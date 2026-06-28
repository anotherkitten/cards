import { inject, Injectable } from '@angular/core';
import { CardId, Card, CardLocation, SavedCard } from '../../models/card';
import { CardExecutionService } from '../card-execution/card-execution';
import { CARD_TEMPLATES } from '../../models/card-library';

type CardFilter = (c: Card) => boolean;
type CardOrderBy = (cards: Card[]) => void;

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private cardExecService: CardExecutionService = inject(CardExecutionService);
  
  owned: Card[] = this.getDefaultDeck();
  current_deck: Card[] = [...this.owned];

  hand: Card[] = Card.shuffle([...this.owned]).slice(0, 5);
  draw: Card[] = [...this.owned].filter(c => !this.hand.includes(c));
  discard: Card[] = [];

  last_played: Card | null = null;

  loadCards(saves: SavedCard[]) {
    this.draw = [];
    this.hand = [];
    this.discard = [];
    this.current_deck = [];
    this.owned = [];

    saves.forEach(save => {
      const card = this.cardFromSave(save);
      const loc = save.location;

      this.owned.push(card);

      if (
        loc === CardLocation.DRAW    ||
        loc === CardLocation.HAND    ||
        loc === CardLocation.DISCARD ||
        loc === CardLocation.DECK
      ) this.current_deck.push(card);

      if (loc === CardLocation.DRAW || loc === CardLocation.DRAW_NOT_IN_DECK) this.draw.push(card);
      if (loc === CardLocation.HAND || loc === CardLocation.HAND_NOT_IN_DECK) this.hand.push(card);
      if (loc === CardLocation.DISCARD || loc === CardLocation.DISCARD_NOT_IN_DECK) this.discard.push(card);
    })
  }

  cardFromSave(saved: SavedCard): Card {
    const temp = CARD_TEMPLATES[saved.id];
    return new Card(this.cardExecService, saved.id, temp.info, temp.tags, saved.data, temp.effect, temp.playable);
  }

  createNewSaveCards() {
    return this.getDefaultDeck().map(c => new SavedCard(c.id, c.data, CardLocation.DECK));
  }

  saveCards(): SavedCard[] {
    return this.owned.map(c => new SavedCard(c.id, c.data, this.getLocation(c)));
  }

  discardCard(c: Card) {
    for (let tempData of Object.keys(c.data).filter(k => k.startsWith('temporary'))) {
      c.data[tempData] = '';
    }

    if (this.current_deck.includes(c)) this.discard.push(c);
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

  getLocation(card: Card): CardLocation {
    if (this.hand.includes(card)) return this.current_deck.includes(card) ? CardLocation.HAND : CardLocation.HAND_NOT_IN_DECK;
    if (this.draw.includes(card)) return this.current_deck.includes(card) ? CardLocation.DRAW : CardLocation.DRAW_NOT_IN_DECK;
    if (this.discard.includes(card)) return this.current_deck.includes(card) ? CardLocation.DISCARD : CardLocation.DISCARD_NOT_IN_DECK;
    if (this.current_deck.includes(card)) return CardLocation.DECK;
    return CardLocation.OWNED;
  }

  moveToHand(card: Card) {
    if (this.current_deck.includes(card) && !this.hand.includes(card)) {
      this.hand.push(card);
      this.draw = this.draw.filter(c => c.uuid !== card.uuid);
      this.discard = this.discard.filter(c => c.uuid !== card.uuid);
    }
  }

  play(card: Card) {
    card.effect(card, card.exec!);
    this.discardCard(card);
    this.last_played = card;
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
      CardId.MINE_STONE,
      CardId.CHOP_WOOD,
      CardId.MINE_STONE,
      CardId.CHOP_WOOD,
      CardId.MINE_STONE,
      CardId.CHOP_WOOD,
      CardId.MINE_STONE,
      CardId.CHOP_WOOD,
      CardId.MINE_STONE,
    ].map(id => CARD_TEMPLATES[id]).map(template => template.toCard(this.cardExecService));
  }

  craftCard(id: CardId) {
    const card = CARD_TEMPLATES[id].toCard(this.cardExecService)
    this.owned.push(card);
    
    if (this.current_deck.length < 40) this.current_deck.push(card);
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

