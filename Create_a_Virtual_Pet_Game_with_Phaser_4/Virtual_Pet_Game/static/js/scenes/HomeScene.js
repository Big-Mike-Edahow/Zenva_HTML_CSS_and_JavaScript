// HomeScene.js

export default class HomeScene extends Phaser.Scene {
    constructor() {
        super('HomeScene');
    }

    create() {
        // Get game width and height.
        const { width, height } = this.scale;

        // Background.
        const bg = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0).setInteractive();

        // Title text.
        const titleText = this.add.text(width / 2, height * 0.35, '😄 VIRTUAL PET', {
            fill: '#ffffff',
            fontSize: '40px',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setDepth(1);
        this.add.rectangle(titleText.x, titleText.y, titleText.width + 20, titleText.height + 20, 0x000000, 0.7);

        // Click to start text.
        const startText = this.add.text(width / 2, height * 0.75, 'Click to start.', {
            fill: '#ffffff',
            fontSize: '24px',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setDepth(1);
        this.add.rectangle(startText.x, startText.y, startText.width + 20, startText.height + 20, 0x000000, 0.7);

        // On mouse click, start GameScene.
        bg.once(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.start('GameScene');
        }, this);
    }
}
