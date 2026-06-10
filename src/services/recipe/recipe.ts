import { Injectable } from '@angular/core';
import { Card, CardId, CardRecipe } from '../../models/card';
import { CARD_RECIPES, CARD_TEMPLATES } from '../../models/card-library';
import { Pack } from '../../models/pack';

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
    CardId.WATER_WELL,
    CardId.TILL_SOIL,
    CardId.GROW_WHEAT,
    CardId.MINE_COAL,
    CardId.SMELT_ORE,
    CardId.FURNACE,
    CardId.METAL_AXE,
    CardId.METAL_PICK,
    CardId.WATER_PIPE,
    CardId.EXPEDITION
  ]
  available: CardRecipe[] = [];
  filtered: CardRecipe[] = [];
  lastFilter: String = '';

  loadUnlocks(unlocks: CardId[]) {
    this.available = unlocks.map(u => CARD_RECIPES[u]);
  }

  unlockFromPack(pack: Pack) {
    const newCard: CardId = pack.draw(this.unlocked_recipes);
    this.unlock(newCard);
  }

  unlock(card: CardId) {
    this.unlocked_recipes.push(card);
    this.available.push(CARD_RECIPES[card]);
    this.filterRecipes(this.lastFilter);
  }

  filterRecipes(text: String) {
    this.lastFilter = text;

    this.filtered = this.available
      .map(c => CARD_TEMPLATES[c.id].toCard())
      .filter(Card.textFilter(text))
      .map(c => CARD_RECIPES[c.id]);
  }
}
