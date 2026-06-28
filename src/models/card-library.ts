import { CardColor, CardId, CardInfo, CardTemplate, CardTag, Card, CardRecipe, CardLocation } from './card';
import { ResourceCosts, ResourceId } from './resource';
import { CardExecutionService } from '../services/card-execution/card-execution';

type CardLibrary<T extends string | symbol | number, U> = {
    [K in T]: U;
};

export const CARD_TEMPLATES: CardLibrary<CardId, CardTemplate> = {
	[CardId.RELAX]: new CardTemplate(CardId.RELAX,
		new CardInfo(
			'Relax',
			'Do nothing.',
			'',
			CardColor.WHITE
		),
		[],
		{},
		(c: Card, x: CardExecutionService) => { },
	),
	[CardId.CHOP_WOOD]: new CardTemplate(CardId.CHOP_WOOD,
		new CardInfo(
			'Chop Wood',
			'Gain {!Rwood} wood.',
			'',
			CardColor.BROWN
		),
		[ CardTag.WOOD_PROVIDER ],
		{ wood: '1' },
		(c: Card, x: CardExecutionService) => { x.addResourceByData(ResourceId.WOOD, c) },
	),
	[CardId.MINE_STONE]: new CardTemplate(CardId.MINE_STONE,
		new CardInfo(
			'Mine Stone',
			'Gain {!Rstone} stone.',
			'',
			CardColor.GRAY
		),
		[ CardTag.STONE_PROVIDER ],
		{ stone: '1' },
		(c: Card, x: CardExecutionService) => { x.addResourceByData(ResourceId.STONE, c) },
	),
	[CardId.STONE_AXE]: new CardTemplate(CardId.STONE_AXE,
		new CardInfo(
			'Stone Axe',
			'Increase wood gain from other cards in hand by 2.',
			'',
			CardColor.WHITE
		),
		[ CardTag.TOOL ],
		{},
		(c: Card, x: CardExecutionService) => {
			x.cards().getCardsFrom(
				CardLocation.HAND, Infinity, Card.tagFilter(CardTag.WOOD_PROVIDER)
			).forEach(c => {
				c.set('temporary-wood', c.getNum('temporary-wood') + 2)
			})
		},
	),
	[CardId.STONE_PICK]: new CardTemplate(CardId.STONE_PICK,
		new CardInfo(
			'Stone Pick',
			'Increase stone gain from other cards in hand by 2.',
			'',
			CardColor.WHITE
		),
		[ CardTag.TOOL ],
		{},
		(c: Card, x: CardExecutionService) => {
			x.cards().getCardsFrom(
				CardLocation.HAND, Infinity, Card.tagFilter(CardTag.STONE_PROVIDER)
			).forEach(c => {
				c.set('temporary-stone', c.getNum('temporary-stone') + 2)
			})
		},
	),
	[CardId.TOOL_CART]: new CardTemplate(CardId.TOOL_CART,
		new CardInfo(
			'Tool Cart',
			'Draw two Tools from your deck.',
			'',
			CardColor.WHITE
		),
		[],
		{},
		(c: Card, x: CardExecutionService) => {
			x.cards().drawFromDeck(x.cards().getCardsFrom(
				CardLocation.DRAW,
				2,
				Card.tagFilter(CardTag.TOOL)
			))
		},
	),
	[CardId.LUMBERYARD]: new CardTemplate(CardId.LUMBERYARD,
		new CardInfo(
			'Lumberyard',
			'Gain {!Rwood} wood.',
			'',
			CardColor.BROWN
		),
		[ CardTag.WOOD_PROVIDER ],
		{ wood: '3' },
		(c: Card, x: CardExecutionService) => { x.addResourceByData(ResourceId.WOOD, c) },
	),
	[CardId.QUARRY]: new CardTemplate(CardId.QUARRY,
		new CardInfo(
			'Quarry',
			'Gain {!Rstone} stone.',
			'',
			CardColor.GRAY
		),
		[ CardTag.STONE_PROVIDER ],
		{ stone: '3' },
		(c: Card, x: CardExecutionService) => { x.addResourceByData(ResourceId.STONE, c) },
	),
	[CardId.WATER_WELL]: new CardTemplate(CardId.WATER_WELL,
		new CardInfo(
			'Water Well',
			'Gain {!Rwater} water.',
			'',
			CardColor.BLUE
		),
		[ CardTag.WATER_PROVIDER ],
		{ water: '5' },
		(c: Card, x: CardExecutionService) => { x.addResourceByData(ResourceId.WATER, c) },
	),
	[CardId.TILL_SOIL]: new CardTemplate(CardId.TILL_SOIL,
		new CardInfo(
			'Till Soil',
			'Spend 1 water, gain {!Rland} land.',
			'',
			CardColor.GREEN
		),
		[ CardTag.LAND_PROVIDER ],
		{ land: '3' },
		(c: Card, x: CardExecutionService) => {
			x.spend(c, [ResourceId.WATER, 1], () => {
				x.addResourceByData(ResourceId.LAND, c);
			})
		},
	),
	[CardId.GROW_WHEAT]: new CardTemplate(CardId.GROW_WHEAT,
		new CardInfo(
			'Grow Wheat',
			'Grow {!G}: Gain {!Rwheat} wheat.',
			'',
			CardColor.YELLOW
		),
		[ CardTag.WHEAT_PROVIDER, CardTag.GROW ],
		{ wheat: '2', grow: '4' },
		(c: Card, x: CardExecutionService) => {
			x.grow(c, () => {
				x.addResourceByData(ResourceId.WHEAT, c);
			}) 
		},
	),
	[CardId.WATERING_CAN]: new CardTemplate(CardId.WATERING_CAN,
		new CardInfo(
			'Watering Can',
			'Spend 3 water, speed up growth of all cards in hand by 1.',
			'',
			CardColor.WHITE
		),
		[ CardTag.TOOL ],
		{ },
		(c: Card, x: CardExecutionService) => {
			x.cards().getCardsFrom(CardLocation.HAND, Infinity, Card.tagFilter(CardTag.GROW)).forEach(growCard => {
				growCard.set('growturn', Math.min(growCard.getNum('grow'), growCard.getNum('growturn') + 1));
			})
		},
	),
	[CardId.IRRIGATE]: new CardTemplate(CardId.IRRIGATE,
		new CardInfo(
			'Irrigate',
			'Spend 6 water, gain {!Rland} land.',
			'',
			CardColor.GREEN
		),
		[ CardTag.LAND_PROVIDER ],
		{ land: '12' },
		(c: Card, x: CardExecutionService) => {
			x.spend(c, [ResourceId.WATER, 6], () => {
				x.addResourceByData(ResourceId.LAND, c);
			})
		},
	),
	[CardId.FEED_ANIMALS]: new CardTemplate(CardId.FEED_ANIMALS,
		new CardInfo(
			'Feed Livestock',
			'Spend 3 wheat to gain {!Rmanure} manure.',
			'',
			CardColor.BROWN
		),
		[ CardTag.MANURE_PROVIDER ],
		{ manure: '2' },
		(c: Card, x: CardExecutionService) => {
			x.spend(c, [ResourceId.WHEAT, 3], () => {
				x.addResourceByData(ResourceId.MANURE, c);
			})
		},
	),
	[CardId.FERTILIZE]: new CardTemplate(CardId.FERTILIZE,
		new CardInfo(
			'Fertilize',
			'Spend 6 manure to permanently speed up the growth of cards in hand by 1.',
			'',
			CardColor.BROWN
		),
		[ ],
		{ },
		(c: Card, x: CardExecutionService) => {
			x.spend(c, [ResourceId.MANURE, 6], () => {
				x.cards().getCardsFrom(CardLocation.HAND, Infinity, Card.tagFilter(CardTag.GROW)).forEach(growCard => {
					growCard.set('grow', Math.max(1, growCard.getNum('grow') - 1));
					growCard.set('growturn', Math.min(growCard.getNum('grow'), growCard.getNum('growturn')));
				})
			})
		},
	),
	[CardId.BAKE_BREAD]: new CardTemplate(CardId.BAKE_BREAD,
		new CardInfo(
			'Bake Bread',
			'Spend 4 wheat and 2 coal to gain {!Rbread} bread.',
			'',
			CardColor.YELLOW
		),
		[ CardTag.BREAD_PROVIDER ],
		{ bread: '6' },
		(c: Card, x: CardExecutionService) => {
			x.spend(c, [[ResourceId.WHEAT, 4], [ResourceId.COAL, 2]], () => {
				x.addResourceByData(ResourceId.BREAD, c);
			})
		},
	),
	[CardId.QUICK_SNACK]: new CardTemplate(CardId.QUICK_SNACK,
		new CardInfo(
			'Quick Snack',
			'Spend 1 bread to draw 2 cards.',
			'',
			CardColor.YELLOW
		),
		[ ],
		{ },
		(c: Card, x: CardExecutionService) => {
			x.spend(c, [ResourceId.BREAD, 1], () => {
				x.cards().drawCards(2);
			})
		},
	),
	[CardId.EXPEDITION]: new CardTemplate(CardId.EXPEDITION,
		new CardInfo(
			'Expedition',
			'Spend 2 land to gain {!Rwood} wood and {!Rstone} stone',
			'',
			CardColor.GREEN
		),
		[ CardTag.STONE_PROVIDER, CardTag.WOOD_PROVIDER ],
		{ wood: '4', stone: '4' },
		(c: Card, x: CardExecutionService) => {
			x.spend(c, [ResourceId.LAND, 2], () => {
				x.addResourceByData(ResourceId.WOOD, c);
				x.addResourceByData(ResourceId.STONE, c);
			})
		},
	),
	[CardId.MINE_COAL]: new CardTemplate(CardId.MINE_COAL,
		new CardInfo(
			'Mine Coal',
			'{!P}: Gain {!Rcoal} coal.',
			'',
			CardColor.BLACK
		),
		[ CardTag.COAL_PROVIDER, CardTag.PROBABILITY ],
		{ probability: '60', coal: '2' },
		(c: Card, x: CardExecutionService) => {
			x.probability(c, () => {
				x.addResourceByData(ResourceId.COAL, c);
			})
		},
	),
	[CardId.SMELT_ORE]: new CardTemplate(CardId.SMELT_ORE,
		new CardInfo(
			'Smelt Ore',
			'Spend 3 coal and 6 stone to gain {!Rmetal} metal.',
			'',
			CardColor.WHITE
		),
		[ CardTag.METAL_PROVIDER ],
		{ metal: '1' },
		(c: Card, x: CardExecutionService) => { 
			x.spend(c, [[ResourceId.COAL, 3], [ResourceId.STONE, 6]], () => {
				x.addResourceByData(ResourceId.METAL, c);
			})
		},
	),
	[CardId.FURNACE]: new CardTemplate(CardId.FURNACE,
		new CardInfo(
			'Furnace',
			'Spend 1 coal to increase metal gain from cards in hand by 2.',
			'',
			CardColor.RED
		),
		[ ],
		{ },
		(c: Card, x: CardExecutionService) => { 
			x.spend(c, [ResourceId.COAL, 1], () => {
				x.cards().getCardsFrom(
					CardLocation.HAND, Infinity, Card.tagFilter(CardTag.METAL_PROVIDER)
				).forEach(c => {
					c.set('temporary-metal', c.getNum('temporary-metal') + 2);
				})
			})
		},
	),
	[CardId.CHARCOAL]: new CardTemplate(CardId.CHARCOAL,
		new CardInfo(
			'Charcoal',
			'Spend 6 wood to gain {!Rcoal} coal.',
			'',
			CardColor.BLACK
		),
		[ CardTag.COAL_PROVIDER ],
		{ coal: '3' },
		(c: Card, x: CardExecutionService) => {
			x.addResourceByData(ResourceId.COAL, c);
		},
	),
	[CardId.LANTERN]: new CardTemplate(CardId.LANTERN,
		new CardInfo(
			'Lantern',
			'Increase probability of cards in hand by 30%.',
			'',
			CardColor.WHITE
		),
		[ CardTag.TOOL ],
		{ },
		(c: Card, x: CardExecutionService) => {
			x.cards().getCardsFrom(CardLocation.HAND, Infinity, Card.tagFilter(CardTag.PROBABILITY)).forEach(probabilityCard => {
				probabilityCard.set('temporary-probability', probabilityCard.getNum('temporary-probability') + 30);
			});
		},
	),
	[CardId.PROSPECTING]: new CardTemplate(CardId.PROSPECTING,
		new CardInfo(
			'Prospecting',
			'{!P}: Gain {!Rcoal} coal and {!Rmetal} metal.',
			'',
			CardColor.BLACK
		),
		[ CardTag.COAL_PROVIDER, CardTag.METAL_PROVIDER, CardTag.PROBABILITY ],
		{ probability: '20', coal: '8', metal: '1' },
		(c: Card, x: CardExecutionService) => {
			x.probability(c, () => {
				x.addResourceByData(ResourceId.COAL, c);
				x.addResourceByData(ResourceId.METAL, c);
			})
		},
	),
	[CardId.METAL_AXE]: new CardTemplate(CardId.METAL_AXE,
		new CardInfo(
			'Metal Axe',
			'Increase wood gain from other cards in hand by 6.',
			'',
			CardColor.WHITE
		),
		[ CardTag.TOOL ],
		{ },
		(c: Card, x: CardExecutionService) => {
			x.cards().getCardsFrom(
				CardLocation.HAND, Infinity, Card.tagFilter(CardTag.WOOD_PROVIDER)
			).forEach(c => {
				c.set('temporary-wood', c.getNum('temporary-wood') + 6);
			})
		},
	),
	[CardId.METAL_PICK]: new CardTemplate(CardId.METAL_PICK,
		new CardInfo(
			'Metal Pick',
			'Increase stone gain from other cards in hand by 6.',
			'',
			CardColor.WHITE
		),
		[ CardTag.TOOL ],
		{ },
		(c: Card, x: CardExecutionService) => {
			x.cards().getCardsFrom(
				CardLocation.HAND, Infinity, Card.tagFilter(CardTag.STONE_PROVIDER)
			).forEach(c => {
				c.set('temporary-stone', c.getNum('temporary-stone') + 6);
			})
		},
	),
	[CardId.WATER_PIPE]: new CardTemplate(CardId.WATER_PIPE,
		new CardInfo(
			'Water Pipe',
			'Gain {!Rwater} water.',
			'',
			CardColor.BLUE
		),
		[ CardTag.WATER_PROVIDER ],
		{ water: '12' },
		(c: Card, x: CardExecutionService) => {
			x.addResourceByData(ResourceId.WATER, c);
		},
	),
	[CardId.HOOK]: new CardTemplate(CardId.HOOK,
		new CardInfo(
			'Hook',
			'Return the last played card to hand.',
			'',
			CardColor.WHITE
		),
		[ CardTag.TOOL ],
		{ },
		(c: Card, x: CardExecutionService) => {
			if (x.cards().last_played) {
				x.cards().moveToHand(x.cards().last_played!);
			}
		},	
	),
	[CardId.TOOLBOX]: new CardTemplate(CardId.TOOLBOX,
		new CardInfo(
			'Toolbox',
			'Draw three Tools from your deck.',
			'',
			CardColor.WHITE
		),
		[],
		{},
		(c: Card, x: CardExecutionService) => {
			x.cards().drawFromDeck(x.cards().getCardsFrom(
				CardLocation.DRAW,
				3,
				Card.tagFilter(CardTag.TOOL)
			))
		},
	),
	[CardId.PROCESS_COAL]: new CardTemplate(CardId.PROCESS_COAL,
		new CardInfo(
			'Process Coal',
			'Spend 4 water to increase coal gain from other cards in hand by 3.',
			'',
			CardColor.BLACK
		),
		[ ],
		{ },
		(c: Card, x: CardExecutionService) => {
			x.spend(c, [ResourceId.WATER, 4], () => {
				x.cards().getCardsFrom(
					CardLocation.HAND, Infinity, Card.tagFilter(CardTag.COAL_PROVIDER)
				).forEach(c => {
					c.set('temporary-coal', c.getNum('temporary-coal') + 3);
				})
			})
		},
	),
	// [CardId.REPLACEME]: new CardTemplate(CardId.REPLACEME,
	// 	new CardInfo(
	// 		'REPLACEME',
	// 		'REPLACEME',
	// 		'',
	// 		CardColor.REPLACEME
	// 	),
	// 	[ REPLACEME ],
	// 	{ REPLACEME },
	// 	(c: Card, x: CardExecutionService) => {
			
	// 	},	
	// ),
}

