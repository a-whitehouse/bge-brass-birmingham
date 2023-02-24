import * as bge from "bge-core";

import { Player } from "../player";
import { IIndustryLevelData, Industry } from "../types";

@bge.width(2.25)
@bge.height(2.25)
@bge.thickness(0.15)
@bge.cornerRadius(0.1)
export class IndustryTile extends bge.Card {
    readonly player: Player;
    readonly industry: Industry;
    readonly data: IIndustryLevelData;

    constructor(player: Player, industry: Industry, data: IIndustryLevelData) {
        super();

        this.player = player;
        this.industry = industry;
        this.data = data;

        const frontUrl = player.index < 2
            ? "https://iili.io/HMC2BJs.jpg"
            : "https://iili.io/HMC2C5G.jpg";

        const backUrl = player.index < 2
            ? "https://iili.io/HMC2nef.jpg"
            : "https://iili.io/HMC2fgn.jpg";

        const indexOffset = (player.index % 2) * 31;
        const index = indexOffset + data.tileIndex;

        const row = 6 - Math.floor(index / 9);
        const col = index % 9;

        this.front.image = bge.Image.tile(frontUrl, 7, 9, row, col);
        this.back.image = bge.Image.tile(backUrl, 7, 9, row, col);
    }
}
