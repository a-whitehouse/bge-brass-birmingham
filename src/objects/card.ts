import * as bge from "bge-core";

import { IndustryLocation } from "./industrylocation";
import { City, Industry, ALL_INDUSTRIES } from "../types";

import { areArrayContentsMatching } from "../helpers";

@bge.width(Card.WIDTH)
@bge.height(Card.HEIGHT)
export class Card extends bge.Card {
	static readonly WIDTH = 6.3;
	static readonly HEIGHT = 8.5;

	static *generateDeck(playerCount: number): Iterable<Card> {
		switch (playerCount) {
			case 2:
				{
					// industries
					for (let i = 0; i < 2; i++)
						yield new IndustryCard([Industry.Coal], 18);
					for (let i = 0; i < 2; i++)
						yield new IndustryCard([Industry.Pottery], 6);
					break;
				}
			case 3:
				{
					// dark blue
					for (let i = 0; i < 2; i++)
						yield new CityCard(City.Leek, 27);
					for (let i = 0; i < 3; i++)
						yield new CityCard(City.StokeOnTrent, 16);
					for (let i = 0; i < 2; i++)
						yield new CityCard(City.Stone, 7);
					for (let i = 0; i < 1; i++)
						yield new CityCard(City.Uttoxeter, 23);
					// industries
					for (let i = 0; i < 2; i++)
						yield new IndustryCard([Industry.Coal], 18);
					for (let i = 0; i < 6; i++)
						yield new IndustryCard([Industry.Goods, Industry.Cotton], 5);
					for (let i = 0; i < 2; i++)
						yield new IndustryCard([Industry.Pottery], 6);
					break;
				}
			case 4:
				{
					// cyan
					for (let i = 0; i < 2; i++)
						yield new CityCard(City.Belper, 28);
					for (let i = 0; i < 3; i++)
						yield new CityCard(City.Derby, 0);
					// dark blue
					for (let i = 0; i < 2; i++)
						yield new CityCard(City.Leek, 27);
					for (let i = 0; i < 3; i++)
						yield new CityCard(City.StokeOnTrent, 16);
					for (let i = 0; i < 2; i++)
						yield new CityCard(City.Stone, 7);
					for (let i = 0; i < 2; i++)
						yield new CityCard(City.Uttoxeter, 23);
					// industries
					for (let i = 0; i < 3; i++)
						yield new IndustryCard([Industry.Coal], 18);
					for (let i = 0; i < 8; i++)
						yield new IndustryCard([Industry.Goods, Industry.Cotton], 5);
					for (let i = 0; i < 3; i++)
						yield new IndustryCard([Industry.Pottery], 6);
					break;
				}
		}

		// red
		for (let i = 0; i < 2; i++)
			yield new CityCard(City.Stafford, 13);
		for (let i = 0; i < 2; i++)
			yield new CityCard(City.BurtonOnTrent, 9);
		for (let i = 0; i < 2; i++)
			yield new CityCard(City.Cannock, 14);
		for (let i = 0; i < 1; i++)
			yield new CityCard(City.Tamworth, 15);
		for (let i = 0; i < 1; i++)
			yield new CityCard(City.Walsall, 8);

		// yellow
		for (let i = 0; i < 3; i++)
			yield new CityCard(City.Coalbrookdale, 24);
		for (let i = 0; i < 2; i++)
			yield new CityCard(City.Dudley, 19);
		for (let i = 0; i < 2; i++)
			yield new CityCard(City.Kidderminster, 25);
		for (let i = 0; i < 2; i++)
			yield new CityCard(City.Wolverhampton, 10);
		for (let i = 0; i < 2; i++)
			yield new CityCard(City.Worcester, 26);

		// purple
		for (let i = 0; i < 3; i++)
			yield new CityCard(City.Birmingham, 4);
		for (let i = 0; i < 3; i++)
			yield new CityCard(City.Coventry, 17);
		for (let i = 0; i < 1; i++)
			yield new CityCard(City.Nuneaton, 32);
		for (let i = 0; i < 1; i++)
			yield new CityCard(City.Redditch, 31);
		// industries
		for (let i = 0; i < 4; i++)
			yield new IndustryCard([Industry.Iron], 11);
		for (let i = 0; i < 5; i++)
			yield new IndustryCard([Industry.Brewery], 12);
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

		let x = index % 7;
		let y = 4 - Math.floor(index / 7);

		this.front.image = bge.Image.tile("https://iili.io/HGIUIEu.jpg", 5, 7, y, x);
		this.back.image = bge.Image.tile("https://iili.io/HGIUEEg.jpg", 1, 1, 0, 0);
		this.hidden.image = this.back.image;
	}

	matchesIndustryLocation(location: IndustryLocation, industry?: Industry): boolean { throw new Error("Not implemented"); }
	equals(card: Card): boolean { throw new Error("Not implemented"); }
	get isWild(): boolean { throw new Error("Not implemented"); }
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

	override matchesIndustryLocation(location: IndustryLocation, industry?: Industry): boolean {
		if (industry != null) {
			return this.industries.includes(industry);
		} else {
			return this.industries.some(x => location.data.industries.includes(x));
		}
	}

	override equals(card: Card): boolean {
		return card instanceof IndustryCard && areArrayContentsMatching(this.industries, card.industries);
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

	override matchesIndustryLocation(location: IndustryLocation, industry?: Industry): boolean {
		return this.city === City.Any || this.city === location.city;
	}

	override equals(card: Card): boolean {
		return card instanceof CityCard && this.city === card.city;
	}

	override get isWild(): boolean {
		return this.city === City.Any;
	}
}
