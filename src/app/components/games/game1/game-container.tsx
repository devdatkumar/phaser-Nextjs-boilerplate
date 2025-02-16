// game-container.tsx
"use client";
import { Game } from "phaser";
import { useEffect, useRef } from "react";
import config from "./game-config";

// Interface for ref forwarding
export interface ContainerIRef {
  game: Phaser.Game | null;
}

// Props interface
interface ContainerIProps {
  ref?: React.RefObject<ContainerIRef | null>;
}

export const GameContainer = ({ ref }: ContainerIProps) => {
  const game = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!game.current) {
      game.current = new Game({ ...config });
      if (ref) {
        ref.current = { game: game.current };
      }
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        game.current = null;
      }
    };
  }, [ref]);

  return <div id="game-container" />;
};
