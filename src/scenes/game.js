import player from "../assets/player.png";
import map from "../assets/map.png";
import goalBack from "../assets/goalBack.png";
import goalPost from "../assets/goalPost.png";
import ball from "../assets/ball.png";
export default class Game extends Phaser.Scene {
	constructor() {
		super("game");
		this.playerSpeed = 180;
		this.screenW = 854;
		this.screenH = 480;
		this.centerX = this.screenW / 2;
		this.centerY = this.screenH / 2;
	}
	

	preload() {
		this.load.image("player", player);
		this.load.image("map", map);
		this.load.image("goalBack", goalBack);
		this.load.image("goalPost", goalPost);
		this.load.image("ball", ball);
	}

	create() {
		this.map = this.physics.add.sprite(this.centerX, this.centerY, "map");
		this.cameras.main.setBackgroundColor("#eee");

		this.player = this.physics.add.sprite(100, 100, "player");
		this.player.setCollideWorldBounds(true);
		this.player.setScale(0.7);

		this.ball = this.physics.add.sprite(200, 200, "ball");
		this.ball.setCollideWorldBounds(true);
		this.ball.setBounce(0.8);
		this.ball.setScale(0.018);
		this.ball.setFriction(0);

		this.goalBack1 = this.physics.add.staticImage(0, this.centerY, "goalBack");
		this.goalBack2 = this.physics.add.staticImage(
			this.screenW,
			this.centerY,
			"goalBack"
		);
		this.goalPost1 = this.physics.add.staticImage(35, 168, "goalPost");
		this.goalPost2 = this.physics.add.staticImage(35, 312, "goalPost");
		this.goalPost3 = this.physics.add.staticImage(
			this.screenW - 35,
			168,
			"goalPost"
		);
		this.goalPost4 = this.physics.add.staticImage(
			this.screenW - 35,
			312,
			"goalPost"
		);
	}

	update() {
		const cursors = this.input.keyboard.createCursorKeys();

		this.physics.collide(this.player, this.ball);

		this.physics.collide(this.player, this.goalBack1);
		this.physics.collide(this.player, this.goalBack2);

		this.physics.collide(this.player, this.goalPost1);
		this.physics.collide(this.player, this.goalPost2);
		this.physics.collide(this.player, this.goalPost3);
		this.physics.collide(this.player, this.goalPost4);

		this.physics.collide(this.ball, this.goalBack1);
		this.physics.collide(this.ball, this.goalBack2);

		this.physics.collide(this.ball, this.goalPost1);
		this.physics.collide(this.ball, this.goalPost2);
		this.physics.collide(this.ball, this.goalPost3);
		this.physics.collide(this.ball, this.goalPost4);

		const lowerVelocity = 0.01;
		const xVel = this.ball.body.velocity.x;
		const yVel = this.ball.body.velocity.y;
		if (xVel > 0) {
			this.ball.setVelocityX(xVel - xVel * lowerVelocity);
		}
		if (yVel > 0) {
			this.ball.setVelocityY(yVel - yVel * lowerVelocity);
		}
		// console.log(this.ball.body.velocity);

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
