import { useState, useRef, useCallback } from "react";
import { submitScore } from "@/lib/db";
import { unlockLevel } from "@/lib/levels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SkipLevel from "@/components/SkipLevel";

const Game = () => {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [won, setWon] = useState(false);
  const [name, setName] = useState("");
  const [tapping, setTapping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRef = useRef(20);
  const scoreRef = useRef(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleTap = useCallback(() => {
    if (finished) return;

    if (!started) {
      setStarted(true);
      timeRef.current = 20;
      timerRef.current = setInterval(() => {
        timeRef.current -= 1;
        setTime(timeRef.current);
        if (timeRef.current === 0) {
          clearInterval(timerRef.current!);
          setFinished(true);
          if (scoreRef.current >= 100) {
            setWon(true);
            unlockLevel(2);
            toast({ title: "🎉 Level Complete!", description: `You tapped ${scoreRef.current} times! Level 2 unlocked.` });
          } else {
            toast({ title: "😢 You Lose!", description: `Only ${scoreRef.current} taps. Need 100!`, variant: "destructive" });
          }
        }
      }, 1000);
    }

    scoreRef.current += 1;
    setScore(scoreRef.current);
    setTapping(true);
    setTimeout(() => setTapping(false), 100);
  }, [started, finished, toast]);

  const handleSubmitScore = () => {
    if (!name.trim()) {
      toast({ title: "Enter your name first", variant: "destructive" });
      return;
    }
    submitScore(name, scoreRef.current);
    toast({ title: "Score submitted!" });
  };

  const reset = () => {
    setScore(0);
    setTime(20);
    setStarted(false);
    setFinished(false);
    setWon(false);
    scoreRef.current = 0;
    timeRef.current = 20;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <h2 className="text-3xl text-primary">Level 1 – Tap Challenge</h2>
      <p className="text-muted-foreground">Tap 100 times in 20 seconds</p>

      <div className="flex gap-8 text-2xl font-body">
        <span>⏱ <strong className="text-secondary">{time}</strong>s</span>
        <span>👆 <strong className="text-accent">{score}</strong></span>
      </div>

      {!finished ? (
        <Button
          onClick={handleTap}
          className={`h-32 w-32 rounded-full text-2xl shadow-[var(--shadow-button)] transition-transform ${tapping ? "scale-90" : ""}`}
          style={{ background: "var(--gradient-hero)" }}
        >
          TAP
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-3 w-full max-w-sm">
          <p className="text-lg text-muted-foreground">Final score: <strong>{score}</strong></p>
          {won && (
            <Button onClick={() => navigate("/hard-math")} className="w-full">
              Continue to Level 2 →
            </Button>
          )}
          <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={handleSubmitScore} variant="secondary" className="w-full">Submit Score</Button>
          <Button onClick={reset} variant="outline" className="w-full">Play Again</Button>
        </div>
      )}
      {!finished && <SkipLevel nextLevel={2} nextPath="/hard-math" />}
    </div>
  );
};

export default Game;
