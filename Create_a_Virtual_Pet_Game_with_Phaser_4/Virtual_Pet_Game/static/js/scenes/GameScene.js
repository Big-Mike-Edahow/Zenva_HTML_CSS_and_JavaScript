// GameScene.js

// Immutable dictionary of string keys.
const CUSTOM_DATA_KEYS = Object.freeze({
    STATS: 'STATS'
});

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    // Scene parameters.
    init() {
        // Stats.
        this.stats = {
            health: 100,
            fun: 100,
        };

        // Decay rates.
        this.decayRates = {
            health: -5,
            fun: -2,
        };
    }

    // Initialize and position game elements.
    create() {
        // Background.
        const bg = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0).setInteractive();
        bg.on(Phaser.Input.Events.POINTER_DOWN, this.placeItem, this);

        // Pet.
        this.pet = this.add.sprite(100, 200, 'pet', 0).setInteractive({
            draggable: true,
        });
        this.pet.setDepth(1);

        // Animation complete event listener.
        this.pet.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.pet.setFrame(0);
            this.refreshUi();
        }, this);

        // Create Ui.
        this.createUi();
        this.createHud();
        this.refreshHud();

        // Decay of health and fun over time.
        this.timerEventForStateDecay = this.time.addEvent({
            delay: 1000,
            repeat: -1,
            callback: () => {
                this.updateStats(this.decayRates);
                this.refreshHud();
            },
            callbackScope: this,
        });

        /* Listen for the DRAG event across the scene. When the pointer moves while holding
            a draggable game object, the callback updates the object's X and Y coords. */
        this.input.on(Phaser.Input.Events.DRAG, (pointer, gameObject, dragX, dragY) => {
            gameObject.setPosition(dragX, dragY);
        });
    }

    createUi() {
        // Buttons.
        this.appleBtn = this.add.sprite(72, 470, 'apple').setInteractive();
        this.appleBtn.on(Phaser.Input.Events.POINTER_DOWN, () => { this.pickItem(this.appleBtn); });
        this.appleBtn.setData(CUSTOM_DATA_KEYS.STATS, { health: 20, fun: 0 });

        this.candyBtn = this.add.sprite(144, 470, 'candy').setInteractive();
        this.candyBtn.on(Phaser.Input.Events.POINTER_DOWN, () => { this.pickItem(this.candyBtn); });
        this.candyBtn.setData(CUSTOM_DATA_KEYS.STATS, { health: -10, fun: 10 });

        this.toyBtn = this.add.sprite(216, 470, 'toy').setInteractive();
        this.toyBtn.on(Phaser.Input.Events.POINTER_DOWN, () => { this.pickItem(this.toyBtn); });
        this.toyBtn.setData(CUSTOM_DATA_KEYS.STATS, { health: 0, fun: 15 });

        this.rotateBtn = this.add.sprite(288, 470, 'rotate').setInteractive();
        // the third argument allows us to pass what scope we want to be bound to the method provide
        this.rotateBtn.on(Phaser.Input.Events.POINTER_DOWN, this.rotatePet, this);
        this.rotateBtn.setData(CUSTOM_DATA_KEYS.STATS, { health: 0, fun: 10 });

        this.uiButtons = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn];

        this.isUiLocked = false;
        this.selectedItem = null;
        this.placedItem = undefined;
    }

    // Pick item.
    pickItem(item) {
        // The Ui can't be locked in order to select an item.
        if (this.isUiLocked) {
            return;
        }

        // Refresh the UI, track the selected item, and change transparency.
        this.refreshUi();
        this.selectedItem = item;
        item.setAlpha(0.5);

        // Log the selected item to the console.
        console.log('We are picking ', item.texture.key);
        console.log(item.getData(CUSTOM_DATA_KEYS.STATS));
    }

    // Rotate pet.
    rotatePet() {
        // The Ui can't be locked in order to select an item.
        if (this.isUiLocked) {
            return;
        }

        // Make sure the Ui is ready, and lock the Ui.
        this.refreshUi();
        this.isUiLocked = true;

        // Dim the rotate icon.
        this.rotateBtn.setAlpha(0.5);

        // Rotation tween.
        this.tweens.add({
            targets: this.pet,
            angle: 720,
            duration: 600,
            onComplete: () => {
                // Increase fun.
                const customStats = this.rotateBtn.getData(CUSTOM_DATA_KEYS.STATS);
                this.updateStats(customStats);
                // Set UI to ready.
                this.refreshUi();
            },
            callbackScope: this,
        });

        // Log the pet rotation to the console.
        console.log('We are rotating the pet!');
    }

    // Unlock ui.
    refreshUi() {
        // Nothing is being selected.
        this.selectedItem = null;

        // Set all buttons to alpha 1 (no transparency).
        this.uiButtons.forEach((button) => {
            button.setAlpha(1);
        });

        // Scene must be unlocked.
        this.isUiLocked = false;

        // Update hud.
        this.refreshHud();
    }

    // Place item.
    placeItem(pointer, localX, localY) {
        // Scene must be unlocked.
        if (this.isUiLocked) {
            return;
        }
        // Check that an item was selected.
        if (this.selectedItem === null) {
            return;
        }

        this.isUiLocked = true;

        // Create a new item in the position the player clicked/tapped.
        if (this.placedItem !== undefined) {
            this.placedItem.setPosition(localX, localY);
            this.placedItem.setTexture(this.selectedItem.texture.key);
            this.placedItem.setVisible(true);
        } else {
            this.placedItem = this.add.image(localX, localY, this.selectedItem.texture.key);
        }

        // Funny faces tween.
        this.tweens.add({
            targets: this.pet,
            x: this.placedItem.x,
            y: this.placedItem.y,
            duration: 500,
            onComplete: () => {
                // Hide our item game object.
                this.placedItem.setVisible(false);
                // Play spritesheet animation.
                this.pet.play('funnyfaces');
                // Increase stats.
                const customStats = this.selectedItem.getData(CUSTOM_DATA_KEYS.STATS);
                this.updateStats(customStats);
            },
            callbackScope: this,
        });
    }

    // Stat updater.
    updateStats(customStats) {
        // Game over flag.
        let isGameOver = false;

        // Update the pet stats.
        for (const [key, value] of Object.entries(customStats)) {
            if (this.stats[key] !== undefined) {
                this.stats[key] += value;

                // Stats can't be less than zero.
                if (this.stats[key] <= 0) {
                    this.stats[key] = 0;
                    isGameOver = true;
                }
            }
        }

        // Check to see if the game ended.
        if (isGameOver) {
            this.handleGameOver();
        }
    }

    createHud() {
        this.healthText = this.add.text(20, 20, 'Health: ', {
            fill: '#000000',
            fontSize: '24px',
            fontFamily: 'Arial',
        });

        this.funText = this.add.text(170, 20, 'Fun: ', {
            fill: '#000000',
            fontSize: '24px',
            fontFamily: 'Arial',
        });
    }

    refreshHud() {
        this.healthText.setText(`Health: ${this.stats.health}`);
        this.funText.setText(`Fun: ${this.stats.fun}`);
    }

    handleGameOver() {
        // Block Ui.
        this.isUiLocked = true;

        // Cleanup timer event for stat decay.
        this.timerEventForStateDecay.destroy();

        // Change frame of the pet.
        this.pet.setFrame(4);

        // Add a five second delay, then start the Home Scene.
        this.time.addEvent({
            delay: 5000,
            repeat: 0,
            callback: () => {
                this.scene.start('HomeScene');
            },
            callbackScope: this,
        });
    }
}
