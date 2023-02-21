import * as bge from "bge-core";

import { City, ILinkLocationData } from "../types";

/**
 * A location that a link can be built on by a player.
 */
export class LinkLocation extends bge.Zone {
    /**
     * The display options used by this location on the {@link GameBoard}.
     */
    display: bge.IDisplayOptions;

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

    constructor(data: ILinkLocationData) {
        super(2.25, 1);

        this.data = data;
        this.hideIfEmpty = true;
        this.outlineStyle = bge.OutlineStyle.None;
    }
}
