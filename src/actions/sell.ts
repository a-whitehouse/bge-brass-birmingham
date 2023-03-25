import * as bge from "bge-core";

import { Game } from "../game.js";
import { IndustryTile } from "../objects/industrytile.js";
import { MerchantLocation } from "../objects/merchantlocation.js";
import { ResourceToken } from "../objects/resourcetoken.js";
import { Player } from "../player.js";
import { SELLABLE_INDUSTRIES, City, Industry, Resource } from "../types.js";

export async function sell(game: Game, player: Player) {
    let sellOptions = getSellOptions(game, player);

    if (sellOptions.length == 0) {
        await Promise.reject("Must have at least one sellable tile.");
    }

    await player.prompt.click(new bge.Button("Sell"));

    const messageRow = game.message.add("{0} is selling", player);

    await sellOnce(game, player, sellOptions, true, messageRow);

    while (true) {
        sellOptions = getSellOptions(game, player);

        const soldAgain = await game.anyExclusive(() => [
            sellOnce(game, player, sellOptions, false, messageRow),
            player.discardAnyCard({
                return: false
            })
        ]);

        if (!soldAgain) {
            break;
        }
    }
}

async function sellOnce(game: Game, player: Player, sellOptions: ISellOption[], firstSale: boolean, messageRow: bge.MessageRow): Promise<true> {
    const tile = await player.prompt.clickAny(sellOptions.map(x => x.tile), {
        message: "Click on a tile to sell.",
        autoResolveIfSingle: firstSale
    });
    const optionsForTile = sellOptions.filter(x => x.tile === tile);

    messageRow.update("{0} is selling their {1}", player, tile);

    const merchantLocation = await player.prompt.clickAny(optionsForTile.map(x => x.merchant), {
        message: "Click on a merchant to sell to.",
        autoResolveIfSingle: true
    });
    
    messageRow.update("{0} is selling their {1} to {2}", player, tile, City[merchantLocation.data.city]);

    console.info(`${player.name} click on ${Industry[tile.industry]}, ${City[merchantLocation.data.city]}`);

    let beerRemaining = tile.data.saleBeerCost!;

    while (beerRemaining > 0) {
        const beerSources = new Set<ResourceToken | IndustryTile>(
            game.board.getResourceSources(Resource.Beer, tile.location, player).tiles.map(x => x.tile));

        if (merchantLocation.marketBeer != null) {
            beerSources.add(merchantLocation.marketBeer);
        }

        console.info(`Beer sources: ${[...beerSources].map(x => x instanceof ResourceToken ? "Market Beer" : x.location.name).join(", ")}`);

        const beerSource = await player.prompt.clickAny(beerSources, {
            message: `Select a beer token to sell with`,
            autoResolveIfSingle: true
        });

        --beerRemaining;

        if (beerSource === merchantLocation.marketBeer) {
            console.info(`Using merchant beer`);

            await merchantLocation.consumeBeer(tile);
            continue;
        }

        // Otherwise, clicked on a brewery

        const brewery = beerSource as IndustryTile;

        await brewery.consumeResource();
    }

    tile.clearResources();
    await tile.flip();

    return true;
}

interface ISellOption {
    tile: IndustryTile;
    merchant: MerchantLocation;
}

function getSellOptions(game: Game, player: Player): ISellOption[] {
    const sellableTiles = player.builtIndustries.filter(x => !x.hasFlipped && SELLABLE_INDUSTRIES.includes(x.industry));

    const sellOptions = sellableTiles.flatMap(x => {
        const beerSources = game.board.getResourceSources(Resource.Beer, x.location, player);

        let connectedMarkets = game.board.merchantLocations.filter(
            y => {
                if (y.tile == null) {
                    return false;
                }

                if (!y.tile.industries.includes(x.industry)) {
                    return false;
                }

                if (!game.board.isLinked(x.location, y.data.city)) {
                    return false;
                }

                const beerCost = x.data.saleBeerCost;

                if (beerCost == null) {
                    throw new Error("Missing sale cost!");
                }

                const availableBeer = beerSources.tiles.length + (y.marketBeer != null ? 1 : 0);

                return availableBeer >= beerCost;
            });

        return connectedMarkets.map(y => ({ tile: x, merchant: y }));
    }) as ISellOption[];

    for (let option of sellOptions) {
        console.info(`${Industry[option.tile.industry]} can be sold to ${City[option.merchant.data.city]}`);
    }

    return sellOptions;
}