// main.js

import Boot from './scenes/Boot.js';
import Preload from './scenes/Preload.js';
import HomeScene from './scenes/HomeScene.js';
import GameScene from './scenes/GameScene.js';

function main() {
    const config = {
        type: Phaser.AUTO,
        width: 360,
        height: '95%',
        parent: 'game-canvas',
        backgroundColor: '#ffffff',
        pixelArt: false,
        scene: [Boot, Preload, HomeScene, GameScene],
        title: 'Virtual Pet Game',
        version: '1.0',
        description: 'Zenva virtual pet game.',
    };

    const game = new Phaser.Game(config);
}

main();
