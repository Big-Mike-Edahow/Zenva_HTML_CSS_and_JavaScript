// GameScene.js

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init() {
        // Set levelsCompleted to 0 if it's undefined.
        if (this.levelsCompleted === undefined) {
            this.levelsCompleted = 0;
        }

        // Player speed.
        this.playerSpeed = 3;

        // Enemy speed.
        this.enemyMinSpeed = 1.5;
        this.enemyMaxSpeed = 3;

        // Boundaries.
        this.enemyMinY = 80;
        this.enemyMaxY = 280

        // isGameOver is false at start of game.
        this.isGameOver = false;
    }

    preload() {
        // Load image assets.
        this.load.setBaseURL('static/');
        this.load.image('gameBackground', 'images/game_bg.png');
        this.load.image('player', 'images/player.png');
        this.load.image('enemy', 'images/dragon.png');
        this.load.image('treasure', 'images/treasure.png');
    }

    create() {
        // Background. Change origin to the top-left corner.
        const bg = this.add.image(0, 0, 'gameBackground');
        bg.setOrigin(0, 0);

        // Player.
        this.player = this.add.image(40, this.scale.height / 2, 'player');
        this.player.setScale(0.5);

        // Treasure chest.
        this.goal = this.add.image(this.scale.width - 80, this.scale.height / 2, 'treasure');
        this.goal.setScale(0.6);

        // Add enemies group.
        this.enemies = this.add.group({
            key: 'enemy',
            repeat: 4,
            setXY: {
                x: 90,
                y: 100,
                stepX: 100,
                stepY: 20
            }
        });

        /* Configure the enemies group. Scale them down slightly, flip them horizontally,
            and assign them randomized, directional movement speeds. */
        Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);
        Phaser.Actions.Call(this.enemies.getChildren(), (enemy) => {
            enemy.flipX = true;

            // Set enemy speed.
            const dir = Math.random() < 0.5 ? 1 : -1;
            const speed = Phaser.Math.RND.between(this.enemyMinSpeed, this.enemyMaxSpeed);
            enemy.speed = dir * speed;
        });

        // Smoothly fade-in from black to normal.
        this.cameras.main.fadeIn(500);

        // Add score text.
        this.add.text(10, 10, `Score: ${this.levelsCompleted * 100}`, { fontSize: '22px' });
    }

    // Called up to 60 times per second.
    update() {
        // If isGameOver is true, return.
        if (this.isGameOver) {
            return;
        }

        // Check for active input (left click / touch).
        if (this.input.activePointer.isDown) {
            // Player walks.
            this.player.x += this.playerSpeed;
        }

        // Treasure chest overlap check.
        const playerRect = this.player.getBounds();
        const goalRect = this.goal.getBounds();

        // Check if the player and the treasure chest overlap.
        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, goalRect)) {
            console.log('reached goal!!');

            this.handleGameOver(false);
            return;
        }

        // Update the enemies group.
        const enemies = this.enemies.getChildren();
        for (let i = 0; i < enemies.length; i += 1) {
            // Enemy movement.
            enemies[i].y += enemies[i].speed;

            // Check we haven't passed min or max Y.
            const conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
            const conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;

            // If we passed the upper or lower limit, reverse.
            if (conditionUp || conditionDown) {
                enemies[i].speed *= -1;
            }

            // If the player and enemies overlap, game is over.
            const enemyRect = enemies[i].getBounds();
            if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
                console.log('Game over!');

                // Game over.
                this.handleGameOver(true);

                return;
            }
        }
    }

    handleGameOver(playerDied) {
        // Game is over.
        this.isGameOver = true;

        // If the player is dead, shake the camera before the fade-out to black.
        if (playerDied) {
            this.cameras.main.shake(500);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => {
                this.cameras.main.fadeOut(500);
            });
        } else {
            this.cameras.main.fadeOut(500);
        }

        // Once the fade out is complete, restart that scene.
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            if (playerDied) {
                this.levelsCompleted = 0;
            } else {
                this.levelsCompleted += 1;
            }
            // Restart the Scene.
            this.scene.restart();
        });
    }
}
