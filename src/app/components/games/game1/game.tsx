// game.tsx
"use client";
import { useRef, useState, useEffect } from "react";
import {
  ContainerIRef,
  GameContainer,
} from "@/app/components/games/game1/game-container";
import TrackerBar from "./trackerbar";
import { EventBus } from "./EventBus";

const Game = () => {
  const phaserRef = useRef<ContainerIRef | null>(null);
  const [leftCount, setLeftCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);
  const [turnsCount, setTurnsCount] = useState(9);

  // Listen for target clicks from Phaser
  useEffect(() => {
    const handleTargetClicked = () => {
      setTurnsCount((prev) => Math.max(prev - 1, 0));
    };
    EventBus.on("target-clicked", handleTargetClicked);
    return () => {
      EventBus.off("target-clicked", handleTargetClicked);
    };
  }, []);

  useEffect(() => {
    const handleWinner = () => {
      if (turnsCount > 0 && rightCount < 3) {
        setRightCount((prev) => prev + 1);
        setTurnsCount((prev) => prev - 1);
      }
    };
    EventBus.on("winner", handleWinner);
    return () => {
      EventBus.off("winner", handleWinner);
    };
  }, []);

  useEffect(() => {
    const handleLooser = () => {
      if (turnsCount > 0 && leftCount < 2) {
        setLeftCount((prev) => prev + 1);
        setTurnsCount((prev) => prev - 1);
      }
    };
    EventBus.on("loser", handleLooser);
    return () => {
      EventBus.off("loser", handleLooser);
    };
  }, []);

  return (
    <div>
      <TrackerBar
        leftCount={leftCount}
        rightCount={rightCount}
        turnsCount={turnsCount}
        startValue={3}
      />
      <GameContainer ref={phaserRef} />
    </div>
  );
};

export default Game;
