import * as bge from "bge-core";

import { Player } from "../player";


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
    @bge.display()
    playerToken: PlayerToken;

    /*
    TODO: when we have text scaling
    @bge.display({ position: { x: 5 } })
    get moneySpent() { return `£${this.playerToken?.player.spent}`; }
    */

    constructor() {
        super(4, 4);

        this.outlineStyle = bge.OutlineStyle.NONE;
        this.hideIfEmpty = true;
    }
}
