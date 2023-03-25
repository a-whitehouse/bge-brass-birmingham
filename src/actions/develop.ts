import * as bge from "bge-core";
import { Game } from "../game.js";

import { ALL_INDUSTRIES, Resource } from "../types.js";
import { Player } from "../player.js";

const console = bge.Logger.get("develop");


export async function develop(game: Game, player: Player) {
    const ironSources = game.board.getResourceSources(Resource.Iron);

    if (ironSources.tiles.length === 0 && game.ironMarket.getCost(1) > player.money) {
        await Promise.reject("Can't affort to develop");
    }

    await player.prompt.click(new bge.Button("Develop"));

    const messageRow = game.message.add("{0} is developing", player);

    await developOnce(game, player, messageRow);
    console.log(`${player.name} developed once`);

    let hasDevelopedAgain = await game.anyExclusive(() => [
        developOnce(game, player, messageRow),
        player.discardAnyCard()
    ]);

    if (hasDevelopedAgain) {
        await player.discardAnyCard();
    }
}

export async function developOnce(game: Game, player: Player, messageRow?: bge.MessageRow): Promise<boolean> {
    let ironSources = game.board.getResourceSources(Resource.Iron);

    let marketCost = game.board.ironMarket.getCost(1);

    if (ironSources.tiles.length === 0 && marketCost > player.money) {
        await Promise.reject("Must have access to iron or enough money to buy from market.")
    }

    const developableIndustries = ALL_INDUSTRIES.map(x => {
        let slot = player.getNextIndustryLevelSlot(x);
        if (slot != null && (slot.data.canDevelop ?? true)) {
            return slot;
        } else {
            return null;
        }
    }).filter(x => x != null);

    let slot = await player.prompt.clickAny(developableIndustries, {
        message: "Click the industry tile on your player board to develop",
        autoResolveIfSingle: true
    });

    messageRow?.update("{0} is developing {1}", player, slot.top);

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
