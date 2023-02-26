import * as bge from "bge-core";

import { Game } from "../game";
import { Card } from "../objects/card";
import { IndustryLocation } from "../objects/industrylocation";
import { ResourceToken } from "../objects/resourcetoken";
import { ScoreTokenKind } from "../objects/scoring";
import { Player } from "../player";
import { City, Industry, Resource } from "../types";

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

	await player.prompt.click(new bge.Button("Scout"), {});

	while (true) {
		const clicked = await game.anyExclusive(() => [
			player.prompt.clickAny([...player.hand].filter(x => player.hand.selected.length < 3 || player.hand.getSelected(x)), {
				message: "Discard any three cards"
			}),
			player.prompt.click(new bge.Button("Discard"), {
				return: null,
				if: player.hand.selected.length === 3
			})
		]);

		if (clicked instanceof Card) {
			player.hand.toggleSelected(clicked);
			continue;
		}

		break;
	}


	const selected = player.hand.selected;

	player.hand.removeAll(selected);
	player.discardPile.addRange(selected);

	await game.delay.beat();

	player.hand.add(game.wildIndustryPile.draw());
	player.hand.add(game.wildLocationPile.draw());

	await game.delay.beat();
}
