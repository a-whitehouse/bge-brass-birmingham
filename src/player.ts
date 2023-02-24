import * as bge from "bge-core";
import { CardOrientation } from "bge-core";
import { Card } from "./objects/card";
import { PlayerBoard } from "./objects/playerboard";

/**
 * @summary Custom player class for your game.
 * @description It can contain any objects the player owns, and properties like their score or health.
 */
export class Player extends bge.Player {
    static readonly DEFAULT_COLORS: readonly bge.Color[] = [
        bge.Color.parse("9259F0"),
        bge.Color.parse("FFFFFF"),
        bge.Color.parse("F05B4B"),
        bge.Color.parse("E8D041")
    ];

    @bge.display({ position: { x: 15, y: -7 }, label: "Hand" })
    readonly hand = new bge.Hand(Card, 20);

    @bge.display({ position: { x: 8.15, y: 5 }, label: "Discard" })
    readonly discardPile = new bge.Deck(Card, { orientation: CardOrientation.FACE_UP });

    @bge.display({ position: { x: -12.2 }})
    readonly playerBoard = new PlayerBoard(this);

    /**
     * This player's total score.
     */
    get victoryPoints(): number {
        return 0;
    }

    override get color(): bge.Color {
        return Player.DEFAULT_COLORS[this.index];
    }

    createZone(): bge.Zone {
        const zone = new bge.Zone(57, this.playerBoard.height + 4);

        zone.label = this.name;
        zone.outlineColor = this.color;

        zone.children.addProperties(this);
        zone.children.getOptions("hand").revealedFor = [this];
        zone.children.getOptions("discardPile").revealedFor = [this];

        return zone;
    }
}
