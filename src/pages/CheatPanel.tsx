import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Unlock, Edit, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CHEAT_PIN = "1108";

const CheatPanel = () => {
  const [phase, setPhase] = useState<"locked" | "pin" | "panel" | "edit">("locked");
  const [pin, setPin] = useState("");
  const [editPin, setEditPin] = useState("");
  const [points, setPoints] = useState("");
  const [playerName, setPlayerName] = useState("");
  const { toast } = useToast();

  const handleUnlock = () => {
    if (pin === CHEAT_PIN) {
      setPhase("panel");
      setPin("");
    } else {
      toast({ title: "Incorrect password", variant: "destructive" });
    }
  };

  const handleEditUnlock = () => {
    if (editPin === CHEAT_PIN) {
      setPhase("edit");
      setEditPin("");
    } else {
      toast({ title: "Incorrect password", variant: "destructive" });
    }
  };

  const mathCheck = () => {
    // 11 × 11 = 121
    return true;
  };

  const addPoints = () => {
    if (!playerName.trim()) {
      toast({ title: "Enter a player name", variant: "destructive" });
      return;
    }
    const numPoints = parseNumber(points);
    if (numPoints <= 0) {
      toast({ title: "Enter a valid number of points", variant: "destructive" });
      return;
    }

    // Add to leaderboard
    const raw = localStorage.getItem("spc_db");
    const db = raw ? JSON.parse(raw) : { users: [], leaderboard: [] };
    db.leaderboard.push({ name: playerName, score: numPoints });
    db.leaderboard.sort((a: { score: number }, b: { score: number }) => b.score - a.score);
    db.leaderboard = db.leaderboard.slice(0, 10);
    localStorage.setItem("spc_db", JSON.stringify(db));

    toast({ title: `Added ${formatNumber(numPoints)} points to ${playerName}!` });
    setPoints("");
    setPlayerName("");
  };

  const unlockAll = () => {
    localStorage.setItem("level", "6");
    toast({ title: "All levels unlocked!" });
  };

  const resetProgress = () => {
    localStorage.removeItem("level");
    toast({ title: "Progress reset!" });
  };

  if (phase === "locked") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <Lock className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-3xl text-primary">Secret Panel</h2>
        <p className="text-muted-foreground">This area is restricted.</p>
        <p className="text-sm text-muted-foreground">First, solve: 11 × 11 = ?</p>
        <Input
          placeholder="Answer"
          className="w-40 text-center"
          onChange={(e) => {
            if (e.target.value === "121") {
              setPhase("pin");
              toast({ title: "Correct! Now enter the PIN." });
            }
          }}
        />
      </div>
    );
  }

  if (phase === "pin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <Unlock className="h-16 w-16 text-primary" />
        <h2 className="text-2xl text-primary">Enter PIN</h2>
        <Input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-40 text-center"
          maxLength={4}
        />
        <Button onClick={handleUnlock}>Unlock</Button>
      </div>
    );
  }

  if (phase === "edit") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <Edit className="h-10 w-10 text-primary" />
        <h2 className="text-2xl text-primary">Edit Mode</h2>
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Button onClick={unlockAll} variant="secondary">Unlock All Levels</Button>
          <Button onClick={resetProgress} variant="destructive">Reset All Progress</Button>
          <Button onClick={() => {
            localStorage.setItem("spc_runner_high", "0");
            toast({ title: "Runner high score reset!" });
          }} variant="outline">Reset Runner High Score</Button>
        </div>
        <Button onClick={() => setPhase("panel")} variant="ghost">← Back to Panel</Button>
      </div>
    );
  }

  // Panel
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <Sparkles className="h-10 w-10 text-primary" />
      <h2 className="text-2xl text-primary">⚡ Cheat Panel</h2>

      <div className="flex flex-col gap-4 w-full max-w-sm bg-card p-6 rounded-lg border shadow-lg">
        <h3 className="text-lg font-semibold">Add Points</h3>
        <Input placeholder="Player name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
        <Input placeholder="Points (e.g. 1000000)" value={points} onChange={(e) => setPoints(e.target.value)} />
        <Button onClick={addPoints}>Add Points</Button>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <Button onClick={unlockAll} variant="secondary">Unlock All Levels</Button>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground text-center">Edit mode requires PIN</p>
          <Input
            type="password"
            placeholder="PIN for edit access"
            value={editPin}
            onChange={(e) => setEditPin(e.target.value)}
            className="text-center"
            maxLength={4}
          />
          <Button onClick={handleEditUnlock} variant="outline" className="gap-2">
            <Edit className="h-4 w-4" /> Edit Mode
          </Button>
        </div>
      </div>
    </div>
  );
};

function parseNumber(s: string): number {
  const clean = s.toLowerCase().trim().replace(/,/g, "");
  const multipliers: Record<string, number> = {
    million: 1e6, billion: 1e9, trillion: 1e12,
    quadrillion: 1e15, quintillion: 1e18, sextillion: 1e21,
    septillion: 1e24, octillion: 1e27, nonillion: 1e30,
    decillion: 1e33, undecillion: 1e36,
  };
  for (const [word, mult] of Object.entries(multipliers)) {
    if (clean.includes(word)) {
      const num = parseFloat(clean.replace(word, "").trim()) || 1;
      return num * mult;
    }
  }
  return parseInt(clean) || 0;
}

function formatNumber(n: number): string {
  if (n >= 1e36) return (n / 1e36).toFixed(1) + " undecillion";
  if (n >= 1e33) return (n / 1e33).toFixed(1) + " decillion";
  if (n >= 1e15) return (n / 1e15).toFixed(1) + " quadrillion";
  if (n >= 1e12) return (n / 1e12).toFixed(1) + " trillion";
  if (n >= 1e9) return (n / 1e9).toFixed(1) + " billion";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + " million";
  return n.toLocaleString();
}

export default CheatPanel;
