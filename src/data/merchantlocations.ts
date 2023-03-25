import { IMerchantLocationData, City, MerchantBeerReward } from "../types.js";

import * as gameboard from "./gameboard.js"

const REFERENCE_WIDTH = 4000;
const REFERENCE_HEIGHT = 4000;

export default ([
    {
        city: City.Shrewsbury,

        minPlayers: 2,

        posX: 355.5,
        posY: 2355.5,

        beerReward: MerchantBeerReward.FourVictoryPoints,

        beerPosX: 505,
        beerPosY: 2315
    },

    {
        city: City.Gloucester,

        minPlayers: 2,

        posX: 2325.5,
        posY: 3720.5,

        beerReward: MerchantBeerReward.Develop,

        beerPosX: 2287,
        beerPosY: 3569
    },
    {
        city: City.Gloucester,

        minPlayers: 2,

        posX: 2511.6667,
        posY: 3720.6667,

        beerReward: MerchantBeerReward.Develop,

        beerPosX: 2551,
        beerPosY: 3569
    },

    {
        city: City.Oxford,

        minPlayers: 2,

        posX: 3215.5833,
        posY: 3414.5833,

        beerReward: MerchantBeerReward.TwoIncome,

        beerPosX: 3175,
        beerPosY: 3265
    },
    {
        city: City.Oxford,

        minPlayers: 2,

        posX: 3401.75,
        posY: 3414.5833,

        beerReward: MerchantBeerReward.TwoIncome,

        beerPosX: 3439,
        beerPosY: 3265
    },

    {
        city: City.Warrington,

        minPlayers: 3,

        posX: 1019.75,
        posY: 513.9167,

        beerReward: MerchantBeerReward.FiveCoins,

        beerPosX: 982,
        beerPosY: 654
    },
    {
        city: City.Warrington,

        minPlayers: 3,

        posX: 1206.9167,
        posY: 513.9167,

        beerReward: MerchantBeerReward.FiveCoins,

        beerPosX: 1246,
        beerPosY: 654
    },

    {
        city: City.Warrington,

        minPlayers: 4,

        posX: 3525.9167,
        posY: 767.25,

        beerReward: MerchantBeerReward.ThreeVictoryPoints,

        beerPosX: 3488,
        beerPosY: 917
    },
    {
        city: City.Warrington,

        minPlayers: 4,

        posX: 3713.0833,
        posY: 767.25,

        beerReward: MerchantBeerReward.ThreeVictoryPoints,

        beerPosX: 3752,
        beerPosY: 917
    }
] as IMerchantLocationData[]).map(data => {
    data.posX = (data.posX - REFERENCE_WIDTH * 0.5) * gameboard.WIDTH / REFERENCE_WIDTH;
    data.posY = (REFERENCE_HEIGHT * 0.5 - data.posY) * gameboard.HEIGHT / REFERENCE_HEIGHT;
    data.beerPosX = (data.beerPosX - REFERENCE_WIDTH * 0.5) * gameboard.WIDTH / REFERENCE_WIDTH;
    data.beerPosY = (REFERENCE_HEIGHT * 0.5 - data.beerPosY) * gameboard.HEIGHT / REFERENCE_HEIGHT;
    return data;
});
