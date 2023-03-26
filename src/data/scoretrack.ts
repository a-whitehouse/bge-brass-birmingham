import { IIncomeSlotData, IScoreSlotData } from "../types.js";
import * as gameboard from "./gameboard.js"

const REFERENCE_WIDTH = 4000;
const REFERENCE_HEIGHT = 4000;

export const SCORE_SLOTS: IScoreSlotData[] = ([
    { posX: 62.5, posY: 3718.5 },
    { posX: 59.5, posY: 3573.5 },
    { posX: 62.5, posY: 3429.5 },
    { posX: 59.5, posY: 3287.5 },
    { posX: 62.5, posY: 3143.5 },
    { posX: 59.5, posY: 3000.5 },
    { posX: 62.5, posY: 2857.5 },
    { posX: 59.5, posY: 2712.5 },
    { posX: 62.5, posY: 2570.5 },
    { posX: 59.5, posY: 2426.5 },
    { posX: 62.5, posY: 2277.5 },

    { posX: 60.5, posY: 2111.5 },
    { posX: 60.5, posY: 1996.5 },

    { posX: 61.5, posY: 1825.5 },
    { posX: 60.5, posY: 1711.5 },

    { posX: 60.5, posY: 1536.5 },
    { posX: 60.5, posY: 1422.5 },

    { posX: 60.5, posY: 1252.5 },
    { posX: 59.5, posY: 1140.5 },

    { posX: 60.5, posY: 967.5 },
    { posX: 60.5, posY: 854.5 },

    { posX: 61.5, posY: 683.5 },
    { posX: 60.5, posY: 569.5 },

    { posX: 60.5, posY: 397.5 },
    { posX: 60.5, posY: 283.5 },

    { posX: 262, posY: 61 },
    { posX: 375, posY: 61 },
    
    { posX: 542, posY: 61 },
    { posX: 656, posY: 61 },
    
    { posX: 831, posY: 61 },
    { posX: 946, posY: 61 },
    
    { posX: 1160, posY: 63 },
    { posX: 1274, posY: 62 },
    { posX: 1390, posY: 62 },
    
    { posX: 1623, posY: 62 },
    { posX: 1738, posY: 63 },
    { posX: 1854, posY: 62 },
    
    { posX: 2089, posY: 61 },
    { posX: 2204, posY: 61 },
    { posX: 2319, posY: 61 },
    
    { posX: 2551, posY: 61 },
    { posX: 2666, posY: 61 },
    { posX: 2781, posY: 62 },
    
    { posX: 3028, posY: 61 },
    { posX: 3143, posY: 61 },
    { posX: 3258, posY: 61 },
    
    { posX: 3485, posY: 59 },
    { posX: 3600, posY: 61 },
    { posX: 3717, posY: 61 },
    
    { posX: 3935, posY: 330 },
    { posX: 3935, posY: 446 },
    { posX: 3935, posY: 560 },
    
    { posX: 3936, posY: 793 },
    { posX: 3937, posY: 908 },
    { posX: 3937, posY: 1022 },
    
    { posX: 3936, posY: 1258 },
    { posX: 3937, posY: 1373 },
    { posX: 3937, posY: 1488 },
    
    { posX: 3937, posY: 1726 },
    { posX: 3937, posY: 1841 },
    { posX: 3937, posY: 1956 },
    
    { posX: 3937, posY: 2189 },
    { posX: 3937, posY: 2304 },
    { posX: 3937, posY: 2419 },
    { posX: 3937, posY: 2533 },
    
    { posX: 3937, posY: 2760 },
    { posX: 3937, posY: 2874 },
    { posX: 3937, posY: 2989 },
    { posX: 3937, posY: 3103 },

    { posX: 3935, posY: 3332 },
    { posX: 3935, posY: 3446 },
    { posX: 3935, posY: 3560 },
    { posX: 3935, posY: 3673 },

    { posX: 3726, posY: 3938 },
    { posX: 3612, posY: 3938 },
    { posX: 3498, posY: 3938 },
    { posX: 3383, posY: 3938 },

    { posX: 3184, posY: 3937 },
    { posX: 3071, posY: 3938 },
    { posX: 2957, posY: 3938 },
    { posX: 2843, posY: 3937 },

    { posX: 2644, posY: 3937 },
    { posX: 2531, posY: 3937 },
    { posX: 2418, posY: 3937 },
    { posX: 2304, posY: 3937 },

    { posX: 2113, posY: 3937 },
    { posX: 1999, posY: 3937 },
    { posX: 1886, posY: 3937 },
    { posX: 1772, posY: 3937 },

    { posX: 1575, posY: 3938 },
    { posX: 1460, posY: 3938 },
    { posX: 1347, posY: 3938 },
    { posX: 1233, posY: 3938 },

    { posX: 1029, posY: 3937 },
    { posX: 914, posY: 3937 },
    { posX: 800, posY: 3937 },
    { posX: 687, posY: 3937 },

    { posX: 495, posY: 3939 },
    { posX: 381, posY: 3938 },
    { posX: 267, posY: 3938 },    
] as IScoreSlotData[]).map(data => {
    data.posX = (data.posX - REFERENCE_WIDTH * 0.5) * gameboard.WIDTH / REFERENCE_WIDTH;
    data.posY = (REFERENCE_HEIGHT * 0.5 - data.posY) * gameboard.HEIGHT / REFERENCE_HEIGHT;
    return data;
});

