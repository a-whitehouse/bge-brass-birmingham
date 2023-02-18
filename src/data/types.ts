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

    Farm1,
    Farm2,
    
    Any = -1
}

/**
 * Types of industry that players can build.
 */
export enum Industry
{
    None = 0,
    Iron = 1,
    Coal = 2,
    Goods = 4,
    Cotton = 8,
    Pottery = 16,
    Brewery = 32,
    Any = 63,
}

/**
 * Represents a location on the board that a player can build an industry on.
 */
export interface IIndustryLocationData {
    city: City;
    industries: Industry;
    posX: number;
    posY: number;
}
