import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Load assets
    this.load.image("logo", "/assets/logo.png");
    this.load.image("bg", "/assets/bg.png");
  }

  create() {
    // Add a logo image to the center of the screen

    const bg = this.add.image(100, 100, "bg");
    bg.setScale(2);
    const logo = this.add.image(300, 300, "logo");
    logo.setScale(0.5);

    // Create a tween to rotate the logo
    const rotateTween = this.tweens.add({
      targets: logo,
      angle: 360, // Rotate by 360 degrees
      duration: 2000, // 2 seconds
      repeat: -1, // Repeat indefinitely
      ease: "Linear", // Smooth rotation
      paused: true, // Start paused, will be played on first click
    });

    // Animate the logo's scale (size)
    const scaleTween = this.tweens.add({
      targets: logo,
      scale: 1, // Scale to original size
      duration: 2000, // 2 seconds
      yoyo: true, // Go back to the original size
      repeat: -1, // Repeat indefinitely
      paused: true, // Start paused, will be played on first click
    });

    // Set the logo as interactive to listen for clicks
    logo.setInteractive();

    // Flag to track whether tweens are paused or playing
    let isPaused = true;

    // Handle the click event
    logo.on("pointerdown", function () {
      if (isPaused) {
        // Resume the tweens when they are paused
        rotateTween.play();
        scaleTween.play();
        isPaused = false; // Tweens are now playing
      } else {
        // Stop the tweens when they are playing
        rotateTween.pause();
        scaleTween.pause();
        isPaused = true; // Tweens are paused now
      }
    });
  }
}
