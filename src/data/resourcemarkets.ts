import { IResourceMarketData } from "../types";

import * as gameboard from "./gameboard";

const REFERENCE_WIDTH = 4000;
const REFERENCE_HEIGHT = 4000;

function remapRows(rows: number[]): number[] {
    return rows.map(posY => (REFERENCE_HEIGHT * 0.5 - posY)
        * gameboard.HEIGHT / REFERENCE_HEIGHT);
}

function remapColumns(cols: number[]): number[] {
    return cols.map(posX => (posX - REFERENCE_WIDTH * 0.5)
        * gameboard.WIDTH / REFERENCE_WIDTH);
}

export const COAL_MARKET = {
    initialCount: 13,

    rows: remapRows([
        2074.7059,
        1951.7059,
        1832.7059,
        1714.7059,
        1593.7059,
        1474.7059,
        1351.7059
    ]),

    columns: remapColumns([
        3379.8235,
        3466.8235
    ])
} as IResourceMarketData;

export const IRON_MARKET = {
    initialCount: 8,

    rows: remapRows([
        2074.7059,
        1951.7059,
        1832.7059,
        1714.7059,
        1593.7059
    ]),
    
    columns: remapColumns([
        3598.8235,
        3685.8235
    ])
} as IResourceMarketData;
