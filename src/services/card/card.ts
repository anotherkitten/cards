import { inject, Injectable } from '@angular/core';
import { CardId, Card } from '../../models/card';
import { CardExecutionService } from '../card-execution/card-execution';
import { CARD_TEMPLATES } from '../../models/card-library';

type CardFilter = (c: Card) => boolean;
type CardOrderBy = (cards: Card[]) => void;

export enum CardLocation {
  HAND, DRAW, DISCARD, DECK, OWNED
}

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private cardExecService: CardExecutionService = inject(CardExecutionService);
  
  owned: Card[] = [];
  queued_deck_changed: boolean = false;
  current_deck: Card[] = [];

  draw: Card[] = [];
  hand: Card[] = [];
  discard: Card[] = [];

  discardCard(c: Card) {
    for (let tempData of Object.keys(c.data).filter(k => k.startsWith('temporary'))) {
      c.data[tempData] = '';
    }

    if (this.current_deck?.includes(c)) this.discard.push(c);
    this.hand = this.hand.filter(a => a.uuid !== c.uuid);
  }

  discardToDraw() {
    this.draw = [...this.current_deck.filter(c => !this.hand.includes(c))];
    Card.shuffle(this.draw);
    this.discard = [];
  }

  redraw() {
    for (let card of this.hand) {
      this.discardCard(card);
    }
    this.drawCards(5);
  }

  drawCards(cards: number = 1) {
    while (cards > 0 && this.hand.length < 9) {
      cards--;

      if (!this.draw.length) {
        this.discardToDraw();
      }

      if (this.draw.length) {
        this.hand.push(this.draw.pop()!);
      }
    }
  }

  drawFromDeck(cards: Card | Card[]) {
    [cards].flat().forEach(c => {
      if (this.hand.length < 9 && this.draw.includes(c)) {
        this.hand.push(c);
        this.draw = this.draw.filter(a => a.uuid !== c.uuid);
      }
    })
  }

  play(card: Card) {
    card.effect(card);
    this.discardCard(card);
  }

  getDefaultDeck() {
    return [
      CardId.RELAX,
      CardId.RELAX,
      CardId.RELAX,
      CardId.RELAX,
      CardId.RELAX,
      CardId.RELAX,
      CardId.RELAX,
      CardId.RELAX,
      CardId.RELAX,
      CardId.RELAX,
      CardId.CHOP_WOOD,
      CardId.CHOP_WOOD,
      CardId.CHOP_WOOD,
      CardId.CHOP_WOOD,
      CardId.CHOP_WOOD,
      CardId.MINE_STONE,
      CardId.MINE_STONE,
      CardId.MINE_STONE,
      CardId.MINE_STONE,
      CardId.MINE_STONE
    ].map(id => CARD_TEMPLATES[id]).map(template => template.toCard(this.cardExecService));
  }

  craftCard(id: CardId) {
    const card = CARD_TEMPLATES[id].toCard(this.cardExecService)
    this.owned.push(card);
  }

  // CARD EFFECT HELPERS
  getCardsFrom(where: CardLocation, amount: number = 1, filters: CardFilter[] | CardFilter = [], order: CardOrderBy = Card.shuffle) {
    let selected_cards = 
      (where == CardLocation.HAND) ? this.hand :
      (where == CardLocation.DRAW) ? this.draw :
      (where == CardLocation.DISCARD) ? this.discard :
      (where == CardLocation.DECK) ? this.current_deck :
      this.owned

    for (let filter of [filters].flat()) {
      selected_cards = selected_cards.filter(filter);
    }

    order(selected_cards);

    return selected_cards.slice(0, amount);
  }
}

