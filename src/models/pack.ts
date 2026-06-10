import { CardId } from "./card";
import { Resource, ResourceId } from "./resource";

type CardPackCosts = {[key: string]: number};

export class Pack {
	name: String;
	cards: CardId[];
	cost: CardPackCosts;

	constructor(name: String, cards: CardId[], costs: CardPackCosts) {
		this.name = name;
		this.cards = cards;
		this.cost = costs;
	}

	available(unlocked: CardId[]): CardId[] {
		return this.cards.filter(id => !unlocked.includes(id));
	}

	draw(unlocked: CardId[]): CardId {
		const notUnlocked = this.available(unlocked);

		if (!notUnlocked.length) return CardId.RELAX;
		return notUnlocked[Math.floor(Math.random() * notUnlocked.length)];
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
