import * as bge from "bge-core";

import { City, ILinkLocationData } from "../types";
import { LinkTile } from "./linktile";

/**
 * A location that a link can be built on by a player.
 */
export class LinkLocation extends bge.Zone {
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

    constructor(data: ILinkLocationData) {
        super(3, 1.6);

        this.data = data;
        this.hideIfEmpty = true;
        this.outlineStyle = bge.OutlineStyle.NONE;
    }

    async setTile(tile: LinkTile) {
        if (this._tile != null) {
            throw new Error("Can't build over existing tiles!");
        }

        if (tile.location != null) {
            throw new Error("Tile already has a location!");
        }

        this._tile = tile;

        tile.player.builtLinks.add(tile);
        tile.location = this;

        await tile.player.game.delay.beat();
    }
}
