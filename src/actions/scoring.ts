import * as bge from "bge-core";

import { Game } from "../game";
import { City, Industry } from "../types";

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

        const player = bge.Helpers.minBy(playersWithLinks, x => x.victoryPoints);

        // Score their most valuable link first

        const link = bge.Helpers.maxBy(player.builtLinks, x => x.location.scoredLinkPoints);
        const linkPoints = link.location.scoredLinkPoints;

        await link.location.setTile(null);

        if (linkPoints > 0) {
            link.player.increaseVictoryPoints(linkPoints);
            await game.delay.beat();
        }
    }
}

/**
 * Score all built industries.
 */
async function scoreIndustries(game: Game) {

    let unscoredTiles = [...game.board.industryLocations.filter(x => x.tile != null).map(x => x.tile)];

    for (let tile of unscoredTiles) {
        if (tile.hasFlipped) {
            let victoryPoints = tile.data.saleReward.victoryPoints;

            console.log(`${tile.player.name} scored ${victoryPoints} points from ${Industry[tile.industry]} in ${City[tile.location.city]}`)
            tile.player.increaseVictoryPoints(victoryPoints);
        }
    }
}
