import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Card } from '../../../models/card';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragEnd, CdkDragMove, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-card',
  imports: [CommonModule, DragDropModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class CardComponent {
  @Input() card: Card | undefined;
  @Output() played: EventEmitter<void> = new EventEmitter();
  @ViewChild('cardDiv') card_div: ElementRef | undefined;
  dragged: boolean = false;
  playing: boolean = false;
  card_y: number = 0;

  dragStart(event: MouseEvent | TouchEvent) {
    const card = this.card_div!.nativeElement.getBoundingClientRect();
    let client_y;

    if (Object.keys(event).includes("touches")) {
      client_y = (event as TouchEvent).touches[0].clientY;
    } else {
      client_y = (event as MouseEvent).clientY;
    }

    this.card_y = card.y - client_y;
  }

  dragMoved(event: CdkDragMove) {
    const play_area = window.screen.availHeight - 300;
    this.dragged = true;
    this.playing = (event.pointerPosition.y + this.card_y < play_area)
  }

  dragEnd(event: CdkDragEnd, drag: CdkDrag) {
    if (this.playing) {
      this.played.emit();
    } else {
      setTimeout(() => drag.reset(), 0); // let the class apply first
    }

    this.dragged = false;
  }
}