export const CARD_RECIPES: CardLibrary<CardId, CardRecipe> = {
	[CardId.RELAX]: new CardRecipe(CardId.RELAX, new ResourceCosts({})),
	[CardId.CHOP_WOOD]: new CardRecipe(CardId.CHOP_WOOD, new ResourceCosts({})),
	[CardId.MINE_STONE]: new CardRecipe(CardId.MINE_STONE, new ResourceCosts({})),
	[CardId.STONE_AXE]: new CardRecipe(CardId.STONE_AXE, new ResourceCosts({
		[ResourceId.WOOD]: 4,
		[ResourceId.STONE]: 6
	})),
	[CardId.STONE_PICK]: new CardRecipe(CardId.STONE_PICK, new ResourceCosts({
		[ResourceId.WOOD]: 6,
		[ResourceId.STONE]: 4
	})),
	[CardId.TOOL_CART]: new CardRecipe(CardId.TOOL_CART, new ResourceCosts({
		[ResourceId.WOOD]: 8,
		[ResourceId.STONE]: 8
	})),
	[CardId.LUMBERYARD]: new CardRecipe(CardId.LUMBERYARD,  new ResourceCosts({
		[ResourceId.WOOD]: 12,
		[ResourceId.STONE]: 16
	})),
	[CardId.QUARRY]: new CardRecipe(CardId.QUARRY,  new ResourceCosts({
		[ResourceId.WOOD]: 16,
		[ResourceId.STONE]: 12
	})),
	[CardId.WATER_WELL]: new CardRecipe(CardId.WATER_WELL,  new ResourceCosts({
		[ResourceId.STONE]: 25
	})),
	[CardId.TILL_SOIL]: new CardRecipe(CardId.TILL_SOIL, new ResourceCosts({
		[ResourceId.WOOD]: 10,
		[ResourceId.WATER]: 15
	})),
	[CardId.GROW_WHEAT]: new CardRecipe(CardId.GROW_WHEAT, new ResourceCosts({
		[ResourceId.WATER]: 10,
		[ResourceId.LAND]: 6
	})),
	[CardId.WATERING_CAN]: new CardRecipe(CardId.WATERING_CAN, new ResourceCosts({
		[ResourceId.WATER]: 12,
		[ResourceId.METAL]: 8
	})),
	[CardId.IRRIGATE]: new CardRecipe(CardId.IRRIGATE, new ResourceCosts({
		[ResourceId.WATER]: 20,
		[ResourceId.LAND]: 10
	})),
	[CardId.FEED_ANIMALS]: new CardRecipe(CardId.FEED_ANIMALS, new ResourceCosts({
		[ResourceId.LAND]: 10,
		[ResourceId.WHEAT]: 5
	})),
	[CardId.FERTILIZE]: new CardRecipe(CardId.FERTILIZE, new ResourceCosts({
		[ResourceId.MANURE]: 10
	})),
	[CardId.BAKE_BREAD]: new CardRecipe(CardId.BAKE_BREAD, new ResourceCosts({
		[ResourceId.WATER]: 10,
		[ResourceId.WHEAT]: 10
	})),
	[CardId.QUICK_SNACK]: new CardRecipe(CardId.QUICK_SNACK, new ResourceCosts({
		[ResourceId.BREAD]: 5
	})),
	[CardId.EXPEDITION]: new CardRecipe(CardId.EXPEDITION, new ResourceCosts({
		[ResourceId.WATER]: 40,
		[ResourceId.LAND]: 15
	})),
	[CardId.MINE_COAL]: new CardRecipe(CardId.MINE_COAL,  new ResourceCosts({
		[ResourceId.WOOD]: 25,
		[ResourceId.STONE]: 10
	})),
	[CardId.SMELT_ORE]: new CardRecipe(CardId.SMELT_ORE,  new ResourceCosts({
		[ResourceId.STONE]: 20,
		[ResourceId.COAL]: 4
	})),
	[CardId.FURNACE]: new CardRecipe(CardId.FURNACE,  new ResourceCosts({
		[ResourceId.STONE]: 40,
		[ResourceId.COAL]: 8
	})),
	[CardId.CHARCOAL]: new CardRecipe(CardId.CHARCOAL,  new ResourceCosts({
		[ResourceId.WOOD]: 25,
		[ResourceId.COAL]: 5
	})),
	[CardId.LANTERN]: new CardRecipe(CardId.LANTERN, new ResourceCosts({
		[ResourceId.COAL]: 10,
		[ResourceId.METAL]: 4
	})),
	[CardId.PROSPECTING]: new CardRecipe(CardId.PROSPECTING,  new ResourceCosts({
		[ResourceId.LAND]: 30
	})),
	[CardId.METAL_AXE]: new CardRecipe(CardId.METAL_AXE, new ResourceCosts({
		[ResourceId.WOOD]: 25,
		[ResourceId.METAL]: 10
	})),
	[CardId.METAL_PICK]: new CardRecipe(CardId.METAL_PICK, new ResourceCosts({
		[ResourceId.WOOD]: 25,
		[ResourceId.METAL]: 10
	})),
	[CardId.WATER_PIPE]: new CardRecipe(CardId.WATER_PIPE, new ResourceCosts({
		[ResourceId.WATER]: 20,
		[ResourceId.METAL]: 15
	})),
	[CardId.HOOK]: new CardRecipe(CardId.HOOK, new ResourceCosts({
		[ResourceId.METAL]: 20
	})),
	[CardId.TOOLBOX]: new CardRecipe(CardId.TOOLBOX, new ResourceCosts({
		[ResourceId.METAL]: 35
	})),
	[CardId.PROCESS_COAL]: new CardRecipe(CardId.PROCESS_COAL, new ResourceCosts({
		[ResourceId.WATER]: 30,
		[ResourceId.METAL]: 5
	})),
}