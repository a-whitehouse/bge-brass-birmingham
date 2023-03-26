
import * as bge from "bge-core";

import { ResourceToken } from "./resourcetoken.js";
import { MerchantTile, MerchantTileValue } from "./merchanttile.js";

import { IMerchantLocationData, MerchantBeerReward, Resource } from "../types.js";
import { developOnce } from "../actions/develop.js";
import { IndustryTile } from "./industrytile.js";
import { IMerchantState } from "../state.js";
import { GameBoard } from "./gameboard.js";

export class MerchantLocation extends bge.Zone {
    private readonly _board: GameBoard;
    readonly data: IMerchantLocationData;

    @bge.display<MerchantLocation>(function (ctx) { return {
        position: {
            x: this.data.beerPosX - this.data.posX,
            y: this.data.beerPosY - this.data.posY
        }
    }})
    marketBeer: ResourceToken;

    @bge.display()
    tile: MerchantTile;

    constructor(board: GameBoard, data: IMerchantLocationData) {
        super(2.25, 2.25);

        this._board = board;
        this.data = data;

        this.outlineStyle = bge.OutlineStyle.NONE;
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

    serialize(): IMerchantState | null {
        if (this.tile == null) {
            return null;
        }

        return {
            value: this.tile.value,
            hasBeer: this.marketBeer != null
        };
    }

    deserialize(state: IMerchantState | null): void {
        if (state == null) {
            this.tile = null;
            this.marketBeer = null;
            return;
        }

        this.tile = this.tile?.value === state.value ? this.tile : new MerchantTile(state.value);
        this.marketBeer = state.hasBeer ? this.marketBeer ?? new ResourceToken(Resource.Beer) : null;
    }
}
