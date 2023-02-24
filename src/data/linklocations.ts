import { City, ILinkLocationData } from "../types";
import * as gameboard from "./gameboard";

const REFERENCE_WIDTH = 4000;
const REFERENCE_HEIGHT = 4000;

/**
 * All the possible locations that players can build links.
 */
export default ([
    { cities: [City.Warrington, City.StokeOnTrent], posX: 1410.6667, posY: 380.8611, angle: 333.014, canal: true, rail: true },
    { cities: [City.StokeOnTrent, City.Leek], posX: 1880.5556, posY: 324.8889, angle: 24.795, canal: true, rail: true },
    { cities: [City.Leek, City.Belper], posX: 2577.1111, posY: 278.5556, angle: 352.675, canal: false, rail: true },
    { cities: [City.Belper, City.Derby], posX: 3063.6667, posY: 630.2222, angle: 293.235, canal: true, rail: true },
    { cities: [City.Derby, City.Nottingham], posX: 3282.8889, posY: 825.8889, angle: 24.654, canal: true, rail: true },
    { cities: [City.Derby, City.Uttoxeter], posX: 2659.3333, posY: 1008.5556, angle: 352.131, canal: false, rail: true },
    { cities: [City.Uttoxeter, City.Stone], posX: 1753, posY: 955.2222, angle: 4.626, canal: false, rail: true },
    { cities: [City.Stone, City.StokeOnTrent], posX: 1469.7778, posY: 828.2222, angle: 38.08, canal: true, rail: true },
    { cities: [City.Stone, City.BurtonOnTrent], posX: 2075.6667, posY: 1183.3333, angle: 352.131, canal: true, rail: true },
    { cities: [City.Derby, City.BurtonOnTrent], posX: 3027.6667, posY: 1316.3333, angle: 47.639, canal: true, rail: true },
    { cities: [City.Stone, City.Stafford], posX: 1262.6667, posY: 1329.3333, angle: 315, canal: true, rail: true },
    { cities: [City.Stafford, City.Cannock], posX: 1898.6667, posY: 1561.3333, angle: 296.703, canal: true, rail: true },
    { cities: [City.Cannock, City.Farm1], posX: 1502.6667, posY: 1726.3333, angle: 357.212, canal: true, rail: true },
    { cities: [City.Cannock, City.BurtonOnTrent], posX: 2290.6667, posY: 1584.3333, angle: 38.081, canal: false, rail: true },
    { cities: [City.Cannock, City.Wolverhampton], posX: 1575.6667, posY: 1938.3333, angle: 225, canal: true, rail: true },
    { cities: [City.Cannock, City.Walsall], posX: 2155.6667, posY: 2002.3333, angle: 280.569, canal: true, rail: true },
    { cities: [City.Walsall, City.BurtonOnTrent], posX: 2357.6667, posY: 1892.3333, angle: 256.273, canal: true, rail: false },
    { cities: [City.BurtonOnTrent, City.Tamworth], posX: 2798.6667, posY: 1789.3333, angle: 274.626, canal: true, rail: true },
    { cities: [City.Wolverhampton, City.Coalbrookdale], posX: 1157, posY: 2153.3333, angle: 0, canal: true, rail: true },
    { cities: [City.Coalbrookdale, City.Shrewsbury], posX: 664, posY: 2153.3333, angle: 4.087, canal: true, rail: true },
    { cities: [City.Walsall, City.Wolverhampton], posX: 1810, posY: 2182.3333, angle: 352.132, canal: true, rail: true },
    { cities: [City.Walsall, City.Tamworth], posX: 2490, posY: 2208.3333, angle: 24.547, canal: false, rail: true },
    { cities: [City.Tamworth, City.Nuneaton], posX: 3137, posY: 2118.3333, angle: 114.547, canal: true, rail: true },
    { cities: [City.Tamworth, City.Birmingham], posX: 2775, posY: 2359.3333, angle: 242.154, canal: true, rail: true },
    { cities: [City.Walsall, City.Birmingham], posX: 2223, posY: 2537.3333, angle: 305.752, canal: true, rail: true },
    { cities: [City.Wolverhampton, City.Dudley], posX: 1492, posY: 2441.3333, angle: 296.703, canal: true, rail: true },
    { cities: [City.Coalbrookdale, City.Kidderminster], posX: 1008, posY: 2766.3333, angle: 303.15, canal: true, rail: true },
    { cities: [City.Kidderminster, City.Dudley], posX: 1414, posY: 2845.3333, angle: 232.203, canal: true, rail: true },
    { cities: [City.Dudley, City.Birmingham], posX: 2093, posY: 2713.3333, angle: 157.392, canal: true, rail: true },
    { cities: [City.Birmingham, City.Nuneaton], posX: 2848, posY: 2599.3333, angle: 235.001, canal: false, rail: true },
    { cities: [City.Nuneaton, City.Coventry], posX: 3440, posY: 2637.3333, angle: 270, canal: false, rail: true },
    { cities: [City.Birmingham, City.Coventry], posX: 2881, posY: 2894.3333, angle: 164.064, canal: true, rail: true },
    { cities: [City.Birmingham, City.Worcester], posX: 1958, posY: 3122.3333, angle: 242.154, canal: true, rail: true },
    { cities: [City.Kidderminster, City.Worcester, City.Farm2], posX: 1363, posY: 3360.3333, angle: 292.666, canal: true, rail: true },
    { cities: [City.Worcester, City.Gloucester], posX: 1750, posY: 3706.3333, angle: 165.33, canal: true, rail: true },
    { cities: [City.Gloucester, City.Redditch], posX: 2025, posY: 3449.3333, angle: 237.393, canal: true, rail: true },
    { cities: [City.Birmingham, City.Redditch], posX: 2452, posY: 3080.3333, angle: 262.194, canal: false, rail: true },
    { cities: [City.Redditch, City.Oxford], posX: 2662, posY: 3337.3333, angle: 167.714, canal: true, rail: true },
    { cities: [City.Birmingham, City.Oxford], posX: 2864, posY: 3080.3333, angle: 129.14, canal: true, rail: true },
] as ILinkLocationData[]).map(data => {
    data.posX = (data.posX - REFERENCE_WIDTH * 0.5) * gameboard.WIDTH / REFERENCE_WIDTH;
    data.posY = (REFERENCE_HEIGHT * 0.5 - data.posY) * gameboard.HEIGHT / REFERENCE_HEIGHT;
    return data;
});
