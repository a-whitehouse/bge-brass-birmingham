import * as bge from "bge-core";

import { Card } from "../objects/card";
import { IndustryLocation } from "../objects/industrylocation";
import { ResourceToken } from "../objects/resourcetoken";
import { ScoreTokenKind } from "../objects/scoring";
import { IndustryCard, CityCard } from "../objects/card";
import { LinkTile } from "../objects/linktile";

import { Game } from "../game";
import { Player } from "../player";
import { City, Industry, Resource, ALL_INDUSTRIES } from "../types";

import { takeLoan } from "./takeloan";
import { scout } from "./scout";
import { buildLink } from "./buildlink";
import { buildIndustry } from "./buildindustry";

export default async function main(game: Game) {
    await setup(game);

    let firstTurn = true;
    let numActions;

    while (true) {

        numActions = firstTurn ? 1 : 2;

        for (let player of game.players) {
            await playerTurn(game, player, numActions);
            game.drawPile.deal([player.hand], numActions);
        }

        firstTurn = false;
    }
}

async function playerTurn(game: Game, player: Player, actionCount: number) {
    game.message.clear();

    for (let i = 0; i < actionCount; ++i) {
        game.message.set(player, "It's your turn, action {0} of {1}", i + 1, actionCount);

        await game.anyExclusive(() => [
            buildIndustry(game, player),
            buildLink(game, player),
            takeLoan(game, player),
            scout(game, player)
        ]);
    }
}

async function setup(game: Game) {
    for (let player of game.players) {
        player.victoryPointToken = game.scoreTrack.createScoreToken(player, ScoreTokenKind.VICTORY_POINTS);
        player.incomeToken = game.scoreTrack.createScoreToken(player, ScoreTokenKind.INCOME);

        for (let i = 0; i < 15; ++i) {
            player.linkTiles.add(new LinkTile(player));
        }
    }

    // Deal cards etc
    game.drawPile.addRange(Card.generateDeck(game.players.length));
    game.drawPile.shuffle(game.random);

    for (let i = 0; i < game.players.length; ++i) {
        game.wildIndustryPile.add(new IndustryCard(ALL_INDUSTRIES, 2));
        game.wildLocationPile.add(new CityCard(City.Any, 1));
    }

    game.drawPile.deal(game.players.map(x => x.discardPile));

    for (let i = 0; i < 8; ++i) {
        game.drawPile.deal(game.players.map(x => x.hand));
        // await game.delay.beat();
    }

    await game.delay.beat();
}

