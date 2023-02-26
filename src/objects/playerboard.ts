import * as bge from "bge-core";

import * as playerboard from "../data/playerboard";
import INDUSTRIES from "../data/industrylevels";

import { Player } from "../player";
import { IndustryTile } from "./industrytile";
import { IIndustryLevelData, Industry } from "../types";
import { LinearArrangement, Vector3 } from "bge-core";

export class IndustryLevelSlot extends bge.Zone {
    readonly player: Player;
    readonly industry: Industry;
    readonly data: IIndustryLevelData;

    @bge.display({
        arrangement: new LinearArrangement({
            axis: "z",
            offset: new Vector3(0, 0.1, 0)
        })
    })
    readonly tiles: IndustryTile[] = [];

    constructor(player: Player, industry: Industry, data: IIndustryLevelData) {
        super(2.5, 2.5);

        this.player = player;
        this.industry = industry;
        this.data = data;

        this.outlineStyle = bge.OutlineStyle.NONE;
        this.hideIfEmpty = true;

        const count = data.count ?? 1;

        for (let i = 0; i < count; ++i) {
            this.tiles.push(new IndustryTile(player, industry, data));
        }
    }
}

@bge.width(playerboard.WIDTH)
@bge.height(playerboard.HEIGHT)
@bge.thickness(0.5)
export class PlayerBoard extends bge.Card {
    readonly industryLevels: Map<Industry, IndustryLevelSlot[]> = new Map();

    constructor(player: Player) {
        super();

        this.front.image = bge.Image.simple("https://iili.io/HMBsWQf.jpg");

        for (let [industry, levels] of INDUSTRIES) {
            const slots: IndustryLevelSlot[] = [];

            for (let level of levels) {
                const slot = new IndustryLevelSlot(player, industry, level);
                this.children.add(slot, {
                    position: { x: level.posX, y: level.posY }
                });
                slots.push(slot);
            }

            this.industryLevels.set(industry, slots);
        }
    }
}
