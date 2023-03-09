import * as bge from "bge-core";

import { Player } from "./player";
import { GameBoard } from "./objects/gameboard";
import { ResourceMarket } from "./objects/resourcemarket";
import { Resource, Era } from "./types";

import { grantIncome, playerAction, PlayerActionResult, reorderPlayers, resetSpentMoney, startRailEra } from "./actions";
import { Card } from "./objects/card";
import { ScoreTrack } from "./objects/scoring";
import { IGameState } from "./state";
import { setup } from "./actions/setup";
import { endOfEraScoring } from "./actions/scoring";

/**
 * @summary This class contains the meat of your game.
 * @details In this example game, players take turns discarding cards, and then either drawing from a Deck or a Hand.
 */
export class Game extends bge.StateMachineGame<Player> {

    era: Era = Era.Canal;
    
    firstRound = true;
    turnOrder?: Player[];
    turn = 0;
    action = 0;

    @bge.display()
    readonly board = new GameBoard(this);

    @bge.display()
    readonly playerZones: bge.Zone[] = [];

    readonly drawPile = new bge.Deck(Card, { orientation: bge.CardOrientation.FACE_DOWN });
    readonly wildLocationPile = new bge.Deck(Card, { orientation: bge.CardOrientation.FACE_UP });
    readonly wildIndustryPile = new bge.Deck(Card, { orientation: bge.CardOrientation.FACE_UP });

    readonly coalMarket: ResourceMarket;
    readonly ironMarket: ResourceMarket;

    readonly scoreTrack: ScoreTrack;

    turnStartState?: IGameState;
    actionStartState?: IGameState;

    get currentPlayer(): Player {
        return this.turnOrder[this.turn];
    }

    get actionsPerTurn(): number {
        return this.firstRound ? 1 : 2;
    }

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

    protected override onInitialize(): void {
        this.playerZones.push(...this.players.map(x => x.zone));

        const playerZonesOptions = this.children.getOptions("playerZones");

        if (this.players.length === 2) {
            playerZonesOptions.position = { y: -46 };
            playerZonesOptions.arrangement = new bge.LinearArrangement({
                axis: "x"
            });
        } else {
            playerZonesOptions.arrangement = new bge.RectangularArrangement({
                size: new bge.Vector3(60, 60)
            });
        }
    }

    override get initialState(): bge.GameStateFunction {
        return this.setup;
    }

    async setup(): bge.GameState {
        await setup(this);
        
        this.firstRound = true;
        this.turnOrder = [...this.players];

        this.random.shuffle(this.turnOrder);

        return this.roundStart;
    }

    async roundStart(): bge.GameState {
        this.turn = 0;
        
        await grantIncome(this.turnOrder);

        return this.playerTurnStart;
    }

    async playerTurnStart(): bge.GameState {
        this.action = 0;
        
        this.turnStartState = this.serialize();

        return this.playerAction;
    }

    async playerAction(): bge.GameState {
        this.actionStartState = this.serialize();

        const result = await playerAction(this, this.currentPlayer);

        switch (result) {
            case PlayerActionResult.RESOLVED:
                break;

            case PlayerActionResult.RESTART_ACTION:
                this.deserialize(this.actionStartState);
                return this.playerAction;

            case PlayerActionResult.RESTART_TURN:
                this.deserialize(this.turnStartState);
                return this.playerAction;
        }

        this.action++;

        return this.action < this.actionsPerTurn
            ? this.playerAction
            : this.playerTurnEnd;
    }

    async playerTurnEnd(): bge.GameState {
        this.drawPile.dealTotal([this.currentPlayer.hand], 2, 8);

        this.turn++;

        return this.turn < this.players.length
            ? this.playerTurnStart
            : this.roundEnd;
    }

    async roundEnd(): bge.GameState {
        this.firstRound = false;
        
        await reorderPlayers(this);
        await resetSpentMoney(this);

        if (this.players.every(x => x.hand.count > 0)) {
            return this.roundStart;
        }

        return this.eraEnd;
    }

    async eraEnd(): bge.GameState {
        await endOfEraScoring(this);

        return this.era === Era.Canal
            ? this.railEraStart
            : this.endGame;
    }

    async railEraStart(): bge.GameState {
        await startRailEra(this);
        return this.roundStart;
    }

    async endGame(): bge.GameState {
        return {
            scores: this.players.map(x => x.victoryPoints)
        };
    }

    serialize(): IGameState {
        return {
            era: this.era,
            turnOrder: this.turnOrder?.map(x => x.index),
            turn: this.turn,
            action: this.action,

            board: this.board.serialize(),
            players: this.players.map(x => x.serialize())
        } as any;
    }

    deserialize(state: IGameState): void {
        this.era = state.era;
        this.turnOrder = state.turnOrder?.map(x => this.players[x]);
        this.turn = state.turn;
        this.action = state.action;

        this.board.deserialize(state.board);
        this.players.forEach((x, i) => {
            x.deserialize(state.players[i]);
            x.updateBuiltTiles();
        });
    }
}
