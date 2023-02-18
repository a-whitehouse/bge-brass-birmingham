import * as bge from "bge-core";

import { PlayingCard, PokerHand } from "bge-playingcard";

import { CardGame } from "../game";
import { Player } from "../player";

export default async function main(game: CardGame) {

    await setup(game);

    let player = game.random.item(game.players);

    while (game.drawPile.count > 0) {
        await playerTurn(game, player);
        player = game.getNextPlayer(player);
    }

    await finalScoring(game);
}

async function setup(game: CardGame) {

    game.addPlayerZones(x => x.createZone(), {
        avoid: game.tableCenter.footprint
    });

    game.message.set("Setting up the deck...");

    game.discardPile.addRange(PlayingCard.generateDeck());

    await game.delay.short();

    game.discardPile.shuffle(game.random);
    game.drawPile.addRange(game.discardPile.removeAll());

    await game.delay.short();
    
    game.message.set("Dealing starting hands...");

    game.drawPile.deal(game.players.map(x => x.hand), 5);
    
    await game.delay.short();

    game.message.set("Filling the {0}", "Shop");

    game.shop.addRange(game.drawPile.drawRange(3));
    
    await game.delay.short();

    game.message.clear();
}

async function playerTurn(game: CardGame, player: Player) {

    game.message.set("It's {0}'s turn to discard a card!", player);
    
    while (!await game.anyExclusive(() => [
        changeSelection(game, player),
        player.prompt.click(game.discardButton, {
            if: player.hand.selected.length === 1,
            return: true
        })
    ]));
    
    const selected = player.hand.selected[0];

    game.message.set("{0} discards their {1}!", player, selected);

    game.discardPile.add(player.hand.remove(selected));

    await game.delay.short();

    game.message.set("Now {0} can draw from the {1} or the {2}", player, "Draw Pile", "Shop");

    const clicked = await game.anyExclusive(() => [
        player.prompt.click(game.drawPile, {
            message: { format: "Click on the {0}", args: ["Draw Pile"] }
        }),
        player.prompt.clickAny(game.shop, {
            message: { format: "Click on any card in the {0}", args: ["Shop"] }
        })
    ]);
    
    if (clicked instanceof PlayingCard) {
        game.shop.remove(clicked);
        player.hand.add(clicked);
        
        game.message.set("{0} takes a {1} from the {2}!", player, clicked, "Shop");
    
        await game.delay.beat();

        game.shop.add(game.drawPile.draw());

        await game.delay.beat();
    } else {
        const card = game.drawPile.draw();
        player.hand.add(card);
        
        game.message.set("{0} draws from the {1}, refilling the {2}!", player, "Draw Pile", "Shop");
    
        await game.delay.beat();

        game.discardPile.addRange(game.shop.removeAll());

        await game.delay.beat();

        game.shop.addRange(game.drawPile.drawRange(3));

        await game.delay.beat();
    }
}

async function changeSelection(game: CardGame, player: Player): Promise<false> {

    const clicked = await player.prompt.clickAny(player.hand.unselected, {
        message: player.hand.selected.length === 0
            ? "Select a card to discard"
            : "Select a different card"
    });
    
    player.hand.setSelected(false);
    player.hand.setSelected(clicked, true);

    return false;
}

async function finalScoring(game: CardGame) {

    const pokerHands = game.players.map(x => ({
        player: x,
        hand: PokerHand.getBest(x.hand)
    })).sort((a, b) => PokerHand.compare(a.hand, b.hand));

    game.message.set("Final scoring!");

    await game.delay.short();

    let index = 0;

    for (let scoreInfo of pokerHands) {
        game.discardPile.addRange(game.shop.removeAll());

        await game.delay.beat();

        scoreInfo.player.finalScore = ++index;
        
        game.message.set("{0} has a {1}!", scoreInfo.player, scoreInfo.hand);
        
        scoreInfo.player.hand.removeAll();
        game.shop.addRange(scoreInfo.hand.cards);

        await game.delay.long();
    }

    game.discardPile.addRange(game.shop.removeAll());
    
    await game.delay.beat();
    
    game.message.set("Thanks for playing!");
}