import * as bge from "bge-core";

import { Game } from "./game.js";
import { Card, IndustryCard, CityCard } from "./objects/card.js";
import { IndustryTile } from "./objects/industrytile.js";
import { LinkTile } from "./objects/linktile.js";
import { IndustryLevelSlot, PlayerBoard } from "./objects/playerboard.js";
import { ScoreToken } from "./objects/scoring.js";
import { IndustryLocation } from "./objects/industrylocation.js";
import { ALL_INDUSTRIES, Industry, City, Era } from "./types.js";
import { PlayerToken } from "./objects/playertoken.js";
import { LinkLocation } from "./objects/linklocation.js";
import { IPlayerState } from "./state.js";

export interface IDiscardAnyCardOptions<TReturn = void> {
    cards?: readonly Card[];
    message?: string;
    return?: TReturn;
    canAutoResolve?: boolean;
}

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
    @bge.display<Player>(function (ctx) { return { revealedFor: [this] }})
    readonly hand = new bge.Hand(Card, 20, {
        autoSort: Card.compare
    });

    @bge.display({ position: { x: 8.15, y: 5 }, label: "Discard" })
    @bge.display<Player>(function (ctx) { return {
        revealedFor: this.game.firstRound && this.discardPile.count === 1 ? [this] : undefined
    }})
    readonly discardPile = new bge.Deck(Card, { orientation: bge.CardOrientation.FACE_UP });

    @bge.display({ position: { x: -12.2 } })
    readonly playerBoard = new PlayerBoard(this);

    @bge.display({ position: { x: 15, y: 2 }, label: "Link Tiles" })
    readonly linkTiles = new bge.Deck(LinkTile, { orientation: bge.CardOrientation.FACE_UP })

    @bge.display({ position: { x: 15, y: 8 }, label: "Discarded\nTiles" })
    readonly developedIndustries = new bge.Deck(IndustryTile, { orientation: bge.CardOrientation.FACE_UP })

    playerToken: PlayerToken;
    victoryPointToken: ScoreToken;
    incomeToken: ScoreToken;

    private _zone: bge.Zone;

    private readonly _builtIndustries: Set<IndustryTile> = new Set();
    private readonly _builtLinks: Set<LinkTile> = new Set();

    get builtIndustries(): readonly IndustryTile[] {
        return [...this._builtIndustries];
    }

    get builtLinks(): readonly LinkTile[] {
        return [...this._builtLinks];
    }

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
    @bge.display<Player>(function (ctx) { return {
        fontColor: this.money < 0 ? bge.Color.parse("ff0000") : undefined
    }})
    get moneyDisplay() {
        return this.money >= 0 ? `£${this.money}` : `-£${-this.money}`;
    }

    @bge.display({ position: { x: 23, y: 2 }, label: "Spent This Round" })
    get spentDisplay() { return `£${this.spent}`; }

    override get color(): bge.Color {
        return Player.DEFAULT_COLORS[this.index];
    }

    addBuiltIndustry(tile: IndustryTile) {
        this._builtIndustries.add(tile);
    }

    removeBuiltIndustry(tile: IndustryTile) {
        this._builtIndustries.delete(tile);
    }

    addBuiltLink(tile: LinkTile) {
        this._builtLinks.add(tile);
    }

    removeBuiltLink(tile: LinkTile) {
        this._builtLinks.delete(tile);
    }

    get zone(): bge.Zone {
        if (this._zone != null) {
            return this._zone;
        }

        this._zone = new bge.Zone(57, this.playerBoard.height + 4);

        this._zone.label = this.name;
        this._zone.outlineColor = this.color;

        this._zone.children.addProperties(this);

        return this._zone;
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
        this.incomeToken.decreaseBrackets(delta);
    }

    increaseVictoryPoints(delta: number): void {
        this.victoryPointToken.increase(delta);
    }

    decreaseVictoryPoints(delta: number): void {
        this.victoryPointToken.decrease(delta);
    }

    get hasAnyBuiltTiles() {
        return this._builtIndustries.size > 0 || this._builtLinks.size > 0;
    }

    /**
     * Checks if the given location is adjacent to a player placed tile.
     * @param loc Location to check
     * @param player Player's network to check
     */
    isInNetwork(loc: LinkLocation | IndustryLocation): boolean {

        if (!this.hasAnyBuiltTiles) {
            return true;
        }

        let cities = loc instanceof LinkLocation ? loc.data.cities : [loc.city];

        for (let city of cities) {
            if (this.game.board.getIndustryLocations(city).some(x => x.tile?.player === this)) {
                return true;
            }

            if (this.game.board.getNeighbouringLinks(city).some(x => x.tile?.player === this)) {
                return true;
            }
        }

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

            if ((slot.data.canalOnly ?? false) && this.game.era !== Era.Canal) {
                return false;
            }
            
            if ((slot.data.railOnly ?? false) && this.game.era !== Era.Rail) {
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
            if (slot.count > 0) {
                return slot;
            }
        }

        return null;
    }

    takeNextIndustryTile(industry: Industry): IndustryTile {
        const slot = this.getNextIndustryLevelSlot(industry);
        return slot.draw();
    }

    getMatchingCards(location: IndustryLocation, industry: Industry): Card[] {
        if (!this.isInNetwork(location)) {
            industry = Industry.None;
        }

        return [...this.hand].filter(x => x.matchesIndustryLocation(location, industry));
    }

    /*
    async discardAnyCardOrUndo(options?: IDiscardAnyCardOptions<false>): Promise<boolean> {
        return await this.game.anyExclusive(() => [
            this.discardAnyCard({ ...options, canAutoResolve: false, return: true }),
            this.undo()
        ]);
    }
    */

    async discardAnyCard<TReturn = void>(options?: IDiscardAnyCardOptions<TReturn>): Promise<TReturn> {

        const cards = options?.cards ?? [...this.hand];
        const canAutoResolve = options?.canAutoResolve ?? false;

        let discardedCard: Card;

        if (canAutoResolve && cards.length > 1 && cards.every(x => x.equals(cards[0]))) {
            discardedCard = cards[0];
        } else {
            if (cards.length < this.hand.count) {
                for (let card of cards) {
                    this.hand.setSelected(card, true);
                }
            }

            const lastAction = this.game.action === this.game.actionsPerTurn - 1;
            const messagePostfix = lastAction ? " to end your turn" : "";
    
            discardedCard = await this.prompt.clickAny(cards, {
                message: options?.message ?? (cards.length < this.hand.count
                    ? `Discard a matching card${messagePostfix}`
                    : `Discard any card${messagePostfix}`),
                autoResolveIfSingle: canAutoResolve
            });
        }

        this.hand.setSelected(false);

        this.game.message.add("{0} discards {1}", this, discardedCard);
        
        await this.finishDiscardingCards([discardedCard]);

        return options?.return;
    }

    async discardAnyCards(count: number) {
        const lastAction = this.game.action === this.game.actionsPerTurn - 1;
        const messagePostfix = lastAction ? " and End Turn" : "";

        while (true) {
            const remaining = count - this.hand.selected.length;
            const clicked = await this.game.anyExclusive(() => [
                this.prompt.clickAny([...this.hand].filter(x => this.hand.selected.length < count || this.hand.getSelected(x)), {
                    message: remaining === 0
                        ? "Change your selection"
                        : `Select ${remaining}${remaining === count ? "" : " more"} card${remaining === 1 ? "" : "s"}`
                }),
                this.prompt.click(new bge.Button(`Discard${messagePostfix}`), {
                    return: null,
                    if: remaining === 0
                })
            ]);

            if (clicked instanceof Card) {
                this.hand.toggleSelected(clicked);
                continue;
            }

            break;
        }
        
        this.game.message.add("{0} discards {1}", this, this.hand.selected);

        await this.finishDiscardingCards(this.hand.selected);
    }

    private async finishDiscardingCards(cards: readonly Card[]) {
        this.hand.removeAll(cards);

        this.discardPile.addRange(cards.filter(x => !x.isWild));

        this.game.wildIndustryPile.addRange(cards.filter(x => x.isWild && x instanceof IndustryCard));
        this.game.wildLocationPile.addRange(cards.filter(x => x.isWild && x instanceof CityCard));

        await this.game.delay.beat();
    }
    
    async confirm(): Promise<true> {
        await this.prompt.click(new bge.Button("Confirm"));
        return true;
    }

    /*
    async confirmOrUndo(): Promise<boolean> {
        return await this.game.anyExclusive(() => [
            this.confirm(),
            this.undo()
        ]);
    }

    async undo(): Promise<false> {
        await this.prompt.click(new bge.Button("Undo"));
        return false;
    }

    async skip(): Promise<false> {
        await this.prompt.click(new bge.Button("Skip"));
        return false;
    }
    */
    
    serialize(): IPlayerState {
        return {
            money: this.money,
            spent: this.spent,
            income: this.incomeToken.value,
            victoryPoints: this.victoryPoints,
            links: this.linkTiles.count,

            hand: [...this.hand].map(x => x.index),
            discardPile: [...this.discardPile].map(x => x.index),
            developedIndustries: [...this.developedIndustries].map(x => ({
                industry: x.industry,
                level: x.data.level
            })),

            industries: this.playerBoard.serialize()
        };
    }

    deserialize(state: IPlayerState): void {
        this.money = state.money;
        this.spent = state.spent;
        this.incomeToken.moveTo(state.income);
        this.victoryPointToken.moveTo(state.victoryPoints);

        Card.deserializeTo(this.hand, state.hand);
        Card.deserializeTo(this.discardPile, state.discardPile);

        this.hand.setSelected(false);

        this.linkTiles.setCount(state.links, () => new LinkTile(this));

        if (this.developedIndustries.count > state.developedIndustries.length) {
            this.developedIndustries.drawRange(this.developedIndustries.count - state.developedIndustries.length);
        } else {
            this.developedIndustries.addRange(state.developedIndustries.slice(this.developedIndustries.count).map(x => new IndustryTile(this, x.industry, x.level)))
        }

        this.playerBoard.deserialize(state.industries);
    }

    updateBuiltTiles(): void {
        this._builtIndustries.clear();
        this._builtLinks.clear();

        for (let loc of this.game.board.industryLocations) {
            if (loc.tile == null || loc.tile.player != this) {
                continue;
            }

            this._builtIndustries.add(loc.tile);
        }
        
        for (let loc of this.game.board.linkLocations) {
            if (loc.tile == null || loc.tile.player != this) {
                continue;
            }

            this._builtLinks.add(loc.tile);
        }
    }
}
