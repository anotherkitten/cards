import { CardExecutionService } from '../services/card-execution/card-execution';
import { Resource, ResourceId } from './resource';

type CardTags = CardTag[];
type CardData = {[key: string]: String};
type CardRecipeCosts = {[key: string]: number};
type CardEffect = (c: Card, exec: CardExecutionService) => void;
type CardFilter = (c: Card) => boolean;

export enum CardColor {
	WHITE = 'white',
	GREEN = 'green',
	YELLOW = 'yellow',
	ORANGE = 'orange',
	RED = 'red',
	PURPLE = 'purple',
	BLUE = 'blue',
	BROWN = 'brown',
	GREY = 'grey',
	BLACK = 'black',
}

export enum CardId {
	//unlocked by default
	RELAX = 'relax',
	CHOP_WOOD = 'chop-wood',
	MINE_STONE = 'mine-stone',
	STONE_AXE = 'stone-axe',
	STONE_PICK = 'stone-pick',
	TOOL_CART = 'tool-cart',
	LUMBERYARD = 'lumberyard',
	QUARRY = 'quarry',

	////early agriculture
	// first buy
	WATER_WELL = 'water-well', // +5 water
	TILL_SOIL = 'till-soil', // -1 water, +3 land
	GROW_WHEAT = 'grow-wheat', // -1 land; grow (1/5): +2 wheat
	// // additional
	WATERING_CAN = 'watering-can', // -3 water, +2 growth to all crops in hand 
	IRRIGATE = 'irrigate', // -6 water, +12 land
	FEED_ANIMALS = 'feed-animals', // -3 wheat, +2 manure
	FERTILIZE = 'fertilize', // -6 manure, permanently speed up growth of all crops in hand
	BAKE_BREAD = 'bake-bread', // -4 wheat, -2 coal, +6 bread
	QUICK_SNACK = 'quick-snack', // -1 bread to draw 2 cards
	EXPEDITION = 'expedition', // -5 land, +3 wood, +3 stone

	////simple mining
	//first buy
	MINE_COAL = 'mine-coal', // 40%: +2 coal
	SMELT_ORE = 'smelt-ore', // -3 coal, -6 stone, +1 metal
	FURNACE = 'furnace', // -1 coal, +2 metal to cards in hand 
	// // additional
	CHARCOAL = 'charcoal', // -6 wood, +3 coal
	LANTERN = 'lantern', // other cards have +30% probability to find resources 
	PROSPECTING = 'prospecting', // 20%: +6 coal, +1 metal
	METAL_AXE = 'metal-axe', // +6 to all wood cards in hand
	METAL_PICK = 'metal-pick', // +6 to all stone cards in hand
	WATER_PIPE = 'water-pipe', // +12 water
	HOOK = 'hook', // return the last played card to your hand

	// //// improved basics
	// TOOLBOX = 'toolbox', // draw 3 tool cards from your deck
	// SAWMILL = 'sawmill', // -5 water, +9 wood
	// BLAST_MINE = 'blast-mine', // -3 coal, +9 stone
    // SCYTHE = 'scythe', // +4 wheat to cards in hand
	// COAL_VEIN = 'coal-vein', // 70%: +3 coal
	// CAMPFIRE = 'campfire', // 

}

export enum CardTag {
	WOOD_PROVIDER = 'wood-provider',
	STONE_PROVIDER = 'stone-provider',
	WATER_PROVIDER = 'water-provider',
	LAND_PROVIDER = 'land-provider',
	MANURE_PROVIDER = 'manure-provider',
	WHEAT_PROVIDER = 'wheat-provider',
	BREAD_PROVIDER = 'bread-provider',
	COAL_PROVIDER = 'coal-provider',
	METAL_PROVIDER = 'metal-provider',
	PROBABILITY = 'probability',
	GROW = 'grow',
	TOOL = 'tool'
}

export enum CardLocation {
  HAND, DRAW, DISCARD, DECK, OWNED, DRAW_NOT_IN_DECK, HAND_NOT_IN_DECK, DISCARD_NOT_IN_DECK
}

export const VISIBLE_TAGS: {[key: string]: String} = {
	'tool': 'Tool'
}

export const CARD_ID_ORDINALS: { [key: string]: number } = Object.values(CardId).map((id, index) => { return {[id as string]: index} }).reduce(Object.assign, {});

export class CardInfo {
	name: String;
	desc: String;
	icon: String;
	color: CardColor;

	constructor(name: String, desc: String, icon: String, color: CardColor) {
		this.name = name;
		this.desc = desc;
		this.icon = icon;
		this.color = color;
	}
}

export class CardTemplate {
	id: CardId;
	info: CardInfo;
	tags: CardTags;
	initial_data: CardData;
	effect: CardEffect = (c: Card) => {};
	playable: CardFilter = (c: Card) => { return true };

	constructor(id: CardId, info: CardInfo, tags?: CardTags, initial_data?: CardData, effect?: CardEffect, restriction?: CardFilter) {
		this.id = id;
		this.info = info;
		this.tags = tags || [];
		this.initial_data = initial_data || {};
		if (effect) this.effect = effect;
		if (restriction) this.playable = restriction;
	}

	toCard(exec?: CardExecutionService): Card {
		const card = new Card(exec || null, this.id, this.info, this.tags, this.initial_data, this.effect, this.playable);

		if (this.tags.includes(CardTag.GROW)) card.data['growturn'] = '1';

		return card;
	}
}

