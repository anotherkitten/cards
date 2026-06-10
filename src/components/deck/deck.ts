import { Component, inject, OnInit } from '@angular/core';
import { CardService } from '../../services/card/card';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { Card, CARD_ID_ORDINALS, CardId, CardLocation } from '../../models/card';
import { CardVisualComponent } from '../cards/card-visual/card-visual';
import { CARD_TEMPLATES } from '../../models/card-library';

const UUID_SORT = (a: Card, b: Card) => a.uuid > b.uuid ? 1 : -1;

@Component({
  selector: 'app-deck',
  imports: [ FormsModule, CardVisualComponent ],
  templateUrl: './deck.html',
  styleUrl: './deck.css',
})
export class DeckComponent implements OnInit {
  cardService: CardService = inject(CardService);
  showing: boolean = false;
  search: String = '';
  $searchChange: Subject<String> = new Subject();

  lookupCards: Card[] = [];
  lookupRows: Card[][] = [];
  drilldownCards: Card[] = [];
  drilldownRows: Card[][] = [];
  deckCards: Card[] = [];
  deckRows: Card[][] = [];
  drilldownCard: Card | null = null;

  ngOnInit() {
    this.$searchChange.subscribe(search => this.getLookupCards(search));
  }

  open() {
    this.showing = !this.showing;
    if (this.showing) this.drilldownCard = null;

    this.getLookupCards(this.search);
    this.getDeckCards();
  }

  getLookupCards(search: String) {
    this.lookupCards = Object.values(CARD_TEMPLATES).map(t => t.toCard())
      .filter(Card.textFilter(search))
      .filter(c => this.cardService.owned.some(a => a.id === c.id))
      .sort((a, b) => CARD_ID_ORDINALS[a.id] - CARD_ID_ORDINALS[b.id]);
    this.createLookupRows();
  }

  getDrilldownCards(card: CardId) {
    this.drilldownCards = this.cardService.getCardsFrom(
      CardLocation.OWNED,
      Infinity,
      [(c) => c.id === card],
      (cards) => cards.sort(UUID_SORT)
    );
    this.createDrilldownRows();
  }

  getDeckCards() {
    this.deckCards = this.cardService.getCardsFrom(
      CardLocation.DECK,
      Infinity,
      [],
      (cards) => cards.sort(UUID_SORT).sort((a, b) => CARD_ID_ORDINALS[a.id] - CARD_ID_ORDINALS[b.id])
    );
    this.createDeckRows();
  }
  
  createRows(rows: Card[][], cards: Card[]) {
    rows.splice(0, Infinity);

    cards.forEach((card, i) => {
      if (i % 2) {
        rows[(i/2)|0].push(card);
      } else {
        rows.push([card]);
      }
    });
  }

  createLookupRows() {
    this.createRows(this.lookupRows, this.lookupCards);
  }

  createDrilldownRows() {
    this.createRows(this.drilldownRows, this.drilldownCards);
  }

  createDeckRows() {
    this.createRows(this.deckRows, this.deckCards);
  }

  drilldown(card: Card | null) {
    this.drilldownCard = card;

    if (card) this.getDrilldownCards(card.id);
  }

  addCardToDeck(c: Card) {
    if (this.cardService.current_deck.length >= 40) return;
    if (this.cardInDeck(c)) return;
    this.cardService.current_deck.push(c);
    this.getDeckCards();
  }

  removeCardFromDeck(c: Card) {
    if (this.cardService.current_deck.length <= 20) return;
    this.cardService.current_deck = this.cardService.current_deck.filter(card => c.uuid !== card.uuid);
    this.getDeckCards();
  }

  cardInDeck(c: Card) {
    return this.cardService.current_deck.includes(c);
  }
}
