import * as bge from "bge-core";

import { Game } from "../game";
import { Player } from "../player";

export async function buildLink(game: Game, player: Player) {

	let loc = await player.prompt.clickAny(game.board.linkLocations.filter(x => x.tile == null), { message: "Click on a link!" });

	const card = await player.prompt.clickAny(player.hand, {
		message: "Discard any card"
	});

	loc.tile = player.linkTiles.draw();

	player.discardPile.add(player.hand.remove(card));

	await game.delay.beat();

}
