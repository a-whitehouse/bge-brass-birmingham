import { IResourceMarketData, Resource } from "../types";
import { GameBoard } from "./gameboard";
import { ResourceToken } from "./resourcetoken";

import * as marketdata from "../data/resourcemarkets";

/**
 * Handles adding and removing iron or coal {@link ResourceToken}s from
 * the market display to the right of the main board, and calculating how
 * much each token costs to purchase.
 */
export class ResourceMarket {
    /**
     * Central game board on which to position the market.
     */
    readonly board: GameBoard;

    /**
     * Resource type (coal or iron) of this market.
     */
    readonly resource: Resource;

    private readonly _data: IResourceMarketData;
    private readonly _tokens: ResourceToken[] = [];

    /**
     * Maximum number of tokens this market can contain.
     */
    readonly capacity: number;

    /**
     * Current number of tokens in the market.
     */
    get count() {
        return this._tokens.length;
    }

    /**
     * How many empty slots are available for players to fill.
     */
    get remainingSpace() {
        return this.capacity - this.count; 
    }

    /**
     * If true, the market can't be sold to.
     */
    get isFull() {
        return this.remainingSpace <= 0;
    }

    /**
     * Handles adding and removing iron or coal {@link ResourceToken}s from
     * the market display to the right of the main board, and calculating how
     * much each token costs to purchase.
     * @param board Central game board on which to position the market.
     * @param resource Resource type (coal or iron) of this market.
     */
    constructor(board: GameBoard, resource: Resource) {
        this.board = board;
        this.resource = resource;

        this._data = resource === Resource.Coal
            ? marketdata.COAL_MARKET
            : marketdata.IRON_MARKET;

        this.capacity = this._data.rows.length * this._data.columns.length;

        this.fill(this._data.initialCount);
    }

    private getRowCol(index: number): [row: number, col: number] {
        const row = this._data.rows.length - 1
            - Math.floor(index / this._data.columns.length);
        const col = index % this._data.columns.length;

        return [row, col];
    }

    /**
     * Gets the coin value of tokens in the given row.
     * The lowest value row (1 coin) is rowIndex 0.
     * @param row Row index to determine the value of.
     */
    getRowValue(rowIndex: number): number {
        if (rowIndex < 0) return 0;
        if (rowIndex >= this._data.rows.length) {
            return this._data.rows.length + 1;
        }

        return Math.max(0, Math.min(rowIndex + 1, this._data.rows.length + 1));
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
                total += this.getRowValue(this._data.rows.length);
                continue;
            }

            const [row, col] = this.getRowCol(index);
            total += this.getRowValue(row);
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

        count = Math.min(count, this.remainingSpace);

        for (let i = 0; i < count; ++i) {
            const index = this.count + i;
            const [row, col] = this.getRowCol(index);
            total += this.getRowValue(row);
        }

        return total;
    }

    /**
     * Fill this market up to the given token count.
     * @param count Total number of tokens the market should contain.
     */
    fill(count: number): void {
        while (this._tokens.length < count) {
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

        const index = this._tokens.length;
        const [row, col] = this.getRowCol(index);

        this.board.children.add(`_res_${this.resource}_${index}`, token, {
            localPosition: {
                x: this._data.columns[col],
                z: this._data.rows[row]
            }
        });

        this._tokens.push(token);
    }

    /**
     * Adds a range of tokens to the market. If too many tokens are given,
     * an error is thrown.
     * @param tokens Array of tokens to add to the market.
     */
    addRange(tokens: ResourceToken[]): void {
        if (tokens.length > this.remainingSpace) {
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
        const token = this._tokens.pop();

        this.board.children.remove(token);

        return token;
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
     * counting how many coins are earned in the process. Surplus tokens are
     * included in the return value if the market becomes full.
     * @param tokens Array of tokens to sell to the market.
     * @return Object describing how many coins were earned, and which tokens
     * were not added to the market if it became full.
     */
    sell(tokens: ResourceToken[]): { surplus: ResourceToken[], value: number } {
        const toSell = Math.min(tokens.length, this.remainingSpace);
        const saleValue = this.getSaleValue(toSell);

        this.addRange(tokens.slice(0, toSell));

        return {
            surplus: tokens.slice(toSell),
            value: saleValue
        };
    }
}