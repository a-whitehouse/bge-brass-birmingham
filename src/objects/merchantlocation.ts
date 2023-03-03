
import * as bge from "bge-core";

import { ResourceToken } from "./resourcetoken";
import { MerchantTile } from "./merchanttile";

import { IMerchantLocationData, Resource } from "../types";

export class MerchantLocation extends bge.Zone {
    readonly data: IMerchantLocationData;

    @bge.display()
    marketBeer: ResourceToken;

    @bge.display()
    tile: MerchantTile;

    constructor(data: IMerchantLocationData) {
        super(2.25, 2.25);

        this.data = data;

        this.outlineStyle = bge.OutlineStyle.NONE;

        this.children.getOptions("marketBeer").position = {
            x: data.beerPosX - data.posX,
            y: data.beerPosY - data.posY
        };
    }
}
