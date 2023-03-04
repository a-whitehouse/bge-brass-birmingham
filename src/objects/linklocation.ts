import * as bge from "bge-core";
import { LinearArrangement } from "bge-core";

import { City, Era, ILinkLocationData } from "../types";
import { GameBoard } from "./gameboard";
import { LinkTile } from "./linktile";
import { ResourceToken } from "./resourcetoken";

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

    @bge.display()
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

    async setTile(tile?: LinkTile) {
        if (this._tile === tile) {
            return;
        }

        if (tile?.location != null) {
            throw new Error("Tile already has a location!");
        }

        if (this._tile != null) {
            const game = this._tile.player.game;

            this._tile.player.removeBuiltLink(this._tile);
            this._tile.player.linkTiles.add(this._tile);
            this._tile.location = null;
            this._tile = null;

            await game.delay.long();
        }

        this._tile = tile;

        if (tile != null) {
            tile.player.addBuiltLink(tile);
            tile.location = this;

            this.children.getOptions("tile").rotation = tile.player.game.era === Era.Rail
                ? bge.Rotation.y(180)
                : undefined;

            await tile.player.game.delay.beat();
        }
    }
}
