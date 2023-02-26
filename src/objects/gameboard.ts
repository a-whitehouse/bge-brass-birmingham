import * as bge from "bge-core";

import * as gameboard from "../data/gameboard";
import INDUSTRY_LOCATIONS from "../data/buildinglocations";
import LINK_LOCATIONS from "../data/linklocations";

import { IndustryLocation } from "./industrylocation";
import { LinkLocation } from "./linklocation";
import { Game } from "../game";
import { City } from "../types";

/**
 * The main board in the middle of the table.
 */
@bge.width(gameboard.WIDTH)
@bge.height(gameboard.HEIGHT)
@bge.thickness(0.5)
export class GameBoard extends bge.Card {
    private readonly _game: Game;

    /**
     * Array of {@link IndustryLocation}s that players can build on.
     */
    readonly industryLocations: readonly IndustryLocation[];

    /**
     * Array of {@link LinkLocation}s that players can build on.
     */
    readonly linkLocations: readonly LinkLocation[];

    @bge.display({ rotation: 90, position: { x: -20.6, y: 19.7 } })
    get drawPile() { return this._game.drawPile; }

    @bge.display({ rotation: 90, position: { x: -20.6, y: 12 } })
    get wildLocationPile() { return this._game.wildLocationPile; }

    @bge.display({ rotation: 90, position: { x: -20.6, y: 4.4 } })
    get wildIndustryPile() { return this._game.wildIndustryPile; }

    @bge.display() get coalMarket() { return this._game.coalMarket; }
    @bge.display() get ironMarket() { return this._game.ironMarket; }
    @bge.display() get scoreTrack() { return this._game.scoreTrack; }

    constructor(game: Game) {
        super();

        this._game = game;

        this.front.image = bge.Image.simple("https://iili.io/HGzqKkx.jpg");

        // Read industry location definitions, create IndustryLocation instances,
        // then add them as children to be displayed.

        this.industryLocations = INDUSTRY_LOCATIONS.map(data => {
            const location = new IndustryLocation(data);

            this.children.add(location, {
                position: new bge.Vector3(data.posX, data.posY)
            });

            return location;
        });

        // Read link location definitions, create LinkLocation instances,
        // then add them as children to be displayed.

        this.linkLocations = LINK_LOCATIONS.map(data => {
            const location = new LinkLocation(data);

            location.display = this.children.add(location, {
                position: new bge.Vector3(data.posX, data.posY),
                rotation: bge.Rotation.z(data.angle)
            });

            return location;
        });
    }

    /**
     * Get all industry locations at the given city.
     */
    getIndustryLocations(city: City): readonly IndustryLocation[] {
        if (city === City.Any) {
            return this.industryLocations;
        }

        // TODO: use a Map!

        return this.industryLocations.filter(x => x.city === city);
    }
}
