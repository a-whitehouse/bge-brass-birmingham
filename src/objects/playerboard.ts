import * as bge from "bge-core";

import * as playerboard from "../data/playerboard";
import INDUSTRIES from "../data/industrylevels";

import { Player } from "../player";
import { IndustryTile } from "./industrytile";
import { IIndustryLevelData, Industry } from "../types";

export class IndustryLevelSlot extends bge.Deck<IndustryTile> {
    readonly player: Player;
    readonly industry: Industry;
    readonly data: IIndustryLevelData;

    constructor(player: Player, industry: Industry, data: IIndustryLevelData) {
        super(IndustryTile);

        this.player = player;
        this.industry = industry;
        this.data = data;

        this.emptyOutlineStyle = bge.OutlineStyle.NONE;

        const count = data.count ?? 1;

        for (let i = 0; i < count; ++i) {
            this.add(new IndustryTile(player, industry, data));
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
