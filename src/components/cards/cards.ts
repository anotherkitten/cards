import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CardService } from '../../services/card/card';
import { CommonModule } from '@angular/common';
import { Card } from '../../models/card';
import { CardComponent } from './card/card';
import { interval, Subscription } from 'rxjs';
import { X } from '@angular/cdk/keycodes';
import { DeckViewComponent } from "./deck-view/deck-view";

@Component({
  selector: 'app-cards',
  imports: [CommonModule, CardComponent, DeckViewComponent],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class CardsComponent implements OnInit{
  redrawTime: number = 10e3;
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  cardService: CardService = inject(CardService);
  lastRedraw: number = Date.now();
  nextRedraw: number = Date.now() + this.redrawTime;
  $updateTimer: Subscription = new Subscription();

  @ViewChild('canv') redrawCanvas: ElementRef | undefined;
  canvasContext: CanvasRenderingContext2D | undefined;
  showTimer: boolean = false;
  viewingDeck: String = '';

  ngOnInit() {
    this.cardService.owned = this.cardService.getDefaultDeck();
    this.cardService.current_deck = [...this.cardService.owned];
    this.cardService.draw = [...this.cardService.owned];
    Card.shuffle(this.cardService.draw);
    this.cardService.drawCards(5);

    this.$updateTimer = interval(100).subscribe(() => this.updateTimer());
  }

  ngAfterViewInit() {
    const canvas: HTMLCanvasElement = this.redrawCanvas!.nativeElement;
    this.canvasContext = canvas.getContext("2d")!;
  }

  updateTimer() {
    if (!this.canvasContext) return;

    this.canvasContext!.fillStyle="#FAFAFA6A";
    const percentToRedraw = Math.min(1 - (this.nextRedraw - Date.now()) / (this.nextRedraw - this.lastRedraw), 1);
    this.showTimer = percentToRedraw < 1;
    this.cdr.markForCheck();

    this.canvasContext!.clearRect(0,0,320,320);

    const path = new Path2D();
    path.moveTo(160,160);
    path.arc(160,160,160,0,-Math.min(percentToRedraw,.999) * 2 * Math.PI, true);
    this.canvasContext!.fill(path);
  }

  drawNewHand() {
    if (Date.now() < this.nextRedraw) return;

    this.lastRedraw = Date.now();
    this.nextRedraw = Date.now() + this.redrawTime;

    this.cardService.redraw();
  }

  play(card: Card) {
    this.cardService.play(card);
  }

  viewDeck(deck: String) {
    if ((deck === 'draw' && !this.cardService.draw.length) || (deck === 'discard' && !this.cardService.discard.length)) return;

    this.viewingDeck = deck;
  }
}
