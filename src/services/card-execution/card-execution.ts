import { inject, Injectable } from '@angular/core';
import { ResourceService } from '../resource/resource';
import { ResourceId } from '../../models/resource';
import { Card, CardTag } from '../../models/card';
import { CardLocation, CardService } from '../card/card';

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
}
