/**
 * Named cities on the board.
 */
export enum City {
    None,

    Belper,
    Derby,
    Leek,
    StokeOnTrent,
    Stone,
    Uttoxeter,
    Stafford,
    BurtonOnTrent,
    Cannock,
    Tamworth,
    Walsall,
    Coalbrookdale,
    Dudley,
    Kidderminster,
    Wolverhampton,
    Worcester,
    Birmingham,
    Coventry,
    Nuneaton,
    Redditch,
    Warrington,
    Nottingham,
    Shrewsbury,
    Gloucester,
    Oxford,

    /**
     * Location of a brewery near Cannock.
     */
    Farm1,

    /**
     * Location of a brewery between Kidderminster and Worcester.
     */
    Farm2,

    Any = -1
}

/**
 * Types of industry that players can build.
 */
export enum Industry {
    None = 0,

    Iron,
    Coal,
    Goods,
    Cotton,
    Pottery,
    Brewery,
}

export const ALL_INDUSTRIES = [
    Industry.Iron,
    Industry.Coal,
    Industry.Goods,
    Industry.Cotton,
    Industry.Pottery,
    Industry.Brewery
]

export enum Era {
    Canal,
    Rail
}

export enum Resource {
    Coal = 0,
    Iron = 1,
    Beer = 2
}

/**
 * Definition of a location on the board that a player can build an industry on.
 */
export interface IIndustryLocationData {
    city: City;
    industries: Industry[];
    posX: number;
    posY: number;
}

/**
 * Definition of a location on the board that a player can build a link on.
 */
export interface ILinkLocationData {
    cities: City[];
    posX: number;
    posY: number;
    angle: number;
    canal: boolean;
    rail: boolean;
}

export interface IIndustryCostData {
    coins?: number;
    coal?: number;
    iron?: number;
}

export interface IIndustryRewardData {
    victoryPoints: number;
    linkPoints: number;
    income: number;
}

/**
 * Definition of a level of an industry, as located on a player board.
 */
export interface IIndustryLevelData {
    /**
     * Level number, starting at 1.
     */
    level: number;

    /**
     * How many times this industry level can be built / developed per player.
     * In other words, the number of tiles for this industry level per player.
     */
    count: number;

    /**
     * Image tile index, relative to the first tile of the player's colour.
     */
    tileIndex: number;

    posX: number;
    posY: number;

    cost: IIndustryCostData;

    /**
     * Reward for flipping an industry at this level.
     */
    saleReward: IIndustryRewardData;

    /**
     * How many resources are produced, if applicable.
     * Only valid for coal or iron. Not given for breweries,
     * since they always produce 1 in the canal era, and 2 in the rail era.
     */
    productionCount?: number;

    /**
     * For potteries / cotton / boxes, how much beer is needed to flip a
     * tile of this industry level.
     */
    saleBeerCost?: number;

    /**
     * Can we develop this industry level. If undefined, you should default to true.
     */
    canDevelop?: false;

    /**
     * Can this industry level only be built in the canal era.
     * If undefined, you should default to false.
     */
    canalOnly?: true;

    /**
     * Can this industry level only be built in the rail era.
     * If undefined, you should default to false.
     */
    railOnly?: true;
}

/**
 * Describes how the tokens in a resource market are positioned.
 */
export interface IResourceMarketData {
    /**
     * Number of tokens the market contains at the start of the game.
     */
    initialCount: number;

    /**
     * Vertical (z) coordinates for each row, relative to the player board center.
     */
    rows: number[];

    /**
     * Horizontal (x) coordinates for each column, relative to the player board center.
     */
    columns: number[];
}

export interface IScoreSlotData {
    posX: number;
    posY: number;
}

export interface IIncomeSlotData extends IScoreSlotData {
    income: number;
    slotCount: number;
}
