import * as bge from "bge-core";

import * as gameboard from "../data/gameboard";
import INDUSTRY_LOCATIONS from "../data/buildinglocations";
import LINK_LOCATIONS from "../data/linklocations";

import { ResourceMarket } from "./resourcemarket";

import { IndustryLocation } from "./industrylocation";
import { LinkLocation } from "./linklocation";
import { IndustryTile } from "./industrytile";
import { LinkTile } from "./linktile";
import { PlayerTokenSlot } from "./playertoken";

import { Player } from "../player";
import { Game } from "../game";
import { City, Resource, MARKET_CITIES, BUILDABLE_CITIES } from "../types";

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

    readonly playerTokenSlots: PlayerTokenSlot[] = [];

    constructor(game: Game) {
        super();

        this._game = game;

        this.front.image = bge.Image.simple("https://iili.io/HGzqKkx.jpg");

        for (let i = 0; i < 4; ++i) {
            this.playerTokenSlots[i] = new PlayerTokenSlot();
            this.children.add(this.playerTokenSlots[i], {
                position: { x: -22.65, y: -9.8 - i * 4.62 }
            });
        }

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

    getBuiltIndustries(player: Player): readonly IndustryTile[] {
        return this.industryLocations.filter(x => x.tile?.player === player).map(x => x.tile);
    }

    getBuiltLinks(player: Player): readonly LinkTile[] {
        return this.linkLocations.filter(x => x.tile?.player === player).map(x => x.tile);
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

    /**
     * Iterates through all cities linked to the given one, following built links.
     * Each yielded item contains a city, and the shortest distance to reach it.
     * @param source One or more cities to start searching from
     */
    *getLinkedCities(sources: LinkLocation | IndustryLocation | City | City[]): Iterable<{ city: City, distance: number }> {

        const sourceSet = GameBoard.getCitiesOfAny(sources);

        const queue: { city: City, distance: number }[] = [];
        const visited = new Set<City>();

        for (let source of sourceSet) {
            if (visited.has(source)) {
                continue;
            }

            visited.add(source);

            const info = { city: source, distance: 0 };
            yield info;

            queue.push(info);
        }

        while (queue.length > 0) {
            const next = queue.pop();
            const links = this.getNeighbouringLinks(next.city);

            for (let link of links) {
                if (link.tile == null) {
                    continue;
                }

                for (let linkedCity of link.data.cities) {
                    if (visited.has(linkedCity)) {
                        continue;
                    }

                    visited.add(linkedCity);

                    const info = { city: linkedCity, distance: next.distance + 1 };
                    yield info;

                    queue.push(info);
                }
            }
        }
    }

    private static getCitiesOfAny(loc: LinkLocation | IndustryLocation | City | City[]): Set<City> {
        if (loc instanceof LinkLocation) {
            return new Set(loc.data.cities);
        }

        if (loc instanceof IndustryLocation) {
            return new Set([loc.city]);
        }

        if (Array.isArray(loc)) {
            return new Set(loc);
        }

        return new Set([loc]);
    }

    /**
     * Returns true if the two given locations are connected by built links.
     * @param a A city, industry, or link location to start from
     * @param b A city, industry, or link location that we're trying to reach
     */
    isLinked(a: LinkLocation | IndustryLocation | City | City[], b: LinkLocation | IndustryLocation | City | City[]): boolean {
        const destinations = GameBoard.getCitiesOfAny(b);

        // Both a and b must both be cities from here on

        for (let item of this.getLinkedCities(a)) {
            if (destinations.has(item.city)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get information about where a given resource can be obtained, when trying
     * to deliver to a given destination.
     * @param destination Location or city that the resource should be delivered to
     * @param resource Resource type to search for
     * @param player Player that is requesting the resource (only needed for beer)
     */
    getResourceSources(
        destination: LinkLocation | IndustryLocation | City,
        resource: Resource,
        player?: Player): IResourceSources {

        // TODO: market beer!

        const result: IResourceSources = {
            tiles: [],
            connectedToMarket: resource === Resource.Iron
        };

        if (destination instanceof LinkLocation) {
            throw new Error("Very not implemented!");
        }

        if (destination instanceof IndustryLocation) {
            destination = destination.city;
        }

        const cityDistances = resource === Resource.Iron
            ? BUILDABLE_CITIES.map(x => ({ city: x, distance: 0 }))
            : this.getLinkedCities(destination);

        if (resource === Resource.Beer) {
            if (player == null) {
                throw new Error("Expected a player");
            }

            for (let tile of this.getBuiltIndustries(player)) {
                if (tile.resources.length === 0) {
                    continue;
                }

                if (tile.resources[0].resource !== Resource.Beer) {
                    continue;
                }

                result.tiles.push(...tile.resources
                    .map(x => ({ tile: tile, distance: 0 })));
            }
        }

        for (let item of cityDistances) {

            if (MARKET_CITIES.includes(item.city)) {
                result.connectedToMarket = true;
            }

            const locs = this.getIndustryLocations(item.city);

            for (let loc of locs) {

                if (loc.tile == null) {
                    continue;
                }

                if (loc.tile.resources.length === 0) {
                    continue;
                }

                if (loc.tile.resources[0].resource !== resource) {
                    continue;
                }

                // Don't double-count connected beer owned by the player!
                if (resource === Resource.Beer && loc.tile.player === player) {
                    continue;
                }

                result.tiles.push(...loc.tile.resources
                    .map(x => ({
                        tile: loc.tile, distance: resource === Resource.Beer
                            ? 0 : item.distance
                    })));
            }
        }

        result.tiles.sort((a, b) => a.distance - b.distance);

        return result;
    }
}

/**
 * Describes the locations and distances of a requested resource.
 * See {@link GameBoard.getResourceSources}
 */
interface IResourceSources {
    /**
     * Array with an item for each resource token found, including the distance.
     * Sorted by distance, ascending.
     */
    tiles: { tile: IndustryTile, distance: number }[];

    /**
     * If true, the corresponding resource market can be used.
     */
    connectedToMarket: boolean;
}