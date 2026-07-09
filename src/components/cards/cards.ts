import { ChangeDetectorRef, Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { CardService } from '../../services/card/card';
import { CommonModule } from '@angular/common';
import { Card } from '../../models/card';
import { CardComponent } from './card/card';
import { interval, Subscription } from 'rxjs';
import { DeckViewComponent } from "./deck-view/deck-view";
import { StructureService } from '../../services/structure/structure';
import { StructureId } from '../../models/structure';

@Component({
  selector: 'app-cards',
  imports: [CommonModule, CardComponent, DeckViewComponent],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class CardsComponent implements OnInit{
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  cardService: CardService = inject(CardService);
  structs: StructureService = inject(StructureService);
  redrawTime: number = 5e3;
  lastRedraw: number = Date.now();
  nextRedraw: number = Date.now() + this.redrawTime;
  $updateTimer: Subscription = new Subscription();

  @ViewChild('canv') redrawCanvas: ElementRef | undefined;
  canvasContext: CanvasRenderingContext2D | undefined;
  showTimer: boolean = false;
  viewingDeck: String = '';

  autoplayEnabled: boolean = false;
  autoplayCounter: number = 0;

  ngOnInit() {
    this.$updateTimer = interval(100).subscribe(() => this.updateTimer());
  }

  ngAfterViewInit() {
    const canvas: HTMLCanvasElement = this.redrawCanvas!.nativeElement;
    this.canvasContext = canvas.getContext("2d")!;
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (event.key === ' ') {
      this.drawNewHand();
    }

    if (!isNaN(+event.key) && +event.key && +event.key <= this.cardService.hand.length) {
      this.play(this.cardService.hand[+event.key - 1]);
    }
  }

  updateTimer() {
    this.autoplayCounter++;
    if (this.autoplayCounter >= [20, 16, 12, 8][this.structs.level(StructureId.WORKSHOP)]) this.autoplay();

    if (!this.canvasContext) {
      if (!this.redrawCanvas) return;
      this.canvasContext = (this.redrawCanvas.nativeElement as HTMLCanvasElement).getContext("2d")!;
    }

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

  autoplay() {
    this.autoplayCounter = 0;

    if (this.autoplayEnabled) {
      if (this.cardService.hand.length) this.play(this.cardService.hand[0]);
      else this.drawNewHand();
    }
  }

  drawNewHand() {
    if (Date.now() < this.nextRedraw) return;

    this.redrawTime = [5e3, 4e3, 3.2e3, 2.5e3][this.structs.level(StructureId.WATER_WHEEL)];
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
