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

	loc.tile = player.linkTiles.draw();
	player.spendMoney(3);

	// TODO: make nicer version for rail era.

	await player.discardAnyCard();
}


function getBuildableLinks(game: Game, player: Player): LinkLocation[] {
	let buildableLinks: LinkLocation[];

	let builtIndustries = game.board.getBuiltIndustries(player);
	let builtLinks = game.board.getBuiltLinks(player);

	if (builtIndustries.length != 0 || builtLinks.length != 0) {
		buildableLinks = game.board.linkLocations.filter(x => x.tile == null && game.board.isInPlayerNetwork(x, player));
	}
	else {
		buildableLinks = game.board.linkLocations.filter(x => x.tile == null);
	}

	return buildableLinks;
}
