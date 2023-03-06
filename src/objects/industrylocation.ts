import * as bge from "bge-core";

import { IIndustryLocationData } from "../types";
import { IndustryTile } from "./industrytile";

import { City, Industry } from "../types";
import { ResourceToken } from "./resourcetoken";
import { LinearArrangement } from "bge-core";
import { IIndustryTileState } from "../state";
import { GameBoard } from "./gameboard";

const console = bge.Logger.get("industry-location");

/**
 * A location that an industry can be built on by a player.
 */
export class IndustryLocation extends bge.Zone {
    private readonly _board: GameBoard;

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

    constructor(board: GameBoard, data: IIndustryLocationData) {
        super(2.25, 2.25);

        this._board = board;
        this.data = data;

        this.hideIfEmpty = true;
        this.outlineStyle = bge.OutlineStyle.NONE;

        this.name = `${City[this.data.city]}: ${data.industries.map(x => Industry[x]).join(" or ")}`;
    }

    clearSpentResources() {
        this.spentResources.splice(0, this.spentResources.length);
    }

    async setTile(tile?: IndustryTile) {
        if (this._tile === tile) {
            return;
        }

        if (tile?.location != null) {
            throw new Error("Tile already has a location!");
        }

        const game = this._board.game;

        if (this._tile != null) {
            if (tile != null) {
                console.info(`Overbuilding ${this._tile.name} in ${this.name} with ${tile.name}`);
            }

            this._tile.clearResources();

            this._tile.player.removeBuiltIndustry(this._tile);
            this._tile.player.developedIndustries.add(this._tile);
            this._tile.location = null;
            this._tile = null;

            await game.delay.beat();
        }

        this.children.getOptions("tile").rotation = undefined;
        this._tile = tile;

        if (tile != null) {
            tile.player.addBuiltIndustry(tile);
            tile.location = this;

            await game.delay.beat();
        }
    }

    serialize(): IIndustryTileState | null {
        if (this._tile == null) {
            return null;
        }

        return {
            player: this._tile.player.index,
            industry: this._tile.industry,
            level: this._tile.data.level,

            flipped: this._tile.hasFlipped,
            resources: this._tile.resources.map(x => x.resource)
        };
    }

    deserialize(state: IIndustryTileState | null): void {
        this.clearSpentResources();

        if (state == null) {
            this._tile = null;
            return;
        }
        
        const game = this._board.game;

        if (this._tile?.player.index !== state.player || this._tile?.industry !== state.industry || this._tile?.data.level !== state.level) {
            this._tile = new IndustryTile(game.players[state.player], state.industry, state.level);
            this._tile.hasFlipped = state.flipped;
            this._tile.location = this;
        }

        if (this._tile.resources.length > state.resources.length) {
            this._tile.resources.splice(state.resources.length, this._tile.resources.length - state.resources.length);
        } else {
            this._tile.resources.push(...state.resources.slice(this._tile.resources.length).map(x => new ResourceToken(x)));
        }

        state.resources.forEach((x, i) => {
            if (this._tile.resources[i].resource !== x) {
                this._tile.resources[i] = new ResourceToken(x);
            }
        })

        this.children.getOptions("tile").rotation = state.flipped
            ? bge.Rotation.y(180)
            : undefined;
    }
}
