import * as bge from "bge-core";

import { Game } from "../game";

const console = bge.Logger.get("scoring");

export async function endOfEraScoring(game: Game) {
    await scoreLinks(game);
    await scoreIndustries(game);
}

/***
 * Score all built links, removing them from the board and returning them to each player.
 */
async function scoreLinks(game: Game) {
    for (let linkLoc of game.board.linkLocations) {
        linkLoc.scoredLinkPoints = linkLoc.data.cities.reduce((s, x) => s + game.board.getLinkPoints(x), 0);
    }

    while (true) {        
        const playersWithLinks = game.players
            .filter(x => x.builtLinks.length > 0);
        
        if (playersWithLinks.length === 0) {
            break;
        }
        
        // Keep scoring the last-place player

        const player = minBy(playersWithLinks, x => x.victoryPoints);

        // Score their most valuable link first

        const link = maxBy(player.builtLinks, x => x.location.scoredLinkPoints);

        link.player.increaseVictoryPoints(link.location.scoredLinkPoints);

        await link.location.setTile(null);
    }
}

/**
 * Score all built industries.
 */
async function scoreIndustries(game: Game) {

}

function minBy<T>(collection: Iterable<T>, getValue: { (item: T): number }): T | undefined {
    let bestValue = Number.MAX_VALUE;
    let bestItem: T = undefined;

    for (let item of collection) {
        const value = getValue(item);

        if (value < bestValue) {
            bestValue = value;
            bestItem = item;
        }
    }

    return bestItem;
}

function maxBy<T>(collection: Iterable<T>, getValue: { (item: T): number }): T | undefined {
    let bestValue = -Number.MAX_VALUE;
    let bestItem: T = undefined;

    for (let item of collection) {
        const value = getValue(item);

        if (value > bestValue) {
            bestValue = value;
            bestItem = item;
        }
    }

    return bestItem;
}