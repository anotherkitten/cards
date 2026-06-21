import { Card, CardId } from "./card";
import { ResourceCosts, ResourceId } from "./resource";

export class Pack {
	id: number;
	name: String;
	cards: CardId[];
	cost: ResourceCosts;
	first_pull: CardId[];
	boosted_odds: CardId[] = [];
	per_pull: number = 2;

	constructor(id: number, name: String, cards: CardId[], costs: ResourceCosts, first_pull: CardId[] = [], boosted_odds: CardId[] = []) {
		this.id = id;
		this.name = name;
		this.cards = cards;
		this.cost = costs;
		this.first_pull = first_pull;
		this.boosted_odds.push(...boosted_odds);
	}

	available(unlocked: CardId[]): CardId[] {
		return this.cards.filter(id => !unlocked.includes(id));
	}

	draw(unlocked: CardId[]): CardId[] {
		let notUnlocked = this.available(unlocked);
		const firstPullRemaining = this.first_pull.filter(c => notUnlocked.includes(c));

		if (firstPullRemaining.length) return firstPullRemaining;

		notUnlocked.push(...(this.boosted_odds.filter(id => notUnlocked.includes(id))));
		notUnlocked.push(...(this.boosted_odds.filter(id => notUnlocked.includes(id))));
		
		const draws: CardId[] = [];
		Card.shuffle(notUnlocked);

		for (let i = 0; i < this.per_pull; i++) {
			const unlock = notUnlocked.pop();
			if (unlock) {
				draws.push(unlock);
				notUnlocked = notUnlocked.filter(id => id !== unlock);
			}
		}

		return draws;
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
	], new ResourceCosts({})),
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
	], new ResourceCosts({
		[ResourceId.WOOD]: 40,
		[ResourceId.STONE]: 20
	}), [
		CardId.WATER_WELL,
		CardId.TILL_SOIL,
		CardId.GROW_WHEAT,
	], [
		CardId.IRRIGATE,
		CardId.BAKE_BREAD,
		CardId.CHARCOAL,
		CardId.FEED_ANIMALS,
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
	], new ResourceCosts({
		[ResourceId.WOOD]: 20,
		[ResourceId.STONE]: 40
	}), [
		CardId.MINE_COAL,
		CardId.SMELT_ORE,
		CardId.FURNACE,
	], [
		CardId.LANTERN,
		CardId.PROSPECTING,
		CardId.METAL_AXE,
		CardId.METAL_PICK,
	]),
]