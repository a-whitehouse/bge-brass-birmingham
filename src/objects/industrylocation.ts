import * as bge from "bge-core";

import { IIndustryLocationData } from "../types";
import { IndustryTile } from "./industrytile";

import { City, Industry } from "../types";
import { ResourceToken } from "./resourcetoken";
import { LinearArrangement } from "bge-core";

/**
 * A location that an industry can be built on by a player.
 */
export class IndustryLocation extends bge.Zone {
    private _tile: IndustryTile;

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
    get tile() { return this._tile; }

    @bge.display({
        arrangement: new LinearArrangement({
            axis: "z"
        })
    })
    readonly spentResources: ResourceToken[] = [];

    constructor(data: IIndustryLocationData) {
        super(2.25, 2.25);

        this.data = data;
        this.hideIfEmpty = true;
        this.outlineStyle = bge.OutlineStyle.NONE;

        this.name = `${City[this.data.city]}: ${data.industries.map(x => Industry[x]).join(" or ")}`;
    }

    async setTile(tile: IndustryTile) {
        
        if (this._tile != null) {
            this._tile.player.builtIndustries.delete(this._tile);
            // TODO: animate removing tile?
        }
        
        if (tile.location != null) {
            throw new Error("Tile already has a location!");
        }

        this._tile = tile;
        
        tile.player.builtIndustries.add(tile);
        tile.location = this;

        await tile.player.game.delay.beat();
    }
}
