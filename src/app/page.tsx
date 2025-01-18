"use client";

import dynamic from "next/dynamic";

export default function Page() {
  const GameWithoutSSR = dynamic(
    () => import(`@/app/components/games/game1/game-container`),
    {
      ssr: false,
    }
  );
  return (
    <>
      <GameWithoutSSR />
    </>
  );
}
