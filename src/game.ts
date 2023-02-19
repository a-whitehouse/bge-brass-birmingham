import * as bge from "bge-core";

import { Player } from "./player";
import { GameBoard } from "./objects/gameboard";
import { ResourceMarket } from "./objects/resourcemarket";
import { Resource } from "./types";

import main from "./actions";

/**
 * @summary This class contains the meat of your game.
 * @details In this example game, players take turns discarding cards, and then either drawing from a Deck or a Hand.
 */
export class Game extends bge.Game<Player> {

    @bge.display()
    readonly board = new GameBoard();

    readonly coalMarket: ResourceMarket;
    readonly ironMarket: ResourceMarket;

    /**
     * Game runners expect games to have a public parameterless constructor, like this.
     */
    constructor() {
        // We need to tell Game<TPlayer> how to construct a player here.
        super(Player);

        this.coalMarket = new ResourceMarket(this.board, Resource.Coal);
        this.ironMarket = new ResourceMarket(this.board, Resource.Iron);
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
