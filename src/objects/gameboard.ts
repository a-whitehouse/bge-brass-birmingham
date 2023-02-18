import * as bge from "bge-core";

import INDUSTRY_LOCATIONS from "../data/industryLocations";
import { IIndustryLocationData } from "../data/types";

export class IndustryLocation extends bge.Zone {
    display: bge.IDisplayOptions;

    readonly data: IIndustryLocationData;

    get city() {
        return this.data.city;
    }

    constructor(data: IIndustryLocationData) {
        super(2.25, 2.25);

        this.data = data;
    }
}

@bge.width(GameBoard.WIDTH)
@bge.height(GameBoard.HEIGHT)
@bge.thickness(0.5)
export class GameBoard extends bge.Card {
    static readonly WIDTH = 57;
    static readonly HEIGHT = 57;

    readonly industryLocations: readonly IndustryLocation[];

    constructor() {
        super();

        this.front.image = bge.Image.simple("https://iili.io/HGzqKkx.jpg");

        this.industryLocations = INDUSTRY_LOCATIONS.map((data, i) => {
            const location = new IndustryLocation(data);

            location.display = this.children.add(`building[${i}]`, location, {
                localPosition: { x: data.posX, z: data.posY },
                visibleFor: []
            }).options;

            return location;
        });
    }

    override get footprint(): bge.Footprint {
        const baseFootprint = super.footprint;

        return {
            width: baseFootprint.width + 4,
            height: baseFootprint.height + 4
        }
    }
}
