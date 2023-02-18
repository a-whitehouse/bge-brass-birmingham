import * as bge from "bge-core";

/**
 * @summary Custom player class for your game.
 * @description It can contain any objects the player owns, and properties like their score or health.
 */
export class Player extends bge.Player {

    /**
     * This player's total score.
     */
    get victoryPoints(): number {
        return 0;
    }

    createZone(): bge.Zone {
        const zone = new bge.Zone(20, 10);

        zone.children.addProperties(this);

        return zone;
    }
}
