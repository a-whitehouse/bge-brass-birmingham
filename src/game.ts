import * as bge from "bge-core";
import { PlayingCard, PokerHand } from "bge-playingcard";
import { Player } from "./player";
import { TableCenter } from "./table";
import main from "./actions";

/**
 * @summary This class contains the meat of your game.
 * @details In this example game, players take turns discarding cards, and then either drawing from a Deck or a Hand.
 */
export class CardGame extends bge.Game<Player> {
    /**
     * Draw pile that will gradually deplete during the game.
     */
    readonly drawPile = new bge.Deck(PlayingCard, {
        orientation: bge.CardOrientation.FaceDown
    });

    /**
     * Players discard cards to this pile.
     */
    readonly discardPile = new bge.Deck(PlayingCard, {
        orientation: bge.CardOrientation.FaceUp
    });
    
    /**
     * This will contain three face-up cards that players can choose from.
     */
    readonly shop = new bge.Hand(PlayingCard, 20, {
        orientation: bge.CardOrientation.FaceUp
    });

    /**
     * This zone displays all the shared objects in the middle of the table.
     */
    @bge.display()
    readonly tableCenter = new TableCenter(this);

    /**
     * Button that we can show in the top bar for players to click in a prompt.
     */
    readonly discardButton = new bge.Button("Discard");

    /**
     * Game runners expect games to have a public parameterless constructor, like this.
     */
    constructor() {
        // We need to tell Game<TPlayer> how to construct a player here.
        super(Player);
    }

    protected async onRun(): Promise<bge.IGameResult> {
        await main(this);

        return {
            scores: this.players.map(x => x.finalScore ?? 0)
        };
    }
}
