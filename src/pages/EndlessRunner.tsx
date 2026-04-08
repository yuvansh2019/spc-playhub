import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getUnlockedLevel } from "@/lib/levels";
import { useToast } from "@/hooks/use-toast";

interface Character {
  id: string;
  name: string;
  emoji: string;
  series: string;
}

interface Skin {
  id: string;
  name: string;
  emoji: string;
  power: string;
}

const characters: Character[] = [
  { id: "tom", name: "Talking Tom", emoji: "🐱", series: "Talking Tom & Friends" },
  { id: "doraemon", name: "Doraemon", emoji: "🤖", series: "Doraemon" },
  { id: "spiderman", name: "Spider-Man", emoji: "🕷️", series: "Marvel" },
  { id: "player", name: "You", emoji: "🧑", series: "SPC" },
];

const skins: Skin[] = [
  { id: "default", name: "Default", emoji: "👤", power: "No special power" },
  { id: "superhero", name: "Superhero", emoji: "🦸", power: "Double jump" },
  { id: "basketball", name: "Basketball Player", emoji: "🏀", power: "Dribble to clear path & get stronger" },
  { id: "student", name: "Super Student", emoji: "🎓", power: "Use mind to clear obstacles" },
];

interface Obstacle {
  id: number;
  x: number;
  type: "box" | "spike" | "castle";
  height: number;
  width: number;
}

interface RoyState {
  x: number;
  visible: boolean;
  captured: boolean;
  atSameSpot: boolean;
}

const GROUND_Y = 320;
const GAME_W = 700;
const GAME_H = 400;
const PLAYER_W = 40;
const PLAYER_H = 50;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const SPEED_BASE = 4;

