import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { unlockLevel, getUnlockedLevel } from "@/lib/levels";

interface Apple {
  id: number;
  x: number;
  y: number;
  speed: number;
}

const GAME_WIDTH = 360;
const GAME_HEIGHT = 500;
const BASKET_WIDTH = 60;
const APPLE_SIZE = 28;
const TARGET = 500;
const TIME_LIMIT = 300; // 5 minutes

const AppleCollector = () => {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [basketX, setBasketX] = useState(GAME_WIDTH / 2 - BASKET_WIDTH / 2);
  const [apples, setApples] = useState<Apple[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const lastSpawn = useRef(0);
  const appleId = useRef(0);
  const scoreRef = useRef(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const unlocked = getUnlockedLevel() >= 3;

  if (!unlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="text-destructive text-xl">🔒 Complete Level 2 first!</p>
        <Link to="/"><Button variant="outline">Back to Home</Button></Link>
      </div>
    );
  }

  const handleComplete = useCallback(() => {
    setCompleted(true);
    unlockLevel(4);
    toast({ title: "🎉 Level Complete!", description: "Level 4 unlocked!" });
  }, [toast]);

  // Timer
  useEffect(() => {
    if (!started || completed || gameOver) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          if (scoreRef.current < TARGET) {
            setGameOver(true);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, completed, gameOver]);

  // Game loop
  useEffect(() => {
    if (!started || completed || gameOver) return;

    let applesState: Apple[] = [];

    const loop = (timestamp: number) => {
      // Spawn apple every 200ms
      if (timestamp - lastSpawn.current > 200) {
        lastSpawn.current = timestamp;
        const newApple: Apple = {
          id: appleId.current++,
          x: Math.random() * (GAME_WIDTH - APPLE_SIZE),
          y: -APPLE_SIZE,
          speed: 2 + Math.random() * 3,
        };
        applesState = [...applesState, newApple];
      }

      // Move apples
      applesState = applesState
        .map((a) => ({ ...a, y: a.y + a.speed }))
        .filter((a) => {
          // Check catch
          const basketLeft = basketXRef.current;
          const basketRight = basketLeft + BASKET_WIDTH;
          const appleCenter = a.x + APPLE_SIZE / 2;
          if (
            a.y + APPLE_SIZE >= GAME_HEIGHT - 30 &&
            a.y + APPLE_SIZE <= GAME_HEIGHT &&
            appleCenter >= basketLeft &&
            appleCenter <= basketRight
          ) {
            scoreRef.current += 1;
            setScore(scoreRef.current);
            if (scoreRef.current >= TARGET) {
              handleComplete();
            }
            return false;
          }
          // Remove if fallen past
          return a.y < GAME_HEIGHT + 10;
        });

      setApples([...applesState]);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [started, completed, gameOver, handleComplete]);

  const basketXRef = useRef(basketX);
  basketXRef.current = basketX;

  // Mouse/touch control
  const handleMove = useCallback((clientX: number) => {
    if (!gameRef.current) return;
    const rect = gameRef.current.getBoundingClientRect();
    let x = clientX - rect.left - BASKET_WIDTH / 2;
    x = Math.max(0, Math.min(GAME_WIDTH - BASKET_WIDTH, x));
    setBasketX(x);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (!started) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h2 className="text-3xl text-primary">Level 3 – Apple Collector</h2>
        <p className="text-muted-foreground">🍎 Collect {TARGET} apples in 5 minutes!</p>
        <p className="text-sm text-muted-foreground">Move your mouse/finger to catch falling apples with the basket.</p>
        <Button onClick={() => setStarted(true)} size="lg">Start Game</Button>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h2 className="text-3xl text-primary">Level 3 – Apple Collector</h2>
        <p className="text-2xl text-secondary">✅ Level Complete! You collected {scoreRef.current} apples!</p>
        <Button onClick={() => navigate("/game-builder")}>Continue to Level 4 →</Button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h2 className="text-3xl text-primary">Time's Up!</h2>
        <p className="text-lg text-muted-foreground">You collected {scoreRef.current} / {TARGET} apples.</p>
        <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <h2 className="text-2xl text-primary">Level 3 – Apple Collector</h2>
      <div className="flex gap-6 text-lg">
        <span>⏱ <strong className="text-secondary">{formatTime(timeLeft)}</strong></span>
        <span>🍎 <strong className="text-accent">{score}</strong> / {TARGET}</span>
      </div>

      <div
        ref={gameRef}
        className="relative border-2 border-border rounded-lg overflow-hidden bg-card cursor-none select-none"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onMouseMove={(e) => handleMove(e.clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      >
        {/* Apples */}
        {apples.map((a) => (
          <div
            key={a.id}
            className="absolute text-2xl select-none pointer-events-none"
            style={{ left: a.x, top: a.y, width: APPLE_SIZE, height: APPLE_SIZE }}
          >
            🍎
          </div>
        ))}

        {/* Basket */}
        <div
          className="absolute bottom-0 text-3xl text-center pointer-events-none"
          style={{ left: basketX, width: BASKET_WIDTH, height: 30 }}
        >
          🧺
        </div>
      </div>
    </div>
  );
};

export default AppleCollector;
