import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { ResourceService } from '../../../services/resource/resource';
import { Resource, ResourceId } from '../../../models/resource';

class FallingIcon {
  uuid = self.crypto.randomUUID();
  x: number = Math.random() * 600 - 300;
  y: number = -80;
  scale: number = 1 + Math.random() / 2;
  rot: number = .5 - Math.random();
  resource: string = 'wood';
  fake: boolean = false;

  angle: number = 0;

  constructor(fake: boolean = false, id: ResourceId = ResourceId.WOOD) {
    this.fake = fake;
    this.resource = id.toLowerCase();
  }

  phys() {
    this.y += this.scale;
    this.angle += this.rot;
  }

  filter() {
    return `saturate(${Math.floor(this.scale * 100 - 70)}%)`;
  }

  image() {
    return `linear-gradient(rgba(240, 240, 240, ${1.7 - this.scale}), rgba(240, 240, 240, ${1.8 - this.scale})), url('/assets/${this.resource}.png')`;
  }

  z() {
    return -700 + Math.floor(this.scale * 400);
  }
}

const IMPLEMENTED = [ResourceId.WOOD, ResourceId.STONE];

@Component({
  selector: 'app-inventory-rain',
  imports: [],
  templateUrl: './inventory-rain.html',
  styleUrl: './inventory-rain.css',
})
export class InventoryRain implements OnInit, OnDestroy {
  icons: FallingIcon[] = IMPLEMENTED.map(id => new FallingIcon(true, id));
  $update: Subscription | undefined;
  $resources: Subscription | undefined;
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  resourceService: ResourceService = inject(ResourceService);

  ngOnInit() {
    this.$update = interval(10).subscribe(() => this.update());
    this.$resources = this.resourceService.incrementStream([ResourceId.STONE, ResourceId.WOOD]).subscribe(update => this.create(...update));
  }

  ngOnDestroy() {
    this.$update?.unsubscribe();
    this.$resources?.unsubscribe();
  }

  update() {
    this.icons = this.icons.filter(f => f.y < window.innerHeight + 60);

    for (let icon of this.icons) {
      icon.phys();
    }

    this.cdr.markForCheck();
  }

  create(id: ResourceId, amount: number) {
    const cappedAmount = Math.min(amount, Math.max(5, Math.min(Math.floor(amount ** .6 + Math.random() * amount ** .6), amount)));

    for (let i = cappedAmount; i > 0; i--) {
      const icon = new FallingIcon();
      icon.resource = id.toLowerCase();
      icon.y -= i * 5;
      this.icons.push(icon);
    }
  }
}
