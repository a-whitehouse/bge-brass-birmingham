import * as bge from "bge-core";

import { Resource } from "../types";
import { GameBoard } from "./gameboard";
import { ResourceToken, ResourceTokenSlot } from "./resourcetoken";

import * as marketdata from "../data/resourcemarkets";

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

        this.fill(data.initialCount);
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
    fill(count: number): void {
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
        return Array(count).map(_ => this.take());
    }

    /**
     * Fills up the next slots in the market with the given range of tokens,
     * counting how many coins are earned in the process. The sold tokens are
     * removed from {@link tokens}.
     * @param tokens Array of tokens to sell to the market.
     * @return The coins earned by selling.
     */
    sell(tokens: ResourceToken[]): number {
        const toSell = Math.min(tokens.length, this.remainingSlots);
        const saleValue = this.getSaleValue(toSell);

        this.addRange(tokens.splice(tokens.length - toSell, toSell));

        return saleValue;
    }
}
