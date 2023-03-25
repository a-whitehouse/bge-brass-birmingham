import { Game } from "../game.js";
import { Card, CityCard, IndustryCard } from "../objects/card.js";
import { LinkTile } from "../objects/linktile.js";
import { MerchantTile } from "../objects/merchanttile.js";
import { PlayerToken } from "../objects/playertoken.js";
import { ResourceToken } from "../objects/resourcetoken.js";
import { ScoreTokenKind } from "../objects/scoring.js";
import { ALL_INDUSTRIES, City, Resource } from "../types.js";

export async function setup(game: Game) {
    for (let player of game.players) {
        player.victoryPointToken = game.scoreTrack.createScoreToken(player, ScoreTokenKind.VICTORY_POINTS);
        player.incomeToken = game.scoreTrack.createScoreToken(player, ScoreTokenKind.INCOME);

        player.playerToken = new PlayerToken(player);

        for (let i = 0; i < 15; ++i) {
            player.linkTiles.add(new LinkTile(player));
        }
    }

    // Merchants
    const merchantTiles = [...MerchantTile.generateDeck(game.players.length)];

    game.random.shuffle(merchantTiles);

    for (let merchantLocation of game.board.merchantLocations) {
        if (merchantLocation.data.minPlayers > game.players.length) {
            continue;
        }

        merchantLocation.tile = merchantTiles.pop();

        if (merchantLocation.tile.industries.length > 0) {
            merchantLocation.marketBeer = new ResourceToken(Resource.Beer);
        }
    }

    // Deal cards etc
    game.drawPile.addRange(Card.generateDeck(game.players.length));
    game.drawPile.shuffle(game.random);

    for (let i = 0; i < game.players.length; ++i) {
        game.wildIndustryPile.add(new IndustryCard(ALL_INDUSTRIES, 2));
        game.wildLocationPile.add(new CityCard(City.Any, 1));
    }

    game.drawPile.deal(game.players.map(x => x.discardPile));
    game.drawPile.deal(game.players.map(x => x.hand), 8);

    await game.delay.beat();
}
