import * as bge from "bge-core";

import { Game } from "../game";
import { Card } from "../objects/card";
import { IndustryLocation } from "../objects/industrylocation";
import { ResourceToken } from "../objects/resourcetoken";
import { ScoreTokenKind } from "../objects/scoring";
import { Player } from "../player";
import { City, Industry, Resource } from "../types";

import { takeLoan } from "./takeloan";
import { buildIndustry } from "./buildindustry";

export default async function main(game: Game) {
    await setup(game);

    let firstTurn = true;

    while (true) {
        for (let player of game.players) {
            await playerTurn(game, player, firstTurn ? 1 : 2);
        }

        firstTurn = false;
    }
}

async function playerTurn(game: Game, player: Player, actionCount: number) {
    game.message.clear();

    for (let i = 0; i < actionCount; ++i) {
        game.message.set(player, "It's your turn, action {0} of {1}", i + 1, actionCount);

        await game.anyExclusive(() => [
            takeLoan(game, player),
            buildIndustry(game, player)
        ]);
    }
}

async function setup(game: Game) {
    for (let player of game.players) {
        player.victoryPointToken = game.scoreTrack.createScoreToken(player, ScoreTokenKind.VICTORY_POINTS);
        player.incomeToken = game.scoreTrack.createScoreToken(player, ScoreTokenKind.INCOME);
    }

    // Deal cards etc
    game.drawPile.addRange(Card.generateDeck(game.players.length));
    game.drawPile.shuffle(game.random);

    game.drawPile.deal(game.players.map(x => x.discardPile));

    for (let i = 0; i < 8; ++i) {
        game.drawPile.deal(game.players.map(x => x.hand));
        // await game.delay.beat();
    }

    await game.delay.beat();
}

