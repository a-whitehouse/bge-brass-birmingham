
import * as bge from "bge-core";

import { ResourceToken } from "./resourcetoken";
import { MerchantTile } from "./merchanttile";

import { IMerchantLocationData, MerchantBeerReward, Resource } from "../types";
import { Player } from "../player";
import { developOnce } from "../actions/develop";
import { IndustryTile } from "./industrytile";

export class MerchantLocation extends bge.Zone {
    readonly data: IMerchantLocationData;

    @bge.display()
    marketBeer: ResourceToken;

    @bge.display()
    tile: MerchantTile;

    constructor(data: IMerchantLocationData) {
        super(2.25, 2.25);

        this.data = data;

        this.outlineStyle = bge.OutlineStyle.NONE;

        this.children.getOptions("marketBeer").position = {
            x: data.beerPosX - data.posX,
            y: data.beerPosY - data.posY
        };
    }

    async consumeBeer(targetTile: IndustryTile) {
        if (this.marketBeer == null) {
            throw new Error("Merchant beer already consumed");
        }

        const player = targetTile.player;
        const game = player.game;
        
        targetTile.resources.push(this.marketBeer);
        this.marketBeer = null;

        await game.delay.beat();

        switch (this.data.beerReward) {
            case MerchantBeerReward.Develop:
                try {
                    await developOnce(game, player);
                } catch {
                    game.message.add(`Unable to develop, not enough money`);
                    await game.delay.beat();
                }

                break;

            case MerchantBeerReward.FiveCoins:
                player.money += 5;
                await game.delay.beat();
                break;

            case MerchantBeerReward.TwoIncome:
                player.increaseIncome(2);
                await game.delay.beat();
                break;

            case MerchantBeerReward.ThreeVictoryPoints:
                player.increaseVictoryPoints(3);
                await game.delay.beat();
                break;

            case MerchantBeerReward.FourVictoryPoints:
                player.increaseVictoryPoints(4);
                await game.delay.beat();
                break;
        }
    }
}
