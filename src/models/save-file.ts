import { SavedCard } from "./card";

export class CardsSaveFile {
	owned: SavedCard[] = [];
	draw: String[] = [];
	hand: String[] = [];
	discard: String[] = [];
}

export class SaveFile {
	version: String = '1.0.0';
	cards: CardsSaveFile = new CardsSaveFile();
}