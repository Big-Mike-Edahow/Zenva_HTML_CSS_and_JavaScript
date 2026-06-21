// Preload.js

export default class Preload extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        // Get game width and height.
        const { width, height } = this.scale;

        // Add logo.
        this.add.image(width / 2, 250, 'logo');

        // Progress bar.
        const barW = 150;
        const barH = 30;
        this.add.rectangle(width / 2, height / 2, barW, barH, 0xf5f5f5, 1);
        const progressBar = this.add.rectangle(width / 2 - barW / 2, height / 2, 0, barH, 0x9ad98d, 1).setOrigin(0, 0.5);

        // Set the Base URL to static.
        this.load.setBaseURL('static');

        // Load assets.
        this.load.image('backyard', 'images/backyard.png');
        this.load.image('apple', 'images/apple.png');
        this.load.image('candy', 'images/candy.png');
        this.load.image('rotate', 'images/rotate.png');
        this.load.image('toy', 'images/rubber_duck.png');

        // Load spritesheet.
        this.load.spritesheet('pet', 'images/pet.png', {
            frameWidth: 97,
            frameHeight: 83,
            margin: 1,
            spacing: 1,
        });

        // Listen for the "progress" event.
        this.load.on(Phaser.Loader.Events.PROGRESS, (value) => {
            progressBar.setSize(value * barW, barH);
        });
    }

    create() {
        // Animation.
        this.anims.create({
            key: 'funnyfaces',
            frames: this.anims.generateFrameNames('pet', { frames: [1, 2, 3] }),
            frameRate: 7,
            yoyo: true,
            repeat: 0,
        });

        this.scene.start('HomeScene');
    }
}
