import player from "../assets/player.png";
export default class Game extends Phaser.Scene {
	constructor() {
		super("game");
		this.playerSpeed = 180;
	}

	preload() {
		this.load.image("player", player);
	}

	create() {
		this.cameras.main.setBackgroundColor("#aaa");
		this.player = this.physics.add.sprite(100, 100, "player");
		this.player.setCollideWorldBounds(true);
		this.ball = this.physics.add.sprite(200, 200, "ball");
		this.ball.setCollideWorldBounds(true);
		this.ball.setBounce(0.8);
	}

	update() {
		const cursors = this.input.keyboard.createCursorKeys();

		this.physics.collide(this.player, this.ball);

		if (cursors.left.isDown) {
			this.player.setVelocityX(-this.playerSpeed);
			this.player.flipX = true;
		} else if (cursors.right.isDown) {
			this.player.setVelocityX(this.playerSpeed);
			this.player.flipX = false;
		} else {
			this.player.setVelocityX(0);
		}

		if (cursors.up.isDown) {
			this.player.setVelocityY(-this.playerSpeed);
		} else if (cursors.down.isDown) {
			this.player.setVelocityY(this.playerSpeed);
		} else {
			this.player.setVelocityY(0);
		}
	}
}
