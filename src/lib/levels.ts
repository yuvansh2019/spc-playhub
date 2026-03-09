export interface Level {
  id: number;
  title: string;
  path: string;
}

export const levels: Level[] = [
  { id: 1, title: "Tap Challenge", path: "/game" },
  { id: 2, title: "Hard Math Challenge", path: "/hard-math" },
  { id: 3, title: "Apple Collector", path: "/apple-collector" },
  { id: 4, title: "Game Builder", path: "/game-builder" },
  { id: 5, title: "SPC Game Maker", path: "/spc-game-maker" },
];

export function getUnlockedLevel(): number {
  const stored = localStorage.getItem("level");
  return stored ? parseInt(stored, 10) : 1;
}

export function unlockLevel(level: number) {
  const current = getUnlockedLevel();
  if (level > current) {
    localStorage.setItem("level", String(level));
  }
}
