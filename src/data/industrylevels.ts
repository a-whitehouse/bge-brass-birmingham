import { City, IIndustryLevelData, Industry, IPlayerBoardData } from "../types";

const REFERENCE_WIDTH = 2113.5;
const REFERENCE_HEIGHT = 1710;

const BOARD_WIDTH = 28.6;
const BOARD_HEIGHT = 22.8;

/**
 * All the industry tiles, including positions on player boards.
 */
export default {
    industries: new Map(([
        [Industry.Coal, [
            {
                level: 1,
                count: undefined,
                canalOnly: true,
                
                tileIndex: 12,

                posX: 766.7794,
                posZ: 1536.3235,

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
                count: undefined,
                
                tileIndex: 13,

                posX: 1098.8676,
                posZ: 1536.3235,

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
                count: undefined,
                
                tileIndex: 14,

                posX: 1436.8676,
                posZ: 1536.3235,

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
                count: undefined,
                
                tileIndex: 15,

                posX: 1771.8676,
                posZ: 1536.3235,

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
                count: undefined,
                canalOnly: true,

                tileIndex: 4,

                posX: 1531.8676,
                posZ: 1186.5,

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
                count: undefined,

                tileIndex: 5,

                posX: 1862.8676,
                posZ: 1186.5,

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
                count: undefined,
                
                tileIndex: 6,

                posX: 1862.8676,
                posZ: 970.5,

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
                count: undefined,
                
                tileIndex: 7,

                posX: 1862.8676,
                posZ: 765.5,

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
                count: undefined,
                canalOnly: true,
                
                tileIndex: 8,

                posX: 229.7794,
                posZ: 1521.3235,

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
                count: undefined,
                
                tileIndex: 9,

                posX: 229.7794,
                posZ: 1309.3235,

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
                count: undefined,
                
                tileIndex: 10,

                posX: 229.7794,
                posZ: 1096.3235,

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
                count: undefined,
                railOnly: true,
                
                tileIndex: 11,

                posX: 229.7794,
                posZ: 887.3235,

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
                count: undefined,
                canalOnly: true,
                
                tileIndex: 21,

                posX: 221.7794,
                posZ: 604.3235,

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
                count: undefined,
                
                tileIndex: 22,

                posX: 221.7794,
                posZ: 397.3235,

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
                count: undefined,
                
                tileIndex: 24,

                posX: 221.7794,
                posZ: 182.3235,

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
                count: undefined,
                
                tileIndex: 25,

                posX: 554.7794,
                posZ: 182.3235,

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
                count: undefined,
                
                tileIndex: 26,

                posX: 886.7794,
                posZ: 182.3235,

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
                count: undefined,
                
                tileIndex: 28,

                posX: 1220.7794,
                posZ: 182.3235,

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
                count: undefined,
                
                tileIndex: 29,

                posX: 1553.7794,
                posZ: 182.3235,

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
                count: undefined,
                
                tileIndex: 30,

                posX: 1887.7794,
                posZ: 182.3235,

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
                count: undefined,
                canalOnly: true,

                tileIndex: 0,

                posX: 661.25,
                posZ: 1181.5588,

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
                count: undefined,

                tileIndex: 1,

                posX: 661.25,
                posZ: 972.5588,

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
                count: undefined,

                tileIndex: 2,

                posX: 661.25,
                posZ: 762.5588,

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
                count: undefined,

                tileIndex: 3,

                posX: 661.25,
                posZ: 551.5588,

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
                count: undefined,
                canDevelop: false,
                
                tileIndex: 16,

                posX: 1095.25,
                posZ: 1181.5588,

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
                count: undefined,
                
                tileIndex: 17,

                posX: 1095.25,
                posZ: 972.5588,

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
                count: undefined,
                canDevelop: false,
                
                tileIndex: 18,

                posX: 1095.25,
                posZ: 762.5588,

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
                count: undefined,
                
                tileIndex: 19,

                posX: 1095.25,
                posZ: 551.5588,

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
                count: undefined,
                railOnly: true,
                
                tileIndex: 20,

                posX: 1422.25,
                posZ: 551.5588,

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
            data.posX = (data.posX - REFERENCE_WIDTH * 0.5) * BOARD_WIDTH / REFERENCE_WIDTH;
            data.posZ = (REFERENCE_HEIGHT * 0.5 - data.posZ) * BOARD_HEIGHT / REFERENCE_HEIGHT;
        })

        return [industry, levels];
    }))
} as IPlayerBoardData;
