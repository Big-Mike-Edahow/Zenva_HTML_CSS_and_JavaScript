// Title.js

export default class Title extends Phaser.Scene {
    constructor() {
        super('Title');
    }

    preload() {
        // Load image assets.
        this.load.setBaseURL('static/');
        this.load.image('titleBackground', 'images/title_bg.png');
    }

    create() {
        // Background.
        const bg = this.add.image(0, 0, 'titleBackground');
        bg.setOrigin(0, 0);

        // Title text.
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'Crossing Road Adventure', {
            fontSize: '28px',
        })
            .setOrigin(0.5);

        // Click to play text.
        this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Click to play!', {
            fontSize: '18px',
        })
            .setOrigin(0.5);

        // Smoothly fade-in from black to normal.
        this.cameras.main.fadeIn(500);

        // After the mouse click, smoothly fade-out from normal to black.
        this.input.once('pointerup', () => {
            this.cameras.main.fadeOut(500);
        });

        // Once the fade-out is completer, start GameScene.
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.start('GameScene');
        });
    }
}
