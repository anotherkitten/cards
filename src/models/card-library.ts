import { CardLocation } from '../services/card/card';
import { CardColor, CardId, CardInfo, CardTemplate, CardTag, Card, CardRecipe } from './card';
import { ResourceId } from './resource';
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
			CardColor.BLACK
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
			CardColor.BLACK
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
		{ wheat: '2', grow: '3' },
		(c: Card, x: CardExecutionService) => {
			x.grow(c, () => {
				x.addResourceByData(ResourceId.WHEAT, c);
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
		{ probability: '40', coal: '2' },
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
	[CardId.METAL_AXE]: new CardTemplate(CardId.METAL_AXE,
		new CardInfo(
			'Metal Axe',
			'Increase wood gain from other cards in hand by 6.',
			'',
			CardColor.WHITE
		),
		[ ],
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
		[ ],
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
	[CardId.EXPEDITION]: new CardTemplate(CardId.EXPEDITION,
		new CardInfo(
			'Expedition',
			'Spend 3 land to gain {!Rwood} wood and {!Rstone} stone',
			'',
			CardColor.GREEN
		),
		[ CardTag.STONE_PROVIDER, CardTag.WOOD_PROVIDER ],
		{ wood: '2', stone: '2' },
		(c: Card, x: CardExecutionService) => {
			x.spend(c, [ResourceId.LAND, 3], () => {
				x.addResourceByData(ResourceId.WOOD, c);
				x.addResourceByData(ResourceId.STONE, c);
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
	// 	(c: Card, x: CardExecutionService) => { REPLACEME },
	// ),
	// [CardId.REPLACEME]: new CardTemplate(CardId.REPLACEME,
	// 	new CardInfo(
	// 		'REPLACEME',
	// 		'REPLACEME',
	// 		'',
	// 		CardColor.REPLACEME
	// 	),
	// 	[ REPLACEME ],
	// 	{ REPLACEME },
	// 	(c: Card, x: CardExecutionService) => { REPLACEME },
	// ),
	// [CardId.REPLACEME]: new CardTemplate(CardId.REPLACEME,
	// 	new CardInfo(
	// 		'REPLACEME',
	// 		'REPLACEME',
	// 		'',
	// 		CardColor.REPLACEME
	// 	),
	// 	[ REPLACEME ],
	// 	{ REPLACEME },
	// 	(c: Card, x: CardExecutionService) => { REPLACEME },
	// ),
	// [CardId.REPLACEME]: new CardTemplate(CardId.REPLACEME,
	// 	new CardInfo(
	// 		'REPLACEME',
	// 		'REPLACEME',
	// 		'',
	// 		CardColor.REPLACEME
	// 	),
	// 	[ REPLACEME ],
	// 	{ REPLACEME },
	// 	(c: Card, x: CardExecutionService) => { REPLACEME },
	// ),
	// [CardId.REPLACEME]: new CardTemplate(CardId.REPLACEME,
	// 	new CardInfo(
	// 		'REPLACEME',
	// 		'REPLACEME',
	// 		'',
	// 		CardColor.REPLACEME
	// 	),
	// 	[ REPLACEME ],
	// 	{ REPLACEME },
	// 	(c: Card, x: CardExecutionService) => { REPLACEME },
	// ),
	// [CardId.REPLACEME]: new CardTemplate(CardId.REPLACEME,
	// 	new CardInfo(
	// 		'REPLACEME',
	// 		'REPLACEME',
	// 		'',
	// 		CardColor.REPLACEME
	// 	),
	// 	[ REPLACEME ],
	// 	{ REPLACEME },
	// 	(c: Card, x: CardExecutionService) => { REPLACEME },
	// ),
	// [CardId.REPLACEME]: new CardTemplate(CardId.REPLACEME,
	// 	new CardInfo(
	// 		'REPLACEME',
	// 		'REPLACEME',
	// 		'',
	// 		CardColor.REPLACEME
	// 	),
	// 	[ REPLACEME ],
	// 	{ REPLACEME },
	// 	(c: Card, x: CardExecutionService) => { REPLACEME },
	// ),
	// [CardId.REPLACEME]: new CardTemplate(CardId.REPLACEME,
	// 	new CardInfo(
	// 		'REPLACEME',
	// 		'REPLACEME',
	// 		'',
	// 		CardColor.REPLACEME
	// 	),
	// 	[ REPLACEME ],
	// 	{ REPLACEME },
	// 	(c: Card, x: CardExecutionService) => { REPLACEME },
	// ),
	// [CardId.REPLACEME]: new CardTemplate(CardId.REPLACEME,
	// 	new CardInfo(
	// 		'REPLACEME',
	// 		'REPLACEME',
	// 		'',
	// 		CardColor.REPLACEME
	// 	),
	// 	[ REPLACEME ],
	// 	{ REPLACEME },
	// 	(c: Card, x: CardExecutionService) => { REPLACEME },
	// ),
	// [CardId.REPLACEME]: new CardTemplate(CardId.REPLACEME,
	// 	new CardInfo(
	// 		'REPLACEME',
	// 		'REPLACEME',
	// 		'',
	// 		CardColor.REPLACEME
	// 	),
	// 	[ REPLACEME ],
	// 	{ REPLACEME },
	// 	(c: Card, x: CardExecutionService) => { REPLACEME },
	// ),
}

export const CARD_RECIPES: CardLibrary<CardId, CardRecipe> = {
	[CardId.RELAX]: new CardRecipe(CardId.RELAX, {}),
	[CardId.CHOP_WOOD]: new CardRecipe(CardId.CHOP_WOOD, {}),
	[CardId.MINE_STONE]: new CardRecipe(CardId.MINE_STONE, {}),
	[CardId.STONE_AXE]: new CardRecipe(CardId.STONE_AXE, {
		'wood': 4,
		'stone': 6
	}),
	[CardId.STONE_PICK]: new CardRecipe(CardId.STONE_PICK, {
		'wood': 6,
		'stone': 4
	}),
	[CardId.TOOL_CART]: new CardRecipe(CardId.TOOL_CART, {
		'wood': 8,
		'stone': 8
	}),
	[CardId.LUMBERYARD]: new CardRecipe(CardId.LUMBERYARD, {
		'wood': 12,
		'stone': 20
	}),
	[CardId.QUARRY]: new CardRecipe(CardId.QUARRY, {
		'wood': 20,
		'stone': 12
	}),
	[CardId.WATER_WELL]: new CardRecipe(CardId.WATER_WELL, {
		'stone': 30
	}),
	[CardId.TILL_SOIL]: new CardRecipe(CardId.TILL_SOIL, {
		'wood': 15,
		'water': 20
	}),
	[CardId.GROW_WHEAT]: new CardRecipe(CardId.GROW_WHEAT, {
		'water': 10,
		'land': 15
	}),
	[CardId.MINE_COAL]: new CardRecipe(CardId.MINE_COAL, {
		'wood': 25,
		'stone': 15
	}),
	[CardId.SMELT_ORE]: new CardRecipe(CardId.SMELT_ORE, {
		'stone': 20,
		'coal': 4
	}),
	[CardId.FURNACE]: new CardRecipe(CardId.FURNACE, {
		'stone': 40,
		'coal': 8
	}),
	[CardId.METAL_AXE]: new CardRecipe(CardId.METAL_AXE, {
		'wood': 25,
		'metal': 10
	}),
	[CardId.METAL_PICK]: new CardRecipe(CardId.METAL_PICK, {
		'wood': 25,
		'metal': 10
	}),
	[CardId.WATER_PIPE]: new CardRecipe(CardId.WATER_PIPE, {
		'metal': 20
	}),
	[CardId.EXPEDITION]: new CardRecipe(CardId.EXPEDITION, {
		'land': 15,
		'water': 40
	}),
}