const EndlessRunner = () => {
  const unlocked = getUnlockedLevel() >= 6;
  const { toast } = useToast();

  const [phase, setPhase] = useState<"cutscene" | "select" | "skin" | "playing" | "revive" | "gameover">("cutscene");
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [selectedSkin, setSelectedSkin] = useState<Skin>(skins[0]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const s = localStorage.getItem("spc_runner_high");
    return s ? parseInt(s) : 0;
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const gameState = useRef({
    playerY: GROUND_Y - PLAYER_H,
    velY: 0,
    jumping: false,
    doubleJump: false,
    obstacles: [] as Obstacle[],
    obstacleId: 0,
    frameCount: 0,
    score: 0,
    speed: SPEED_BASE,
    roy: { x: GAME_W + 500, visible: true, captured: false, atSameSpot: false } as RoyState,
    powerActive: false,
    powerTimer: 0,
    alive: true,
    skinId: "default",
    charEmoji: "🐱",
  });

  const handleJump = useCallback(() => {
    const gs = gameState.current;
    if (!gs.alive) return;
    if (!gs.jumping) {
      gs.velY = JUMP_FORCE;
      gs.jumping = true;
      gs.doubleJump = false;
    } else if (gs.skinId === "superhero" && !gs.doubleJump) {
      gs.velY = JUMP_FORCE;
      gs.doubleJump = true;
    }
  }, []);

  const handlePower = useCallback(() => {
    const gs = gameState.current;
    if (!gs.alive) return;
    if (gs.skinId === "basketball" || gs.skinId === "student") {
      gs.powerActive = true;
      gs.powerTimer = 120; // 2 seconds at 60fps
      toast({ title: gs.skinId === "basketball" ? "🏀 Dribble Power!" : "🎓 Mind Clear!" });
    }
  }, [toast]);

  const handleCapture = useCallback(() => {
    const gs = gameState.current;
    if (gs.roy.atSameSpot && !gs.roy.captured) {
      gs.roy.captured = true;
      gs.score += 500;
      toast({ title: "🎉 Roy Captured!", description: "+500 points!" });
    }
  }, [toast]);

  const startGame = useCallback(() => {
    const gs = gameState.current;
    gs.playerY = GROUND_Y - PLAYER_H;
    gs.velY = 0;
    gs.jumping = false;
    gs.doubleJump = false;
    gs.obstacles = [];
    gs.obstacleId = 0;
    gs.frameCount = 0;
    gs.score = 0;
    gs.speed = SPEED_BASE;
    gs.roy = { x: GAME_W + 800, visible: true, captured: false, atSameSpot: false };
    gs.powerActive = false;
    gs.powerTimer = 0;
    gs.alive = true;
    gs.skinId = selectedSkin.id;
    gs.charEmoji = selectedChar?.emoji || "🐱";
    setScore(0);
    setPhase("playing");
  }, [selectedChar, selectedSkin]);

  const revive = useCallback(() => {
    const gs = gameState.current;
    gs.alive = true;
    gs.playerY = GROUND_Y - PLAYER_H;
    gs.velY = 0;
    gs.jumping = false;
    // Remove nearby obstacles
    gs.obstacles = gs.obstacles.filter(o => o.x > 100);
    setPhase("playing");
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const loop = () => {
      const gs = gameState.current;
      if (!gs.alive) return;

      gs.frameCount++;
      gs.score++;
      gs.speed = SPEED_BASE + Math.floor(gs.frameCount / 500) * 0.5;

      // Gravity
      gs.velY += GRAVITY;
      gs.playerY += gs.velY;
      if (gs.playerY >= GROUND_Y - PLAYER_H) {
        gs.playerY = GROUND_Y - PLAYER_H;
        gs.velY = 0;
        gs.jumping = false;
        gs.doubleJump = false;
      }

      // Power timer
      if (gs.powerActive) {
        gs.powerTimer--;
        if (gs.powerTimer <= 0) gs.powerActive = false;
      }

      // Spawn obstacles
      if (gs.frameCount % Math.max(40, 80 - Math.floor(gs.frameCount / 300)) === 0) {
        const type = Math.random() < 0.15 ? "castle" : Math.random() < 0.5 ? "spike" : "box";
        const h = type === "castle" ? 80 : type === "spike" ? 30 : 40;
        const w = type === "castle" ? 60 : 30;
        gs.obstacles.push({ id: gs.obstacleId++, x: GAME_W, type, height: h, width: w });
      }

      // Move obstacles
      gs.obstacles = gs.obstacles.map(o => ({ ...o, x: o.x - gs.speed })).filter(o => o.x > -100);

      // Move Roy
      if (gs.roy.visible && !gs.roy.captured) {
        gs.roy.x -= gs.speed * 0.3;
        if (gs.roy.x < -50) gs.roy.x = GAME_W + 400 + Math.random() * 600;
        const playerX = 60;
        gs.roy.atSameSpot = Math.abs(gs.roy.x - playerX) < 50;
      }

      // Collision
      const playerX = 60;
      const playerTop = gs.playerY;
      const playerBottom = gs.playerY + PLAYER_H;
      const playerRight = playerX + PLAYER_W;

      for (const o of gs.obstacles) {
        const oTop = GROUND_Y - o.height;
        const oLeft = o.x;
        const oRight = o.x + o.width;

        if (playerRight > oLeft && playerX < oRight && playerBottom > oTop) {
          if (gs.powerActive) {
            gs.obstacles = gs.obstacles.filter(obs => obs.id !== o.id);
            gs.score += 10;
            continue;
          }
          gs.alive = false;
          setScore(gs.score);
          const prev = parseInt(localStorage.getItem("spc_runner_high") || "0");
          if (gs.score > prev) {
            localStorage.setItem("spc_runner_high", String(gs.score));
            setHighScore(gs.score);
          }
          setPhase("revive");
          return;
        }
      }

      // Draw
      ctx.clearRect(0, 0, GAME_W, GAME_H);

      // Sky
      ctx.fillStyle = "#87CEEB";
      ctx.fillRect(0, 0, GAME_W, GROUND_Y);

      // Ground
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(0, GROUND_Y, GAME_W, GAME_H - GROUND_Y);
      ctx.fillStyle = "#228B22";
      ctx.fillRect(0, GROUND_Y, GAME_W, 5);

      // Obstacles
      for (const o of gs.obstacles) {
        if (o.type === "castle") {
          ctx.fillStyle = "#808080";
          ctx.fillRect(o.x, GROUND_Y - o.height, o.width, o.height);
          ctx.fillStyle = "#696969";
          // Turrets
          ctx.fillRect(o.x - 5, GROUND_Y - o.height - 15, 15, 15);
          ctx.fillRect(o.x + o.width - 10, GROUND_Y - o.height - 15, 15, 15);
        } else if (o.type === "spike") {
          ctx.fillStyle = "#DC143C";
          ctx.beginPath();
          ctx.moveTo(o.x, GROUND_Y);
          ctx.lineTo(o.x + o.width / 2, GROUND_Y - o.height);
          ctx.lineTo(o.x + o.width, GROUND_Y);
          ctx.fill();
        } else {
          ctx.fillStyle = "#8B6914";
          ctx.fillRect(o.x, GROUND_Y - o.height, o.width, o.height);
        }
      }

      // Roy
      if (gs.roy.visible && !gs.roy.captured && gs.roy.x > 0 && gs.roy.x < GAME_W) {
        ctx.font = "30px serif";
        ctx.fillText("🦝", gs.roy.x, GROUND_Y - 10);
        if (gs.roy.atSameSpot) {
          ctx.fillStyle = "#FF0000";
          ctx.font = "12px sans-serif";
          ctx.fillText("CAPTURE!", gs.roy.x - 10, GROUND_Y - 45);
        }
      }

      // Player
      ctx.font = "36px serif";
      ctx.fillText(gs.charEmoji, playerX, gs.playerY + 35);

      // Power glow
      if (gs.powerActive) {
        ctx.strokeStyle = gs.skinId === "basketball" ? "#FF8C00" : "#00BFFF";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(playerX + PLAYER_W / 2, gs.playerY + PLAYER_H / 2, 30, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Skin indicator
      const skinEmoji = skins.find(s => s.id === gs.skinId)?.emoji || "";
      if (skinEmoji && gs.skinId !== "default") {
        ctx.font = "16px serif";
        ctx.fillText(skinEmoji, playerX + 30, gs.playerY);
      }

      // HUD
      ctx.fillStyle = "#000";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(`Score: ${gs.score}`, 10, 25);
      ctx.fillText(`Speed: ${gs.speed.toFixed(1)}`, GAME_W - 120, 25);

      setScore(gs.score);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); handleJump(); }
      if (e.code === "KeyP") handlePower();
      if (e.code === "KeyC") handleCapture();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleJump, handlePower, handleCapture]);

  if (!unlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="text-destructive text-xl">🔒 Complete all 5 levels first!</p>
        <Link to="/"><Button variant="outline">Back to Home</Button></Link>
      </div>
    );
  }

  // Cutscene
  if (phase === "cutscene") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 bg-background">
        <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h2 className="text-3xl text-primary">🎬 SPC Official Game</h2>
        <div className="max-w-lg text-center space-y-3 text-muted-foreground">
          <p className="text-lg">🦝 Roy the Raccoon has escaped from the Special Jail!</p>
          <p>He used Ben's jetpack to fly away and hide in his house.</p>
          <p>Meanwhile, at Tom's HQ, the team is searching for Roy...</p>
          <p>Roy has stolen infinite gold and a fake gold-making machine to scam everyone!</p>
          <p className="text-primary font-semibold text-lg mt-4">Your mission: Run, dodge obstacles, and capture Roy!</p>
        </div>
        <Button onClick={() => setPhase("select")} size="lg">Start Mission →</Button>
      </div>
    );
  }

  // Character select
  if (phase === "select") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h2 className="text-2xl text-primary">Choose Your Character</h2>
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {characters.map((c) => (
            <Button
              key={c.id}
              variant={selectedChar?.id === c.id ? "default" : "outline"}
              className="h-24 flex-col gap-1"
              onClick={() => setSelectedChar(c)}
            >
              <span className="text-3xl">{c.emoji}</span>
              <span className="text-sm font-semibold">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.series}</span>
            </Button>
          ))}
        </div>
        {selectedChar && (
          <Button onClick={() => setPhase("skin")} size="lg">Choose Skin →</Button>
        )}
      </div>
    );
  }

  // Skin select
  if (phase === "skin") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h2 className="text-2xl text-primary">Choose Your Skin</h2>
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {skins.map((s) => (
            <Button
              key={s.id}
              variant={selectedSkin.id === s.id ? "default" : "outline"}
              className="h-24 flex-col gap-1"
              onClick={() => setSelectedSkin(s)}
            >
              <span className="text-3xl">{s.emoji}</span>
              <span className="text-sm font-semibold">{s.name}</span>
              <span className="text-xs text-muted-foreground">{s.power}</span>
            </Button>
          ))}
        </div>
        <Button onClick={startGame} size="lg">Run! 🏃</Button>
      </div>
    );
  }

  // Revive screen
  if (phase === "revive") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <h2 className="text-3xl text-destructive">💥 Crashed!</h2>
        <p className="text-lg text-muted-foreground">Score: <strong>{score}</strong></p>
        <p className="text-muted-foreground">Wait to revive or restart</p>
        <ReviveTimer onRevive={revive} />
        <Button onClick={startGame} variant="outline">Restart</Button>
        <Link to="/"><Button variant="ghost">Back to Home</Button></Link>
      </div>
    );
  }

  // Playing
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-4">
      <Link to="/" className="absolute top-4 left-4 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">High: {highScore}</span>
        <h2 className="text-xl text-primary">SPC Runner</h2>
        <span className="text-sm text-muted-foreground">Score: {score}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={GAME_W}
        height={GAME_H}
        className="border-2 border-border rounded-lg cursor-pointer max-w-full"
        onClick={handleJump}
        onTouchStart={(e) => { e.preventDefault(); handleJump(); }}
      />
      <div className="flex gap-2">
        <Button onClick={handleJump} size="sm">Jump (Space)</Button>
        {(selectedSkin.id === "basketball" || selectedSkin.id === "student") && (
          <Button onClick={handlePower} size="sm" variant="secondary">
            Power (P) {selectedSkin.emoji}
          </Button>
        )}
        {gameState.current.roy.atSameSpot && !gameState.current.roy.captured && (
          <Button onClick={handleCapture} size="sm" variant="destructive">
            Capture Roy! (C)
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">Tap/Space to jump • P for power • C to capture Roy</p>
    </div>
  );
};

// Revive timer component
const ReviveTimer = ({ onRevive }: { onRevive: () => void }) => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval);
          onRevive();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onRevive]);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-2xl text-primary">{seconds}s</p>
      <p className="text-sm text-muted-foreground">until auto-revive</p>
      <Button onClick={onRevive} variant="secondary">Revive Now</Button>
    </div>
  );
};

export default EndlessRunner;
