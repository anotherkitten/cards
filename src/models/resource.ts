import { ɵAcxChangeDetectionStrategy } from "@angular/core";

export enum ResourceId {
	WOOD = 'wood',
	STONE = 'stone',
	WATER = 'water',
	LAND = 'land',
	WHEAT = 'wheat',
	MANURE = 'manure',
	BREAD = 'bread',
	COAL = 'coal',
	METAL = 'metal',
}

export enum ResourceColor {
	WHITE = 'white',
	GREEN = 'green',
	YELLOW = 'yellow',
	ORANGE = 'orange',
	RED = 'red',
	PURPLE = 'purple',
	BLUE = 'blue',
	BROWN = 'brown',
	GRAY = 'gray',
	BLACK = 'black',
}

type ResourceLibrary<T extends string | symbol | number, U> = {
    [K in T]: U;
};

export class SavedResource {
	id: ResourceId;
	quantity: number;
	unlocked: boolean;

	constructor(id: ResourceId, quantity: number, unlocked: boolean) {
		this.id = id;
		this.quantity = quantity;
		this.unlocked = unlocked;
	}
}

export class ResourceCosts {
	dict: ResourceLibrary<ResourceId, number> = (Object.values(ResourceId) as ResourceId[]).map(id => { return {[id]: 0} }).reduce((acc, r) => Object.assign(acc, r)) as ResourceLibrary<ResourceId, number>;
	resources: ResourceId[] = [];

	constructor(costs: {[id: string]: number}) {
		Object.assign(this.dict, costs);
		this.resources = this.getResourcesInCost();
	}

	getResourcesInCost(): ResourceId[] {
		return Object.entries(this.dict).filter(pair => pair[1]).map(pair => pair[0]) as ResourceId[];
	}

	getCost(id: ResourceId) {
		return this.dict[id];
	}

	enough(resource: Resource) {
		return resource.quantity >= this.getCost(resource.id);
	}

	canBuy(resources: Resource[]) {
		return resources.every(res => this.enough(res));
	}

	recipeCostString(id: ResourceId) {
		return `${this.getCost(id)} ${RESOURCE_LIB[id].name}`
	}
}

export class Resource {
	id: ResourceId;
	name: String;
	color: ResourceColor;
	quantity: number;

	constructor(id: ResourceId, name: String, color: ResourceColor, quantity?: number) {
		this.id = id;
		this.name = name;
		this.color = color;
		this.quantity = quantity || 0;
	}
}

export const RESOURCE_LIB = {
	[ResourceId.WOOD]: new Resource(ResourceId.WOOD, "Wood", ResourceColor.BROWN),
	[ResourceId.STONE]: new Resource(ResourceId.STONE, "Stone", ResourceColor.GRAY),
	[ResourceId.WATER]: new Resource(ResourceId.WATER, "Water", ResourceColor.BLUE),
	[ResourceId.LAND]: new Resource(ResourceId.LAND, "Land", ResourceColor.GREEN),
	[ResourceId.WHEAT]: new Resource(ResourceId.WHEAT, "Wheat", ResourceColor.YELLOW),
	[ResourceId.BREAD]: new Resource(ResourceId.BREAD, "Bread", ResourceColor.YELLOW),
	[ResourceId.MANURE]: new Resource(ResourceId.MANURE, "Manure", ResourceColor.BROWN),
	[ResourceId.COAL]: new Resource(ResourceId.COAL, "Coal", ResourceColor.BLACK),
	[ResourceId.METAL]: new Resource(ResourceId.METAL, "Metal", ResourceColor.WHITE),
}