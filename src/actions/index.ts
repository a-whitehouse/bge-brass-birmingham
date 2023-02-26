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
    while (true) {
        for (let player of game.players) {
            await playerTurn(game, player);
        }
    }
}

async function playerTurn(game: Game, player: Player) {
    await game.anyExclusive(() => [
        takeLoan(game, player),
        buildIndustry(game, player)
    ]);
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
        // await game.delay.beat();
    }

    await game.delay.short();
}

