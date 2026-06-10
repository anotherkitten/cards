import { inject, Injectable } from '@angular/core';
import { ResourceService } from '../resource/resource';
import { ResourceId } from '../../models/resource';
import { Card } from '../../models/card';
import { CardService } from '../card/card';

type Callback = () => void;

@Injectable({
  providedIn: 'root',
})
export class CardExecutionService {
  resourceService: ResourceService = inject(ResourceService);
  cardService: CardService | undefined;

  init(cardService: CardService) {
    this.cardService = cardService
  }

  cards(): CardService {
    if (!this.cardService) throw `Card Service not set in Card Execution Service`;
    return this.cardService;
  }

  addResourceByData(id: ResourceId, card: Card) {
    this.resourceService.add(id, card.getResourceFromData(id));
  }
  
  addResource(id: ResourceId, amount: number) {
    this.resourceService.add(id, amount);
  }

  spend(c: Card, resources: [ResourceId, number][] | [ResourceId, number], on_spend: Callback) {
    const res_array: [ResourceId, number][]  = (Array.isArray(resources[0])) ? 
      (resources as [ResourceId, number][]) :
      [(resources as [ResourceId, number])];

    if (res_array.every(r => this.resourceService.quantity(r[0]) >= r[1])) {
      res_array.forEach(r => this.resourceService.spend(r[0], r[1]));
      on_spend();
    }
  }

  grow(c: Card, on_grown: Callback) {
    const grow = c.getNum('grow');
    if (!grow) return;

    const turn = c.getNum('growturn');
    if (turn >= grow) {
      on_grown();
      c.set('growturn', 1);
    } else {
      c.set('growturn', turn + 1);
    }
  }

  probability(c: Card, on_success: Callback, on_fail: Callback = () => {}) {
    const probability = c.getNum('probability') + c.getNum('temporary-probability');

    if (Math.random() * 100 < probability) {
      on_success();
    } else {
      on_fail();
    }
  }
}
