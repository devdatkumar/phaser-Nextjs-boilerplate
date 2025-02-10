// scene1.ts
import { Scene } from "phaser";
import { EventBus } from "./EventBus";

export class Target extends Scene {
  private background!: Phaser.GameObjects.Image;
  private targets!: Phaser.Physics.Arcade.Group;
  private initialTargets: Phaser.Physics.Arcade.Sprite[] = [];
  private remainTargets: Phaser.Physics.Arcade.Sprite[] = [];
  private gameOver: boolean = false;
  private levelCount: number = 3;
  private levelDuration: number = 2000 * this.levelCount;
  private TARGET_AREA_MARGIN = 0.25;
  private correctGuesses: number = 0;
  private MIN_VELOCITY: number = -100;
  private MAX_VELOCITY: number = 100;
  private animationTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: "TargetScene" });
  }

  preload() {
    this.load.image("bg", "/assets/tracking_bg_1.jpg");
    this.load.image("bubble", "assets/bubble_15.png");
  }

  create() {
    // Reset all variables when scene starts/restarts
    this.initialTargets = [];
    this.remainTargets = [];
    this.gameOver = false;
    this.correctGuesses = 0;

    this.createBackground();
    this.setupPhysics();
    this.setupLevel();
    this.startAnimationTimer();
  }

  // Clean up resources when scene shuts down
  shutdown() {
    if (this.animationTimer) {
      this.animationTimer.remove();
    }

    // Clear any event listeners
    if (this.targets) {
      this.targets.clear(true, true); // destroy all group members
    }

    this.initialTargets = [];
    this.remainTargets = [];
    this.shutdown();
  }

  private createBackground() {
    this.background = this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.background.setScale(
      this.game.canvas.width / this.background.width,
      this.game.canvas.height / this.background.height
    );
  }

  private setupPhysics() {
    const marginX = this.game.canvas.width * this.TARGET_AREA_MARGIN;
    const marginY = this.game.canvas.height * this.TARGET_AREA_MARGIN;
    const width = this.game.canvas.width * (1 - 2 * this.TARGET_AREA_MARGIN);
    const height = this.game.canvas.height * (1 - 2 * this.TARGET_AREA_MARGIN);

    this.physics.world.setBounds(marginX, marginY, width, height);
  }

  setupLevel() {
    // Create the targets group first
    this.targets = this.physics.add.group({
      collideWorldBounds: true,
      bounceX: 1,
      bounceY: 1,
    });

    // create initial targets
    for (let i = 0; i < this.levelCount; i++) {
      this.time.delayedCall(500 * i, () => {
        const target = this.createTarget();
        this.initialTargets.push(target);
      });
    }

    this.time.delayedCall(500 * this.levelCount, () => {
      for (let i = 0; i < this.levelCount + 1; i++) {
        const target = this.createTarget();
        target.setAlpha(0);
        this.remainTargets.push(target);
      }
    });

    const applyRandomVelocity = (target: Phaser.Physics.Arcade.Sprite) => {
      target.setVelocity(
        Phaser.Math.Between(this.MIN_VELOCITY, this.MAX_VELOCITY)
      );
    };

    this.time.delayedCall(500 * this.levelCount + 500, () => {
      this.initialTargets.forEach(applyRandomVelocity);
      this.remainTargets.forEach(applyRandomVelocity);
    });

    this.time.delayedCall(1000 * this.levelCount, () => {
      this.tweens.add({
        targets: this.remainTargets,
        alpha: 1,
        duration: 600,
        ease: "Linear",
      });
    });

    this.physics.add.collider(this.targets, this.targets);
  }

  createTarget(): Phaser.Physics.Arcade.Sprite {
    const x = Phaser.Math.Between(
      this.game.canvas.width * this.TARGET_AREA_MARGIN,
      this.game.canvas.width * (1 - this.TARGET_AREA_MARGIN)
    );
    const y = Phaser.Math.Between(
      this.game.canvas.height * this.TARGET_AREA_MARGIN,
      this.game.canvas.height * (1 - this.TARGET_AREA_MARGIN)
    );

    const target = this.targets
      .create(x, y, "bubble")
      .setCollideWorldBounds(true)
      .setBounce(1)
      .setDisplaySize(50, 50)
      .setInteractive({ useHandCursor: true });

    target.flipX = target.x < this.game.canvas.width / 2;

    return target;
  }

  private startAnimationTimer() {
    // Store reference to the timer so we can remove it if needed
    this.animationTimer = this.time.addEvent({
      delay: this.levelDuration,
      callback: this.stopAnimation,
      callbackScope: this,
      loop: false,
    });
  }

  private stopAnimation() {
    // Check if targets exists before using it
    if (!this.targets) return;

    this.targets.setVelocity(0, 0);

    this.targets.getChildren().forEach((target) => {
      const spriteTarget = target as Phaser.Physics.Arcade.Sprite;

      // Remove any existing listeners first
      spriteTarget.removeAllListeners("pointerdown");

      spriteTarget.on("pointerdown", () => {
        if (this.gameOver) {
          EventBus.emit("turnsCount");
          return;
        }

        spriteTarget.removeInteractive();
        EventBus.emit("target-clicked"); // Notify React

        const isInitialTarget = this.initialTargets.includes(spriteTarget);

        if (isInitialTarget) {
          spriteTarget.setAlpha(0);
          this.correctGuesses++;

          if (this.correctGuesses === this.levelCount) {
            this.targets.getChildren().forEach((target) => {
              const spriteTarget = target as Phaser.Physics.Arcade.Sprite;
              spriteTarget.setAlpha(0);
            });
            EventBus.emit("winner"); // Notify React
            this.gameOver = true;
            this.displayMessage("You Win!");
          }
        } else {
          this.targets.getChildren().forEach((target) => {
            const spriteTarget = target as Phaser.Physics.Arcade.Sprite;
            spriteTarget.setAlpha(0);
          });
          this.initialTargets.map((target) => target.setAlpha(1));
          EventBus.emit("loser"); // Notify React
          this.gameOver = true;
          this.displayMessage("You Lose!");
        }
      });
    });
  }

  private displayMessage(message: string) {
    this.add
      .text(this.game.canvas.width / 2, this.game.canvas.height / 2, message, {
        font: "32px Arial",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Add restart button
    this.add
      .text(
        this.game.canvas.width / 2,
        this.game.canvas.height / 2 + 50,
        "Restart",
        {
          font: "24px Arial",
          color: "#ffffff",
          backgroundColor: "#445B1F",
          padding: { x: 20, y: 10 },
        }
      )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => {
        // First emit the reset event to update React state
        EventBus.emit("reset");

        // Then restart the scene properly
        this.scene.restart();
      });
  }
}
