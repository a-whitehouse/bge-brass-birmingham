import * as bge from "bge-core";

import { City, Era, Resource } from "../types.js";
import { Game } from "../game.js";
import { LinkLocation } from "../objects/linklocation.js";
import { Player } from "../player.js";
import { consumeResources } from "./index.js";

export async function buildLink(game: Game, player: Player) {

	if (player.linkTiles.count === 0) {
		await Promise.reject("Must have link tiles remaining.")
	}

	let linkCost = game.era == Era.Canal ? 3 : 5;
	let coalCost = game.era == Era.Canal ? 0 : 1;

	await buildSingleLink(game, player, linkCost, coalCost, 0);

	if (game.era == Era.Rail) {
		if (!await game.anyExclusive(() => [
			buildSingleLink(game, player, 10, coalCost, 1),
			player.discardAnyCard()
		])) {
			return;
		}
	}
	
	return await player.discardAnyCard();
}

async function buildSingleLink(game: Game, player: Player, linkCost: number, coalCost: number, beerCost: number): Promise<true> {
	const coalMarket = player.game.board.coalMarket;
	let marketCoalPrice = coalMarket.getCost(1);

	let loc = await player.prompt.clickAny(getBuildableLinks(game, player, linkCost, coalCost, beerCost, marketCoalPrice), { message: "Click on a link!" });

	game.message.add("{0} is building a {1} between {2}", player, player.linkTiles.top, loc.cities.map(x => City[x]));

	player.spendMoney(linkCost);
	const coalSources = game.board.getResourceSources(Resource.Coal, loc);

	await consumeResources(player, loc, Resource.Coal, coalCost, coalSources, coalMarket);

	if (beerCost > 0) {
		const beerSources = game.board.getResourceSources(Resource.Beer, loc, player);
		await consumeResources(player, loc, Resource.Beer, beerCost, beerSources);
	}

	await loc.setTile(player.linkTiles.draw());

	loc.clearSpentResources();

	return true;
}


function getBuildableLinks(game: Game, player: Player, cost: number, coalCost: number, beerCost: number, marketCoalPrice: number): LinkLocation[] {

	return game.board.linkLocations
		.filter(x => x.tile == null)
		.filter(x => x.data.canal && game.era == Era.Canal || x.data.rail && game.era == Era.Rail)
		.filter(x => player.isInNetwork(x))
		.filter(x => {
			try {
				const coalSources = game.board.getResourceSources(Resource.Coal, x);

				if (beerCost > 0) {
					const beerSources = game.board.getResourceSources(Resource.Beer, x, player);

					if (beerSources.tiles.length < beerCost) {
						return false;
					}
				}

				if ((coalSources.tiles.length >= coalCost) && (cost <= player.money)) {
					// console.info(`We can link between ${x.cities.map(x => City[x]).join(", ")}`);
					return true;
				}
				else if (coalSources.connectedToMarket && (cost + marketCoalPrice) <= player.money) {
					return true;
				}
				else {
					// console.info(`We can't link between ${x.cities.map(x => City[x]).join(", ")}`);
					return false;
				}
			} catch (e) {
				console.error(e);
				return false;
			}
		});
}
