import * as bge from "bge-core";
import { Game } from "../game";

import { ALL_INDUSTRIES, Resource } from "../types";
import { Player } from "../player";

const console = bge.Logger.get("develop");


export async function develop(game: Game, player: Player) {
    await player.prompt.click(new bge.Button("Develop"), {});

    await developOnce(game, player);
    console.log(`${player.name} developed once`);

    let hasDevelopedAgain = await game.anyExclusive(() => [
        developOnce(game, player),
        player.discardAnyCard({
            message: "Discard any card to finish developing",
            return: false
        })
    ]);

    if (hasDevelopedAgain) {
        await player.discardAnyCard({
            message: "Discard any card to finish developing"
        })
    }
}

async function developOnce(game: Game, player: Player): Promise<true> {
    let ironSources = game.board.getResourceSources(Resource.Iron);

    let marketCost = game.board.ironMarket.getCost(1);

    if (ironSources.tiles.length === 0 && marketCost > player.money) {
        await Promise.reject("Must have access to iron or enough money to buy from market.")
    }

    console.log(`${player.name} can develop`);

    let tile = await player.prompt.clickAny(
        ALL_INDUSTRIES.map(
            x => {
                let slot = player.getNextIndustryLevelSlot(x);
                if (slot.data.canDevelop ?? true) {
                    return slot;
                }
            }),
        { "message": "Click the industry tile on your player board to develop" }
    );

    player.takeNextIndustryTile(tile.industry);

    let ironTiles = new Set(ironSources.tiles.map(x => x.tile));

    if (ironTiles.size > 1) {
        let source = await player.prompt.clickAny(ironTiles, {
            message: `Select an iron to consume`
        })
        source.resources.pop();
    } else if (ironTiles.size == 1) {
        await ironSources.tiles[0].tile.consumeResource();
    } else {
        game.board.ironMarket.take();
        player.spendMoney(marketCost);
    }

    return true;
}