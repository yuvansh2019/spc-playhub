import { supabase } from "@/integrations/supabase/client";

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
  syncProgressToCloud(Math.max(level, current));
}

async function syncProgressToCloud(level: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("player_progress")
    .upsert({ user_id: user.id, unlocked_level: level, updated_at: new Date().toISOString() });
}

export async function loadProgressFromCloud(): Promise<number | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("player_progress")
    .select("unlocked_level")
    .eq("user_id", user.id)
    .maybeSingle();
  if (data?.unlocked_level) {
    const local = getUnlockedLevel();
    const merged = Math.max(data.unlocked_level, local);
    localStorage.setItem("level", String(merged));
    if (merged > data.unlocked_level) syncProgressToCloud(merged);
    return merged;
  }
  return null;
}
