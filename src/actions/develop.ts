import * as bge from "bge-core";
import { Game } from "../game";

import { ALL_INDUSTRIES, Resource } from "../types";
import { Player } from "../player";

const console = bge.Logger.get("develop");


export async function develop(game: Game, player: Player) {
    await player.prompt.click(new bge.Button("Develop"));

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

export async function developOnce(game: Game, player: Player): Promise<true> {
    let ironSources = game.board.getResourceSources(Resource.Iron);

    let marketCost = game.board.ironMarket.getCost(1);

    if (ironSources.tiles.length === 0 && marketCost > player.money) {
        await Promise.reject("Must have access to iron or enough money to buy from market.")
    }

    const developableIndustries = ALL_INDUSTRIES.map(x => {
        let slot = player.getNextIndustryLevelSlot(x);
        if (slot.data.canDevelop ?? true) {
            return slot;
        } else {
            return null;
        }
    }).filter(x => x != null);

    let slot = await player.prompt.clickAny(developableIndustries, {
        message: "Click the industry tile on your player board to develop",
        autoResolveIfSingle: true
    });

    let ironTiles = new Set(ironSources.tiles.map(x => x.tile));

    if (ironTiles.size > 0) {
        let source = await player.prompt.clickAny(ironTiles, {
            message: `Select an iron to consume`,
            autoResolveIfSingle: true
        })
        await source.consumeResource(slot.top.resources);
    } else {
        slot.top.resources.push(game.board.ironMarket.take());
        player.spendMoney(marketCost);
        await game.delay.beat();
    }

    slot.top.clearResources();
    player.developedIndustries.add(player.takeNextIndustryTile(slot.industry));

    await game.delay.beat();

    return true;
}
