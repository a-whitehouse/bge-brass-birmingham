import * as bge from 'bge-core';
import { CardGame } from './game';

/**
 * @summary Required default export describing our game's config.
 * @description This is how a runner knows what our game class is, and how many players it supports.
 */
export default {
    apiVersion: bge.API_VERSION,
    Game: CardGame,
    minPlayers: 4,
    maxPlayers: 8
} as bge.IGameConfig;
