import * as bge from "bge-core";

import { Game } from "../game";
import { Card } from "../objects/card";
import { IndustryLocation } from "../objects/industrylocation";
import { ResourceToken } from "../objects/resourcetoken";
import { ScoreTokenKind } from "../objects/scoring";
import { IndustryCard } from "../objects/card";
import { Player } from "../player";
import { City, Industry, Resource, Era } from "../types";

const DEBUG_LOGGING = false;

function debugLog(message: string) {
	if (DEBUG_LOGGING) {
		console.log(message);
	}
}

export async function buildIndustry(game: Game, player: Player) {
	const buildableIndustries = new Map(game.board.industryLocations
		.map(x => [x, getBuildableIndustriesAtLocation(x, player)])
		.filter(entry => (entry[1] as Industry[]).length > 0) as [IndustryLocation, Industry[]][]);

	const loc = await player.prompt.clickAny(buildableIndustries.keys(), {

		message: "Click on a location!"
	});

	debugLog(`${player.name} clicked on ${loc.name}`);

	const validIndustriesAtLocation = buildableIndustries.get(loc);

	debugLog(`Valid industries: ${validIndustriesAtLocation.map(x => Industry[x])}`);

	let industry: Industry;

	switch (validIndustriesAtLocation.length) {
		case 0:
			throw new Error("An industry location should always have at least one industry.");

		case 1:
			industry = validIndustriesAtLocation[0];
			break;

		default:
			let selectableIndustries = validIndustriesAtLocation.map(x => player.getNextIndustryLevelSlot(x));
			industry = (await player.prompt.clickAny(selectableIndustries, {
				"message": "Click the industry tile on your player board to build."
			})).industry;
			break;
	}

	loc.tile = player.takeNextIndustryTile(industry);

	await game.delay.beat();

	let producedResourceType: Resource = undefined;
	let producedAmount = loc.tile.data.productionCount ?? 0;

	switch (loc.tile.industry) {
		case Industry.Coal:
			producedResourceType = Resource.Coal;
			break;

		case Industry.Iron:
			producedResourceType = Resource.Iron;
			break;

		case Industry.Brewery:
			producedResourceType = Resource.Beer;
			producedAmount = game.era === Era.Canal ? 1 : 2;
			break;
	}

	for (let i = 0; i < producedAmount; ++i) {
		loc.tile.resources.push(new ResourceToken(producedResourceType));
	}

	await game.delay.beat();

	let discardedCard: Card;

	const matchingCards = player.getMatchingCards(loc, industry);

	debugLog(`All cards: ${[...player.hand].map(x => x.name).join(", ")}`);
	debugLog(`Matching cards: ${matchingCards.map(x => x.name).join(", ")}`);

	switch (matchingCards.length) {
		case 0:
			throw new Error("There should be at least one matching card after building.");

		case 1:
			discardedCard = matchingCards[0];
			break;

		default:
			if (matchingCards.every(x => x.equals(matchingCards[0]))) {
				discardedCard = matchingCards[0];
				break;
			}

			for (let card of matchingCards) {
				player.hand.setSelected(card, true);
			}

			discardedCard = await player.prompt.clickAny(matchingCards, {
				message: "Discard a matching card for that location"
			});

			player.hand.setSelected(false);
			break;
	}

	debugLog(`${player.name} discards ${discardedCard.name}`);

	player.discardPile.add(player.hand.remove(discardedCard));

	await game.delay.beat();
}

function getBuildableIndustriesAtLocation(location: IndustryLocation, player: Player): Industry[] {
	if (location.tile != null) {
		// TODO: overbuilding
		return [];
	}

	const availableIndustries = player.availableIndustries;
	const handCards = [...player.hand];

	const result: Industry[] = [];

	let locations = player.game.board.getIndustryLocations(location.city);

	if (player.game.era == Era.Canal) {
		for (let loc of locations) {
			if (loc.tile?.player == player) {
				return [];
			}
		}
	}

	for (let industry of location.data.industries) {
		if (!availableIndustries.includes(industry)) {
			continue;
		}

		if (player.getMatchingCards(location, industry).length === 0) {
			continue;
		}

		result.push(industry);
	}

	return result;
}
