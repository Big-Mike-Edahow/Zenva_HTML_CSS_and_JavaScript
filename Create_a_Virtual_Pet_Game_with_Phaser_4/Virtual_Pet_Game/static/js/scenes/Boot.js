// Boot.js

export default class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Set the Base URL to static.
        this.load.setBaseURL('static/');

        // Load assets.
        this.load.image('logo', 'images/rubber_duck.png');
    }

    create() {
        this.scene.start('Preload');
    }
}
