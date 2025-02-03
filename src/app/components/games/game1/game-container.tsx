// game-container.tsx
"use client";
import { Game } from "phaser";
import { useEffect, useRef } from "react";
import { EventBus } from "./EventBus";
import config from "./game-config";

// Interface for ref forwarding
export interface ContainerIRef {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

// Props interface
interface ContainerIProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
  ref?: React.RefObject<ContainerIRef | null>;
}

export const GameContainer = ({ currentActiveScene, ref }: ContainerIProps) => {
  const game = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!game.current) {
      game.current = new Game({ ...config });
      if (ref) {
        ref.current = { game: game.current, scene: null };
      }
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        game.current = null;
      }
    };
  }, [ref]);

  useEffect(() => {
    EventBus.on("current-scene-ready", (scene_instance: Phaser.Scene) => {
      if (currentActiveScene) {
        currentActiveScene(scene_instance);
      }
      if (ref) {
        ref.current = { game: game.current, scene: scene_instance };
      }
    });

    return () => {
      EventBus.removeListener("current-scene-ready");
    };
  }, [currentActiveScene, ref]);

  return <div id="game-container" />;
};
