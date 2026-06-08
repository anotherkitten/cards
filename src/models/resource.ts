export enum ResourceId {
	WOOD = 'wood',
	STONE = 'stone',
	GOLD = 'gold'
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
		this.quantity = quantity || 0;
	}
}

export const RESOURCE_LIB = {
	[ResourceId.WOOD]: new Resource(ResourceId.WOOD, "Wood", ResourceColor.BROWN),
	[ResourceId.STONE]: new Resource(ResourceId.STONE, "Stone", ResourceColor.BLACK),
	[ResourceId.GOLD]: new Resource(ResourceId.GOLD, "Gold", ResourceColor.YELLOW),
}