import * as bge from "bge-core";

import { Game } from "../game";
import { Player } from "../player";

export default async function main(game: Game) {
    await setup(game);
    await playerTurn(game, game.players[0]);
}

async function setup(game: Game) {
    // Deal cards etc
}

async function playerTurn(game: Game, player: Player) {
    game.board.industryLocations.forEach(x => x.display.visibleFor = [player]);
    await player.prompt.clickAny(game.board.industryLocations, {
        message: "Click on an industry location!"
    });
}
