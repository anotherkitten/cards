import { Component } from '@angular/core';
import { NgClass } from "@angular/common";
import { RecipesComponent } from '../recipes/recipes';
import { DeckComponent } from '../deck/deck';
import { PacksComponent } from '../packs/packs';
import { StructuresComponent } from '../structures/structures';

@Component({
  selector: 'app-tabs',
  imports: [NgClass, RecipesComponent, DeckComponent, PacksComponent, StructuresComponent],
  templateUrl: './tabs.html',
  styleUrl: './tabs.css',
})
export class Tabs {
  selected: String = '';
  last_selected: String = '';
  tabs = ['Craft', 'Deck', 'Packs', 'Structures'];

  select(s: String) {
    this.selected = this.selected === s ? '' : s;
    this.last_selected = s;
  }
}
