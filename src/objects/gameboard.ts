import * as bge from "bge-core";

import * as gameboard from "../data/gameboard";
import INDUSTRY_LOCATIONS from "../data/buildinglocations";
import LINK_LOCATIONS from "../data/linklocations";

import { IndustryLocation } from "./industrylocation";
import { LinkLocation } from "./linklocation";

import { Player } from "../player";
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

    private readonly _cityIndustryLocations = new Map<City, IndustryLocation[]>();
    private readonly _cityLinkLocations = new Map<City, LinkLocation[]>();

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

        // Build up maps of all industry and link locations inside / adjacent to each city

        for (let loc of this.industryLocations) {
            let indLocations = this._cityIndustryLocations.get(loc.city);

            if (indLocations == null) {
                indLocations = [];
                this._cityIndustryLocations.set(loc.city, indLocations);
            }

            indLocations.push(loc);
        }

        for (let loc of this.linkLocations) {
            for (let city of loc.data.cities) {
                let linkLocations = this._cityLinkLocations.get(city);

                if (linkLocations == null) {
                    linkLocations = [];
                    this._cityLinkLocations.set(city, linkLocations);
                }

                linkLocations.push(loc);
            }
        }
    }

    /**
     * Get all industry locations at the given city.
     * @param city City to look up industry locations for
     */
    getIndustryLocations(city: City): readonly IndustryLocation[] {
        if (city === City.Any) {
            return this.industryLocations;
        }

        return this._cityIndustryLocations.get(city) ?? [];
    }

    /**
     * Get all link locations directly adjacent to the given city.
     * @param city City to look up adjacent links for
     */
    getNeighbouringLinks(city: City): readonly LinkLocation[] {
        return this._cityLinkLocations.get(city) ?? [];
    }

    /**
     * Checks if the given location is adjacent to a player placed tile.
     * @param loc Location to check
     * @param player Player's network to check
     */
    isInPlayerNetwork(loc: LinkLocation | IndustryLocation, player: Player): boolean {
        let cities = loc instanceof LinkLocation ? loc.data.cities : [loc.city];

        for (let city of cities) {
            if (this.getIndustryLocations(city).some(x => x.tile?.player === player)) {
                return true;
            }

            if (this.getNeighbouringLinks(city).some(x => x.tile?.player === player)) {
                return true;
            }
        }

        return false;
    }

    *getLinkedCities(loc: City): Iterable<City> {
        const queue: City[] = [];
        const visited = new Set<City>();

        visited.add(loc);
        queue.push(loc);

        yield loc;

        while (queue.length > 0) {
            const nextCity = queue.pop();
            const links = this.getNeighbouringLinks(nextCity);

            for (let link of links) {
                if (link.tile == null) {
                    continue;
                }

                for (let linkedCity of link.data.cities) {
                    yield linkedCity;

                    if (visited.add(linkedCity)) {
                        queue.push(linkedCity);
                    }
                }
            }
        }
    }

    /**
     * Returns true if the two given locations are connected by built links.
     * @param a A city, industry, or link location to start from
     * @param b A city, industry, or link location that we're trying to reach
     */
    isLinked(a: LinkLocation | IndustryLocation | City, b: LinkLocation | IndustryLocation | City): boolean {
        if (a instanceof LinkLocation) {
            for (let city of a.data.cities) {
                if (this.isLinked(city, b)) {
                    return true;
                }
            }

            return false;
        }

        if (b instanceof LinkLocation) {
            for (let city of b.data.cities) {
                if (this.isLinked(a, city)) {
                    return true;
                }
            }

            return false;
        }

        if (a instanceof IndustryLocation) {
            a = a.city;
        }

        if (b instanceof IndustryLocation) {
            b = b.city;
        }

        if (a === b) {
            return true;
        }

        // Both a and b must both be cities from here on

        for (let city of this.getLinkedCities(a)) {
            if (city === b) {
                return true;
            }
        }

        return false;
    }
}
