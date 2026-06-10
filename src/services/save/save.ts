import { inject, Injectable } from '@angular/core';
import { CardService } from '../card/card';
import { ResourceService } from '../resource/resource';
import { RecipeService } from '../recipe/recipe';
import { Card, CardId, CardTemplate, SavedCard } from '../../models/card';
import { ResourceId, SavedResource } from '../../models/resource';
import { CardExecutionService } from '../card-execution/card-execution';
import { CARD_TEMPLATES } from '../../models/card-library';
import { SaveFile } from '../../models/save-file';

class Save {
  savedCards: SavedCard[] = [];
  savedResources: SavedResource[] = [];
  savedRecipes: CardId[] = [];
}

const SAVE_LOCATION = 'CARDS-test-savefile'

@Injectable({
  providedIn: 'root',
})
export class SaveService {
  cards: CardService = inject(CardService);
  exec: CardExecutionService = inject(CardExecutionService);
  resources: ResourceService = inject(ResourceService);
  recipes: RecipeService = inject(RecipeService);

  save() {
    console.log('progress saved');
    localStorage.setItem(SAVE_LOCATION, JSON.stringify(this.makeSave()));
  }

  makeSave(): Save {
    const saveFile = new Save();

    saveFile.savedCards = this.cards.saveCards();
    saveFile.savedResources = this.resources.saveResources();
    saveFile.savedRecipes = this.recipes.unlocked_recipes;

    return saveFile;
  }

  load() {
    const saveData = localStorage.getItem(SAVE_LOCATION);
    if (saveData) {
      try {
        const saveFile = JSON.parse(saveData) as Save;
        if (saveFile.savedCards && saveFile.savedResources && saveFile.savedRecipes) this.loadSave(saveFile);
      } catch (e) {
        console.error('Bad savefile!');
      }
    }
  }

  loadSave(save: Save) {
    this.cards.loadCards(save.savedCards.filter(this.validCard));
    this.resources.loadResources(save.savedResources.filter(this.validResource));
    this.recipes.loadUnlocks(save.savedRecipes.filter(this.validCardId));
  }

  validCard(saved: SavedCard) {
    return Object.values(CardId).includes(saved.id);
  }

  validResource(saved: SavedResource) {
    return Object.values(ResourceId).includes(saved.id);
  }

  validCardId(id: CardId) {
    return Object.values(CardId).includes(id);
  }
}
