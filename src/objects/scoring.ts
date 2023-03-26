import * as bge from "bge-core";
import { LinearArrangement } from "bge-core";

import * as scoretrack from "../data/scoretrack.js"

import { Player } from "../player.js";

export enum ScoreTokenKind {
    VICTORY_POINTS,
    INCOME
}

export class ScoreToken extends bge.Token {
    private _slot: ScoreSlot;
    private _value: number;

    readonly track: ScoreTrack;
    readonly kind: ScoreTokenKind;

    get value(): number {
        return this._value;
    }

    get slot(): ScoreSlot {
        return this._slot;
    }

    constructor(track: ScoreTrack, player: Player, kind: ScoreTokenKind) {
        super({
            sides: kind === ScoreTokenKind.INCOME ? 24 : 6,
            thickness: 0.25,
            scale: 1.5,
            color: player.color
        });

        this.track = track;
        this.kind = kind;
    }

    increase(delta: number): void {
        if (delta < 0) {
            throw new Error("Must increase by at least 0");
        }

        this.moveTo(this.value + delta);
    }

    decrease(delta: number): void {
        if (delta < 0) {
            throw new Error("Must decrease by at least 0");
        }

        if (this.kind === ScoreTokenKind.INCOME) {
            throw new Error("Income can only decrease in brackets!");
        }

        this.moveTo(Math.max(0, this.value - delta));
    }
    
    decreaseBrackets(delta: number): void {
        if (delta < 0) {
            throw new Error("Must decrease by at least 0");
        }

        if (this.kind !== ScoreTokenKind.INCOME) {
            throw new Error("Can only decrease income by brackets!");
        }

        let lastIncome = this.slot.income;

        for (var i = this.value - 1; i >= 0 && delta > 0; --i) {
            const nextIncome = this.track.slots[i].income;

            if (nextIncome >= lastIncome) {
                continue;
            }

            lastIncome = nextIncome;

            if (--delta <= 0) {
                this.moveTo(i);
                return;
            }
        }

        this.moveTo(0);
    }

    moveTo(value: number): void {
        if (this.kind === ScoreTokenKind.INCOME) {
            value = Math.max(0, Math.min(this.track.slots.length - 1, value));
        } else {
            value = Math.max(0, value);
        }

        if (this.value === value) {
            return;
        }

        this._value = value;

        this._slot?.remove(this);
        this._slot = this.track.slots[value % this.track.slots.length];
        this._slot?.add(this);
    }
}

export class ScoreTrack extends bge.Zone {
    readonly slots: readonly ScoreSlot[];

    constructor() {
        super(0, 0);

        const slots: ScoreSlot[] = [];

        let score = 0;

        for (let incomeIndex = 0; incomeIndex < scoretrack.INCOME_LEVELS.length; ++incomeIndex) {
            const incomeData = scoretrack.INCOME_LEVELS[incomeIndex];

            for (let i = 0; i < incomeData.slotCount; ++i, ++score) {
                const slot = new ScoreSlot(score, incomeData.income);
                const slotData = scoretrack.SCORE_SLOTS[score];
                this.children.add(slot, {
                    position: new bge.Vector3(slotData.posX, slotData.posY)
                });
                slots.push(slot);
            }
        }

        this.slots = slots;

        this.outlineStyle = bge.OutlineStyle.NONE;
        this.hideIfEmpty = true;
    }

    createScoreToken(player: Player, kind: ScoreTokenKind): ScoreToken {
        const token = new ScoreToken(this, player, kind);

        switch (kind) {
            case ScoreTokenKind.VICTORY_POINTS:
                token.moveTo(0);
                break;

            case ScoreTokenKind.INCOME:
                token.moveTo(10);
                break;
        }

        return token;
    }
}

export class ScoreSlot extends bge.Zone {
    readonly victoryPoints: number;
    readonly income: number;

    @bge.display({
        arrangement: new LinearArrangement({
            axis: "z"
        })
    })
    readonly tokens: ScoreToken[] = [];

    constructor(victoryPoints: number, income: number) {
        super(1, 1);

        this.victoryPoints = victoryPoints;
        this.income = income;

        this.outlineStyle = bge.OutlineStyle.NONE;
        this.hideIfEmpty = true;
    }

    add(token: ScoreToken): void {
        this.tokens.push(token);
    }

    remove(token: ScoreToken): void {
        this.tokens.splice(this.tokens.indexOf(token), 1);
    }
}
