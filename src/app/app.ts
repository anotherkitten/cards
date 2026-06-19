import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Inventory } from "../components/inventory/inventory";
import { CardService } from '../services/card/card';
import { CardExecutionService } from '../services/card-execution/card-execution';
import { CardsComponent } from "../components/cards/cards";
import { SaveService } from '../services/save/save';
import { interval } from 'rxjs';
import { Tabs } from "../components/tabs/tabs";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Inventory, CardsComponent, Tabs],
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

    interval(30e3).subscribe(() => this.saveService.save());
  }
}
