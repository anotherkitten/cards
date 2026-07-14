import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ResourceService } from '../../services/resource/resource';
import { Subscription } from 'rxjs';
import { Resource, RESOURCE_LIB } from '../../models/resource';
import { CommonModule } from '@angular/common';
import { InventoryGlow } from './inventory-glow/inventory-glow';
import { InventoryRain } from './inventory-rain/inventory-rain';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, InventoryGlow, InventoryRain],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit, OnDestroy {
  resourceService: ResourceService = inject(ResourceService);
  $resources: Subscription | undefined;
  resources: Resource[] = [];
  grid: Resource[][] = [];

  ngOnInit() {
    this.$resources = this.resourceService.$unlocked.subscribe(res => this.updateResources(res));
    this.resourceService.sendUpdates();
    this.fillGrid();
  }

  ngOnDestroy() {
    this.$resources?.unsubscribe();
  }

  updateResources(res: Resource[]) {
    this.resources = res;
    this.fillGrid();
  }

  private fillGrid() {
    const columns = (this.resources.length / 2);
    this.grid = [];

    for (let i = 0; i < columns; i++) {
      this.grid.push(
        this.resources.slice(i * 2, i * 2 + 2)
      );
    }
  }
}
