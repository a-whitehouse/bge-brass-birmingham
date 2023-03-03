import * as bge from "bge-core";
import { LinearArrangement, Rotation } from "bge-core";

import { Player } from "../player";
import { IIndustryLevelData, Industry } from "../types";
import { IndustryLocation } from "./industrylocation";
import { LinkLocation } from "./linklocation";
import { ResourceToken } from "./resourcetoken";

@bge.width(2.25)
@bge.height(2.25)
@bge.thickness(0.15)
@bge.cornerRadius(0.1)
export class IndustryTile extends bge.Card {
    readonly player: Player;
    readonly industry: Industry;
    readonly data: IIndustryLevelData;

    @bge.display({
        arrangement: new LinearArrangement({
            axis: "z"
        })
    })
    readonly resources: ResourceToken[] = [];

    location?: IndustryLocation;
    hasFlipped: boolean = false;

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

    async consumeResource(destination?: ResourceToken[]) {
        if (this.resources.length === 0) {
            throw new Error("This tile has no resources to consume");
        }

        const resource = this.resources.pop();
        destination?.push(resource);

        await this.player.game.delay.beat();

        if (this.resources.length === 0) {
            await this.flip();
        }
    }

    async flip() {
        if (this.hasFlipped) {
            throw new Error("This tile has already flipped");
        }

        this.hasFlipped = true;
        this.location.children.getOptions("tile").rotation = Rotation.y(180);

        await this.player.game.delay.beat();

        if (this.data.saleReward.income > 0) {
            this.player.increaseIncome(this.data.saleReward.income);
            await this.player.game.delay.beat();
        }
    }
}
