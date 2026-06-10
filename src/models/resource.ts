export enum ResourceId {
	WOOD = 'wood',
	STONE = 'stone',
	WATER = 'water',
	LAND = 'land',
	WHEAT = 'wheat',
	MANURE = 'manure',
	BREAD = 'bread',
	COAL = 'coal',
	METAL = 'metal'
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
	GREY = 'grey',
	BLACK = 'black',
}

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

export class Resource {
	id: ResourceId;
	name: String;
	color: ResourceColor;
	quantity: number;

	constructor(id: ResourceId, name: String, color: ResourceColor, quantity?: number) {
		this.id = id;
		this.name = name;
		this.color = color;
		this.quantity = quantity || 100;
	}
}

export const RESOURCE_LIB = {
	[ResourceId.WOOD]: new Resource(ResourceId.WOOD, "Wood", ResourceColor.BROWN),
	[ResourceId.STONE]: new Resource(ResourceId.STONE, "Stone", ResourceColor.BLACK),
	[ResourceId.WATER]: new Resource(ResourceId.WATER, "Water", ResourceColor.BLUE),
	[ResourceId.LAND]: new Resource(ResourceId.LAND, "Land", ResourceColor.GREEN),
	[ResourceId.WHEAT]: new Resource(ResourceId.WHEAT, "Wheat", ResourceColor.YELLOW),
	[ResourceId.BREAD]: new Resource(ResourceId.BREAD, "Bread", ResourceColor.YELLOW),
	[ResourceId.MANURE]: new Resource(ResourceId.MANURE, "Manure", ResourceColor.BROWN),
	[ResourceId.COAL]: new Resource(ResourceId.COAL, "Coal", ResourceColor.BLACK),
	[ResourceId.METAL]: new Resource(ResourceId.METAL, "Metal", ResourceColor.WHITE),
}