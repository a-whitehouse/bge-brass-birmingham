import * as bge from "bge-core";

import { IIndustryLocationData } from "../types";

/**
 * A location that an industry can be built on by a player.
 */
export class IndustryLocation extends bge.Zone {
    /**
     * The display options used by this location on the {@link GameBoard}.
     */
    display: bge.IDisplayOptions;

    /**
     * Original definition of this industry location.
     */
    readonly data: IIndustryLocationData;

    /**
     * The city containing this location.
     */
    get city() {
        return this.data.city;
    }

    constructor(data: IIndustryLocationData) {
        super(2.25, 2.25);

        this.data = data;
    }
}
