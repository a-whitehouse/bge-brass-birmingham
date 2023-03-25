import * as bge from "bge-core";
import { IMerchantState } from "../state.js";

import { Industry, SELLABLE_INDUSTRIES } from "../types.js";

export enum MerchantTileValue {
    Blank,
    Goods,
    Cotton,
    Pottery,
    Wild
}

@bge.width(2.25)
@bge.height(2.25)
@bge.thickness(0.15)
@bge.cornerRadius(0.1)
export class MerchantTile extends bge.Card {
    static *generateDeck(playerCount: number): Iterable<MerchantTile> {
        yield new MerchantTile(MerchantTileValue.Wild);
        yield new MerchantTile(MerchantTileValue.Goods);
        yield new MerchantTile(MerchantTileValue.Cotton);
        yield new MerchantTile(MerchantTileValue.Blank);
        yield new MerchantTile(MerchantTileValue.Blank);

        if (playerCount < 3) {
            return;
        }

        yield new MerchantTile(MerchantTileValue.Pottery);
        yield new MerchantTile(MerchantTileValue.Blank);

        if (playerCount < 4) {
            return;
        }

        yield new MerchantTile(MerchantTileValue.Goods);
        yield new MerchantTile(MerchantTileValue.Cotton);
    }

    readonly industries: readonly Industry[];
    readonly value: MerchantTileValue;

    constructor(value: MerchantTileValue) {
        super();

        this.value = value;

        let row: number;
        let col: number;

        switch (value) {
            case MerchantTileValue.Blank:
                row = 0;
                col = 1;
                this.industries = [];
                break;

            case MerchantTileValue.Goods:
                row = 1;
                col = 1;
                this.industries = [Industry.Goods];
                break;

            case MerchantTileValue.Cotton:
                row = 1;
                col = 2;
                this.industries = [Industry.Cotton];
                break;

            case MerchantTileValue.Pottery:
                row = 1;
                col = 0;
                this.industries = [Industry.Pottery];
                break;

            case MerchantTileValue.Wild:
                row = 0;
                col = 0;
                this.industries = SELLABLE_INDUSTRIES;
                break;
        }

        this.back.image = this.hidden.image = bge.Image.simple("https://iili.io/HWnsNnt.jpg");
        this.front.image = bge.Image.tile("https://iili.io/HWnsOMX.jpg", 2, 3, row, col);
    }
}
