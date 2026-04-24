// Cloud-backed leaderboard (with localStorage fallback for guests)
import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardEntry {
  name: string;
  score: number;
}

const LS_KEY = "spc_db";

interface LocalDB {
  leaderboard: LeaderboardEntry[];
}

function readLocal(): LocalDB {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return { leaderboard: [] };
  try {
    const parsed = JSON.parse(raw);
    return { leaderboard: parsed.leaderboard ?? [] };
  } catch {
    return { leaderboard: [] };
  }
}

function writeLocal(db: LocalDB) {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}

export async function submitScore(name: string, score: number, category = "tap") {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("leaderboard_scores").insert({
      user_id: user.id,
      name,
      score,
      category,
    });
  } else {
    // Guest: save locally
    const db = readLocal();
    db.leaderboard.push({ name, score });
    db.leaderboard.sort((a, b) => b.score - a.score);
    db.leaderboard = db.leaderboard.slice(0, 10);
    writeLocal(db);
  }
}

export async function getLeaderboard(category = "tap"): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from("leaderboard_scores")
    .select("name, score")
    .eq("category", category)
    .order("score", { ascending: false })
    .limit(10);

  if (!error && data && data.length > 0) {
    return data.map((d) => ({ name: d.name, score: Number(d.score) }));
  }
  // Fallback to local
  return readLocal().leaderboard;
}

// Legacy stub kept for the old CheatPanel localStorage path (still works for guests)
export function getLocalLeaderboard(): LeaderboardEntry[] {
  return readLocal().leaderboard;
}
