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

const PROFILE_LOCATION = 'CARDS-active-profile'
const SAVEFILE_STRING = 'CARDS-savefile-';

@Injectable({
  providedIn: 'root',
})
export class SaveService {
  profile: String = this.loadProfile();
  cards: CardService = inject(CardService);
  exec: CardExecutionService = inject(CardExecutionService);
  resources: ResourceService = inject(ResourceService);
  recipes: RecipeService = inject(RecipeService);
  structs: StructureService = inject(StructureService);

  lastSaved: number = Date.now();

  loadProfile() {
    return localStorage.getItem(PROFILE_LOCATION) || 'player';
  }

  saveProfile() {
    localStorage.setItem(PROFILE_LOCATION, this.profile.toString());
  }

  getSaves(): [String, Save][] {
    return Object.entries(localStorage)
      .filter(obj => obj[0] !== PROFILE_LOCATION)
      .map(obj => [obj[0].replaceAll(SAVEFILE_STRING.toString(), ''), obj[1]]) as [String, Save][];
  }

  createProfile(name: String): String {
    if (Object.keys(localStorage).includes(this.saveLocation(name))) return 'Profile with this name already exists';
    if (name.includes(SAVEFILE_STRING)) return 'Please dont do that';

    this.profile = name;
    this.loadSave(this.createNewSave());
    this.cards.drawCards(5);
    this.save();
    this.saveProfile();

    return '';
  }

  switchProfile(name: String) {
    if (!Object.keys(localStorage).includes(this.saveLocation(name))) return;

    this.save();
    this.profile = name;
    this.load();
    this.saveProfile();
  }

  renameProfile(name: String, clone: boolean = false): String {
    if (Object.keys(localStorage).includes(this.saveLocation(name))) return 'Profile with this name already exists';
    if (name.includes(SAVEFILE_STRING)) return 'Please dont do that';

    if (!clone) localStorage.removeItem(this.saveLocation());
    this.profile = name;
    this.save();
    this.saveProfile();

    return '';
  }

  createNewSave() {
    const save = new Save();
    save.savedCards = this.cards.createNewSaveCards();
    save.savedRecipes = this.recipes.defaultUnlocks();
    return save;
  }

  saveLocation(name?: String) {
    return SAVEFILE_STRING.concat(name ? name.toString() : this.profile.toString());
  }

  save() {
    console.log(`Progress saved in profile ${this.profile}`);
    localStorage.setItem(this.saveLocation(), JSON.stringify(this.makeSave()));
    this.lastSaved = Date.now();
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
    this.saveProfile();
    const saveData = localStorage.getItem(this.saveLocation());
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
