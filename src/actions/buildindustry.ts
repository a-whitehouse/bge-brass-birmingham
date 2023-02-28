import * as bge from "bge-core";

import { Game } from "../game";
import { Card } from "../objects/card";
import { IResourceSources } from "../objects/gameboard";
import { IndustryLocation } from "../objects/industrylocation";
import { ResourceToken } from "../objects/resourcetoken";
import { Player } from "../player";
import { Industry, Resource, Era, City } from "../types";

const console = bge.Logger.get("build-industry");

interface IBuildableAtLocationInfo {
	industries: Industry[];
	coalSources: IResourceSources;
	ironSources: IResourceSources;
}

export async function buildIndustry(game: Game, player: Player) {

	const buildableIndustries = new Map(game.board.industryLocations
		.map(x => {
			const coalSources = game.board.getResourceSources(x, Resource.Coal, player);
			const ironSources = game.board.getResourceSources(x, Resource.Iron, player);

			const buildableIndustries = getBuildableIndustriesAtLocation(x, player, coalSources, ironSources);

			return [x, { industries: buildableIndustries, coalSources: coalSources, ironSources: ironSources }];
		})
		.filter(entry => (entry[1] as IBuildableAtLocationInfo).industries.length > 0) as [IndustryLocation, IBuildableAtLocationInfo][]);

	const loc = await player.prompt.clickAny(buildableIndustries.keys(), {

		message: "Click on a location!"
	});

	console.info(`${player.name} clicked on ${loc.name}`);

	const locationInfo = buildableIndustries.get(loc);
	const validIndustriesAtLocation = locationInfo.industries;

	console.info(`Valid industries: ${validIndustriesAtLocation.map(x => Industry[x])}`);

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
			let value = game.ironMarket.sell(loc.tile.resources);
			player.money += value;
			break;
		case Resource.Coal:
			let sources = game.board.getResourceSources(loc, Resource.Coal);
			if (sources.connectedToMarket) {
				let value = game.coalMarket.sell(loc.tile.resources);
				player.money += value;
			}
			break;
		default:
			break;
	}

	await player.discardAnyCard(player.getMatchingCards(loc, industry));
}

function getBuildableIndustriesAtLocation(location: IndustryLocation, player: Player,
	coalSources: IResourceSources, ironSources: IResourceSources): Industry[] {

	if (location.tile != null) {
		// TODO: overbuilding
		return [];
	}

	const availableIndustries = player.availableIndustries;

	const result: Industry[] = [];

	let locations = player.game.board.getIndustryLocations(location.city);

	if (player.game.era == Era.Canal) {
		for (let loc of locations) {
			if (loc.tile?.player == player) {
				return [];
			}
		}
	}

	for (let industry of location.data.industries) {
		if (!availableIndustries.includes(industry)) {
			continue;
		}

		if (player.getMatchingCards(location, industry).length === 0) {
			continue;
		}

		const slot = player.getNextIndustryLevelSlot(industry);

		const coalMarket = player.game.board.coalMarket;
		const ironMarket = player.game.board.ironMarket;

		let totalCost = slot.data.cost.coins ?? 0;

		let costCoal = slot.data.cost.coal ?? 0;
		let costIron = slot.data.cost.iron ?? 0;

		let residualCoal = costCoal - coalSources.count;
		let residualIron = costIron - ironSources.count;

		totalCost += coalMarket.getCost(residualCoal);
		totalCost += ironMarket.getCost(residualIron);

		console.log(`${City[location.city]} ${Industry[industry]} ${totalCost}`);

		if (costCoal > coalSources.tiles.length && !coalSources.connectedToMarket) {
			continue;
		} else if (player.money < totalCost) {
			continue;
		}

		result.push(industry);
	}

	return result;
}
