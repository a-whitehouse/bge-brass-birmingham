import * as bge from "bge-core";

import { Era } from "../types";
import { Game } from "../game";
import { LinkLocation } from "../objects/linklocation";
import { LinkTile } from "../objects/linktile";
import { Player } from "../player";

export async function buildLink(game: Game, player: Player) {

	if (player.linkTiles.count === 0) {
		await Promise.reject("Must have link tiles remaining.")
	}

	switch (game.era) {
		case Era.Canal:
			if (player.money < 3) {
				await Promise.reject("Must have 3 pounds.");
			}
			break;
		case Era.Rail:
			throw new Error("To be implemented.");
			break;
		default:
			break;
	}

	let loc = await player.prompt.clickAny(getBuildableLinks(game, player), { message: "Click on a link!" });

	player.spendMoney(3);

	await loc.setTile(player.linkTiles.draw());

	// TODO: make nicer version for rail era.

	await player.discardAnyCard();
}


function getBuildableLinks(game: Game, player: Player): LinkLocation[] {
	return game.board.linkLocations
		.filter(x => x.tile == null)
		.filter(x => x.data.canal && game.era == Era.Canal || x.data.rail && game.era == Era.Rail)
		.filter(x => player.isInNetwork(x));
}
