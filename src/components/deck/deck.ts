import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CardService } from '../../services/card/card';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { Card, CARD_ID_ORDINALS, CardId, CardLocation } from '../../models/card';
import { CardVisualComponent } from '../cards/card-visual/card-visual';
import { CARD_TEMPLATES } from '../../models/card-library';
import { faArrowRotateLeft, faBan, faEye, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const MAX_DECK = 40;
const MIN_DECK = 20;
const ID_SORT = (a: Card, b: Card) => CARD_ID_ORDINALS[a.id] - CARD_ID_ORDINALS[b.id];
const UUID_SORT = (a: Card, b: Card) => a.uuid > b.uuid ? 1 : -1;
const OLD_FIRST_TIME_SORT = (a: Card, b: Card) => b.time - a.time;

@Component({
  selector: 'app-deck',
  imports: [ FormsModule, CardVisualComponent, FontAwesomeModule ],
  templateUrl: './deck.html',
  styleUrl: './deck.css',
})
export class DeckComponent implements OnInit, OnDestroy {
  cardService: CardService = inject(CardService);
  search: String = '';
  $searchChange: Subject<String> = new Subject();
  hasDeckChanged: boolean = false;
  iconClear = faBan;
  iconAdd = faPlus;
  iconView = faEye;
  iconUndo = faArrowRotateLeft;
  iconSave = faSave;

  lookupCards: Card[] = [];
  lookupRows: Card[][] = [];
  drilldownCards: Card[] = [];
  drilldownRows: Card[][] = [];
  deckCards: Card[] = [];
  deckRows: Card[][] = [];
  drilldownCard: Card | null = null;

  ngOnInit() {
    this.deckCards = [...this.cardService.current_deck].sort(UUID_SORT).sort(OLD_FIRST_TIME_SORT).sort(ID_SORT);
    this.createDeckRows();

    this.$searchChange.subscribe(search => this.getLookupCards(search));
    this.getLookupCards(this.search);
  }

  ngOnDestroy() {
    this.$searchChange.unsubscribe();
  }

  deckChanged() {
    const sortedLocal = this.deckCards.sort(UUID_SORT).map(c => c.uuid);
    const sortedDeck = this.cardService.current_deck.sort(UUID_SORT).map(c => c.uuid);

    this.hasDeckChanged = !sortedLocal.length || !sortedLocal.every((uuid, i) => sortedDeck[i] === uuid);
  }

  amountInDeck(id: CardId) {
    return this.deckCards.filter(card => card.id === id).length;
  }

  amountOwned(id: CardId) {
    return this.cardService.owned.filter(card => card.id === id).length;
  }

  getLookupCards(search: String) {
    this.lookupCards = Object.values(CARD_TEMPLATES).map(t => t.toCard())
      .filter(Card.textFilter(search))
      .filter(c => this.cardService.owned.some(a => a.id === c.id))
      .sort(ID_SORT);
    this.createLookupRows();
  }

  getDrilldownCards(card: CardId) {
    this.drilldownCards = this.cardService.getCardsFrom(
      CardLocation.OWNED,
      Infinity,
      [(c) => c.id === card],
      (cards) => cards.sort(UUID_SORT).sort(OLD_FIRST_TIME_SORT)
    );
    this.createDrilldownRows();
  }

  getDeckCards() {
    this.deckCards = this.cardService.getCardsFrom(
      CardLocation.DECK,
      Infinity,
      [],
      (cards) => cards.sort(UUID_SORT).sort(OLD_FIRST_TIME_SORT).sort(ID_SORT)
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
    this.deckCards = this.deckCards.sort(UUID_SORT).sort(OLD_FIRST_TIME_SORT).sort(ID_SORT);
    this.createRows(this.deckRows, this.deckCards);
  }

  drilldown(card: Card | null) {
    this.drilldownCard = card;

    if (card) this.getDrilldownCards(card.id);
  }

  addCardOfId(id: CardId) {
    if (this.cardService.current_deck.length >= MAX_DECK) return;

    const cardsOwnedNotInDeck = this.cardService.owned
      .filter(Card.idFilter([id]))
      .filter(c => !this.cardInDeck(c));
    
    if (!cardsOwnedNotInDeck.length) return;
    this.addCardToDeck(cardsOwnedNotInDeck.sort(UUID_SORT).sort(OLD_FIRST_TIME_SORT)[0]);
  }

  addCardToDeck(c: Card) {
    if (this.cardInDeck(c)) return;
    this.deckCards.push(c);
    this.createDeckRows();
    this.deckChanged();
  }

  removeCardFromDeck(c: Card) {
    this.deckCards = this.deckCards.filter(card => c.uuid !== card.uuid);
    this.createDeckRows();
    this.deckChanged();
  }

  clearCardsFromDeck(id: CardId) {
    this.deckCards = this.deckCards.filter(card => card.id !== id);
    this.createDeckRows();
    this.deckChanged();
  }

  clearDeck() {
    this.deckCards = [];
    this.createDeckRows();
    this.deckChanged();
  }

  cardInDeck(c: Card) {
    return this.deckCards.includes(c);
  }

  validDeckSize() {
    return this.deckCards.length >= MIN_DECK && this.deckCards.length <= MAX_DECK;
  }

  saveDeckCards() {
    if (this.validDeckSize()) {
      this.cardService.current_deck = [...this.deckCards];
      this.hasDeckChanged = false;
    }
  }

  clearChanges() {
    this.hasDeckChanged = false;
    this.getDeckCards();
  }
}
