import player1Img from "../assets/player1.png";
import player2Img from "../assets/player2.png";
import map from "../assets/map.png";
import goalBack from "../assets/goalBack.png";
import goalPost from "../assets/goalPost.png";
import ballImg from "../assets/ball.png";
import topBlockImg from "../assets/top.png";
import sideBlockImg from "../assets/side.png";
export default class Game extends Phaser.Scene {
	constructor() {
		super("game");
		this.playerSpeed = 180;
		this.playerScale = 0.1;
		this.screenW = 854;
		this.screenH = 480;
		this.centerX = this.screenW / 2;
		this.centerY = this.screenH / 2;
		this.scores = [0, 0];
		this.player1Scores = [0, 0];
		this.playerScores = [0, 0];
		this.timeNum = 300;
		this.pausedTime = 15;
		this.paused = false;
		this.lastTouched = "";
		this.showScoreTime = 5000;
	}

	preload() {
		this.load.image("player1", player1Img);
		this.load.image("player2", player2Img);
		this.load.image("map", map);
		this.load.image("goalBack", goalBack);
		this.load.image("goalPost", goalPost);
		this.load.image("ball", ballImg);
		this.load.image("topBlock", topBlockImg);
		this.load.image("sideBlock", sideBlockImg);
	}

	create() {
		this.map = this.physics.add.sprite(this.centerX, this.centerY, "map");
		this.cameras.main.setBackgroundColor("#eee");

		//* Player
		this.playerPos = [this.screenW - 200, this.centerY];
		this.player = this.physics.add.sprite(
			this.playerPos[0],
			this.playerPos[1],
			"player2"
		);
		this.player.setCollideWorldBounds(true);
		this.player.setScale(this.playerScale);

		//* Player 1
		this.player1Pos = [200, this.centerY];
		this.player1 = this.physics.add.sprite(
			this.player1Pos[0],
			this.player1Pos[1],
			"player1"
		);
		this.player1.setCollideWorldBounds(true);
		this.player1.setScale(this.playerScale);

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

		//* Ball block things
		this.ballBlock1 = this.physics.add.staticImage(this.centerX, 0, "topBlock");
		this.ballBlock1.visible = false;

		this.ballBlock2 = this.physics.add.staticImage(
			this.centerX,
			this.screenH,
			"topBlock"
		);
		this.ballBlock2.visible = false;

		this.ballBlock3 = this.physics.add.staticImage(
			0,
			this.centerY,
			"sideBlock"
		);
		this.ballBlock3.visible = false;

		this.ballBlock4 = this.physics.add.staticImage(
			this.screenW,
			this.centerY,
			"sideBlock"
		);
		this.ballBlock4.visible = false;

		//* Timer
		this.timerTxt = this.add.text(this.centerX, this.screenH - 40, "5:00", {
			fontFamily: "arial",
			fontSize: "20px",
			fontWeight: 900,
		});
		this.timerTxt.setPosition(
			this.centerX - this.timerTxt.width / 2,
			this.timerTxt.y
		);
		this.timer();

		//* Start Timer
		this.startTimerTxt = this.add.text(
			this.centerX,
			this.centerY - 50,
			this.pausedTime,
			{
				fontFamily: "arial",
				fontSize: "30px",
				fontWeight: 900,
			}
		);
		this.startTimerTxt.setPosition(
			this.centerX - this.startTimerTxt.width / 2,
			this.startTimerTxt.y
		);
		this.startTimerTxt.visible = false;

		//* End screen
		this.endScreenBg = this.add.rectangle(
			this.centerX,
			this.centerY,
			this.screenW,
			this.screenH,
			0
		);
		this.endScreenBg.visible = false;

		this.winnerTxt = this.add.text(this.centerX, this.centerY - 50, "", {
			fontFamily: "arial",
			fontSize: "30px",
			fontWeight: 900,
		});
		this.winnerTxt.visible = false;

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

		this.team1MVP = this.add.text(this.centerX, 100, "", {
			fontFamily: "arial",
			fontSize: "20px",
			fontWeight: 900,
		});

		this.team2MVP = this.add.text(this.centerX, 100, "", {
			fontFamily: "arial",
			fontSize: "20px",
			fontWeight: 900,
		});
	}

