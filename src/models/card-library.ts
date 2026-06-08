import { R } from '@angular/cdk/keycodes';
import { CardLocation } from '../services/card/card';
import { CardColor, CardId, CardInfo, CardTemplate, CardTag, Card, CardRecipe } from './card';
import { ResourceId } from './resource';

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
		(c: Card) => { },
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
		(c: Card) => { c.exec!.addResourceByData(ResourceId.WOOD, c) },
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
		(c: Card) => { c.exec!.addResourceByData(ResourceId.STONE, c) },
	),
	[CardId.STONE_AXE]: new CardTemplate(CardId.STONE_AXE,
		new CardInfo(
			'Stone Axe',
			'Increase wood gained from other cards in hand by 2.',
			'',
			CardColor.WHITE
		),
		[ CardTag.TOOL ],
		{},
		(c: Card) => {
			c.exec!.cards().getCardsFrom(
				CardLocation.HAND, Infinity, Card.tagFilter(CardTag.WOOD_PROVIDER)
			).forEach(c => {
				c.set('temporary-wood', c.getNum('temporary-wood') + 2)
			})
		},
	),
	[CardId.STONE_PICK]: new CardTemplate(CardId.STONE_PICK,
		new CardInfo(
			'Stone Pick',
			'Increase stone gained from other cards in hand by 2.',
			'',
			CardColor.WHITE
		),
		[ CardTag.TOOL ],
		{},
		(c: Card) => {
			c.exec!.cards().getCardsFrom(
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
		(c: Card) => {
			c.exec!.cards().drawFromDeck(c.exec!.cards().getCardsFrom(
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
		(c: Card) => { c.exec!.addResourceByData(ResourceId.WOOD, c) },
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
		(c: Card) => { c.exec!.addResourceByData(ResourceId.STONE, c) },
	),
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
}