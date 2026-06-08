import { Injectable } from '@angular/core';
import { Card, CardId, CardRecipe } from '../../models/card';
import { CARD_RECIPES, CARD_TEMPLATES } from '../../models/card-library';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  unlocked_recipes: CardId[] = [ 
    CardId.STONE_AXE, 
    CardId.STONE_PICK, 
    CardId.TOOL_CART, 
    CardId.LUMBERYARD, 
    CardId.QUARRY 
  ]
  available: CardRecipe[] = [];
  filtered: CardRecipe[] = [];
  lastFilter: String = '';

  loadUnlocks(unlocks: CardId[]) {
    this.available = unlocks.map(u => CARD_RECIPES[u]);
  }

  unlock(card: CardId) {
    this.available.push(CARD_RECIPES[card]);
    this.filterRecipes(this.lastFilter);
  }

  filterRecipes(text: String) {
    this.lastFilter = text;

    this.filtered = this.available.filter(c => {
      const card = CARD_TEMPLATES[c.id];

      if (
        text &&
        !card.info.name.toLowerCase().includes(text.toLowerCase()) &&
        !card.info.desc.replaceAll(/{(!R)?[a-zA-Z0-9-]+}/g,'').toLowerCase().includes(text.toLowerCase())
      ) {
        return false;
      }

      return true;
    })
  }
}
