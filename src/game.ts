import * as bge from "bge-core";

import { Player } from "./player";
import { GameBoard } from "./objects/gameboard";
import { ResourceMarket } from "./objects/resourcemarket";
import { Resource, Era } from "./types";

import main from "./actions";
import { Card } from "./objects/card";
import { ScoreTrack } from "./objects/scoring";

/**
 * @summary This class contains the meat of your game.
 * @details In this example game, players take turns discarding cards, and then either drawing from a Deck or a Hand.
 */
export class Game extends bge.Game<Player> {

    era: Era = Era.Canal;

    @bge.display()
    readonly board = new GameBoard(this);

    @bge.display({
        arrangement: new bge.RectangularArrangement({
            size: new bge.Vector3(60, 60)
        })
    })
    readonly playerZones: bge.Zone[] = [];

    readonly drawPile = new bge.Deck(Card, { orientation: bge.CardOrientation.FACE_DOWN });
    readonly wildLocationPile = new bge.Deck(Card, { orientation: bge.CardOrientation.FACE_UP });
    readonly wildIndustryPile = new bge.Deck(Card, { orientation: bge.CardOrientation.FACE_UP });

    readonly coalMarket: ResourceMarket;
    readonly ironMarket: ResourceMarket;

    readonly scoreTrack: ScoreTrack;

    /**
     * Game runners expect games to have a public parameterless constructor, like this.
     */
    constructor() {
        // We need to tell Game<TPlayer> how to construct a player here.
        super(Player);

        this.coalMarket = new ResourceMarket(this.board, Resource.Coal);
        this.ironMarket = new ResourceMarket(this.board, Resource.Iron);

        this.scoreTrack = new ScoreTrack();
    }

    protected async onRun(): Promise<bge.IGameResult> {

        this.playerZones.push(...this.players.map(x => x.createZone()));

        // Entry point for gameplay logic
        await main(this);

        // Return final scores
        return {
            scores: this.players.map(x => x.victoryPoints)
        };
    }
}
