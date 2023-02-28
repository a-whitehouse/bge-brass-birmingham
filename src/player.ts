import * as bge from "bge-core";

import { Game } from "./game";
import { Card, IndustryCard, CityCard } from "./objects/card";
import { IndustryTile } from "./objects/industrytile";
import { LinkTile } from "./objects/linktile"
import { IndustryLevelSlot, PlayerBoard } from "./objects/playerboard";
import { ScoreToken } from "./objects/scoring";
import { IndustryLocation } from "./objects/industrylocation";
import { ALL_INDUSTRIES, Industry, City } from "./types";

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
    readonly hand = new bge.Hand(Card, 20, {
        autoSort: Card.compare
    });

    @bge.display({ position: { x: 8.15, y: 5 }, label: "Discard" })
    readonly discardPile = new bge.Deck(Card, { orientation: bge.CardOrientation.FACE_UP });

    @bge.display({ position: { x: -12.2 } })
    readonly playerBoard = new PlayerBoard(this);

    @bge.display({ position: { x: 15, y: 5 }, label: "Link Tiles" })
    readonly linkTiles = new bge.Deck(LinkTile, { orientation: bge.CardOrientation.FACE_UP })

    victoryPointToken: ScoreToken;
    incomeToken: ScoreToken;

    money: number = 17;
    spent: number = 0;

    game: Game;

    /**
     * This player's total score.
     */
    get victoryPoints(): number {
        return this.victoryPointToken?.value ?? 0;
    }

    get income(): number {
        return this.incomeToken?.slot.income ?? 0;
    }

    @bge.display({ position: { x: 23, y: 8 }, label: "Money" })
    get moneyDisplay() { return `£${this.money}`; }

    @bge.display({ position: { x: 23, y: 2 }, label: "Spent This Round" })
    get spentDisplay() { return `£${this.spent}`; }

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

    spendMoney(amount: number): void {
        if (this.money < amount) {
            throw new Error("Not enough money!");
        }

        this.spent += amount;
        this.money -= amount;
    }

    increaseIncome(delta: number): void {
        this.incomeToken.increase(delta);
    }

    decreaseIncome(delta: number): void {
        this.incomeToken.decrease(delta);
    }

    increaseVictoryPoints(delta: number): void {
        this.incomeToken.increase(delta);
    }

    get hasBuiltAnything(): boolean {
        return false;
    }

    /**
     * Gets a bit flag value with a 1 for each industry that this
     * player can afford to build.
     */
    get availableIndustries(): Industry[] {
        return ALL_INDUSTRIES.filter(industry => {
            const slot = this.getNextIndustryLevelSlot(industry);

            if (slot == null) {
                return false;
            }

            return true;
        });
    }

    get hasWildCardInHand(): boolean {
        for (let card of this.hand) {
            if (card.isWild) {
                return true;
            }
        }

        return false;
    }

    getNextIndustryLevelSlot(industry: Industry): IndustryLevelSlot | null {
        const slots = this.playerBoard.industryLevels.get(industry);

        for (let slot of slots) {
            if (slot.tiles.count > 0) {
                return slot;
            }
        }

        return null;
    }

    takeNextIndustryTile(industry: Industry): IndustryTile {
        const slot = this.getNextIndustryLevelSlot(industry);
        return slot.tiles.draw();
    }

    getMatchingCards(location: IndustryLocation, industry?: Industry): Card[] {
        return [...this.hand].filter(x => x.matchesIndustryLocation(location, industry));
    }

    async discardAnyCard(cards?: readonly Card[]) {

        cards ??= [...this.hand];

        let discardedCard: Card;
        
        switch (cards.length) {
            case 0:
                throw new Error("There should be at least one matching card after building.");

            case 1:
                discardedCard = cards[0];
                break;

            default:
                if (cards.every(x => x.equals(cards[0]))) {
                    discardedCard = cards[0];
                    break;
                }

                if (cards.length < this.hand.count) {
                    for (let card of cards) {
                        this.hand.setSelected(card, true);
                    }
                }

                discardedCard = await this.prompt.clickAny(cards, {
                    message: cards.length < this.hand.count
                        ? "Discard a matching card"
                        : "Discard any card"
                });

                this.hand.setSelected(false);
                break;
        }

        await this.finishDiscardingCards([discardedCard]);
    }

    async discardAnyCards(count: number) {
        while (true) {
            const clicked = await this.game.anyExclusive(() => [
                this.prompt.clickAny([...this.hand].filter(x => this.hand.selected.length < count || this.hand.getSelected(x)), {
                    message: "Discard any three cards"
                }),
                this.prompt.click(new bge.Button("Discard"), {
                    return: null,
                    if: this.hand.selected.length === count
                })
            ]);

            if (clicked instanceof Card) {
                this.hand.toggleSelected(clicked);
                continue;
            }

            break;
        }

        await this.finishDiscardingCards(this.hand.selected);
    }

    private async finishDiscardingCards(cards: readonly Card[]) {
        this.hand.removeAll(cards);

        this.discardPile.addRange(cards.filter(x => !x.isWild));

        this.game.wildIndustryPile.addRange(cards.filter(x => x.isWild && x instanceof IndustryCard));
        this.game.wildLocationPile.addRange(cards.filter(x => x.isWild && x instanceof CityCard));
        
        await this.game.delay.beat();
    }
}
