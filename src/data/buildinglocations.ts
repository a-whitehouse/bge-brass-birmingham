import { City, IIndustryLocationData, Industry } from "../types";
import * as gameboard from "./gameboard";

const REFERENCE_WIDTH = 4000;
const REFERENCE_HEIGHT = 4000;

/**
 * All the possible locations that players can build industries.
 */
export default ([
    { city: City.StokeOnTrent, posX: 1652, posZ: 398, industries: Industry.Cotton | Industry.Goods },
    { city: City.StokeOnTrent, posX: 1556.5, posZ: 583.5, industries: Industry.Pottery | Industry.Iron },
    { city: City.StokeOnTrent, posX: 1745.5, posZ: 583.5, industries: Industry.Goods },
    { city: City.Leek, posX: 2120.5, posZ: 293.5, industries: Industry.Cotton | Industry.Goods },
    { city: City.Leek, posX: 2309.5, posZ: 293.5, industries: Industry.Cotton | Industry.Coal },
    { city: City.Belper, posX: 2826.5, posZ: 351.5, industries: Industry.Cotton | Industry.Goods },
    { city: City.Belper, posX: 3013.5, posZ: 351.5, industries: Industry.Coal },
    { city: City.Belper, posX: 3200.5, posZ: 351.5, industries: Industry.Pottery },
    { city: City.Derby, posX: 3048, posZ: 841.25, industries: Industry.Cotton | Industry.Brewery },
    { city: City.Derby, posX: 2954.5, posZ: 1029.75, industries: Industry.Cotton | Industry.Goods },
    { city: City.Derby, posX: 3141.5, posZ: 1029.75, industries: Industry.Iron },
    { city: City.Uttoxeter, posX: 2170.5, posZ: 937.5, industries: Industry.Goods | Industry.Brewery },
    { city: City.Uttoxeter, posX: 2359.5, posZ: 937.5, industries: Industry.Cotton | Industry.Brewery },
    { city: City.Stone, posX: 1140.5, posZ: 1006.5, industries: Industry.Cotton | Industry.Brewery },
    { city: City.Stone, posX: 1325.5, posZ: 1006.5, industries: Industry.Goods | Industry.Coal },
    { city: City.Stafford, posX: 1513.5, posZ: 1381.5, industries: Industry.Goods | Industry.Brewery },
    { city: City.Stafford, posX: 1699.5, posZ: 1381.5, industries: Industry.Pottery },
    { city: City.Cannock, posX: 1808.5, posZ: 1790.5, industries: Industry.Goods | Industry.Coal },
    { city: City.Cannock, posX: 1994.5, posZ: 1790.5, industries: Industry.Coal },
    { city: City.Farm1, posX: 1196.5, posZ: 1740.5, industries: Industry.Brewery },
    { city: City.BurtonOnTrent, posX: 2643.5, posZ: 1497.5, industries: Industry.Goods | Industry.Coal },
    { city: City.BurtonOnTrent, posX: 2829.5, posZ: 1497.5, industries: Industry.Brewery },
    { city: City.Tamworth, posX: 2703.5, posZ: 1999.5, industries: Industry.Cotton | Industry.Coal },
    { city: City.Tamworth, posX: 2885.5, posZ: 1999.5, industries: Industry.Cotton | Industry.Coal },
    { city: City.Walsall, posX: 2034.5, posZ: 2251.5, industries: Industry.Iron | Industry.Goods },
    { city: City.Walsall, posX: 2219.5, posZ: 2251.5, industries: Industry.Goods | Industry.Brewery },
    { city: City.Wolverhampton, posX: 1389.5, posZ: 2158.5, industries: Industry.Goods },
    { city: City.Wolverhampton, posX: 1574.5, posZ: 2158.5, industries: Industry.Goods | Industry.Coal },
    { city: City.Coalbrookdale, posX: 930.5, posZ: 2147.5, industries: Industry.Iron | Industry.Brewery },
    { city: City.Coalbrookdale, posX: 837.5, posZ: 2334.5, industries: Industry.Iron },
    { city: City.Coalbrookdale, posX: 1022.5, posZ: 2334.5, industries: Industry.Coal },
    { city: City.Dudley, posX: 1574.5, posZ: 2649.5, industries: Industry.Coal },
    { city: City.Dudley, posX: 1759.5, posZ: 2649.5, industries: Industry.Iron },
    { city: City.Birmingham, posX: 2425.5, posZ: 2616.5, industries: Industry.Cotton | Industry.Goods },
    { city: City.Birmingham, posX: 2611.5, posZ: 2616.5, industries: Industry.Goods },
    { city: City.Birmingham, posX: 2425.5, posZ: 2805.5, industries: Industry.Iron },
    { city: City.Birmingham, posX: 2611.5, posZ: 2805.5, industries: Industry.Goods },
    { city: City.Nuneaton, posX: 3063.5, posZ: 2403.5, industries: Industry.Goods | Industry.Brewery },
    { city: City.Nuneaton, posX: 3250.5, posZ: 2403.5, industries: Industry.Cotton | Industry.Coal },
    { city: City.Coventry, posX: 3247.5, posZ: 2743.5, industries: Industry.Pottery },
    { city: City.Coventry, posX: 3155.5, posZ: 2930.5, industries: Industry.Goods | Industry.Coal },
    { city: City.Coventry, posX: 3341.5, posZ: 2930.5, industries: Industry.Iron | Industry.Goods },
    { city: City.Redditch, posX: 2238.5, posZ: 3277.5, industries: Industry.Goods | Industry.Coal },
    { city: City.Redditch, posX: 2426.5, posZ: 3277.5, industries: Industry.Iron },
    { city: City.Kidderminster, posX: 1296.5, posZ: 3063.5, industries: Industry.Cotton | Industry.Coal },
    { city: City.Kidderminster, posX: 1480.5, posZ: 3063.5, industries: Industry.Cotton },
    { city: City.Worcester, posX: 1348.5, posZ: 3582.5, industries: Industry.Cotton },
    { city: City.Worcester, posX: 1534.5, posZ: 3582.5, industries: Industry.Cotton },
    { city: City.Farm2, posX: 1039.5, posZ: 3362.5, industries: Industry.Brewery },
] as IIndustryLocationData[]).map(data => {
    data.posX = (data.posX - REFERENCE_WIDTH * 0.5) * gameboard.WIDTH / REFERENCE_WIDTH;
    data.posZ = (REFERENCE_HEIGHT * 0.5 - data.posZ) * gameboard.HEIGHT / REFERENCE_HEIGHT;
    return data;
});
