import { getLeaderboard } from "@/lib/db";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy } from "lucide-react";

const medals = ["🥇", "🥈", "🥉"];

const Leaderboard = () => {
  const data = getLeaderboard();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <div className="flex items-center gap-2">
        <Trophy className="h-8 w-8 text-accent" />
        <h2 className="text-3xl text-primary">Leaderboard</h2>
      </div>

      {data.length === 0 ? (
        <p className="text-muted-foreground">No scores yet. Be the first!</p>
      ) : (
        <div className="w-full max-w-md space-y-2">
          {data.map((entry, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-[var(--shadow-card)]">
              <span className="text-lg">
                {medals[i] || `#${i + 1}`} <strong>{entry.name}</strong>
              </span>
              <span className="font-display text-lg text-secondary">{entry.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
