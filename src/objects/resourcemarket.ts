import * as bge from "bge-core";

import { Resource } from "../types.js";
import { GameBoard } from "./gameboard.js";
import { ResourceToken, ResourceTokenSlot } from "./resourcetoken.js";

import * as marketdata from "../data/resourcemarkets.js"
import { IndustryTile } from "./industrytile.js";

/**
 * Handles adding and removing iron or coal {@link ResourceToken}s from
 * the market display to the right of the main board, and calculating how
 * much each token costs to purchase.
 */
export class ResourceMarket extends bge.Zone {
    private _count: number;

    /**
     * Central game board on which to position the market.
     */
    readonly board: GameBoard;

    /**
     * Resource type (coal or iron) of this market.
     */
    readonly resource: Resource;

    readonly defaultCost: number;

    private readonly _slots: ResourceTokenSlot<{ cost: number }>[];

    /**
     * Maximum number of tokens this market can contain.
     */
    get capacity() {
        return this._slots.length;
    }

    /**
     * Current number of tokens in the market.
     */
    get count() {
        return this._count;
    }

    /**
     * How many empty slots are available for players to fill.
     */
    get remainingSlots() {
        return this.capacity - this.count;
    }

    /**
     * If true, the market can't be sold to.
     */
    get isFull() {
        return this.remainingSlots <= 0;
    }

    /**
     * If true, every slot in the market is empty.
     */
    get isEmpty() {
        return this._count === 0;
    }

    /**
     * Handles adding and removing iron or coal {@link ResourceToken}s from
     * the market display to the right of the main board, and calculating how
     * much each token costs to purchase.
     * @param board Central game board on which to position the market.
     * @param resource Resource type (coal or iron) of this market.
     */
    constructor(board: GameBoard, resource: Resource) {
        super(0, 0);

        this.outlineStyle = bge.OutlineStyle.NONE;

        this.board = board;
        this.resource = resource;

        this._count = 0;
        this._slots = [];

        const data = resource === Resource.Coal
            ? marketdata.COAL_MARKET
            : marketdata.IRON_MARKET;

        for (let i = data.rows.length - 1; i >= 0; --i) {
            const row = data.rows[i];
            const rowCost = i + 1;

            for (let col of data.columns) {
                const slot = new ResourceTokenSlot({ cost: rowCost });
                this._slots.push(slot);
                this.children.add(slot, {
                    position: new bge.Vector3(col, row)
                });
            }
        }

        this.defaultCost = data.rows.length + 1;

        this.setCount(data.initialCount);
    }

    /**
     * Determines how much purchasing the given amount of coal would currently cost.
     * @param count Number of coal tokens to be purchased.
     * @returns Cost in coins.
     */
    getCost(count: number): number {
        let total = 0;

        for (let i = 0; i < count; ++i) {
            const index = this.count - i - 1;

            if (index < 0) {
                total += this.defaultCost;
                continue;
            }

            total += this._slots[index].data.cost;
        }

        return total;
    }

    /**
     * Determines how many coins a player would currently receive for selling
     * the given number of tokens.
     * @param count Number of tokens to be sold.
     * @returns Sale value in coins.
     */
    getSaleValue(count: number): number {
        let total = 0;

        count = Math.min(count, this.remainingSlots);

        for (let i = 0; i < count; ++i) {
            const index = this.count + i;
            total += this._slots[index].data.cost;
        }

        return total;
    }

    /**
     * Fill this market up to the given token count.
     * @param count Total number of tokens the market should contain.
     */
    setCount(count: number): void {
        if (this.count > count) {
            this.takeRange(this.count - count);
        }

        while (this.count < count) {
            this.add(new ResourceToken(this.resource));
        }
    }

    /**
     * Add a single token to this market, filling the next empty slot.
     * @param token Token to add to the market.
     */
    add(token: ResourceToken): void {
        if (token.resource !== this.resource) {
            throw new Error(`Expected a ${Resource[this.resource]} resource`);
        }

        if (this.isFull) {
            throw new Error("Resource market is full");
        }

        this._slots[this._count++].add(token);
    }

    /**
     * Adds a range of tokens to the market. If too many tokens are given,
     * an error is thrown.
     * @param tokens Array of tokens to add to the market.
     */
    addRange(tokens: ResourceToken[]): void {
        if (tokens.length > this.remainingSlots) {
            throw new Error("Resource market would overflow");
        }

        for (let token of tokens) {
            this.add(token);
        }
    }

    /**
     * Takes a single token from this market. If the market is empty,
     * a new token will be created.
     * @returns Token removed from the market.
     */
    take(): ResourceToken {
        if (this.count <= 0) {
            return new ResourceToken(this.resource);
        }

        return this._slots[--this._count].take();
    }

    /**
     * Takes a range of tokens from the market. New tokens will be created
     * if it becomes empty.
     * @param count Number of tokens to take.
     */
    takeRange(count: number): ResourceToken[] {
        return Array.from(new Array(count)).map(_ => this.take());
    }

    clear(): void {
        this.takeRange(this.count);
    }

    /**
     * Fills up the next slots in the market with tokens taken from the given tile,
     * giving money to the owning player and possibly flipping the tile.
     * @param source Industry tile that has produced the sold tokens.
     */
    async sell(source: IndustryTile) {
        const toSell = Math.min(source.resources.length, this.remainingSlots);

        if (toSell <= 0) {
            return;
        }

        source.player.money += this.getSaleValue(toSell);
        this.addRange(source.resources.splice(source.resources.length - toSell, toSell));

        await source.player.game.delay.beat();

        if (source.resources.length <= 0) {
            await source.flip();
        }
    }
}