export const INCOME_LEVELS: IIncomeSlotData[] = ([
    { posX: 132.5, posY: 3718.5, income: -10, slotCount: 1 },
    { posX: 132.5, posY: 3573.5, income: -9, slotCount: 1 },
    { posX: 132.5, posY: 3433.5, income: -8, slotCount: 1 },
    { posX: 132.5, posY: 3289.5, income: -7, slotCount: 1 },
    { posX: 132.5, posY: 3144.5, income: -6, slotCount: 1 },
    { posX: 132.5, posY: 3001.5, income: -5, slotCount: 1 },
    { posX: 132.5, posY: 2861.5, income: -4, slotCount: 1 },
    { posX: 132.5, posY: 2713.5, income: -3, slotCount: 1 },
    { posX: 132.5, posY: 2572.5, income: -2, slotCount: 1 },
    { posX: 132.5, posY: 2427.5, income: -1, slotCount: 1 },
    { posX: 132.5, posY: 2279.5, income: 0, slotCount: 1 },

    { posX: 127.5, posY: 2055.5, income: 1, slotCount: 2 },
    { posX: 127.5, posY: 1769.5, income: 2, slotCount: 2 },
    { posX: 127.5, posY: 1480.5, income: 3, slotCount: 2 },
    { posX: 127.5, posY: 1198.5, income: 4, slotCount: 2 },
    { posX: 127.5, posY: 911.5, income: 5, slotCount: 2 },
    { posX: 126.5, posY: 626.5, income: 6, slotCount: 2 },
    { posX: 127.5, posY: 343.5, income: 7, slotCount: 2 },
    { posX: 317, posY: 128, income: 8, slotCount: 2 },
    { posX: 597, posY: 128, income: 9, slotCount: 2 },
    { posX: 887, posY: 128, income: 10, slotCount: 2 },
    
    { posX: 1274, posY: 129, income: 11, slotCount: 3 },
    { posX: 1737, posY: 129, income: 12, slotCount: 3 },
    { posX: 2203, posY: 129, income: 13, slotCount: 3 },
    { posX: 2665, posY: 128, income: 14, slotCount: 3 },
    { posX: 3142, posY: 128, income: 15, slotCount: 3 },
    { posX: 3601, posY: 127, income: 16, slotCount: 3 },
    { posX: 3867, posY: 446, income: 17, slotCount: 3 },
    { posX: 3868, posY: 906, income: 18, slotCount: 3 },
    { posX: 3868, posY: 1371, income: 19, slotCount: 3 },
    { posX: 3868, posY: 1839, income: 20, slotCount: 3 },
    
    { posX: 3868, posY: 2360, income: 21, slotCount: 4 },
    { posX: 3868, posY: 2930, income: 22, slotCount: 4 },
    { posX: 3868, posY: 3500, income: 23, slotCount: 4 },
    { posX: 3555, posY: 3868, income: 24, slotCount: 4 },
    { posX: 3014, posY: 3868, income: 25, slotCount: 4 },
    { posX: 2475, posY: 3868, income: 26, slotCount: 4 },
    { posX: 1943, posY: 3868, income: 27, slotCount: 4 },
    { posX: 1403, posY: 3868, income: 28, slotCount: 4 },
    { posX: 856, posY: 3868, income: 29, slotCount: 4 },

    { posX: 385, posY: 3868, income: 30, slotCount: 3 },
] as IIncomeSlotData[]).map(data => {
    data.posX = (data.posX - REFERENCE_WIDTH * 0.5) * gameboard.WIDTH / REFERENCE_WIDTH;
    data.posY = (REFERENCE_HEIGHT * 0.5 - data.posY) * gameboard.HEIGHT / REFERENCE_HEIGHT;
    return data;
});
