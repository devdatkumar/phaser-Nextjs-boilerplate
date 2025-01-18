"use client";
import { Types, Game } from "phaser";
import { useEffect } from "react";
// import { Boot } from "./scenes/scene1";
import { Bubble } from "./scenes/scene2";

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO, // Auto-detect WebGL or Canvas
  mode: Phaser.Scale.FIT,

  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        x: 0,
        y: 200,
      },
      debug: true,
    },
  },
  scene: [Bubble],
};

export default function GameContainer() {
  useEffect(() => {
    const game = new Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div id="game-container" />;
}
