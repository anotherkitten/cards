import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe/recipe';
import { Pack, PACKS } from '../../models/pack';
import { Subscription } from 'rxjs';
import { Card, CardId } from '../../models/card';
import { CARD_TEMPLATES } from '../../models/card-library';
import { ResourceService } from '../../services/resource/resource';
import { Resource } from '../../models/resource';
import { PackView } from './pack-view/pack-view';

export class PackInfo {
  pack: Pack;
  generatedCards: {[key: string]: Card} = {};
  available: CardId[] = [];

  constructor(pack: Pack) {
    this.pack = pack;
    this.generatedCards = pack.cards.map(id => { return { [id]: CARD_TEMPLATES[id].toCard()}}).reduce(Object.assign);
  }
}

@Component({
  selector: 'app-packs',
  imports: [PackView],
  templateUrl: './packs.html',
  styleUrl: './packs.css',
})
export class PacksComponent implements OnInit, OnDestroy {
  resourceService: ResourceService = inject(ResourceService);
  recipes: RecipeService = inject(RecipeService);
  packs = [...PACKS];
  packInfo: PackInfo[] = [...PACKS].map(pack => new PackInfo(pack));
  resources: Resource[] = [];

  $unlockSub: Subscription | null = null;
  $resourceSub: Subscription | null = null;
  viewing: number = 0;
  obtained: Card[] | null = null;
  
  ngOnInit() {
    this.$unlockSub = this.recipes.$unlock.subscribe(() => this.setAvailable());
    this.$resourceSub = this.resourceService.$updates.subscribe(res => this.resources = res);
    this.resourceService.sendUpdates();
    this.setAvailable();
  }

  ngOnDestroy() {
    this.$unlockSub!.unsubscribe();
    this.$resourceSub!.unsubscribe();
  }

  setAvailable() {
    this.packInfo.forEach(info => info.available = info.pack.available(this.recipes.unlocked_recipes));
  }

  purchase(pack: Pack) {
    if (pack.canBuy(this.resources)) {
      const drawn = pack.draw(this.recipes.unlocked_recipes);

      for (let cost of pack.getResourcesInCost()) {
        this.resourceService.spend(cost, pack.getCost(cost));
      }

      this.recipes.unlock(drawn);
      this.obtain(drawn.map(id => CARD_TEMPLATES[id].toCard()));
    }
  }

  view(id?: number) {
    this.viewing = id || 0;
  }

  obtain(obtained?: Card[]) {
    this.obtained = obtained || null;
  }

  packCostString(p: Pack, resource: String) {
    return `${p.getCost(resource)} ${resource.charAt(0).toLocaleUpperCase() + resource.slice(1)}`
  }
}