	update() {
		if (this.paused) {
			this.player1.setVelocity(0);
			this.player.setVelocity(0);
			this.ball.setVelocity(0);
			return;
		}

		const cursors = this.input.keyboard.createCursorKeys();
		const scene = this;

		//* Goals

		function restart() {
			scene.player.setVelocity(0);
			scene.ball.setVelocity(0);
			scene.player1.setVelocity(0);
			scene.goalLeft.body.velocity.y = 0;
			scene.goalLeft.body.velocity.x = 0;
			scene.goalRight.body.velocity.x = 0;
			scene.goalRight.body.velocity.y = 0;
			scene.player.setPosition(scene.playerPos[0], scene.playerPos[1]);
			scene.player1.setPosition(scene.player1Pos[0], scene.player1Pos[1]);
			scene.goalLeft.setPosition(scene.goalLPos[0], scene.goalLPos[1]);
			scene.goalRight.setPosition(scene.goalRPos[0], scene.goalRPos[1]);
			scene.ball.setPosition(scene.ballPos[0], scene.ballPos[1]);
		}

		const lowerVelocity = 0.01;
		const xVel = this.ball.body.velocity.x;
		const yVel = this.ball.body.velocity.y;
		if (xVel > 0) {
			this.ball.setVelocityX(xVel - xVel * lowerVelocity);
		} else if (xVel < 0) {
			this.ball.setVelocityX(xVel + Math.abs(xVel) * lowerVelocity);
		}
		if (yVel > 0) {
			this.ball.setVelocityY(yVel - yVel * lowerVelocity);
		} else if (yVel < 0) {
			this.ball.setVelocityY(yVel + Math.abs(yVel) * lowerVelocity);
		}

		if (cursors.left.isDown) {
			this.player.setVelocityX(-this.playerSpeed);
			this.player.flipX = false;
		} else if (cursors.right.isDown) {
			this.player.setVelocityX(this.playerSpeed);
			this.player.flipX = true;
		} else {
			this.player.setVelocityX(0);
		}

		if (cursors.up.isDown) {
			this.player.setVelocityY(-this.playerSpeed);
			if (this.player.flipX) this.player.rotation = 80;
			if (!this.player.flipX) this.player.rotation = -80;
		} else if (cursors.down.isDown) {
			this.player.setVelocityY(this.playerSpeed);
			if (this.player.flipX) this.player.rotation = -80;
			if (!this.player.flipX) this.player.rotation = 80;
		} else {
			this.player.setVelocityY(0);
			this.player.rotation = 0;
		}

		let keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		let keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
		let keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		let keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

		if (keyD.isDown) {
			this.player1.setVelocityX(this.playerSpeed);
			this.player1.flipX = false;
		} else if (keyA.isDown) {
			this.player1.setVelocityX(-this.playerSpeed);
			this.player1.flipX = true;
		} else {
			this.player1.setVelocityX(0);
		}

		if (keyW.isDown) {
			this.player1.setVelocityY(-this.playerSpeed);
			if (this.player1.flipX) this.player1.rotation = -80;
			if (!this.player1.flipX) this.player1.rotation = 80;
		} else if (keyS.isDown) {
			this.player1.setVelocityY(this.playerSpeed);
			if (this.player1.flipX) this.player1.rotation = 80;
			if (!this.player1.flipX) this.player1.rotation = -80;
		} else {
			this.player1.setVelocityY(0);
			this.player1.rotation = 0;
		}

		function goalLeft() {
			scene.paused = true;
			scene.showScore(scene.lastTouched, 0);
			scene.scores[1]++;
			scene.score2.setText(scene.scores[1]);
			setTimeout(() => {
				restart();
			}, scene.showScoreTime);
		}

		function goalRight() {
			scene.paused = true;
			scene.showScore(scene.lastTouched, 1);
			scene.scores[0]++;
			scene.score1.setText(scene.scores[0]);
			setTimeout(() => {
				restart();
			}, scene.showScoreTime);
		}

		function lastTouch(text) {
			scene.lastTouched = text;
		}

		this.physics.collide(this.player1, this.ball, () => lastTouch("player1"));
		this.physics.collide(this.player, this.ball, () => lastTouch("player"));

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

		this.physics.collide(this.ball, this.goalLeft, goalLeft);
		this.physics.collide(this.ball, this.goalRight, goalRight);

		this.physics.collide(this.ball, this.ballBlock1);
		this.physics.collide(this.ball, this.ballBlock2);
		this.physics.collide(this.ball, this.ballBlock3);
		this.physics.collide(this.ball, this.ballBlock4);
	}

