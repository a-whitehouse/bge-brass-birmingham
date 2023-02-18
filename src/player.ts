import * as bge from "bge-core";
import { PlayingCard } from "bge-playingcard";

/**
 * @summary Custom player class for your game.
 * @description It can contain any objects the player owns, and properties like their score or health.
 */
export class Player extends bge.Player {

    finalScore?: number;

    /**
     * @summary The player's personal hand of cards.
     * @description It has a width in centimetres, and options like which way the cards face, and how to sort them.
     */
    @bge.display()
    readonly hand = new bge.Hand(PlayingCard, 20, {
        orientation: bge.CardOrientation.FaceUp,
        autoSort: PlayingCard.autoSortCompare
    });

    createZone(): bge.Zone {
        const zone = new bge.Zone(this.hand.width + 2, this.hand.height + 2);

        zone.children.addProperties(this);

        return zone;
    }
}
