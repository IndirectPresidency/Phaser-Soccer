import playerImg from "../assets/player.png";
import map from "../assets/map.png";
import goalBack from "../assets/goalBack.png";
import goalPost from "../assets/goalPost.png";
import ballImg from "../assets/ball.png";
export default class Game extends Phaser.Scene {
	constructor() {
		super("game");
		this.playerSpeed = 180;
		this.screenW = 854;
		this.screenH = 480;
		this.centerX = this.screenW / 2;
		this.centerY = this.screenH / 2;
		this.scores = [0, 0];
	}

	preload() {
		this.load.image("player", playerImg);
		this.load.image("map", map);
		this.load.image("goalBack", goalBack);
		this.load.image("goalPost", goalPost);
		this.load.image("ball", ballImg);
	}

	create() {
		this.map = this.physics.add.sprite(this.centerX, this.centerY, "map");
		this.cameras.main.setBackgroundColor("#eee");

		//* Player
		this.playerPos = [100, 100];
		this.player = this.physics.add.sprite(
			this.playerPos[0],
			this.playerPos[0],
			"player"
		);
		this.player.setCollideWorldBounds(true);
		this.player.setScale(0.7);
    
    //* Player 1
    this.player1Pos = [100,100]
		this.player1 = this.physics.add.sprite(this.player1Pos[0], this.player1Pos[0], "player");
		this.player1.setCollideWorldBounds(true);
		this.player1.setScale(0.7);

		//* Ball
		this.ballPos = [this.centerX, this.centerY];
		this.ball = this.physics.add.sprite(
			this.ballPos[0],
			this.ballPos[1],
			"ball"
		);
    
		this.ball.setCollideWorldBounds(true);
		this.ball.setBounce(0.8);
		this.ball.setScale(0.018);
		this.ball.setFriction(0);

		//* Goals

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

		this.goalLPos = [40, this.centerY];
		this.goalLeft = this.add.rectangle(
			this.goalLPos[0],
			this.goalLPos[1],
			60,
			125
		);
		this.physics.add.existing(this.goalLeft);

		this.goalRPos = [this.screenW - 40, this.centerY];
		this.goalRight = this.add.rectangle(
			this.goalRPos[0],
			this.goalRPos[1],
			60,
			125
		);
		this.physics.add.existing(this.goalRight);

		//* Score Text
		const spaceApart = 30;
		this.score1 = this.add.text(this.centerX - spaceApart, 10, "0", {
			fontFamily: "arial",
			fontSize: "50px",
			fontWeight: 900,
		});
		this.score1.setPosition(
			this.centerX - spaceApart - this.score1.width / 2,
			this.score1.y
		);

		this.score2 = this.add.text(this.centerX + spaceApart, 10, "0", {
			fontFamily: "arial",
			fontSize: "50px",
			fontWeight: 900,
		});
		this.score2.setPosition(
			this.centerX + spaceApart - this.score2.width / 2,
			this.score2.y
		);
	}

	update() {
		const cursors = this.input.keyboard.createCursorKeys();
		const scene = this;

		this.physics.collide(this.player, this.ball);
		this.physics.collide(this.player1, this.ball);

		function goalCollide(object) {
			scene.physics.collide(object, scene.goalBack1);
			scene.physics.collide(object, scene.goalBack2);

			scene.physics.collide(object, scene.goalPost1);
			scene.physics.collide(object, scene.goalPost2);
			scene.physics.collide(object, scene.goalPost3);
			scene.physics.collide(object, scene.goalPost4);
		}
		goalCollide(this.player);
		goalCollide(this.player1);
		goalCollide(this.ball);

		//* Goals

		function restart() {
			scene.player.setPosition(scene.playerPos[0], scene.playerPos[1]);
			scene.player.setVelocity(0);
			scene.ball.setPosition(scene.ballPos[0], scene.ballPos[1]);
			scene.ball.setVelocity(0);
			scene.goalLeft.setPosition(scene.goalLPos[0], scene.goalLPos[1]);
			scene.goalLeft.body.velocity.x = 0;
			scene.goalLeft.body.velocity.y = 0;
			scene.goalRight.setPosition(scene.goalRPos[0], scene.goalRPos[1]);
			scene.goalRight.body.velocity.x = 0;
			scene.goalRight.body.velocity.y = 0;
		}

		function goalLeft() {
			console.log("Goal Left");
			scene.scores[1]++;
			scene.score2.setText(scene.scores[1]);
			restart();
		}

		function goalRight() {
			console.log("Goal Right");
			scene.scores[0]++;
			scene.score1.setText(scene.scores[0]);
			restart();
		}

		this.physics.collide(this.ball, this.goalLeft, goalLeft);
		this.physics.collide(this.ball, this.goalRight, goalRight);

		const lowerVelocity = 0.01;
		const xVel = this.ball.body.velocity.x;
		const yVel = this.ball.body.velocity.y;
		if (xVel > 0) {
			this.ball.setVelocityX(xVel - xVel * lowerVelocity);
		}
		if (yVel > 0) {
			this.ball.setVelocityY(yVel - yVel * lowerVelocity);
		}

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

		let keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		let keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		let keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		let keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

		if (keyD.isDown) {
			this.player1.setVelocityX(this.playerSpeed);
		} else if (keyA.isDown) {
			this.player1.setVelocityX(-this.playerSpeed);
		} else {
			this.player1.setVelocityX(0);
		}

		if (keyW.isDown) {
			this.player1.setVelocityY(-this.playerSpeed);
		} else if (keyS.isDown) {
			this.player1.setVelocityY(this.playerSpeed);
		} else {
			this.player1.setVelocityY(0);
		}
	}
}
