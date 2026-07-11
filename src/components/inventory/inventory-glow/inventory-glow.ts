import { AfterViewInit, Component, ElementRef, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RESOURCE_LIB, ResourceId } from '../../../models/resource';
import { ResourceService } from '../../../services/resource/resource';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory-glow',
  imports: [],
  templateUrl: './inventory-glow.html',
  styleUrl: './inventory-glow.css',
})
export class InventoryGlow implements OnInit, AfterViewInit, OnDestroy {
  @Input() id: ResourceId = ResourceId.WOOD;
  @ViewChild('canv') canvRef: ElementRef<HTMLCanvasElement> | undefined;
  resourceService: ResourceService = inject(ResourceService);

  canvas: HTMLCanvasElement | undefined;
  canvasContext: CanvasRenderingContext2D | undefined;
  glowTimes: number[] = [];
  color: String = '';
  glowDuration: number = 260;

  $glow: Subscription | undefined;
  $refresh: Subscription | undefined;

  ngOnInit() {
    this.$glow = this.resourceService.incrementStream(this.id).subscribe(() => this.glow());
    this.$refresh = interval(10).subscribe(() => this.render());
    this.color = this.glowColor();
    this.color = `rgba(` + 
      `${Number.parseInt(this.color.substring(1,3), 16)},` +
      `${Number.parseInt(this.color.substring(3,5), 16)},` +
      `${Number.parseInt(this.color.substring(5,7), 16)},`
  }

  ngAfterViewInit() {
    if (!this.canvRef) return;

    this.canvas = this.canvRef.nativeElement;
    this.canvasContext = this.canvas.getContext('2d') || undefined;
  }

  ngOnDestroy() {
    this.$glow?.unsubscribe();
    this.$refresh?.unsubscribe();
  }

  glow() {
    this.glowTimes.push(Date.now());
  }

  glowColor() {
    return {
      'red': '#dbbdbd',
      'orange': '#dbccbd',
      'yellow': '#d9dbbd',
      'green': '#c2dbbd',
      'blue': '#b6c8d6',
      'purple': '#c0bddb',
      'brown': '#cbc1bc',
      'gray': '#c0c0c0',
      'black': '#a6a6a6',
      'white': '#d8d8d2',
    }[RESOURCE_LIB[this.id].color];
  }

  render() {
    if (!this.canvas || !this.canvasContext) return;

    const current = Date.now();
    this.canvasContext.clearRect(0,0,300,200);
    this.glowTimes = this.glowTimes.filter(n => current - n < this.glowDuration);
    
    for (let time of this.glowTimes) {
      let t = (current - time) / this.glowDuration;
      const x = this.canvasContext;

      const w = 296;
      const h = 198;
      x.fillStyle = `${this.color}${(((1 - t) * .8) ** 3.5).toFixed(2)})`;

      while (t > 0) {
        const scale = (t ** .8) * 10;

        x.beginPath();
        x.moveTo(w/2 - 70, h/2 - 20 - scale);
        x.lineTo(w/2 + 70, h/2 - 20 - scale);
        x.arcTo(w/2 + 75 + scale, h/2 - 20 - scale, w/2 + 75 + scale, h/2 - 15, 5 + scale);
        x.lineTo(w/2 + 75 + scale, h/2 + 15);
        x.arcTo(w/2 + 75 + scale, h/2 + 20 + scale, w/2 + 70, h/2 + 20 + scale, 5 + scale);
        x.lineTo(w/2 - 70, h/2 + 20 + scale);
        x.arcTo(w/2 - 75 - scale, h/2 + 20 + scale, w/2 - 75 - scale, h/2 + 15, 5 + scale);
        x.lineTo(w/2 - 75 - scale, h/2 - 15);
        x.arcTo(w/2 - 75 - scale, h/2 - 20 - scale, w/2 - 70, h/2 - 20 - scale, 5 + scale);
        x.fill();

        t -= 0.02;
      }
    }
  }
}
