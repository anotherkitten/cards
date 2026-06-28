import { inject, Injectable } from '@angular/core';
import { Resource, RESOURCE_LIB, ResourceCosts, ResourceId, SavedResource } from '../../models/resource';
import { Subject } from 'rxjs';
import { StructureService } from '../structure/structure';
import { StructureId } from '../../models/structure';

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  private resources = RESOURCE_LIB;
  unlocked: ResourceId[] = [ResourceId.WOOD, ResourceId.STONE];
  structs: StructureService = inject(StructureService);

  $updates: Subject<Resource[]> = new Subject<Resource[]>();
  $unlocked: Subject<Resource[]> = new Subject<Resource[]>();

  private getResources() {
    return Object.values(this.resources);
  }

  sendUpdates() {
    this.$updates.next(this.getResources());
    this.$unlocked.next(this.getResources().filter(r => this.unlocked.includes(r.id)));
  }

  saveResources(): SavedResource[] {
    return this.getResources().map(r => new SavedResource(r.id, r.quantity, this.unlocked.includes(r.id)));
  }

  loadResources(saved: SavedResource[]) {
    this.unlocked = [ResourceId.WOOD, ResourceId.STONE];
    Object.entries(this.resources).forEach(res => res[1].quantity = 0);

    saved.forEach(save => {
      if (save.unlocked && !this.unlocked.includes(save.id)) this.unlocked.push(save.id);
      if (this.haveResource(save.id)) this.safeGet(save.id).quantity = save.quantity;
    })

    this.sendUpdates();
  }

  private haveResource(s: String) {
    return Object.values(ResourceId).map(id => id.toLowerCase()).includes(s.toLowerCase());
  }

  private resourceIdFromString(s: String): ResourceId {
    if (!Object.values(ResourceId).map(id => id.toLowerCase()).includes(s.toLowerCase())) throw `Tried to access bad resource: ${s}`;
    return Object.values(ResourceId).find(id => id.toLowerCase() === s.toLowerCase()) as ResourceId || ResourceId.WOOD;
  }

  private safeGet(id: ResourceId | String): Resource {
    return this.resources[this.resourceIdFromString(id.toString())];
  }

  name(id: ResourceId | String): String {
    return this.safeGet(id).name;
  }

  quantity(id: ResourceId | String): number {
    return this.safeGet(id).quantity;
  }

  add(id: ResourceId, amount: number): number {
    if (amount < 0) throw `Adding negative amount (${amount}) of resource: ${id}`;
    let r = this.safeGet(id);
    r.quantity = Math.min(r.quantity + amount, this.resourceCap());

    if (!this.unlocked.includes(id)) this.unlocked.push(id);
    this.sendUpdates();
    return r.quantity;
  }

  spendCosts(costs: ResourceCosts) {
    if (costs.canBuy(this.getResources())) {
      costs.getResourcesInCost().forEach(id => this.spend(id, costs.getCost(id)));
    }
  }

  spend(id: ResourceId, amount: number): number {
    let r = this.safeGet(id);
    if (amount > r.quantity) throw `Spending more than you have (${amount}) of resource: ${id}`;
    r.quantity -= amount;

    this.sendUpdates();
    return r.quantity;
  }

  resourceCap() {
    return [100, 200, 500, 1000, 2500, 10000][this.structs.level(StructureId.SILO)];
  }
}
