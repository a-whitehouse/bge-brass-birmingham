import * as bge from "bge-core";

import { Game } from "../game";
import { Card } from "../objects/card";
import { IndustryLocation } from "../objects/industrylocation";
import { ResourceToken } from "../objects/resourcetoken";
import { ScoreTokenKind } from "../objects/scoring";
import { IndustryCard } from "../objects/card";
import { Player } from "../player";
import { City, Industry, Resource } from "../types";

export async function buildIndustry(game: Game, player: Player) {
	const buildableIndustries = new Map(game.board.industryLocations
		.map(x => [x, getBuildableIndustriesAtLocation(x, player)])
		.filter(entry => (entry[1] as Industry[]).length > 0) as [IndustryLocation, Industry[]][]);

	const loc = await player.prompt.clickAny(buildableIndustries.keys(), {

		message: "Click on a location!"
	});

	const validIndustriesAtLocation = buildableIndustries.get(loc);

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

	for (let i = 0; i < loc.tile.data.productionCount ?? 0; ++i) {
		loc.tile.resources.push(new ResourceToken(Resource.Coal));
	}

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

	for (let industry of location.data.industries) {
		if (!availableIndustries.includes(industry)) {
			continue;
		}

		if (!player.hasIndustryCard(industry) && !player.hasLocationCard(location.data.city)) {
			continue;
		}

		result.push(industry);
	}

	return result;
}
