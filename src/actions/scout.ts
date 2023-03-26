import * as bge from "bge-core";

import { Game } from "../game.js";
import { Card } from "../objects/card.js";
import { IndustryLocation } from "../objects/industrylocation.js";
import { ResourceToken } from "../objects/resourcetoken.js";
import { ScoreTokenKind } from "../objects/scoring.js";
import { Player } from "../player.js";
import { City, Industry, Resource } from "../types.js";

export async function scout(game: Game, player: Player) {
	if (player.hasWildCardInHand) {
		await Promise.reject("Can't scout while holding a wild card.");
	}

	if (player.hand.count < 3) {
		await Promise.reject("Must have at least 3 cards to scout.");
	}

	if (game.wildIndustryPile.count === 0 || game.wildLocationPile.count === 0) {
		throw new Error("All cards were scouted, but we should have rejected already.");
	}

	await player.prompt.click(new bge.Button("Scout"));

	game.message.add("{0} is scouting", player);

	await player.discardAnyCards(3);

	player.hand.add(game.wildIndustryPile.draw());
	player.hand.add(game.wildLocationPile.draw());

	await game.delay.beat();
}
