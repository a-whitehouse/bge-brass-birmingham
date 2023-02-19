import * as bge from "bge-core";

import INDUSTRY_LOCATIONS from "../data/industries";
import LINK_LOCATIONS from "../data/links";

import { IndustryLocation } from "./industrylocation";
import { LinkLocation } from "./linklocation";

/**
 * The main board in the middle of the table.
 */
@bge.width(GameBoard.WIDTH)
@bge.height(GameBoard.HEIGHT)
@bge.thickness(0.5)
export class GameBoard extends bge.Card {
    static readonly WIDTH = 57;
    static readonly HEIGHT = 57;

    /**
     * Array of {@link IndustryLocation}s that players can build on.
     */
    readonly industryLocations: readonly IndustryLocation[];
    
    /**
     * Array of {@link LinkLocation}s that players can build on.
     */
    readonly linkLocations: readonly LinkLocation[];

    constructor() {
        super();

        this.front.image = bge.Image.simple("https://iili.io/HGzqKkx.jpg");

        // Read industry location definitions, create IndustryLocation instances,
        // then add them as children to be displayed.

        this.industryLocations = INDUSTRY_LOCATIONS.map((data, i) => {
            const location = new IndustryLocation(data);

            location.display = this.children.add(`industry[${i}]`, location, {
                localPosition: { x: data.posX, z: data.posZ },
                visibleFor: [] // Visible to nobody by default
            }).options;

            return location;
        });
        
        // Read link location definitions, create LinkLocation instances,
        // then add them as children to be displayed.

        this.linkLocations = LINK_LOCATIONS.map((data, i) => {
            const location = new LinkLocation(data);

            location.display = this.children.add(`link[${i}]`, location, {
                localPosition: { x: data.posX, z: data.posZ },
                localRotation: { y: -data.angle },
                visibleFor: [] // Visible to nobody by default
            }).options;

            return location;
        });
    }

    override get footprint(): bge.Footprint {
        const baseFootprint = super.footprint;

        // Add a few cm of clearance around the board

        return {
            width: baseFootprint.width + 4,
            height: baseFootprint.height + 4
        }
    }
}
