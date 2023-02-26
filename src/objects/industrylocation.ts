import * as bge from "bge-core";

import { IIndustryLocationData } from "../types";
import { IndustryTile } from "./industrytile";

import { City, Industry } from "../types";

/**
 * A location that an industry can be built on by a player.
 */
export class IndustryLocation extends bge.Zone {
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

    @bge.display()
    tile?: IndustryTile;

    constructor(data: IIndustryLocationData) {
        super(2.25, 2.25);

        this.data = data;
        this.hideIfEmpty = true;
        this.outlineStyle = bge.OutlineStyle.NONE;

        this.name = `${City[this.data.city]}: ${data.industries.map(x => Industry[x]).join(" or ")}`;
    }
}
