import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Trash2, Play, Square, Move, MousePointer,
  Box, Circle, Triangle, Palette, Settings, Save, Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { unlockLevel, getUnlockedLevel } from "@/lib/levels";
import SkipLevel from "@/components/SkipLevel";

interface GameObject {
  id: string;
  type: "rect" | "circle" | "triangle" | "player" | "enemy" | "coin";
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label: string;
  vx: number;
  vy: number;
  gravity: boolean;
  solid: boolean;
}

type Tool = "select" | "move" | "rect" | "circle" | "player" | "enemy" | "coin";

const COLORS = ["#4f46e5", "#22c55e", "#ef4444", "#eab308", "#ec4899", "#06b6d4", "#f97316", "#8b5cf6"];
const CANVAS_W = 600;
const CANVAS_H = 400;

const GameBuilder = () => {
  const unlocked = getUnlockedLevel() >= 4;
  const { toast } = useToast();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [objects, setObjects] = useState<GameObject[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>("select");
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [gameName, setGameName] = useState("My Game");
  const [dragging, setDragging] = useState<{ id: string; ox: number; oy: number } | null>(null);

  const playStateRef = useRef<GameObject[]>([]);
  const animRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());

  // Drawing
  const draw = useCallback((objs: GameObject[]) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.strokeStyle = "hsl(var(--border))";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < CANVAS_W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke(); }
    for (let y = 0; y < CANVAS_H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke(); }
    objs.forEach(o => {
      ctx.fillStyle = o.color;
      if (o.type === "circle" || o.type === "coin") {
        ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h / 2, o.w / 2, 0, Math.PI * 2); ctx.fill();
      } else if (o.type === "triangle") {
        ctx.beginPath(); ctx.moveTo(o.x + o.w / 2, o.y); ctx.lineTo(o.x + o.w, o.y + o.h); ctx.lineTo(o.x, o.y + o.h); ctx.closePath(); ctx.fill();
      } else {
        ctx.fillRect(o.x, o.y, o.w, o.h);
      }
      if (o.id === selected && !playing) {
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
        ctx.strokeRect(o.x - 2, o.y - 2, o.w + 4, o.h + 4); ctx.setLineDash([]);
      }
      ctx.fillStyle = "#fff"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(o.label, o.x + o.w / 2, o.y - 4);
    });
  }, [selected, playing]);

  useEffect(() => {
    if (!playing) draw(objects);
  }, [objects, selected, playing, draw]);

  if (!unlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="text-destructive text-xl">🔒 Complete Level 3 first!</p>
        <Link to="/"><Button variant="outline">Back to Home</Button></Link>
      </div>
    );
  }

  const selectedObj = objects.find(o => o.id === selected);

  const addObject = (type: GameObject["type"]) => {
    const id = Date.now().toString(36);
    const defaults: Record<string, Partial<GameObject>> = {
      rect: { w: 60, h: 40, color: "#4f46e5", label: "Block" },
      circle: { w: 40, h: 40, color: "#06b6d4", label: "Ball" },
      player: { w: 30, h: 30, color: "#22c55e", label: "Player" },
      enemy: { w: 30, h: 30, color: "#ef4444", label: "Enemy" },
      coin: { w: 20, h: 20, color: "#eab308", label: "Coin" },
    };
    const d = defaults[type] || defaults.rect;
    const obj: GameObject = {
      id, type, x: 100 + Math.random() * 200, y: 100 + Math.random() * 150,
      w: d.w!, h: d.h!, color: d.color!, label: d.label!,
      vx: 0, vy: 0, gravity: type === "player" || type === "enemy",
      solid: type === "rect",
    };
    setObjects(prev => [...prev, obj]);
    setSelected(id);
  };

  const deleteSelected = () => {
    if (!selected) return;
    setObjects(prev => prev.filter(o => o.id !== selected));
    setSelected(null);
  };

  const updateSelected = (patch: Partial<GameObject>) => {
    setObjects(prev => prev.map(o => o.id === selected ? { ...o, ...patch } : o));
  };

  // Drawing
  const draw = useCallback((objs: GameObject[]) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Grid
    ctx.strokeStyle = "hsl(var(--border))";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < CANVAS_W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke(); }
    for (let y = 0; y < CANVAS_H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke(); }

    objs.forEach(o => {
      ctx.fillStyle = o.color;
      if (o.type === "circle" || o.type === "coin") {
        ctx.beginPath();
        ctx.arc(o.x + o.w / 2, o.y + o.h / 2, o.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (o.type === "triangle") {
        ctx.beginPath();
        ctx.moveTo(o.x + o.w / 2, o.y);
        ctx.lineTo(o.x + o.w, o.y + o.h);
        ctx.lineTo(o.x, o.y + o.h);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(o.x, o.y, o.w, o.h);
      }

      // Selection highlight
      if (o.id === selected && !playing) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(o.x - 2, o.y - 2, o.w + 4, o.h + 4);
        ctx.setLineDash([]);
      }

      // Label
      ctx.fillStyle = "#fff";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(o.label, o.x + o.w / 2, o.y - 4);
    });
  }, [selected, playing]);

  // Editor drawing
  useEffect(() => {
    if (!playing) draw(objects);
  }, [objects, selected, playing, draw]);

  // Play mode
  const startPlay = () => {
    playStateRef.current = objects.map(o => ({ ...o }));
    setPlaying(true);
    keysRef.current.clear();

    const onKey = (e: KeyboardEvent) => {
      if (e.type === "keydown") keysRef.current.add(e.key);
      else keysRef.current.delete(e.key);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);

    const loop = () => {
      const objs = playStateRef.current;
      const keys = keysRef.current;
      const player = objs.find(o => o.type === "player");
      if (player) {
        if (keys.has("ArrowLeft") || keys.has("a")) player.x -= 4;
        if (keys.has("ArrowRight") || keys.has("d")) player.x += 4;
        if (keys.has("ArrowUp") || keys.has("w")) player.y -= 4;
        if (keys.has("ArrowDown") || keys.has("s")) player.y += 4;
        player.x = Math.max(0, Math.min(CANVAS_W - player.w, player.x));
        player.y = Math.max(0, Math.min(CANVAS_H - player.h, player.y));
      }

      // Enemies chase player
      objs.filter(o => o.type === "enemy").forEach(e => {
        if (player) {
          const dx = player.x - e.x;
          const dy = player.y - e.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          e.x += (dx / dist) * 1.5;
          e.y += (dy / dist) * 1.5;
        }
      });

      // Coin collection
      if (player) {
        const before = objs.length;
        playStateRef.current = objs.filter(o => {
          if (o.type === "coin") {
            const dx = (player.x + player.w / 2) - (o.x + o.w / 2);
            const dy = (player.y + player.h / 2) - (o.y + o.h / 2);
            return Math.sqrt(dx * dx + dy * dy) > 20;
          }
          return true;
        });
        if (playStateRef.current.length < before) {
          toast({ title: "🪙 Coin collected!" });
        }
      }

      // Gravity
      objs.filter(o => o.gravity).forEach(o => {
        o.vy = Math.min((o.vy || 0) + 0.3, 6);
        o.y += o.vy;
        // Floor collision
        if (o.y + o.h > CANVAS_H) { o.y = CANVAS_H - o.h; o.vy = 0; }
        // Solid block collision
        objs.filter(b => b.solid && b.id !== o.id).forEach(b => {
          if (o.x < b.x + b.w && o.x + o.w > b.x && o.y + o.h > b.y && o.y < b.y + b.h) {
            o.y = b.y - o.h;
            o.vy = 0;
          }
        });
      });

      draw(playStateRef.current);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  };

  const stopPlay = () => {
    setPlaying(false);
    cancelAnimationFrame(animRef.current);
  };

  const completeLevel = () => {
    if (objects.length < 3) {
      toast({ title: "Add at least 3 objects to complete!", variant: "destructive" });
      return;
    }
    setCompleted(true);
    unlockLevel(5);
    toast({ title: "🎉 Level 4 Complete!" });
  };

  // Canvas mouse events
  const onCanvasMouseDown = (e: React.MouseEvent) => {
    if (playing) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (CANVAS_W / rect.width);
    const my = (e.clientY - rect.top) * (CANVAS_H / rect.height);

    if (tool !== "select" && tool !== "move") {
      addObject(tool);
      return;
    }

    // Hit test
    const hit = [...objects].reverse().find(o =>
      mx >= o.x && mx <= o.x + o.w && my >= o.y && my <= o.y + o.h
    );
    if (hit) {
      setSelected(hit.id);
      setDragging({ id: hit.id, ox: mx - hit.x, oy: my - hit.y });
    } else {
      setSelected(null);
    }
  };

  const onCanvasMouseMove = (e: React.MouseEvent) => {
    if (!dragging || playing) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (CANVAS_W / rect.width);
    const my = (e.clientY - rect.top) * (CANVAS_H / rect.height);
    setObjects(prev => prev.map(o =>
      o.id === dragging.id ? { ...o, x: mx - dragging.ox, y: my - dragging.oy } : o
    ));
  };

  const onCanvasMouseUp = () => setDragging(null);

  const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: "select", icon: <MousePointer className="h-4 w-4" />, label: "Select" },
    { id: "move", icon: <Move className="h-4 w-4" />, label: "Move" },
    { id: "rect", icon: <Box className="h-4 w-4" />, label: "Block" },
    { id: "circle", icon: <Circle className="h-4 w-4" />, label: "Ball" },
    { id: "player", icon: <span className="text-xs">🟢</span>, label: "Player" },
    { id: "enemy", icon: <span className="text-xs">🔴</span>, label: "Enemy" },
    { id: "coin", icon: <span className="text-xs">🪙</span>, label: "Coin" },
  ];

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-card border-b text-sm shrink-0">
        <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></Link>
        <span className="font-semibold text-primary">Level 4 – Game Builder</span>
        <Input value={gameName} onChange={e => setGameName(e.target.value)} className="h-7 w-32 text-xs ml-2" />
        <div className="ml-auto flex gap-1">
          {!playing ? (
            <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={startPlay}><Play className="h-3 w-3" /> Play</Button>
          ) : (
            <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={stopPlay}><Square className="h-3 w-3" /> Stop</Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="w-14 border-r bg-card/50 flex flex-col items-center gap-1 py-2 shrink-0">
          {tools.map(t => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`w-10 h-10 rounded flex flex-col items-center justify-center text-xs gap-0.5 transition-colors ${tool === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}
              title={t.label}
            >
              {t.icon}
              <span className="text-[9px] leading-none">{t.label}</span>
            </button>
          ))}
          <div className="border-t my-1 w-8" />
          <button onClick={deleteSelected} className="w-10 h-10 rounded flex flex-col items-center justify-center text-xs text-destructive hover:bg-destructive/10" title="Delete">
            <Trash2 className="h-4 w-4" />
            <span className="text-[9px]">Delete</span>
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center bg-muted/30 overflow-auto p-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="border rounded shadow-lg bg-background cursor-crosshair"
            style={{ maxWidth: "100%", height: "auto" }}
            onMouseDown={onCanvasMouseDown}
            onMouseMove={onCanvasMouseMove}
            onMouseUp={onCanvasMouseUp}
            onMouseLeave={onCanvasMouseUp}
          />
        </div>

        {/* Properties panel */}
        <div className="w-48 border-l bg-card/50 overflow-y-auto shrink-0 p-3">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1"><Settings className="h-3 w-3" /> Properties</h3>
          {selectedObj ? (
            <div className="flex flex-col gap-2 text-xs">
              <label className="text-muted-foreground">Label</label>
              <Input value={selectedObj.label} onChange={e => updateSelected({ label: e.target.value })} className="h-7 text-xs" />
              <label className="text-muted-foreground">X</label>
              <Input type="number" value={Math.round(selectedObj.x)} onChange={e => updateSelected({ x: +e.target.value })} className="h-7 text-xs" />
              <label className="text-muted-foreground">Y</label>
              <Input type="number" value={Math.round(selectedObj.y)} onChange={e => updateSelected({ y: +e.target.value })} className="h-7 text-xs" />
              <label className="text-muted-foreground">Width</label>
              <Input type="number" value={selectedObj.w} onChange={e => updateSelected({ w: +e.target.value })} className="h-7 text-xs" />
              <label className="text-muted-foreground">Height</label>
              <Input type="number" value={selectedObj.h} onChange={e => updateSelected({ h: +e.target.value })} className="h-7 text-xs" />
              <label className="text-muted-foreground">Color</label>
              <div className="flex flex-wrap gap-1">
                {COLORS.map(c => (
                  <button key={c} onClick={() => updateSelected({ color: c })}
                    className={`w-5 h-5 rounded border-2 ${selectedObj.color === c ? "border-foreground" : "border-transparent"}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
              <label className="flex items-center gap-1 text-muted-foreground">
                <input type="checkbox" checked={selectedObj.gravity} onChange={e => updateSelected({ gravity: e.target.checked })} /> Gravity
              </label>
              <label className="flex items-center gap-1 text-muted-foreground">
                <input type="checkbox" checked={selectedObj.solid} onChange={e => updateSelected({ solid: e.target.checked })} /> Solid
              </label>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Select an object or use a tool to place one.</p>
          )}

          <div className="border-t mt-4 pt-4">
            <p className="text-xs text-muted-foreground mb-2">Objects: {objects.length}</p>
            {!completed ? (
              <>
                <Button size="sm" className="w-full text-xs mb-2" onClick={completeLevel}>Complete Level ✓</Button>
                <SkipLevel nextLevel={5} nextPath="/spc-game-maker" />
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-secondary">✅ Level Complete!</p>
                <Button size="sm" className="w-full text-xs" onClick={() => navigate("/spc-game-maker")}>Next Level →</Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center px-3 py-1 bg-primary text-primary-foreground text-xs shrink-0">
        <span>{gameName}</span>
        <span className="ml-2 text-primary-foreground/70">{playing ? "▶ Playing — WASD/Arrows to move" : `Tool: ${tool}`}</span>
        <span className="ml-auto">{objects.length} objects</span>
      </div>
    </div>
  );
};

export default GameBuilder;
