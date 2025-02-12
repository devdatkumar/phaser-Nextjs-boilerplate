// game-config.tsx
"use client";
import { Types } from "phaser";
import { Target } from "./scene1";

const config: Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: 1024,
  height: 768,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        x: 0,
        y: 0,
      },
      debug: process.env.NODE_ENV === "development",
    },
  },
  scene: [Target],
};

export default config;
