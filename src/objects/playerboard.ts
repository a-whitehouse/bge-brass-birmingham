import * as bge from "bge-core";

import * as playerboard from "../data/playerboard";
import INDUSTRIES from "../data/industrylevels";

import { Player } from "../player";
import { IndustryTile } from "./industrytile";

@bge.width(playerboard.WIDTH)
@bge.height(playerboard.HEIGHT)
@bge.thickness(0.5)
export class PlayerBoard extends bge.Card {

    constructor(player: Player) {
        super();

        this.front.image = bge.Image.simple("https://iili.io/HMBsWQf.jpg");

        for (let [industry, levels] of INDUSTRIES) {
            for (let level of levels) {
                this.children.add(new IndustryTile(player, industry, level), {
                    position: { x: level.posX, y: level.posY }
                });
            }
        }
    }
}
