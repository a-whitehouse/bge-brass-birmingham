import * as bge from "bge-core";

import { Era, Resource, City } from "../types";
import { Game } from "../game";
import { LinkLocation } from "../objects/linklocation";
import { LinkTile } from "../objects/linktile";
import { Player } from "../player";
import { consumeResources } from "./buildindustry";

const console = bge.Logger.get("link");

export async function buildLink(game: Game, player: Player) {

	if (player.linkTiles.count === 0) {
		await Promise.reject("Must have link tiles remaining.")
	}

	let linkCost = game.era == Era.Canal ? 3 : 5;
	let coalCost = game.era == Era.Canal ? 0 : 1;

	await buildSingleLink(game, player, linkCost, coalCost, 0);


	if (game.era == Era.Rail) {
		let hasBuiltAgain = await game.anyExclusive(() => [
			buildSingleLink(game, player, 10, coalCost, 1),
			player.discardAnyCard({
				message: "Discard any card to finish building links",
				return: false
			})

		])

		if (hasBuiltAgain) {
			await player.discardAnyCard({
				message: "Discard any card to finish building links"
			})
		}

	} else {
		await player.discardAnyCard({
			message: "Discard any card to finish building links"
		})

	}
}

async function buildSingleLink(game: Game, player: Player, linkCost: number, coalCost: number, beerCost: number): Promise<true> {
	const coalMarket = player.game.board.coalMarket;
	let marketCoalPrice = coalMarket.getCost(1);

	let loc = await player.prompt.clickAny(getBuildableLinks(game, player, linkCost, coalCost, beerCost, marketCoalPrice), { message: "Click on a link!" });

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
