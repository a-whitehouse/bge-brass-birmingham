import { IIndustryLevelData, Industry } from "../types.js";

import * as playerboard from "./playerboard.js"

const REFERENCE_WIDTH = 2113.5;
const REFERENCE_HEIGHT = 1710;

/**
 * All the industry tiles, including positions on player boards.
 */
export default new Map(([
    [Industry.Coal, [
        {
            level: 1,
            count: 1,
            canalOnly: true,

            tileIndex: 12,

            posX: 766.7794,
            posY: 1536.3235,

            productionCount: 2,

            cost: {
                coins: 5
            },

            saleReward: {
                victoryPoints: 1,
                linkPoints: 2,
                income: 4
            }
        },
        {
            level: 2,
            count: 2,

            tileIndex: 13,

            posX: 1098.8676,
            posY: 1536.3235,

            productionCount: 3,

            cost: {
                coins: 7
            },

            saleReward: {
                victoryPoints: 2,
                linkPoints: 1,
                income: 7
            }
        },
        {
            level: 3,
            count: 2,

            tileIndex: 14,

            posX: 1436.8676,
            posY: 1536.3235,

            productionCount: 4,

            cost: {
                coins: 8,
                iron: 1
            },

            saleReward: {
                victoryPoints: 3,
                linkPoints: 1,
                income: 6
            }
        },
        {
            level: 4,
            count: 2,

            tileIndex: 15,

            posX: 1771.8676,
            posY: 1536.3235,

            productionCount: 5,

            cost: {
                coins: 10,
                iron: 1
            },

            saleReward: {
                victoryPoints: 4,
                linkPoints: 1,
                income: 5
            }
        }
    ]],
    [Industry.Iron, [
        {
            level: 1,
            count: 1,
            canalOnly: true,

            tileIndex: 4,

            posX: 1531.8676,
            posY: 1186.5,

            productionCount: 4,

            cost: {
                coins: 5,
                coal: 1
            },

            saleReward: {
                victoryPoints: 3,
                linkPoints: 1,
                income: 3
            }
        },
        {
            level: 2,
            count: 1,

            tileIndex: 5,

            posX: 1862.8676,
            posY: 1186.5,

            productionCount: 4,

            cost: {
                coins: 7,
                coal: 1
            },

            saleReward: {
                victoryPoints: 5,
                linkPoints: 1,
                income: 3
            }
        },
        {
            level: 3,
            count: 1,

            tileIndex: 6,

            posX: 1862.8676,
            posY: 970.5,

            productionCount: 5,

            cost: {
                coins: 9,
                coal: 1
            },

            saleReward: {
                victoryPoints: 7,
                linkPoints: 1,
                income: 2
            }
        },
        {
            level: 4,
            count: 1,

            tileIndex: 7,

            posX: 1862.8676,
            posY: 765.5,

            productionCount: 6,

            cost: {
                coins: 12,
                coal: 1
            },

            saleReward: {
                victoryPoints: 9,
                linkPoints: 1,
                income: 1
            }
        }
    ]],
    [Industry.Brewery, [
        {
            level: 1,
            count: 2,
            canalOnly: true,

            tileIndex: 8,

            posX: 229.7794,
            posY: 1521.3235,

            cost: {
                coins: 5,
                iron: 1
            },

            saleReward: {
                victoryPoints: 4,
                linkPoints: 2,
                income: 4
            }
        },
        {
            level: 2,
            count: 2,

            tileIndex: 9,

            posX: 229.7794,
            posY: 1309.3235,

            cost: {
                coins: 7,
                iron: 1
            },

            saleReward: {
                victoryPoints: 5,
                linkPoints: 2,
                income: 5
            }
        },
        {
            level: 3,
            count: 2,

            tileIndex: 10,

            posX: 229.7794,
            posY: 1096.3235,

            cost: {
                coins: 9,
                iron: 1
            },

            saleReward: {
                victoryPoints: 7,
                linkPoints: 2,
                income: 5
            }
        },
        {
            level: 4,
            count: 1,
            railOnly: true,

            tileIndex: 11,

            posX: 229.7794,
            posY: 887.3235,

            cost: {
                coins: 9,
                iron: 1
            },

            saleReward: {
                victoryPoints: 10,
                linkPoints: 2,
                income: 5
            }
        }
    ]],
    [Industry.Goods, [
        {
            level: 1,
            count: 1,
            canalOnly: true,

            tileIndex: 21,

            posX: 221.7794,
            posY: 604.3235,

            cost: {
                coins: 8,
                coal: 1
            },

            saleBeerCost: 1,

            saleReward: {
                victoryPoints: 3,
                linkPoints: 2,
                income: 5
            }
        },
        {
            level: 2,
            count: 2,

            tileIndex: 22,

            posX: 221.7794,
            posY: 397.3235,

            cost: {
                coins: 10,
                iron: 1
            },

            saleBeerCost: 1,

            saleReward: {
                victoryPoints: 5,
                linkPoints: 1,
                income: 1
            }
        },
        {
            level: 3,
            count: 1,

            tileIndex: 24,

            posX: 221.7794,
            posY: 182.3235,

            cost: {
                coins: 12,
                coal: 2
            },

            saleBeerCost: 0,

            saleReward: {
                victoryPoints: 4,
                linkPoints: 0,
                income: 4
            }
        },
        {
            level: 4,
            count: 1,

            tileIndex: 25,

            posX: 554.7794,
            posY: 182.3235,

            cost: {
                coins: 14,
                iron: 1
            },

            saleBeerCost: 1,

            saleReward: {
                victoryPoints: 3,
                linkPoints: 1,
                income: 6
            }
        },
        {
            level: 5,
            count: 2,

            tileIndex: 26,

            posX: 886.7794,
            posY: 182.3235,

            cost: {
                coins: 16,
                coal: 1
            },

            saleBeerCost: 2,

            saleReward: {
                victoryPoints: 8,
                linkPoints: 2,
                income: 2
            }
        },
        {
            level: 6,
            count: 1,

            tileIndex: 28,

            posX: 1220.7794,
            posY: 182.3235,

            cost: {
                coins: 20
            },

            saleBeerCost: 1,

            saleReward: {
                victoryPoints: 7,
                linkPoints: 1,
                income: 6
            }
        },
        {
            level: 7,
            count: 1,

            tileIndex: 29,

            posX: 1553.7794,
            posY: 182.3235,

            cost: {
                coins: 16,
                coal: 1,
                iron: 1
            },

            saleBeerCost: 0,

            saleReward: {
                victoryPoints: 9,
                linkPoints: 0,
                income: 4
            }
        },
        {
            level: 8,
            count: 2,

            tileIndex: 30,

            posX: 1887.7794,
            posY: 182.3235,

            cost: {
                coins: 20,
                iron: 2
            },

            saleBeerCost: 1,

            saleReward: {
                victoryPoints: 11,
                linkPoints: 1,
                income: 1
            }
        }
    ]],
    [Industry.Cotton, [
        {
            level: 1,
            count: 3,
            canalOnly: true,

            tileIndex: 0,

            posX: 661.25,
            posY: 1181.5588,

            cost: {
                coins: 12
            },

            saleBeerCost: 1,

            saleReward: {
                victoryPoints: 5,
                linkPoints: 1,
                income: 5
            }
        },
        {
            level: 2,
            count: 2,

            tileIndex: 1,

            posX: 661.25,
            posY: 972.5588,

            cost: {
                coins: 14,
                coal: 1
            },

            saleBeerCost: 1,

            saleReward: {
                victoryPoints: 5,
                linkPoints: 2,
                income: 4
            }
        },
        {
            level: 3,
            count: 3,

            tileIndex: 2,

            posX: 661.25,
            posY: 762.5588,

            cost: {
                coins: 16,
                coal: 1,
                iron: 1
            },

            saleBeerCost: 1,

            saleReward: {
                victoryPoints: 9,
                linkPoints: 1,
                income: 3
            }
        },
        {
            level: 4,
            count: 3,

            tileIndex: 3,

            posX: 661.25,
            posY: 551.5588,

            cost: {
                coins: 18,
                coal: 1,
                iron: 1
            },

            saleBeerCost: 1,

            saleReward: {
                victoryPoints: 12,
                linkPoints: 1,
                income: 2
            }
        }
    ]],
    [Industry.Pottery, [
        {
            level: 1,
            count: 1,
            canDevelop: false,

            tileIndex: 16,

            posX: 1095.25,
            posY: 1181.5588,

            cost: {
                coins: 17,
                iron: 1
            },

            saleBeerCost: 1,

            saleReward: {
                victoryPoints: 10,
                linkPoints: 1,
                income: 5
            }
        },
        {
            level: 2,
            count: 1,

            tileIndex: 17,

            posX: 1095.25,
            posY: 972.5588,

            cost: {
                coal: 1
            },

            saleBeerCost: 1,

            saleReward: {
                victoryPoints: 1,
                linkPoints: 1,
                income: 1
            }
        },
        {
            level: 3,
            count: 1,
            canDevelop: false,

            tileIndex: 18,

            posX: 1095.25,
            posY: 762.5588,

            cost: {
                coins: 22,
                coal: 2
            },

            saleBeerCost: 2,

            saleReward: {
                victoryPoints: 11,
                linkPoints: 1,
                income: 5
            }
        },
        {
            level: 4,
            count: 1,

            tileIndex: 19,

            posX: 1095.25,
            posY: 551.5588,

            cost: {
                coal: 1
            },

            saleBeerCost: 1,

            saleReward: {
                victoryPoints: 1,
                linkPoints: 1,
                income: 1
            }
        },
        {
            level: 5,
            count: 1,
            railOnly: true,

            tileIndex: 20,

            posX: 1422.25,
            posY: 551.5588,

            cost: {
                coins: 24,
                coal: 2
            },

            saleBeerCost: 2,

            saleReward: {
                victoryPoints: 20,
                linkPoints: 1,
                income: 5
            }
        }
    ]]
] as [Industry, IIndustryLevelData[]][]).map(entry => {
    const [industry, levels] = entry;

    levels.forEach(data => {
        data.posX = (data.posX - REFERENCE_WIDTH * 0.5) * playerboard.WIDTH / REFERENCE_WIDTH;
        data.posY = (REFERENCE_HEIGHT * 0.5 - data.posY) * playerboard.HEIGHT / REFERENCE_HEIGHT;

        data.cost.coins ??= 0;
        data.cost.coal ??= 0;
        data.cost.iron ??= 0;
    })

    return [industry, levels];
}));
