import * as bge from "bge-core";
import { Player } from "./player";
import main from "./actions";
import { GameBoard } from "./objects/gameboard";

/**
 * @summary This class contains the meat of your game.
 * @details In this example game, players take turns discarding cards, and then either drawing from a Deck or a Hand.
 */
export class Game extends bge.Game<Player> {

    @bge.display()
    readonly board = new GameBoard();

    /**
     * Game runners expect games to have a public parameterless constructor, like this.
     */
    constructor() {
        // We need to tell Game<TPlayer> how to construct a player here.
        super(Player);
    }

    protected async onRun(): Promise<bge.IGameResult> {

        this.addPlayerZones(x => x.createZone(), {
            avoid: this.board.footprint
        });

        // Entry point for gameplay logic
        await main(this);

        // Return final scores
        return {
            scores: this.players.map(x => x.victoryPoints)
        };
    }
}
