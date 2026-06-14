import { Injectable } from '@angular/core';
import { Card, CARD_ID_ORDINALS, CardId, CardRecipe } from '../../models/card';
import { CARD_RECIPES, CARD_TEMPLATES } from '../../models/card-library';
import { Pack } from '../../models/pack';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  unlocked_recipes: CardId[] = [ 
    CardId.STONE_AXE, 
    CardId.STONE_PICK, 
    CardId.TOOL_CART, 
    CardId.LUMBERYARD, 
    CardId.QUARRY,
  ]
  available: CardRecipe[] = [];
  filtered: CardRecipe[] = [];
  lastFilter: String = '';

  $unlock: Subject<void> = new Subject();

  loadUnlocks(unlocks: CardId[]) {
    this.unlocked_recipes = unlocks;
    this.available = unlocks.sort((a, b) => CARD_ID_ORDINALS[a.toString()] - CARD_ID_ORDINALS[b.toString()]).map(u => CARD_RECIPES[u]);
  }

  unlock(cards: CardId | CardId[]) {
    for (let card of [cards].flat()) {
      this.unlocked_recipes.push(card);
      this.available.push(CARD_RECIPES[card]);
      this.available.sort((a, b) => CARD_ID_ORDINALS[a.id.toString()] - CARD_ID_ORDINALS[b.id.toString()]);
      this.filterRecipes(this.lastFilter);
    }

    this.$unlock.next();
  }

  filterRecipes(text: String) {
    this.lastFilter = text;

    this.filtered = this.available
      .map(c => CARD_TEMPLATES[c.id].toCard())
      .filter(Card.textFilter(text))
      .map(c => CARD_RECIPES[c.id]);
  }
}
