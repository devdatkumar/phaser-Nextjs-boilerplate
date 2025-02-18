// page.tsx
"use client";

import dynamic from "next/dynamic";

export default function Page() {
  const GameWithoutSSR = dynamic(
    () => import(`@/app/components/games/game1/game`),
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
