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

        if (linkPoints > 0) {
            game.message.set("{0} scores {1} points for their {2} between {3}!", player, linkPoints, link, link.location.cities.map(x => City[x]));
            link.beingScored = true;
            await game.delay.beat();
            
            link.player.increaseVictoryPoints(linkPoints);
            await game.delay.short();
            
            link.beingScored = false;
        }

        await link.location.setTile(null);
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
            
            game.message.set("{0} scores {1} points for their {2} in {3}!", tile.player, victoryPoints, tile, City[tile.location.city]);

            tile.beingScored = true;
            await game.delay.beat();
            
            tile.player.increaseVictoryPoints(victoryPoints);
            await game.delay.short();
            
            tile.beingScored = false;
        }
    }
}
