import * as bge from "bge-core";

import * as playerboard from "../data/playerboard";
import INDUSTRIES from "../data/industrylevels";

import { Player } from "../player";
import { IndustryTile } from "./industrytile";
import { IIndustryLevelData, Industry } from "../types";
import { IPlayerIndustryState } from "../state";

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
            this.add(new IndustryTile(player, industry, data.level));
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

    serialize(): IPlayerIndustryState[] {
        return [...this.industryLevels].map(([industry, slots]) => ({
            industry: industry,
            tiles: slots.reduce((s, x) => s + x.count, 0)
        }));
    }

    deserialize(state: IPlayerIndustryState[]): void {
        for (let industryState of state) {
            const slots = this.industryLevels.get(industryState.industry);

            let remaining = industryState.tiles;

            for (let i = slots.length - 1; i >= 0; --i) {
                const slot = slots[i];
                const slotCount = slot.data.count;

                slot.setCount(Math.max(0, Math.min(remaining, slotCount)),
                    () => new IndustryTile(slot.player, slot.industry, slot.data.level));

                remaining -= slotCount;
            }
        }
    }
}
