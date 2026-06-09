import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Inventory } from "../components/inventory/inventory";
import { CardService } from '../services/card/card';
import { CardExecutionService } from '../services/card-execution/card-execution';
import { CardsComponent } from "../components/cards/cards";
import { RecipesComponent } from "../components/recipes/recipes";
import { DeckComponent } from '../components/deck/deck';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Inventory, CardsComponent, RecipesComponent, DeckComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  cardService: CardService = inject(CardService);
  cardExecService: CardExecutionService = inject(CardExecutionService);

  // initiate services
  ngOnInit() {
    this.cardExecService.init(this.cardService);
  }
}
