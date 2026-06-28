import { Injectable } from '@angular/core';
import { SavedStructure, StructureId, STRUCTURES } from '../../models/structure';
import { RouterTestingHarness } from '@angular/router/testing';

@Injectable({
  providedIn: 'root',
})
export class StructureService {
  structures = STRUCTURES;

  get(id: StructureId) {
    return this.structures[id];
  }

  level(id: StructureId) {
    return this.structures[id].level;
  }

  upgrade(id: StructureId) {
    this.structures[id].level = Math.min(this.structures[id].levels, this.structures[id].level + 1);
  }

  loadStructures(saved: SavedStructure[]) {
    Object.entries(this.structures).forEach(struct => struct[1].level = 0);
    saved.forEach(save => this.structures[save.id].level = Math.min(save.level, this.structures[save.id].levels));
  }

  saveStructures() {
    return Object.values(this.structures).map(s => new SavedStructure(s.id, s.level));
  }
}
