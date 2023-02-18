import { display, Zone } from "bge-core";
import { CardGame } from "./game";

/**
 * This zone displays all the shared objects in the middle of the table.
 * This would be the place to `@display` a board, if your game has one.
 */
export class TableCenter extends Zone {
    private readonly _game: CardGame;

    /**
     * Display property for the shared draw pile.
     */
    @display({ label: "Draw Pile", localPosition: { x: -4, z: 5 }})
    get drawPile() {
        return this._game.drawPile;
    }
    
    /**
     * Display property for the shared discard pile.
     */
    @display({ label: "Discard Pile", localPosition: { x: 4, z: 5 }})
    get discardPile() {
        return this._game.discardPile;
    }
    
    /**
     * Display property for the shared card shop.
     */
    @display({ label: "Shop", localPosition: { z: -7 }})
    get shop() {
        return this._game.shop;
    }

    constructor(game: CardGame) {
        super();

        this._game = game;

        this.width = 24;
        this.height = 26;
    }
}