	timer() {
		function secToMinAndSec(num) {
			const min = Math.floor(num / 60);
			const sec = num % 60;
			if (sec < 10) return `${min}:0${sec}`;
			return `${min}:${sec}`;
		}
		const timer = setInterval(() => {
			if (this.paused) {
				clearInterval(timer);
				this.startTimer();
				return;
			} else {
				this.timeNum--;
				this.timerTxt.setText(secToMinAndSec(this.timeNum));
			}
			if (this.timeNum < 1) {
				this.endGame();
				clearInterval(timer);
				return;
			}
		}, 1000);
	}

	startTimer() {
		this.startTimerTxt.visible = true;

		const timer = setInterval(() => {
			if (this.pausedTime == 0) {
				clearInterval(timer);
				this.paused = false;
				this.startTimerTxt.visible = false;
				this.pausedTime = 10;
				this.timer();
				return;
			} else {
				this.pausedTime--;
				this.startTimerTxt.setText(this.pausedTime);
				this.startTimerTxt.setPosition(
					this.centerX - this.startTimerTxt.width / 2,
					this.startTimerTxt.y
				);
			}
		}, 1000);
	}

	endGame() {
		const cam = this.cameras.main;
		const scene = this;
		this.paused = true;
		let winner = "";
		if (this.scores[0] > this.scores[1]) {
			cam.pan(this.player1.x, this.player1.y, 0);
			cam.setZoom(5);
			cam.fade(2000);
			showStats();
			winner = "Player 1 wins!";
		} else if (this.scores[0] == this.scores[1]) {
			cam.fade(2000);
			showStats();
			winner = "It's a TIE!";
		} else {
			cam.pan(this.player.x, this.player.y, 0);
			cam.setZoom(5);
			cam.fade(2000);
			showStats();
			winner = "Player 2 wins!";
		}
		this.winnerTxt.setText(winner);
		this.winnerTxt.setPosition(
			this.centerX - this.winnerTxt.width / 2,
			this.winnerTxt.y
		);
		this.winnerTxt.visible = true;

		this.team1MVP.setText(`Team 1 MVP: ${getTeamMVP(1)}`);
		this.team2MVP.setText(`Team 2 MVP: ${getTeamMVP(0)}`);

		this.team1MVP.setPosition(
			this.centerX - 230 - this.team1MVP.width / 2,
			this.team1MVP.y
		);

		this.team2MVP.setPosition(
			this.centerX + 230 - this.team2MVP.width / 2,
			this.team2MVP.y
		);

		function getTeamMVP(team) {
			// console.log()
			if (team == 0) {
				if (scene.scores[1] == 0) {
					return "None";
				}
			} else {
				if (scene.scores[0] == 0) {
					return "None";
				}
			}

			console.log(scene.playerScores, scene.player1Scores);
			if (scene.playerScores[team] > scene.player1Scores[team]) {
				return "Player 2";
			} else {
				return "Player 1";
			}
		}
		function showStats() {
			setTimeout(() => {
				scene.endScreenBg.visible = true;
				cam.fadeIn(0);
				cam.setZoom(1);
				cam.pan(scene.centerX, scene.centerY, 0);
			}, 2500);
		}
	}

	showScore(scored, goal) {
		const cam = this.cameras.main;
		if (scored == "player") {
			cam.pan(this.player.x, this.player.y, 0);
			this.playerScores[goal]++;
		} else {
			cam.pan(this.player1.x, this.player1.y, 0);
			this.player1Scores[goal]++;
		}
		cam.setZoom(5);

		setTimeout(() => {
			cam.pan(this.centerX, this.centerY, 0);
			cam.setZoom(1);
		}, this.showScoreTime);
	}
}
