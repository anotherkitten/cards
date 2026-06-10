import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Inventory } from "../components/inventory/inventory";
import { CardService } from '../services/card/card';
import { CardExecutionService } from '../services/card-execution/card-execution';
import { CardsComponent } from "../components/cards/cards";
import { RecipesComponent } from "../components/recipes/recipes";
import { DeckComponent } from '../components/deck/deck';
import { SaveService } from '../services/save/save';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Inventory, CardsComponent, RecipesComponent, DeckComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  cardService: CardService = inject(CardService);
  cardExecService: CardExecutionService = inject(CardExecutionService);
  saveService: SaveService = inject(SaveService);

  // initiate services
  ngOnInit() {
    this.cardExecService.init(this.cardService);
    this.saveService.load();

    interval(60e3).subscribe(() => this.saveService.save());
  }
}
