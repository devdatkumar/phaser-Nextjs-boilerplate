// game.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import {
  ContainerIRef,
  GameContainer,
} from "@/app/components/games/game1/game-container";
import TrackerBar from "./trackerbar";
import { EventBus } from "./EventBus";

const INITIAL_TURNS = 9;

const Game = () => {
  const phaserRef = useRef<ContainerIRef | null>(null);
  const [leftArrowCount, setLeftArrowCount] = useState(0);
  const [rightArrowCount, setRightArrowCount] = useState(0);
  const [turnsCount, setTurnsCount] = useState(INITIAL_TURNS);

  useEffect(() => {
    const handleWinner = () => {
      if (rightArrowCount < 3) {
        setRightArrowCount((prev) => prev + 1);
        setTurnsCount((prev) => prev - 1);
      }
    };

    const handleLoser = () => {
      if (leftArrowCount < 2) {
        setLeftArrowCount((prev) => prev + 1);
        setTurnsCount((prev) => prev - 1);
      }
    };

    // Add listeners
    EventBus.on("winner", handleWinner);
    EventBus.on("loser", handleLoser);

    // Clean up all listeners when component unmounts
    return () => {
      EventBus.off("winner", handleWinner);
      EventBus.off("loser", handleLoser);
    };
  }, []); // Dependencies required for your conditional logic

  return (
    <div>
      <TrackerBar
        leftCount={leftArrowCount}
        rightCount={rightArrowCount}
        turnsCount={turnsCount}
        starValue={3}
      />
      <GameContainer ref={phaserRef} />
    </div>
  );
};

export default Game;
