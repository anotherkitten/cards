import { inject, Injectable } from '@angular/core';
import { CardService } from '../card/card';
import { ResourceService } from '../resource/resource';
import { RecipeService } from '../recipe/recipe';
import { CardId, SavedCard } from '../../models/card';
import { ResourceId, SavedResource } from '../../models/resource';
import { CardExecutionService } from '../card-execution/card-execution';
import { SavedStructure, StructureId } from '../../models/structure';
import { StructureService } from '../structure/structure';

class Save {
  savedCards: SavedCard[] = [];
  savedResources: SavedResource[] = [];
  savedRecipes: CardId[] = [];
  savedStructures: SavedStructure[] = [];

  constructor(loadedSave?: Save) {
    if (!loadedSave) return;
    
    this.savedCards = loadedSave.savedCards || [];
    this.savedResources = loadedSave.savedResources || [];
    this.savedRecipes = loadedSave.savedRecipes || [];
    this.savedStructures = loadedSave.savedStructures || [];
  }
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
  structs: StructureService = inject(StructureService);

  save() {
    console.log('progress saved');
    localStorage.setItem(SAVE_LOCATION, JSON.stringify(this.makeSave()));
  }

  makeSave(): Save {
    const saveFile = new Save();

    saveFile.savedCards = this.cards.saveCards();
    saveFile.savedResources = this.resources.saveResources();
    saveFile.savedRecipes = this.recipes.unlocked_recipes;
    saveFile.savedStructures = this.structs.saveStructures();

    return saveFile;
  }

  load() {
    const saveData = localStorage.getItem(SAVE_LOCATION);
    if (saveData) {
      try {
        const saveFile = new Save(JSON.parse(saveData) as Save);
        this.loadSave(saveFile);
      } catch (e) {
        console.error('Bad savefile!');
      }
    }
  }

  loadSave(save: Save) {
    this.cards.loadCards(save.savedCards.filter(this.validCard));
    this.resources.loadResources(save.savedResources.filter(this.validResource));
    this.recipes.loadUnlocks(save.savedRecipes.filter(this.validCardId));
    this.structs.loadStructures(save.savedStructures.filter(this.validStructure));
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

  validStructure(saved: SavedStructure) {
    return Object.values(StructureId).includes(saved.id);
  }
}
