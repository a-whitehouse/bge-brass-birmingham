import * as bge from "bge-core";

import { Game } from "../game";
import { Card } from "../objects/card";
import { IResourceSources } from "../objects/gameboard";
import { IndustryLocation } from "../objects/industrylocation";
import { IndustryTile } from "../objects/industrytile";
import { ResourceMarket } from "../objects/resourcemarket";
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
			const coalSources = game.board.getResourceSources(Resource.Coal, x, player);
			const ironSources = game.board.getResourceSources(Resource.Iron, x, player);

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

	let selectableIndustries = validIndustriesAtLocation.map(x => player.getNextIndustryLevelSlot(x));
	let industry = (await player.prompt.clickAny(selectableIndustries, {
		message: "Click the industry tile on your player board to build.",
		autoResolveIfSingle: true
	})).industry;

	await player.discardAnyCard({
		cards: player.getMatchingCards(loc, industry)
	});

	console.info(`We're building a ${Industry[industry]}!`);

	const slot = player.getNextIndustryLevelSlot(industry);

	await consumeResources(player, loc, slot.data.cost.coal, locationInfo.coalSources, game.board.coalMarket);
	await consumeResources(player, loc, slot.data.cost.iron, locationInfo.ironSources, game.board.ironMarket);

	player.spendMoney(slot.data.cost.coins);

	await loc.setTile(player.takeNextIndustryTile(industry));

	loc.spentResources.splice(0, loc.spentResources.length);

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

		if (costCoal > coalSources.tiles.length && !coalSources.connectedToMarket) {
			continue;
		} else if (player.money < totalCost) {
			continue;
		}

		result.push(industry);
	}

	return result;
}

async function consumeResources(player: Player, destination: IndustryLocation,
	amount: number, sources: IResourceSources, market: ResourceMarket) {

	while (sources.tiles.length > 0 && amount > 0) {
		const distance = sources.tiles[0].distance;
		const choices = new Set(sources.tiles.filter(x => x.distance === distance).map(x => x.tile));

		let tile = await player.prompt.clickAny(choices, {
			message: `Select ${(market.resource === Resource.Iron ? "an" : "a")} ${Resource[market.resource]} to consume`,
			autoResolveIfSingle: true
		});

		sources.tiles.splice(sources.tiles.findIndex(x => x.tile === tile), 1);

		await tile.consumeResource(destination.spentResources);

		--amount;

		await player.game.delay.beat();
	}

	if (amount > 0) {
		destination.spentResources.push(...market.takeRange(amount));
		player.spendMoney(market.getCost(amount));

		await player.game.delay.beat();
	}
}