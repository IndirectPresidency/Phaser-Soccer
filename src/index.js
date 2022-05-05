import Phaser from "phaser";
import Game from "./scenes/game";

const config = {
	type: Phaser.AUTO,
	parent: "phaser-example",
	width: 854,
	height: 480,
	scene: [Game],
	physics: {
		default: "arcade",
		arcade: {
			gravity: {
				y: 0,
			},
			debug: false,
		},
	},
};

const game = new Phaser.Game(config);
