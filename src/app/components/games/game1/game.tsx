"use client";
import { useRef, useState } from "react";
import { IRefPhaserGame, GameContainer } from "./game-container";
import { MainMenu } from "./scenes/main-menu";

const Game = () => {
  // The sprite can only be moved in the MainMenu Scene
  const [canMoveSprite, setCanMoveSprite] = useState(true);

  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });

  const changeScene = () => {
    const scene = phaserRef.current?.scene as MainMenu;
    scene?.changeScene();
  };

  const moveSprite = () => {
    const scene = phaserRef.current?.scene as MainMenu;

    if (scene?.scene.key === "MainMenu") {
      scene.moveLogo(({ x, y }) => {
        setSpritePosition({ x, y });
      });
    }
  };

  const addSprite = () => {
    const scene = phaserRef.current?.scene;

    if (scene) {
      const x = Phaser.Math.Between(64, scene.scale.width - 64);
      const y = Phaser.Math.Between(64, scene.scale.height - 64);

      const star = scene.add.sprite(x, y, "star");

      scene.add.tween({
        targets: star,
        duration: 500 + Math.random() * 1000,
        alpha: 0,
        yoyo: true,
        repeat: -1,
      });
    }
  };

  const currentScene = (scene: Phaser.Scene) => {
    setCanMoveSprite(scene.scene.key !== "MainMenu");
  };

  return (
    <div id="app">
      <GameContainer ref={phaserRef} currentActiveScene={currentScene} />
      <div>
        <div>
          <button type="button" className="button" onClick={changeScene}>
            Change Scene
          </button>
        </div>
        <div>
          <button
            type="button"
            disabled={canMoveSprite}
            className="button"
            onClick={moveSprite}
          >
            Toggle Movement
          </button>
        </div>
        <div className="spritePosition">
          Sprite Position:
          <pre>{JSON.stringify(spritePosition, null, 2)}</pre>
        </div>
        <div>
          <button type="button" className="button" onClick={addSprite}>
            Add New Sprite
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
