import * as bge from "bge-core";
import { Game } from "../game.js";

import { Player } from "../player.js";


@bge.width(4.3)
@bge.height(4.3)
@bge.thickness(0.25)
@bge.cornerRadius(2.15)
export class PlayerToken extends bge.Card {
    readonly player: Player;

    constructor(player: Player) {
        super();

        this.player = player;

        const url = "https://iili.io/HVo4SkJ.jpg";

        this.front.image = bge.Image.tile(url, 2, 4, 0, player.index);
        this.back.image = bge.Image.tile(url, 2, 4, 1, player.index);

    }
}

export class PlayerTokenSlot extends bge.Zone {
    private readonly _game: Game;

    readonly index: number;
    
    @bge.display()
    get playerToken() {
        return this._game.turnOrder == null ? null : this._game.turnOrder[this.index]?.playerToken;
    }

    @bge.display({ position: { x: 4.5, y: -0.5 }, fontScale: 0.5 })
    get moneySpent() { return this.playerToken == null || this._game.turnOrder.indexOf(this.playerToken.player) > this._game.turn ? undefined : `£${this.playerToken.player.spent}`; }

    constructor(game: Game, index: number) {
        super(4, 4);

        this._game = game;
        this.index = index;

        this.outlineStyle = bge.OutlineStyle.NONE;
        this.hideIfEmpty = true;
    }
}
