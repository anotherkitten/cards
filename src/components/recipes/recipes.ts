import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe/recipe';
import { CardService } from '../../services/card/card';
import { ResourceService } from '../../services/resource/resource';
import { CARD_RECIPES, CARD_TEMPLATES } from '../../models/card-library';
import { Card, CardRecipe } from '../../models/card';
import { CardVisualComponent } from "../cards/card-visual/card-visual";
import { Subject } from 'rxjs';
import { Resource, ResourceId } from '../../models/resource';

@Component({
  selector: 'app-recipes',
  imports: [FormsModule, CardVisualComponent],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class RecipesComponent implements OnInit {
  recipeService: RecipeService = inject(RecipeService);
  cardService: CardService = inject(CardService);
  resourceService: ResourceService = inject(ResourceService);
  show: boolean = false;
  search: String = '';
  rows: Card[][] = [];
  resources: Resource[] = [];

  recipes = CARD_RECIPES;

  $searchChange: Subject<String> = new Subject();

  ngOnInit() {
    this.recipeService.loadUnlocks(this.recipeService.unlocked_recipes);
    this.$searchChange.subscribe(search => this.filterCards(search));

    this.recipeService.filterRecipes('');
    setTimeout(() => this.rows = this.createRows());

    this.resourceService.$updates.subscribe(res => this.resources = res);
    this.resourceService.sendUpdates();
  }
  
  filterCards(search: String) {
    this.recipeService.filterRecipes(search);
    setTimeout(() => this.rows = this.createRows());
  }

  createRows() {
    const rows: Card[][] = [];

    this.recipeService.filtered.forEach((recipe, i) => {
      if (i % 2) {
        rows[(i/2)|0].push(CARD_TEMPLATES[recipe.id].toCard());
      } else {
        rows.push([CARD_TEMPLATES[recipe.id].toCard()]);
      }
    });

    return rows;
  }

  affordable(c: Card) {
    const recipe = this.recipes[c.id];
    return recipe.canBuy(this.resources);
  }

  costAffordable(card: Card, cost: String) {
    return this.resourceService.quantity(cost) >= this.recipes[card.id].getCost(cost);
  }

  craft(c: Card) {
    if (this.affordable(c)) {
      const recipe = this.recipes[c.id];

      for (let cost of recipe.getResourcesInCost()) {
        this.resourceService.spend(cost, recipe.getCost(cost));
      }

      this.cardService.craftCard(c.id);
    }
  }

  recipeComponents(r: CardRecipe) {
    return Object.keys(r.cost);
  }

  recipeCostString(r: CardRecipe, resource: String) {
    return `${r.getCost(resource)} ${resource.charAt(0).toLocaleUpperCase() + resource.slice(1)}`
  }
}
