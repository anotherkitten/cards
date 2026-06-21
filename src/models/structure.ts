import { ResourceCosts, ResourceId } from "./resource";

type StructureLibrary<T extends string | symbol | number, U> = {
    [K in T]: U;
};

type DescriptionFunc = (level: number) => String;

export enum StructureId {
	SILO = "silo",
	WATER_WHEEL = "water-wheel",
	WORKSHOP = "workshop",
}

export class SavedStructure {
	id: StructureId;
	level: number;

	constructor(id: StructureId, level: number) {
		this.id = id;
		this.level = level;
	}

	toStructure() {
		return Object.assign(STRUCTURES[this.id], { level: this.level }) as Structure;
	}
}

export class Structure {
	id: StructureId;
	name: String = '';
	level: number = 0;
	levels: number = 1;
	desc: DescriptionFunc = () => '';
	costs: ResourceCosts[] = [];

	constructor(id: StructureId, name: String, levels: number, desc: DescriptionFunc, costs: ResourceCosts[]) {
		this.id = id;
		this.name = name;
		this.levels = levels;
		this.desc = desc;
		this.costs = costs;
	}

	getCost() {
		return this.costs[Math.min(this.level, this.costs.length - 1)];
	}

	maxLevel() {
		return this.level >= this.levels;
	}
}

export const STRUCTURES: StructureLibrary<StructureId, Structure> = {
	[StructureId.SILO]: new Structure(
		StructureId.SILO, "Silo", 5,
		(n) => !n ? 'Raises the resource limit' : `Resource limit is raised to ${[200, 500, 1000, 2500, 10000][n - 1]}`,
		[
			new ResourceCosts({
				[ResourceId.WOOD]: 80,
				[ResourceId.STONE]: 80
			}),
			new ResourceCosts({
				[ResourceId.WOOD]: 160,
				[ResourceId.STONE]: 160
			}),
			new ResourceCosts({
				[ResourceId.WOOD]: 320,
				[ResourceId.STONE]: 320
			}),
			new ResourceCosts({
				[ResourceId.WOOD]: 640,
				[ResourceId.STONE]: 640
			}),
			new ResourceCosts({
				[ResourceId.WOOD]: 1280,
				[ResourceId.STONE]: 1280
			})
		]
	),
	[StructureId.WATER_WHEEL]: new Structure(
		StructureId.WATER_WHEEL, "Water Wheel", 3,
		(n) => !n ? 'Speeds up the redraw timer' : `Redrawing is ${['1 second', '1.8 seconds', '2.5 seconds'][n - 1]} faster`,
		[
			new ResourceCosts({
				[ResourceId.WOOD]: 120,
				[ResourceId.WATER]: 80
			}),
			new ResourceCosts({
				[ResourceId.WOOD]: 250,
				[ResourceId.WATER]: 200,
				[ResourceId.METAL]: 50
			}),
			new ResourceCosts({
				[ResourceId.WOOD]: 800,
				[ResourceId.WATER]: 500,
				[ResourceId.METAL]: 200
			}),
		]
	),
	[StructureId.WORKSHOP]: new Structure(
		StructureId.WORKSHOP, "Workshop", 3,
		(n) => !n ? 'Unlocks autoplay' : `Autoplay speed: ${['.65 cards/s', '.85 cards/s', '1.25 cards/s'][n - 1]}`,
		[
			new ResourceCosts({
				[ResourceId.WOOD]: 150,
				[ResourceId.STONE]: 100
			}),
			new ResourceCosts({
				[ResourceId.WOOD]: 200,
				[ResourceId.STONE]: 150,
				[ResourceId.METAL]: 80,
			}),
			new ResourceCosts({
				[ResourceId.WOOD]: 450,
				[ResourceId.STONE]: 150,
				[ResourceId.METAL]: 80,
			}),
		]
	),
}