export class SavedCard {
	id: CardId;
	data: CardData;
	location: CardLocation;

	constructor(id: CardId, data: CardData, location: CardLocation) {
		this.id = id;
		this.data = data;
		this.location = location;
	}
}

export class CardRecipe {
	id: CardId;
	cost: CardRecipeCosts;

	constructor(id: CardId, cost: CardRecipeCosts) {
		this.id = id;
		this.cost = cost;
	}

	getResourcesInCost(): ResourceId[] {
		return Object.values(ResourceId).filter(res => Object.keys(this.cost).includes(res)) as ResourceId[];
	}

	getCost(id: ResourceId | String) {
		return this.cost[id.toString()] || 0;
	}

	canBuy(resources: Resource[]) {
		return resources.every(res => res.quantity >= this.getCost(res.id));
	}
}

export class Card {
	id: CardId;
	uuid: String;
	time: number = Date.now();
	exec: CardExecutionService | null;
	info: CardInfo;
	tags: CardTags = [];
	data: CardData = {};
	effect: CardEffect = (c: Card) => {};
	playable: CardFilter = (c: Card) => { return true };

	constructor(exec: CardExecutionService | null, id: CardId, info: CardInfo, tags: CardTags, initial_data: CardData, effect: CardEffect, playable: CardFilter) {
		this.id = id;
		this.uuid = self.crypto.randomUUID();
		this.info = info;
		this.exec = exec;
		this.tags = tags;
		this.data = Object.assign({}, initial_data);
		this.effect = effect;
		this.playable = playable;
	}

	hasData = (data_tag: String) => {
		return Object.keys(this.data).includes(data_tag.toString());
	}

	get = (data_tag: String): String | null => {
		return (this.hasData(data_tag)) ? this.data[data_tag.toString()] : null;
	}

	getOr = (data_tag: String, or: String): String => {
		return (this.hasData(data_tag)) ? this.data[data_tag.toString()] : or;
	}

	getNum = (data_tag: String, or: number = 0): number => {
		const datum = this.hasData(data_tag) ? +this.data[data_tag.toString()] : or;

		if (isNaN(datum)) {
			console.error(`Datum (${data_tag}) on card ${this.id} is NaN!`);
			return or;
		}

		return datum;
	}

	set = (data_tag: String, value: String | number) => {
		this.data[data_tag.toString()] = value.toString();
	}

	populate(input: String): String {
		// populate resource data first 
		const resource_data = (input.match(/{!R[a-zA-Z0-9-]+}/g) || []).map(data => data.replaceAll(/{!R|}/g,''));
		for (let datum of resource_data) {
			input = input.replace(`{!R${datum}}`, this.getResourceFromData(datum).toString());
		}

		// populate grow data 
		const grow_data = (input.match(/{!G}/g) || []).map(data => data.replaceAll(/{!G|}/g,''));
		for (let datum of grow_data) {
			input = input.replace(`{!G${datum}}`, `(${this.getNum('growturn')}/${this.getNum('grow')})`);
		}

		// populate probability data 
		const probability_data = (input.match(/{!P}/g) || []).map(data => data.replaceAll(/{!P|}/g,''));
		for (let datum of probability_data) {
			input = input.replace(`{!P${datum}}`, `${Math.min(this.getProbability(), 100)}%`);
		}

		// generic data
		const data = (input.match(/{[a-zA-Z0-9-]+}/g) || []).map(data => data.replaceAll(/{|}/g,''));
		for (let datum of data) {
			input = input.replace(`{${datum}}`, (this.get(datum)?.toString() || ""));
		}

		return input;
	}

	hasTag = (tag: CardTag | String) => {
		return this.tags.map(t => t.toLowerCase().toString()).includes(tag.toLowerCase().toString());
	}

	getProbability() {
		return this.getNum('probability') + this.getNum('temporary-probability');
	}

	getResourceFromData(id: ResourceId | String) {
		return this.getNum(id) + this.getNum(`temporary-${id}`);
	}

	static shuffle(cards: Card[]): Card[] {
		for (let i = cards.length - 1; i > 0; i--) {
			const j = (Math.random() * (i + 1)) | 0;
			[cards[i], cards[j]] = [cards[j], cards[i]];
		}

		return cards;
	}

	static byOrdinal(cards: Card[]) {
		cards = cards.sort((a, b) => CARD_ID_ORDINALS[a.id] - CARD_ID_ORDINALS[b.id]);
	}

	static idFilter(ids: CardId[]): CardFilter {
		return (c: Card) => {
			return ids.includes(c.id);
		}
	}

	static tagFilter(tags: (CardTag | String)[] | CardTag | String): CardFilter {
		return (c: Card) => {
			return [tags].flat().every(c.hasTag);
		}
	}

	static dataFilter(data: String[] | String): CardFilter {
		return (c: Card) => {
			return [data].flat().every(c.hasData);
		}
	}

	static textFilter(text: String): CardFilter {
		return (card) => {
			if (
				text &&
				!card.info.name.toLowerCase().includes(text.toLowerCase()) &&
				!card.info.desc.replaceAll(/{(!R)?[a-zA-Z0-9-]+}/g,'').toLowerCase().includes(text.toLowerCase())
			) {
				return false;
			}

			return true;	
		}
	}
}