import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PackInfo } from '../packs';
import { Card } from '../../../models/card';
import { CARD_TEMPLATES } from '../../../models/card-library';
import { CardVisualComponent } from '../../cards/card-visual/card-visual';

@Component({
  selector: 'app-pack-view',
  imports: [CardVisualComponent],
  templateUrl: './pack-view.html',
  styleUrl: './pack-view.css',
})
export class PackView implements OnInit {
  @Input() info: PackInfo | null = null;
  @Input() obtained: Card[] | null = null;
  @Output() closed: EventEmitter<void> = new EventEmitter();

  firstRows: Card[][] = [];
  otherRows: Card[][] = [];
  obtainedRows: Card[][] = [];

  ngOnInit() {
    if (this.info) {
      this.firstRows = this.sliceIntoRows(this.getCards(true));
      this.otherRows = this.sliceIntoRows(this.getCards(false));
    }

    if (this.obtained) {
      this.obtainedRows = this.sliceIntoRows(this.obtained);
    }
  }

  hasFirstBonus() {
    if (!this.info) return false;
    return this.info.pack.first_pull.length > 0;
  }

  getCards(firstPull: boolean): Card[] {
    if (!this.info) return [];

    const firstIds = this.info.pack.first_pull;
    return (firstPull ? firstIds : this.info.pack.cards.filter(id => !firstIds.includes(id))).map(id => CARD_TEMPLATES[id].toCard());
  }

  sliceIntoRows(cards: Card[]): Card[][] {
    const rows: Card[][] = [];

    for (let [index, card] of cards.entries()) {
      if (index % 5) rows[(index / 5) | 0].push(card);
      else rows.push([card]);
    }

    return rows;
  }

  close() {
    this.closed.next();
  }
}
