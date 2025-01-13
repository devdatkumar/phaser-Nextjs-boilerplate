"use client";
import { useEffect, useRef } from "react";
import { config } from "./config";
import { EventBus } from "./events";
import { Game } from "phaser";

interface IProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
  ref?: React.RefObject<IRefPhaserGame | null>;
}

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

export const GameContainer = ({ currentActiveScene, ref }: IProps) => {
  const game = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!game.current) {
      game.current = new Game({ ...config });
      if (ref) {
        ref.current = { game: game.current, scene: null };
      }
    }

    return () => {
      game.current?.destroy(true);
      game.current = null;
    };
  }, [ref]);

  useEffect(() => {
    const handleSceneReady = (scene_instance: Phaser.Scene) => {
      currentActiveScene?.(scene_instance);
      if (ref) {
        ref.current = { game: game.current, scene: scene_instance };
      }
    };

    EventBus.on("current-scene-ready", handleSceneReady);

    return () => {
      EventBus.removeListener("current-scene-ready");
    };
  }, [currentActiveScene, ref]);

  return <div id="game-container" />;
};
