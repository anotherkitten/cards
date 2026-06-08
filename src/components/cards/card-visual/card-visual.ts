import { Component, Input } from '@angular/core';
import { Card } from '../../../models/card';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-card-visual',
  imports: [NgClass],
  templateUrl: './card-visual.html',
  styleUrl: './card-visual.css',
})
export class CardVisualComponent {
  @Input() card: Card | undefined;
}
