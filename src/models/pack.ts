import { Card, CardId } from "./card";
import { Resource, ResourceId } from "./resource";

type CardPackCosts = {[key: string]: number};

export class Pack {
	id: number;
	name: String;
	cards: CardId[];
	cost: CardPackCosts;
	first_pull: CardId[];
	per_pull: number = 2;

	constructor(id: number, name: String, cards: CardId[], costs: CardPackCosts, first_pull: CardId[] = []) {
		this.id = id;
		this.name = name;
		this.cards = cards;
		this.cost = costs;
		this.first_pull = first_pull;
	}

	available(unlocked: CardId[]): CardId[] {
		return this.cards.filter(id => !unlocked.includes(id));
	}

	draw(unlocked: CardId[]): CardId[] {
		const notUnlocked = this.available(unlocked);
		const firstPullRemaining = this.first_pull.filter(c => notUnlocked.includes(c));

		if (firstPullRemaining.length) return firstPullRemaining;

		const draws: CardId[] = [];
		Card.shuffle(notUnlocked);

		for (let i = 0; i < this.per_pull; i++) {
			const unlock = notUnlocked.pop();
			if (unlock) draws.push(unlock);
		}

		return draws;
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

	static inPack(c: CardId): number {
		const pack = PACKS.find(p => p.cards.includes(c));
		return pack ? pack.id : 0;
	}
}

export const PACKS: Pack[] = [
	new Pack(0, 'Basic Set', [
		CardId.RELAX,
		CardId.CHOP_WOOD,
		CardId.MINE_STONE,
		CardId.STONE_AXE,
		CardId.STONE_PICK,
		CardId.TOOL_CART,
	],{}),
	new Pack(1, 'Early Agriculture', [
		CardId.WATER_WELL,
		CardId.TILL_SOIL,
		CardId.GROW_WHEAT,
		CardId.IRRIGATE,
		CardId.EXPEDITION,
		CardId.FEED_ANIMALS,
		CardId.FERTILIZE,
		CardId.BAKE_BREAD,
		CardId.QUICK_SNACK,
		CardId.WATERING_CAN,
		CardId.CHARCOAL,
	], {
		'wood': 40,
		'stone': 20
	}, [
		CardId.WATER_WELL,
		CardId.TILL_SOIL,
		CardId.GROW_WHEAT,
	]),
	new Pack(2, 'Simple Mining', [
		CardId.MINE_COAL,
		CardId.SMELT_ORE,
		CardId.FURNACE,
		CardId.LANTERN,
		CardId.PROSPECTING,
		CardId.PROCESS_COAL,
		CardId.WATER_PIPE,
		CardId.TOOLBOX,
		CardId.METAL_AXE,
		CardId.METAL_PICK,
		CardId.HOOK,
	], {
		'wood': 20,
		'stone': 40
	}, [
		CardId.MINE_COAL,
		CardId.SMELT_ORE,
		CardId.FURNACE,
	]),
]