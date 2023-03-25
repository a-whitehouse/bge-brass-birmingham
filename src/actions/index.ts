import * as bge from "bge-core";

import { IndustryLocation } from "../objects/industrylocation.js";
import { ResourceMarket } from "../objects/resourcemarket.js";

import { Game } from "../game.js";
import { Player } from "../player.js";
import { Resource, Era } from "../types.js";

import { takeLoan } from "./takeloan.js";
import { scout } from "./scout.js";
import { buildLink } from "./buildlink.js";
import { buildIndustry } from "./buildindustry.js";
import { develop } from "./develop.js";
import { sell } from "./sell.js";
import { IResourceSources } from "../objects/gameboard.js";
import { LinkLocation } from "../objects/linklocation.js";
import { ResourceToken } from "../objects/resourcetoken.js";

const console = bge.Logger.get("player-turn");

const ALLOW_DRAIN_MARKETS = false;

export enum PlayerActionResult {
    RESOLVED,
    RESTART_ACTION,
    RESTART_TURN
}

export async function playerAction(game: Game, player: Player): Promise<PlayerActionResult> {
    game.message.clear();
    game.message.set("It's {0}'s turn, action {1} of {2}", player, game.action + 1, game.actionsPerTurn);

    let result: PlayerActionResult;

    if (game.action > 0) {
        const restartTurnPromise = player.prompt.click(new bge.Button("Restart Turn"), {
            order: 1001
        });

        restartTurnPromise.then(() => {
            result = PlayerActionResult.RESTART_TURN;
            game.cancelAllPromises("Action undone");
        }).catch(() => {
            // Handled
        });
    }

    try {
        await game.anyExclusive(() => {
            // Show an undo button after the player has clicked on anything
            game.promiseGroup.catch(async reason => {
                try {
                    await player.prompt.click(new bge.Button("Restart Action"), {
                        order: 1000
                    });
                } catch {
                    // Handled
                    return;
                }                

                result = PlayerActionResult.RESTART_ACTION;
                game.cancelAllPromises("Action undone");
            });

            return [
                buildIndustry(game, player),
                buildLink(game, player),
                takeLoan(game, player),
                scout(game, player),
                develop(game, player),
                sell(game, player),
                drainMarket(game, player, game.board.coalMarket),
                drainMarket(game, player, game.board.ironMarket)
            ];
        });

        return PlayerActionResult.RESOLVED;
    } catch (e) {
        if (result !== undefined) {
            return result;
        }

        throw e;
    }
}

export async function startRailEra(game: Game) {
    game.message.set("The {0} era begins!", Era[Era.Rail]);

    game.era = Era.Rail;

    for (let player of game.players) {

        // Flip links to be on the rail side

        player.linkTiles.setOrientation(bge.CardOrientation.FACE_DOWN);

        // Remove level 1 industries

        for (let industry of player.builtIndustries.filter(x => x.data.level === 1)) {
            await industry.location.setTile(null);
        }

        // Return discarded cards to draw pile

        game.drawPile.addRange(player.discardPile.removeAll());

        await game.delay.beat();
    }

    // Refill market beer

    for (let merchant of game.board.merchantLocations) {
        if (merchant.tile != null && merchant.tile.industries.length > 0 && merchant.marketBeer == null) {
            merchant.marketBeer = new ResourceToken(Resource.Beer);
        }
    }

    // Shuffle and deal starting hands

    game.drawPile.shuffle(game.random);
    game.drawPile.deal(game.players.map(x => x.hand), 8);

    await game.delay.beat();
}

export async function grantIncome(game: Game, players: Player[]) {
    for (let player of players) {
        if (player.income > 0) {
            game.message.set("{0} gains £{1} of income", player, player.income);
            player.money += player.income;

            await game.delay.short();
        } else if (player.income < 0) {
            game.message.set("{0} pays £{1} in interest", player, -player.income);
            player.money += player.income;
            
            await game.delay.short();

            while (player.money < 0) {
                game.message.set("{0} is £{1} in debt!", player, -player.money);
                await game.delay.beat();

                const builtIndustries = player.builtIndustries.filter(x => (x.data.cost.coins ?? 0) > 0);
                if (builtIndustries.length > 0) {
                    const toSell = await player.prompt.clickAny(builtIndustries, {
                        message: "Select a built industry to sell to repay your debt",
                        autoResolveIfSingle: true
                    });

                    game.message.add("{0} sells their {1} to recover £{2}",
                        player, toSell, toSell.data.cost.coins);

                    toSell.location.setTile(null);
                    player.money += toSell.data.cost.coins;
                    await game.delay.short();
                    continue;
                }

                game.message.add("{0} loses {1} victory points as they have no built industries to sell!",
                    player, -player.money);

                player.decreaseVictoryPoints(-player.money);
                player.money = 0;

                await game.delay.short();
            }
        }
    }
}

export async function reorderPlayers(game: Game) {
    let tmp: Player;

    let successfulComparisons = 0;

    const players = game.turnOrder;

    while (successfulComparisons < players.length - 1) {
        successfulComparisons = 0;

        for (let i = 0; i < players.length - 1; i++) {
            if (players[i].spent > players[i + 1].spent) {
                tmp = players[i];

                players[i] = players[i + 1];
                players[i + 1] = tmp;
            }
            else {
                ++successfulComparisons;
            }
        }
    }
    
    await game.delay.beat();
}

export async function resetSpentMoney(game: Game) {
    for (let player of game.turnOrder) {
        player.spent = 0;
    }

    await game.delay.beat();
}

async function drainMarket(game: Game, player: Player, market: ResourceMarket) {
    if (!ALLOW_DRAIN_MARKETS) {
        await Promise.reject("Draining markets is disabled");
    }

    if (market.isEmpty) {
        await Promise.reject("Market is empty");
    }

    await player.prompt.click(new bge.Button(`Drain ${Resource[market.resource]} market`));

    market.takeRange(market.count);
}

/**
 * Prompts the given player to select which resources to consume, up to the given amount.
 */
export async function consumeResources(player: Player, destination: IndustryLocation | LinkLocation,
	resource: Resource, amount: number, sources: IResourceSources, market?: ResourceMarket) {

	while (sources.tiles.length > 0 && amount > 0) {
		const distance = sources.tiles[0].distance;
		const choices = new Set(sources.tiles.filter(x => x.distance === distance).map(x => x.tile));

		let tile = await player.prompt.clickAny(choices, {
			message: `Select ${(resource === Resource.Iron ? "an" : "a")} ${Resource[resource]} to consume`,
			autoResolveIfSingle: true
		});

		sources.tiles.splice(sources.tiles.findIndex(x => x.tile === tile), 1);

		console.info(`Consuming ${Resource[resource]} from ${tile.name}`);

		await tile.consumeResource(destination.spentResources);

		--amount;

		await player.game.delay.beat();
	}

	if (amount > 0) {
		if (market == null) {
			throw new Error("No market was given!");
		}

		const cost = market.getCost(amount);

		destination.spentResources.push(...market.takeRange(amount));

		console.info(`Spending £${cost} to buy ${amount} ${Resource[resource]} from the market`);

		player.spendMoney(cost);

		await player.game.delay.beat();
	}
}