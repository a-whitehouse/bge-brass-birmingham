import * as bge from "bge-core";

import { Industry } from "../types";

@bge.width(2.25)
@bge.height(2.25)
@bge.thickness(0.15)
@bge.cornerRadius(0.1)
export class MerchantTile extends bge.Card {
    static *generateDeck(playerCount: number): Iterable<MerchantTile> {
        yield new MerchantTile(0, 0, [Industry.Goods, Industry.Cotton, Industry.Pottery]);
        yield new MerchantTile(1, 1, [Industry.Goods]);
        yield new MerchantTile(1, 2, [Industry.Cotton]);
        yield new MerchantTile(0, 1, []);
        yield new MerchantTile(0, 1, []);

        if (playerCount < 3) {
            return;
        }

        yield new MerchantTile(1, 0, [Industry.Pottery]);
        yield new MerchantTile(0, 1, []);

        if (playerCount < 4) {
            return;
        }

        yield new MerchantTile(1, 1, [Industry.Goods]);
        yield new MerchantTile(1, 2, [Industry.Cotton]);
    }

    readonly industries: readonly Industry[];

    constructor(row: number, col: number, industries: Industry[]) {
        super();

        this.industries = industries;

        this.back.image = this.hidden.image = bge.Image.simple("https://iili.io/HWnsNnt.jpg");
        this.front.image = bge.Image.tile("https://iili.io/HWnsOMX.jpg", 2, 3, row, col);
    }
}
