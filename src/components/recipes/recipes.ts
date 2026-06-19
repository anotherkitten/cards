import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../services/recipe/recipe';
import { CardService } from '../../services/card/card';
import { ResourceService } from '../../services/resource/resource';
import { CARD_RECIPES, CARD_TEMPLATES } from '../../models/card-library';
import { Card, CardRecipe } from '../../models/card';
import { CardVisualComponent } from "../cards/card-visual/card-visual";
import { Subject, Subscription } from 'rxjs';
import { Resource, ResourceId } from '../../models/resource';
import { Pack, PACKS } from '../../models/pack';

@Component({
  selector: 'app-recipes',
  imports: [FormsModule, CardVisualComponent],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class RecipesComponent implements OnInit, OnDestroy {
  recipeService: RecipeService = inject(RecipeService);
  cardService: CardService = inject(CardService);
  resourceService: ResourceService = inject(ResourceService);
  show: boolean = false;
  search: String = '';
  packFilter: String = 'Any';
  packs: String[] = [];
  rows: [Card[][], String][] = [];
  resources: Resource[] = [];

  recipes = CARD_RECIPES;

  $searchChange: Subject<String> = new Subject();
  $searchSub: Subscription | null = null;
  $resourceSub: Subscription | null = null;

  ngOnInit() {
    this.recipeService.loadUnlocks(this.recipeService.unlocked_recipes);
    this.$searchSub = this.$searchChange.subscribe(search => this.filterCards(search));

    this.recipeService.filterRecipes('');
    this.packs = [...new Set(this.recipeService.unlocked_recipes.map(Pack.inPack).sort((a, b) => a - b).map(a => PACKS[a].name))];
    setTimeout(() => this.rows = this.createRows());

    this.$resourceSub = this.resourceService.$updates.subscribe(res => this.resources = res);
    this.resourceService.sendUpdates();
  }

  ngOnDestroy() {
    this.$searchSub!.unsubscribe();
    this.$resourceSub!.unsubscribe();
  }
  
  filterCards(search: String) {
    this.recipeService.filterRecipes(search);
    setTimeout(() => this.rows = this.createRows());
  }

  setPackFilter(pack: String) {
    this.packFilter = pack;
    setTimeout(() => this.rows = this.createRows());
  }

  createRows() {
    const rowsByPack: [Card[][], String][] = [];

    this.recipeService.filtered.forEach((recipe) => {
      const packName = PACKS[Pack.inPack(recipe.id)].name;
      let rows: Card[][] = (rowsByPack.find(r => r[1] === packName)|| [[]])[0]
      let iOfPack = (rows || []).flat().length;

      if (!iOfPack) {
        rowsByPack.push([rows, packName]);
      }

      if (iOfPack % 2) {
        rows[iOfPack / 2 | 0].push(CARD_TEMPLATES[recipe.id].toCard());
      } else {
        rows.push([CARD_TEMPLATES[recipe.id].toCard()]);
      }
    });

    return rowsByPack.sort((a, b) => Pack.inPack(a[0][0][0].id) - Pack.inPack(b[0][0][0].id)).filter(a => this.packFilter === "Any" || a[1] === this.packFilter);
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

  numberOwned(c: Card) {
    return this.cardService.owned.filter(card => card.id === c.id).length;
  }

  recipeComponents(r: CardRecipe) {
    return Object.keys(r.cost);
  }

  recipeCostString(r: CardRecipe, resource: String) {
    return `${r.getCost(resource)} ${resource.charAt(0).toLocaleUpperCase() + resource.slice(1)}`
  }
}
