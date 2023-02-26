import * as bge from "bge-core";

import { Game } from "../game";
import { Card } from "../objects/card";
import { IndustryLocation } from "../objects/industrylocation";
import { ResourceToken } from "../objects/resourcetoken";
import { ScoreTokenKind } from "../objects/scoring";
import { Player } from "../player";
import { City, Industry, Resource } from "../types";

export async function buildIndustry(game: Game, player: Player) {
	const buildableIndustries = player.buildableIndustries;

	const loc = await player.prompt.clickAny(filterIndustries(game.board.industryLocations, buildableIndustries), {

		message: "Click on a location!"
	});

	let industry: Industry;

	switch (loc.data.industries.length) {
		case 0:
			throw new Error("An industry location should always have at least one industry.");

		case 1:
			industry = loc.data.industries[0];
			break;

		default:
			let selectableIndustries = loc.data.industries.map(x => player.getNextIndustryLevelSlot(x));
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


function filterIndustries(industryLocations: readonly IndustryLocation[], buildableIndustries: Industry[]) {

	industryLocations = industryLocations.filter(x => x.tile == null
		&& x.data.industries.some(x => buildableIndustries.includes(x))
	);

	return industryLocations;
}
