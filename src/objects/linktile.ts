import * as bge from "bge-core";

import { Player } from "../player";
import { LinkLocation } from "./linklocation";

@bge.width(3)
@bge.height(1.6)
@bge.thickness(0.15)
@bge.cornerRadius(0.8)
export class LinkTile extends bge.Card {
	readonly player: Player;

    location?: LinkLocation;

	constructor(player: Player) {
		super();

		this.player = player;

		const frontUrl = [
			"https://iili.io/HMmNl71.png",
			"https://iili.io/HMmNYrB.png",
			"https://iili.io/HMmNcdP.png",
			"https://iili.io/HMmN71V.png"
		][player.index]

		const backUrl = [
			"https://iili.io/HMmNTzb.png",
			"https://iili.io/HMmNuXj.png",
			"https://iili.io/HMmNALx.png",
			"https://iili.io/HMmN5qQ.png"
		][player.index]

		this.front.image = bge.Image.simple(frontUrl);
		this.back.image = bge.Image.simple(backUrl);
	}
}
