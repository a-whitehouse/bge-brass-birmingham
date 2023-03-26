import * as bge from "bge-core";
import { LinearArrangement } from "bge-core";
import { PlayerIndex } from "../state.js";

import { City, Era, ILinkLocationData } from "../types.js";
import { GameBoard } from "./gameboard.js";
import { LinkTile } from "./linktile.js";
import { ResourceToken } from "./resourcetoken.js";

/**
 * A location that a link can be built on by a player.
 */
export class LinkLocation extends bge.Zone {
    private readonly _board: GameBoard;
    private _tile: LinkTile;

    /**
     * Original definition of this industry location.
     */
    readonly data: ILinkLocationData;

    /**
     * The cities connected to this link.
     */
    get cities(): readonly City[] {
        return this.data.cities;
    }

    @bge.display<LinkLocation, LinkTile>(function (ctx, value) { return {
        rotation: this._board.game.era === Era.Rail ? bge.Rotation.y(180) : undefined,
        position: value?.beingScored ? new bge.Vector3(0, 0, 2) : undefined
    }})
    get tile() { return this._tile; }

    /**
     * Set during scoring at the end of an era. The sum of link points in connected cities.
     */
    scoredLinkPoints?: number;

    @bge.display({
        arrangement: new LinearArrangement({
            axis: "z"
        })
    })
    readonly spentResources: ResourceToken[] = [];

    get victoryPoints() {
        return this.data.cities.reduce((s, x) => s + this._board.getLinkPoints(x), 0);
    }

    constructor(board: GameBoard, data: ILinkLocationData) {
        super(3, 1.6);

        this._board = board;

        this.data = data;
        this.hideIfEmpty = true;
        this.outlineStyle = bge.OutlineStyle.NONE;
    }

    clearSpentResources() {
        this.spentResources.splice(0, this.spentResources.length);
    }

    async setTile(tile?: LinkTile) {
        if (this._tile === tile) {
            return;
        }

        if (tile?.location != null) {
            throw new Error("Tile already has a location!");
        }
        
        const game = this._board.game;

        if (this._tile != null) {
            this._tile.player.removeBuiltLink(this._tile);
            this._tile.player.linkTiles.add(this._tile);
            this._tile.location = null;
            this._tile = null;

            await game.delay.beat();
        }

        this._tile = tile;

        if (tile != null) {
            tile.player.addBuiltLink(tile);
            tile.location = this;

            await game.delay.beat();
        }
    }

    serialize(): PlayerIndex | null {
        return this._tile?.player.index;
    }

    deserialize(state: PlayerIndex | null): void {
        this.clearSpentResources();
        
        if (this._tile?.player.index === state) {
            return;
        }

        this._tile = null;

        if (state == null) {
            return;
        }
        
        const game = this._board.game;

        this._tile = new LinkTile(this._board.game.players[state]);
        this._tile.location = this;
    }
}
