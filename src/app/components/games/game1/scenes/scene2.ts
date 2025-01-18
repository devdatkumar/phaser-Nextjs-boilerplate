import { Scene } from "phaser";

export class Bubble extends Scene {
  private bubbles: Phaser.GameObjects.Graphics[] = [];

  constructor() {
    super("Bubble");
  }

  preload() {
    this.load.image("bg", "/assets/bg.png");
  }

  create() {
    this.add.image(100, 100, "bg").setScale(2);

    // Create an initial bubble
    this.createBubble();

    this.applyBlurAndAddBubbles();
  }

  createBubble(): Phaser.GameObjects.Graphics {
    const radius = 20; // Fixed radius for the bubble
    const bubble = this.add.graphics({
      x: Phaser.Math.Between(100, 600),
      y: Phaser.Math.Between(100, 600),
    });

    // Draw the circle (bubble)
    bubble.fillStyle(0xffff00, 1); // Light blue color
    bubble.fillCircle(0, 0, radius);

    bubble.setData("radius", radius);

    // Enable interactive behavior for the bubble
    bubble.setInteractive(
      new Phaser.Geom.Circle(0, 0, radius),
      Phaser.Geom.Circle.Contains
    );

    // Add click event listener
    bubble.on("pointerdown", () => {
      if (this.bubbles[0] === bubble) {
        // If it's the first bubble, turn it green
        bubble.clear(); // Clear previous graphics
        bubble.fillStyle(0x00ff00, 1); // Green color
        bubble.fillCircle(0, 0, radius);
      } else {
        // If it's not the first bubble, turn it red
        bubble.clear(); // Clear previous graphics
        bubble.fillStyle(0xff0000, 1); // Red color
        bubble.fillCircle(0, 0, radius);
      }
    });

    // Add the bubble to the array
    this.bubbles.push(bubble);

    return bubble; // Return the bubble
  }

  applyBlurAndAddBubbles() {
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.cameras.main.fadeOut(500);

        this.time.addEvent({
          delay: 1000,
          callback: () => {
            const numOfBubbles = 2;
            for (let i = 0; i < numOfBubbles; i++) {
              this.createBubble();
            }
            this.cameras.main.fadeIn(1000);

            this.time.addEvent({
              delay: 1000,
              callback: () => {
                this.bubbles.forEach((bubble) => {
                  this.moveBubbleWithTween(bubble, 100);
                });
              },
              callbackScope: this,
            });
          },
          callbackScope: this,
        });
      },
      callbackScope: this,
    });
  }

  // Helper function to animate a bubble's movement
  moveBubbleWithTween(bubble: Phaser.GameObjects.Graphics, distance: number) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2); // Random direction
    const targetX = bubble.x + Math.cos(angle) * distance;
    const targetY = bubble.y + Math.sin(angle) * distance;

    // Animate the bubble's position using tweens
    this.tweens.add({
      targets: bubble,
      x: targetX,
      y: targetY,
      duration: 1000, // Animation duration (1 second)
      ease: "Power1", // Easing function
    });
  }

  update() {
    // Handle any necessary updates if bubbles require ongoing interaction
    // For now, movement is managed by tweens
  }
}
