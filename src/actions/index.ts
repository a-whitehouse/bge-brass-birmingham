import * as bge from "bge-core";

import { Game } from "../game";
import { Card } from "../objects/card";
import { ResourceToken } from "../objects/resourcetoken";
import { ScoreTokenKind } from "../objects/scoring";
import { Player } from "../player";
import { Industry, Resource } from "../types";

export default async function main(game: Game) {
    await setup(game);
    await playerTurn(game, game.players[0]);
}

async function setup(game: Game) {
    for (let player of game.players) {
        player.victoryPointToken = game.scoreTrack.createScoreToken(player, ScoreTokenKind.VICTORY_POINTS);
        player.incomeToken = game.scoreTrack.createScoreToken(player, ScoreTokenKind.INCOME);
    }

    // Deal cards etc
    game.drawPile.addRange(Card.generateDeck(game.players.length));
    game.drawPile.shuffle(game.random);

    await game.delay.short();

    game.drawPile.deal(game.players.map(x => x.discardPile));

    for (let i = 0; i < 8; ++i) {
        game.drawPile.deal(game.players.map(x => x.hand));
        await game.delay.beat();
    }
    
    await game.delay.short();
}

async function playerTurn(game: Game, player: Player) {
    while (player.getNextIndustryLevelSlot(Industry.Coal) != null) {
        const industry = Industry.Coal;
    
        const loc = await player.prompt.clickAny(game.board.industryLocations
            .filter(x => x.tile == null && (x.data.industries & industry) !== 0), {
                
            message: "Click on a location!"
        });
    
        loc.tile = player.takeNextIndustryTile(industry);

        await game.delay.beat();

        for (let i = 0; i < loc.tile.data.productionCount ?? 0; ++i) {
            loc.tile.resources.push(new ResourceToken(Resource.Coal));
        }

        await game.delay.beat();
    }
}
