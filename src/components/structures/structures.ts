import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Structure, StructureId } from '../../models/structure';
import { StructureService } from '../../services/structure/structure';
import { Resource, ResourceId } from '../../models/resource';
import { ResourceService } from '../../services/resource/resource';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-structures',
  imports: [],
  templateUrl: './structures.html',
  styleUrl: './structures.css',
})
export class StructuresComponent implements OnInit, OnDestroy {
  structs: StructureService = inject(StructureService);
  resourceService: ResourceService = inject(ResourceService);

  $resourceSub: Subscription | undefined;
  resources: Resource[] = [];

  ngOnInit() {
    this.$resourceSub = this.resourceService.$updates.subscribe(res => this.resources = res);
    this.resourceService.sendUpdates();
  }

  ngOnDestroy() {
    this.$resourceSub?.unsubscribe();
  }

  getStructures() {
    return Object.values(this.structs.structures);
  }

  hasSpecialPanel(s: Structure) {
    return [StructureId.WORKSHOP].includes(s.id);
  }

  canAfford(s: Structure, id: ResourceId) {
    return this.resourceService.quantity(id) >= s.getCost().getCost(id);
  }

  purchase(s: Structure) {
    if (s.maxLevel() || !s.getCost().canBuy(this.resources)) return;
    
    this.resourceService.spendCosts(s.getCost());
    this.structs.upgrade(s.id);
  }
}
