import * as bge from "bge-core";

import { Game } from "../game.js";
import { IResourceSources } from "../objects/gameboard.js";
import { IndustryLocation } from "../objects/industrylocation.js";
import { ResourceToken } from "../objects/resourcetoken.js";
import { Player } from "../player.js";
import { Industry, Resource, Era, OVERBUILDABLE_INDUSTRIES, City } from "../types.js";
import { consumeResources } from "./index.js";

const console = bge.Logger.get("build-industry");

interface IBuildableAtLocationInfo {
	industries: Industry[];
	costs: (number | string)[];
	coalSources: IResourceSources;
	ironSources: IResourceSources;
}

export async function buildIndustry(game: Game, player: Player) {

	let coalAvailable = game.board.areAnyTokensAvailable(Resource.Coal);
	let ironAvailable = game.board.areAnyTokensAvailable(Resource.Iron);

	const buildableIndustries = new Map(game.board.industryLocations
		.map(x => {
			const coalSources = game.board.getResourceSources(Resource.Coal, x, player);
			const ironSources = game.board.getResourceSources(Resource.Iron, x, player);

			const buildableIndustries = getBuildableIndustriesAtLocation(x, player, coalSources, ironSources, coalAvailable, ironAvailable);

			return [x, { 
				industries: buildableIndustries.industries,
				costs: buildableIndustries.costs,
				coalSources: coalSources,
				ironSources: ironSources
			}] as [IndustryLocation, IBuildableAtLocationInfo];
		})
		.filter(([loc, info]) => info.costs.some(x => x != null)));

	let loc: IndustryLocation;

	try {
		for (let [buildableLoc, info] of buildableIndustries) {
			console.log(`${buildableLoc.name}, ${info.costs}`);
			buildableLoc.displayCosts(player, info.costs);
		}

		loc = await player.prompt.clickAny([...buildableIndustries].filter(([loc, info]) => info.industries.length > 0).map(([loc, info]) => loc), {
			message: "Click on a location!"
		});
	} finally {
		for (let [buildableLoc, info] of buildableIndustries) {
			buildableLoc.hideCosts();
		}
	}

	const messageRow = game.message.add("{0} is building an industry in {1}", player, City[loc.city]);

	console.info(`${player.name} clicked on ${loc.name}`);

	const locationInfo = buildableIndustries.get(loc);
	const validIndustriesAtLocation = locationInfo.industries;

	console.info(`Valid industries: ${validIndustriesAtLocation.map(x => Industry[x])}`);

	let selectableIndustries = validIndustriesAtLocation.map(x => player.getNextIndustryLevelSlot(x));
	let industry = (await player.prompt.clickAny(selectableIndustries, {
		message: "Click the industry tile on your player board to build.",
		autoResolveIfSingle: true
	})).industry;

	console.info(`We're building a ${Industry[industry]}!`);

	const slot = player.getNextIndustryLevelSlot(industry);

	messageRow.update("{0} is building a {1} in {2}", player, slot.top, City[loc.city]);

	await consumeResources(player, loc, Resource.Coal, slot.data.cost.coal, locationInfo.coalSources, game.board.coalMarket);
	await consumeResources(player, loc, Resource.Iron, slot.data.cost.iron, locationInfo.ironSources, game.board.ironMarket);

	player.spendMoney(slot.data.cost.coins);

	const validCards = player.getMatchingCards(loc, industry);

	await loc.setTile(player.takeNextIndustryTile(industry));

	loc.clearSpentResources();

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

	switch (producedResourceType) {
		case Resource.Iron:
			await game.ironMarket.sell(loc.tile);
			break;
		case Resource.Coal:
			let sources = game.board.getResourceSources(Resource.Coal, loc);
			if (sources.connectedToMarket) {
				await game.coalMarket.sell(loc.tile);
			}
			break;
		default:
			break;
	}

	await player.discardAnyCard({
		cards: validCards
	});
}

function getBuildableIndustriesAtLocation(location: IndustryLocation, player: Player,
	coalSources: IResourceSources, ironSources: IResourceSources, coalAvailable: boolean,
	ironAvailable: boolean): { industries: Industry[], costs: (number | string)[] } {

	const availableIndustries = player.availableIndustries;

	const result: Industry[] = [];
	const costs: (number | string)[] = [];

	// Industry locations in the same city as the one we want to build on
	let locations = player.game.board.getIndustryLocations(location.city);

	if (player.game.era == Era.Canal) {
		for (let loc of locations) {
			if (loc !== location && loc.tile?.player == player) {
				return { industries: [], costs: [] };
			}
		}
	}

	for (let industry of location.data.industries) {
		costs.push(null);

		if (location.tile != null && location.tile.industry != industry) {
			continue;
		}

		if (!availableIndustries.includes(industry)) {
			continue;
		}

		if (player.getMatchingCards(location, industry).length === 0) {
			continue;
		}

		// We can't build industry A on a location allowing industries A and B, if
		// there's a free spot in the same city allowing only industry A.
		//
		//   "If possible, place it on a space displaying only that industry's icon"
		//

		if (location.data.industries.length > 1
			&& locations.some(x => x !== location
				&& x.tile == null
				&& x.data.industries.length === 1
				&& x.data.industries[0] === industry)) {
			continue;
		}

		const slot = player.getNextIndustryLevelSlot(industry);

		const coalMarket = player.game.board.coalMarket;
		const ironMarket = player.game.board.ironMarket;

		let totalCost = slot.data.cost.coins;

		let costCoal = slot.data.cost.coal;
		let costIron = slot.data.cost.iron;

		let residualCoal = costCoal - coalSources.tiles.length;
		let residualIron = costIron - ironSources.tiles.length;

		totalCost += coalMarket.getCost(residualCoal);
		totalCost += ironMarket.getCost(residualIron);

		if (location.tile != null && location.tile.player != player) {
			if (!OVERBUILDABLE_INDUSTRIES.includes(location.tile.industry)) {
				continue;
			}

			switch (location.tile.industry) {
				case (Industry.Coal):
					if (coalAvailable) {
						continue;
					}
				case (Industry.Iron):
					if (ironAvailable) {
						continue;
					}
				default:
					throw Error("Only coal or iron industries of another player can be overbuilt.")
			}
		}
		
		if (costCoal > coalSources.tiles.length && !coalSources.connectedToMarket) {
			costs[costs.length - 1] = "X";
			continue;
		}
		
		costs[costs.length - 1] = totalCost;

		if (player.money < totalCost) {
			continue;
		}

		result.push(industry);
	}

	return { industries: result, costs: costs };
}
