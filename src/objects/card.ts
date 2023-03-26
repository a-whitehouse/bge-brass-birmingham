import * as bge from "bge-core";

import { IndustryLocation } from "./industrylocation.js";
import { City, Industry, ALL_INDUSTRIES, FARM_CITIES } from "../types.js";

import CARDS from "../data/cards.js"
import { LinearCardContainer } from "bge-core";

@bge.width(Card.WIDTH)
@bge.height(Card.HEIGHT)
export class Card extends bge.Card {
	static readonly WIDTH = 6.3;
	static readonly HEIGHT = 8.5;

	readonly index: number;

	static *generateDeck(playerCount: number): Iterable<Card> {
		for (let index = 0; index < CARDS.length; ++index) {
			const data = CARDS[index];
			for (let i = 0; i < data.count[playerCount - 2]; ++i) {
				yield this.create(index);
			}
		}
	}

	static create(index: number): Card {
		const data = CARDS[index];

		if (data.city !== undefined) {
			return new CityCard(data.city, index);
		}

		if (data.industries !== undefined) {
			return new IndustryCard(data.industries, index);
		}

		throw new Error("Invalid card data");
	}

	static deserializeTo(container: LinearCardContainer<Card>, indices: number[]): void {		
		if (indices.length === container.count) {
			if ([...container].every((x, i) => x.index === indices[i])) {
				return;
			}
		}

		const available = [...container];
		const result: Card[] = [];

		for (let i = 0; i < indices.length; ++i) {
			const index = indices[i];
			const match = available.findIndex(x => x.index == index);

			if (match !== -1) {
				result.push(available.splice(match, 1)[0]);
			} else {
				result.push(Card.create(index));
			}
		}

		container.removeAll();
		container.addRange(result);
	}

	static createRange(indices: number[]): Card[] {
		return indices.map(x => this.create(x));
	}

	static compare(a: Card, b: Card): number {

		if (a instanceof CityCard && b instanceof CityCard) {
			return CityCard.compare(a, b);
		}
		
		if (a instanceof IndustryCard && b instanceof IndustryCard) {
			return IndustryCard.compare(a, b);
		}

		return (a instanceof CityCard ? 1 : 0) - (b instanceof CityCard ? 1 : 0);
	}

	constructor(index: number) {
		super();

		this.index = index;

		let x = index % 7;
		let y = 4 - Math.floor(index / 7);

		this.front.image = bge.Image.tile("https://iili.io/HGIUIEu.jpg", 5, 7, y, x);
		this.back.image = bge.Image.tile("https://iili.io/HGIUEEg.jpg", 1, 1, 0, 0);
		this.hidden.image = this.back.image;
	}

	matchesIndustryLocation(location: IndustryLocation, industry: Industry): boolean { throw new Error("Not implemented"); }
	get isWild(): boolean { throw new Error("Not implemented"); }
	
	equals(card: Card): boolean {
		return this.index === card.index;
	}
}

export class IndustryCard extends Card {
	static compare(a: IndustryCard, b: IndustryCard): number {
		if (a.industries.length !== b.industries.length) {
			return a.industries.length - b.industries.length;
		}

		return a.industries[0] - b.industries[0];
	}

	readonly industries: Industry[];

	constructor(industries: Industry[], index: number) {
		super(index);

		this.name = industries.map(x => Industry[x]).join(" or ");
		this.industries = industries;
	}

	override matchesIndustryLocation(location: IndustryLocation, industry: Industry): boolean {
		return this.industries.includes(industry);
	}

	override get isWild(): boolean {
		return this.industries.length === ALL_INDUSTRIES.length;
	}
}

export class CityCard extends Card {
	static compare(a: CityCard, b: CityCard): number {
		return a.city - b.city;
	}

	readonly city: City;

	constructor(city: City, index: number) {
		super(index);

		this.name = City[city];
		this.city = city;
	}

	override matchesIndustryLocation(location: IndustryLocation, industry: Industry): boolean {
		return this.city === City.Any && !FARM_CITIES.includes(location.city) || this.city === location.city;
	}

	override get isWild(): boolean {
		return this.city === City.Any;
	}
}
