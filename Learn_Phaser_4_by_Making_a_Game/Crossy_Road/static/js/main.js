// main.js

import Title from "./scenes/Title.js";
import GameScene from "./scenes/GameScene.js";

function main() {
    const config = {
        type: Phaser.AUTO,
        width: 640,
        height: 360,
        parent: 'game-canvas',
        backgroundColor: '#000000',
        scene: [Title, GameScene],
        title: "Crossy Road",
        version: "1.0",
        description: "Crossy Road RPG game."
    };

    const game = new Phaser.Game(config);
}

main();
