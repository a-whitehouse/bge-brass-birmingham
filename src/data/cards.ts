import { ALL_INDUSTRIES, City, ICardData, Industry } from "../types";

export default [
    { city: City.Derby, count: [0, 0, 3] },
    { city: City.Any, count: [0, 0, 0] },
    { industries: ALL_INDUSTRIES, count: [0, 0, 0] },
    { industries: [Industry.Cotton, Industry.Goods], count: [0, 3, 3] },
    { city: City.Birmingham, count: [3, 3, 3] },
    { industries: [Industry.Cotton, Industry.Goods], count: [0, 3, 3] },
    { industries: [Industry.Pottery], count: [2, 2, 3] },

    { city: City.Stone, count: [0, 2, 2] },
    { city: City.Walsall, count: [1, 1, 1] },
    { city: City.BurtonOnTrent, count: [2, 2, 2] },
    { city: City.Wolverhampton, count: [2, 2, 2] },
    { industries: [Industry.Iron], count: [4, 4, 4] },
    { industries: [Industry.Brewery], count: [5, 5, 5] },
    { city: City.Stafford, count: [2, 2, 2] },

    { city: City.Cannock, count: [2, 2, 2] },
    { city: City.Tamworth, count: [1, 1, 1] },
    { city: City.StokeOnTrent, count: [0, 3, 3] },
    { city: City.Coventry, count: [3, 3, 3] },
    { industries: [Industry.Coal], count: [2, 2, 3] },
    { city: City.Dudley, count: [2, 2, 2] },
    { industries: [Industry.Cotton, Industry.Goods], count: [0, 0, 2] },

    { industries: [Industry.Brewery], count: [0, 0, 0] },
    { industries: [Industry.Iron], count: [0, 0, 0] },
    { city: City.Uttoxeter, count: [0, 1, 2] },
    { city: City.Coalbrookdale, count: [3, 3, 3] },
    { city: City.Kidderminster, count: [2, 2, 2] },
    { city: City.Worcester, count: [2, 2, 2] },
    { city: City.Leek, count: [0, 2, 2] },

    { city: City.Belper, count: [0, 0, 2] },
    { industries: [Industry.Brewery], count: [0, 0, 0] },
    { industries: [Industry.Coal], count: [0, 0, 0] },
    { city: City.Redditch, count: [1, 1, 1] },
    { city: City.Nuneaton, count: [1, 1, 1] }
] as ICardData[];
