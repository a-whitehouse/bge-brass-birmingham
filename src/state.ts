import { Era, Industry, Resource } from "./types";
import { MerchantTileValue } from "./objects/merchanttile";

export interface IGameState {
    era: Era;
    turnOrder: PlayerIndex[];
    turn: number;
    action: number;

    board: IBoardState;
    players: IPlayerState[];
}

export type CardIndex = number;
export type PlayerIndex = number;

export interface IBoardState {
    drawPile: CardIndex[];
    wildIndustries: number;
    wildLocations: number;
    industryLocations: IIndustryTileState[];
    linkLocations: (PlayerIndex | null)[];
    merchants: IMerchantState[];
    coalMarketTokens: number;
    ironMarketTokens: number;
}

export interface IIndustryTileState {
    player: PlayerIndex;
    industry: Industry;
    level: number;
    flipped: boolean;
    resources: Resource[];
}

export interface IPlayerState {
    money: number;
    spent: number;
    income: number;
    victoryPoints: number;
    links: number;

    hand: CardIndex[];
    discardPile: CardIndex[];
    developedIndustries: IDevelopedIndustryState[];

    industries: IPlayerIndustryState[];
}

export interface IPlayerIndustryState {
    industry: Industry;
    tiles: number;
}

export interface IDevelopedIndustryState {
    industry: Industry;
    level: number;
}

export interface IMerchantState {
    value: MerchantTileValue;
    hasBeer: boolean;
}
