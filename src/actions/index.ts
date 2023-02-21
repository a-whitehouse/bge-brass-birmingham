import * as bge from "bge-core";

import { Game } from "../game";
import { Card } from "../objects/card";
import { Player } from "../player";
import { Industry } from "../types";

export default async function main(game: Game) {
    await setup(game);
    await playerTurn(game, game.players[0]);
}

async function setup(game: Game) {
    // Deal cards etc
    let deck = new bge.Deck(Card);
    deck.addRange(Card.generateDeck(game.players.length));
    deck.shuffle(game.random);
    deck.deal(game.players.map(x => x.hand), 8);
}

async function playerTurn(game: Game, player: Player) {
    const loc = await player.prompt.clickAny(game.board.industryLocations
        .filter(x => (x.data.industries & Industry.Coal) !== 0), {
            
        message: "Click on an industry location!"
    });
}
