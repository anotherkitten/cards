import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card, CARD_ID_ORDINALS } from '../../../models/card';
import { CardVisualComponent } from "../card-visual/card-visual";

@Component({
  selector: 'app-deck-view',
  imports: [CardVisualComponent],
  templateUrl: './deck-view.html',
  styleUrl: './deck-view.css',
})
export class DeckViewComponent implements OnInit {
  @Input() cards: Card[] = []
  @Output() close: EventEmitter<void> = new EventEmitter();
  rows: Card[][] = [];

  ngOnInit() {
    this.rows = this.sliceIntoRows();
  }

  sliceIntoRows() {
    const sortedCards = [...this.cards].sort((a, b) => CARD_ID_ORDINALS[a.id] - CARD_ID_ORDINALS[b.id]);

    const rows = []
    for (let [index, card] of sortedCards.entries()) {
      if (index % 5) {
        rows[(index / 5) | 0].push(card);
      } else {
        rows.push([card]);
      }
    }
    return rows;
  }

  closeView() {
    this.close.emit();
  }
}
