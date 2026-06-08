import { CardExecutionService } from "../services/card-execution/card-execution";
import { Resource, ResourceId } from './resource';

type CardTags = CardTag[];
type CardData = {[key: string]: String};
type CardRecipeCosts = {[key: string]: number};
type CardEffect = (c: Card) => void;
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
	RELAX = 'relax',
	CHOP_WOOD = 'chop-wood',
	MINE_STONE = 'mine-stone',
	STONE_AXE = 'stone-axe',
	STONE_PICK = 'stone-pick',
	TOOL_CART = 'tool-cart',
	LUMBERYARD = 'lumberyard',
	QUARRY = 'quarry',
}

export enum CardTag {
	WOOD_PROVIDER = 'wood-provider',
	STONE_PROVIDER = 'stone-provider',
	TOOL = 'tool'
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
		return card;
	}
}

export class SavedCard {
	id: String;
	data: CardData;

	constructor(id: String, data: CardData) {
		this.id = id;
		this.data = data;
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

	loadData(data: CardData) {
		this.data = data;
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
		// populate resource data first (might be modified)
		const resource_data = (input.match(/{!R[a-zA-Z0-9-]+}/g) || []).map(data => data.replaceAll(/{!R|}/g,''));
		for (let datum of resource_data) {
			input = input.replace(`{!R${datum}}`, this.getResourceFromData(datum).toString());
		}

		// generic data
		const data = (input.match(/{[a-zA-Z0-9-]+}/g) || []).map(data => data.replaceAll(/{|}/g,''));
		for (let datum of data) {
			input = input.replace(`{${datum}}`, (this.get(datum)?.toString() || ""));
		}

		return input;
	}

	hasTag = (tag: CardTag | String) => {
		console.log(tag)
		return this.tags.map(t => t.toLowerCase().toString()).includes(tag.toLowerCase().toString());
	}

	getResourceFromData(id: ResourceId | String) {
		return this.getNum(id) + this.getNum(`temporary-${id}`);
	}

	static shuffle(cards: Card[]) {
		for (let i = cards.length - 1; i > 0; i--) {
		const j = (Math.random() * (i + 1)) | 0;
		[cards[i], cards[j]] = [cards[j], cards[i]];
		}
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
}