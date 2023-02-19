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
    readonly board: GameBoard;
    readonly resource: Resource;
    readonly data: IResourceMarketData;

    private readonly _tokens: ResourceToken[] = [];

    readonly capacity: number;

    get count() {
        return this._tokens.length;
    }

    get remainingSpace() {
        return this.capacity - this.count; 
    }

    get isFull() {
        return this.remainingSpace <= 0;
    }

    constructor(board: GameBoard, resource: Resource) {
        this.board = board;
        this.resource = resource;
        this.data = resource === Resource.Coal
            ? marketdata.COAL_MARKET
            : marketdata.IRON_MARKET;

        this.capacity = this.data.rows.length * this.data.columns.length;
    }

    private getRowCol(index: number): [row: number, col: number] {
        const row = this.data.rows.length - 1
            - Math.floor(index / this.data.columns.length);
        const col = index % this.data.columns.length;

        return [row, col];
    }

    getCost(count: number): number {
        let total = 0;

        for (let i = 0; i < count; ++i) {
            const index = this.count - i - 1;

            if (index < 0) {
                total += this.data.rows.length + 1;
                continue;
            }

            const [row, col] = this.getRowCol(index);
            total += row + 1;
        }

        return total;
    }

    fill(count: number): void {
        while (this._tokens.length < count) {
            this.add(new ResourceToken(this.resource));
        }
    }

    add(token: ResourceToken): void {
        if (this.isFull) {
            throw new Error("Resource market full");
        }

        const index = this._tokens.length;
        const [row, col] = this.getRowCol(index);

        this.board.children.add(`_res_${this.resource}_${index}`, token, {
            localPosition: {
                x: this.data.columns[col],
                z: this.data.rows[row]
            }
        });

        this._tokens.push(token);
    }

    take(): ResourceToken {
        const token = this._tokens.pop();

        this.board.children.remove(token);

        return token;
    }
}