// localStorage-based database mimicking the server.js logic

export interface User {
  id: string;
  email: string;
  password: string;
  verified: boolean;
  token: string | null;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
}

interface DB {
  users: User[];
  leaderboard: LeaderboardEntry[];
}

function readDB(): DB {
  const raw = localStorage.getItem("spc_db");
  if (!raw) return { users: [], leaderboard: [] };
  return JSON.parse(raw);
}

function writeDB(data: DB) {
  localStorage.setItem("spc_db", JSON.stringify(data));
}

export function signup(email: string, password: string): { message: string; token: string } {
  const db = readDB();
  const token = crypto.randomUUID();
  db.users.push({ id: crypto.randomUUID(), email, password, verified: false, token });
  writeDB(db);
  return { message: "Signup successful. Use the verification link to verify.", token };
}

export function verify(token: string): boolean {
  const db = readDB();
  const user = db.users.find((u) => u.token === token);
  if (!user) return false;
  user.verified = true;
  user.token = null;
  writeDB(db);
  return true;
}

export function login(email: string, password: string): boolean {
  const db = readDB();
  return db.users.some((u) => u.email === email && u.password === password && u.verified);
}

export function submitScore(name: string, score: number) {
  const db = readDB();
  db.leaderboard.push({ name, score });
  db.leaderboard.sort((a, b) => b.score - a.score);
  db.leaderboard = db.leaderboard.slice(0, 10);
  writeDB(db);
}

export function getLeaderboard(): LeaderboardEntry[] {
  return readDB().leaderboard;
}
