import { Era, Industry, Resource } from "./types";
import CARDS from "./data/cards";

export interface IGameState {
    era: Era;
    turnOrder: PlayerIndex[];
    turn: number;
    action: number;
    deck: CardIndex[];
    board: IBoardState;
    players: IPlayerState[];
}

export type CardIndex = keyof typeof CARDS;
export type PlayerIndex = number;

export interface IBoardState {
    industryLocations: IIndustryTileState[];
    linkLocations: ILinkTileState[];
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

export interface ILinkTileState {
    player: PlayerIndex;
}

export interface IPlayerState {
    money: number;
    spent: number;
    income: number;
    victoryPoints: number;
    hand: CardIndex[];
    discardPile: CardIndex[];
    developedIndustries: IDevelopedIndustryState[];
}

export interface IDevelopedIndustryState {
    industry: Industry;
    level: number;
}
