import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Play, Save, FolderTree, FileCode, Settings,
  ChevronRight, ChevronDown, Plus, Trash2, Lock, Unlock,
  Sparkles, Edit, Terminal, Eye
} from "lucide-react";
import { getUnlockedLevel, unlockLevel } from "@/lib/levels";
import SkipLevel from "@/components/SkipLevel";
import { useToast } from "@/hooks/use-toast";

const CHEAT_PIN = "1111";

interface ProjectFile {
  name: string;
  content: string;
  type: "file" | "folder";
  children?: ProjectFile[];
  open?: boolean;
}

const defaultProject: ProjectFile[] = [
  {
    name: "src", type: "folder", open: true, children: [
      { name: "main.js", type: "file", content: '// SPC Game Entry Point\nconsole.log("Welcome to SPC Game!");\n\nfunction startGame() {\n  const canvas = document.getElementById("game");\n  const ctx = canvas.getContext("2d");\n  ctx.fillStyle = "#4f46e5";\n  ctx.fillRect(50, 50, 200, 200);\n  console.log("Game started!");\n}\n\nstartGame();' },
      { name: "player.js", type: "file", content: '// Player Module\nclass Player {\n  constructor(x, y) {\n    this.x = x;\n    this.y = y;\n    this.speed = 5;\n    this.health = 100;\n  }\n\n  move(dx, dy) {\n    this.x += dx * this.speed;\n    this.y += dy * this.speed;\n  }\n\n  draw(ctx) {\n    ctx.fillStyle = "#22c55e";\n    ctx.fillRect(this.x, this.y, 40, 40);\n  }\n}\n\nexport default Player;' },
      { name: "enemy.js", type: "file", content: '// Enemy Module\nclass Enemy {\n  constructor(x, y) {\n    this.x = x;\n    this.y = y;\n    this.speed = 2;\n  }\n\n  update(playerX, playerY) {\n    const dx = playerX - this.x;\n    const dy = playerY - this.y;\n    const dist = Math.sqrt(dx*dx + dy*dy);\n    this.x += (dx/dist) * this.speed;\n    this.y += (dy/dist) * this.speed;\n  }\n\n  draw(ctx) {\n    ctx.fillStyle = "#ef4444";\n    ctx.fillRect(this.x, this.y, 30, 30);\n  }\n}\n\nexport default Enemy;' },
    ]
  },
  {
    name: "assets", type: "folder", open: false, children: [
      { name: "sprites.json", type: "file", content: '{\n  "player": { "width": 40, "height": 40, "color": "#22c55e" },\n  "enemy": { "width": 30, "height": 30, "color": "#ef4444" },\n  "coin": { "width": 20, "height": 20, "color": "#eab308" }\n}' },
    ]
  },
  { name: "index.html", type: "file", content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My SPC Game</title>\n  <style>canvas { border: 1px solid #333; }</style>\n</head>\n<body>\n  <canvas id="game" width="800" height="600"></canvas>\n  <script src="src/main.js"></script>\n</body>\n</html>' },
  { name: "config.json", type: "file", content: '{\n  "gameName": "My SPC Game",\n  "version": "1.0.0",\n  "resolution": { "width": 800, "height": 600 },\n  "fps": 60\n}' },
];

const SPCGameMaker = () => {
  const unlocked = getUnlockedLevel() >= 5;
  const { toast } = useToast();

  const [files, setFiles] = useState<ProjectFile[]>(defaultProject);
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(defaultProject[0].children![0]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>(["SPC Game Maker Studio v1.0", "Ready."]);
  const [showConsole, setShowConsole] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [tab, setTab] = useState<"editor" | "cheat">("editor");

  // Cheat panel state
  const [cheatPhase, setCheatPhase] = useState<"locked" | "pin" | "panel" | "edit">("locked");
  const [cheatAnswer, setCheatAnswer] = useState("");
  const [cheatPin, setCheatPin] = useState("");
  const [editPin, setEditPin] = useState("");
  const [cheatPoints, setCheatPoints] = useState("");
  const [cheatPlayer, setCheatPlayer] = useState("");

  if (!unlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="text-destructive text-xl">🔒 Complete Level 4 first!</p>
        <Link to="/"><Button variant="outline">Back to Home</Button></Link>
      </div>
    );
  }

  const selectFile = (f: ProjectFile) => {
    if (f.type === "file") setActiveFile(f);
  };

  const toggleFolder = (folder: ProjectFile) => {
    folder.open = !folder.open;
    setFiles([...files]);
  };

  const updateContent = (content: string) => {
    if (activeFile) {
      activeFile.content = content;
      setFiles([...files]);
    }
  };

  const runProject = () => {
    setConsoleOutput(prev => [...prev, "> Running project...", "✓ Build successful", "✓ Game started on virtual device"]);
    setShowPreview(true);
  };

  const saveProject = () => {
    toast({ title: "Project saved!" });
    setConsoleOutput(prev => [...prev, "> Project saved."]);
  };

  // Cheat helpers
  const cheatUnlockMath = () => {
    if (cheatAnswer === "121") {
      setCheatPhase("pin");
      setCheatAnswer("");
    } else {
      toast({ title: "Wrong answer", variant: "destructive" });
    }
  };

  const cheatUnlockPin = () => {
    if (cheatPin === CHEAT_PIN) {
      setCheatPhase("panel");
      setCheatPin("");
    } else {
      toast({ title: "Incorrect password", variant: "destructive" });
    }
  };

  const cheatEditUnlock = () => {
    if (editPin === CHEAT_PIN) {
      setCheatPhase("edit");
      setEditPin("");
    } else {
      toast({ title: "Incorrect password", variant: "destructive" });
    }
  };

  const addCheatPoints = () => {
    if (!cheatPlayer.trim()) { toast({ title: "Enter player name", variant: "destructive" }); return; }
    const pts = parseCheatNumber(cheatPoints);
    if (pts <= 0) { toast({ title: "Enter valid points", variant: "destructive" }); return; }
    const raw = localStorage.getItem("spc_db");
    const db = raw ? JSON.parse(raw) : { users: [], leaderboard: [] };
    db.leaderboard.push({ name: cheatPlayer, score: pts });
    db.leaderboard.sort((a: any, b: any) => b.score - a.score);
    db.leaderboard = db.leaderboard.slice(0, 10);
    localStorage.setItem("spc_db", JSON.stringify(db));
    toast({ title: `Added ${formatCheatNumber(pts)} points to ${cheatPlayer}!` });
    setCheatPoints(""); setCheatPlayer("");
  };

  const renderFileTree = (items: ProjectFile[], depth = 0) => (
    <div>
      {items.map((item, i) => (
        <div key={i}>
          <div
            className={`flex items-center gap-1 px-2 py-1 cursor-pointer text-sm hover:bg-accent/50 rounded ${activeFile === item ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => item.type === "folder" ? toggleFolder(item) : selectFile(item)}
          >
            {item.type === "folder" ? (
              item.open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
            ) : <FileCode className="h-3 w-3" />}
            <span className="truncate">{item.name}</span>
          </div>
          {item.type === "folder" && item.open && item.children && renderFileTree(item.children, depth + 1)}
        </div>
      ))}
    </div>
  );

  const renderCheatPanel = () => {
    if (cheatPhase === "locked") return (
      <div className="flex flex-col items-center gap-4 p-6">
        <Lock className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">Solve: 11 × 11 = ?</p>
        <Input placeholder="Answer" value={cheatAnswer} onChange={e => setCheatAnswer(e.target.value)} className="w-32 text-center" />
        <Button size="sm" onClick={cheatUnlockMath}>Submit</Button>
      </div>
    );
    if (cheatPhase === "pin") return (
      <div className="flex flex-col items-center gap-4 p-6">
        <Unlock className="h-12 w-12 text-primary" />
        <p className="text-sm text-muted-foreground">Enter PIN</p>
        <Input type="password" placeholder="PIN" value={cheatPin} onChange={e => setCheatPin(e.target.value)} className="w-32 text-center" maxLength={4} />
        <Button size="sm" onClick={cheatUnlockPin}>Unlock</Button>
      </div>
    );
    if (cheatPhase === "edit") return (
      <div className="flex flex-col items-center gap-4 p-6">
        <Edit className="h-8 w-8 text-primary" />
        <h3 className="text-primary font-semibold">Edit Mode</h3>
        <Button size="sm" variant="secondary" onClick={() => { localStorage.setItem("level", "6"); toast({ title: "All levels unlocked!" }); }}>Unlock All Levels</Button>
        <Button size="sm" variant="destructive" onClick={() => { localStorage.removeItem("level"); toast({ title: "Progress reset!" }); }}>Reset Progress</Button>
        <Button size="sm" variant="ghost" onClick={() => setCheatPhase("panel")}>← Back</Button>
      </div>
    );
    return (
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /><h3 className="font-semibold text-primary">⚡ Cheat Panel</h3></div>
        <Input placeholder="Player name" value={cheatPlayer} onChange={e => setCheatPlayer(e.target.value)} />
        <Input placeholder="Points" value={cheatPoints} onChange={e => setCheatPoints(e.target.value)} />
        <Button size="sm" onClick={addCheatPoints}>Add Points</Button>
        <Button size="sm" variant="secondary" onClick={() => { localStorage.setItem("level", "6"); toast({ title: "All levels unlocked!" }); }}>Unlock All Levels</Button>
        <div className="border-t pt-2 mt-2">
          <p className="text-xs text-muted-foreground mb-1">Edit mode requires PIN</p>
          <Input type="password" placeholder="PIN" value={editPin} onChange={e => setEditPin(e.target.value)} className="text-center mb-1" maxLength={4} />
          <Button size="sm" variant="outline" onClick={cheatEditUnlock} className="w-full gap-1"><Edit className="h-3 w-3" /> Edit Mode</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-card border-b text-sm shrink-0">
        <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></Link>
        <span className="font-semibold text-primary">SPC Game Maker Studio</span>
        <span className="text-muted-foreground text-xs">— Level 5</span>
        <div className="ml-auto flex gap-1">
          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={saveProject}><Save className="h-3 w-3" /> Save</Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={runProject}><Play className="h-3 w-3" /> Run</Button>
          <Button size="sm" variant={tab === "cheat" ? "secondary" : "ghost"} className="h-7 text-xs gap-1" onClick={() => setTab(tab === "cheat" ? "editor" : "cheat")}><Settings className="h-3 w-3" /> Panel</Button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* File explorer */}
        <div className="w-48 border-r bg-card/50 overflow-y-auto shrink-0">
          <div className="flex items-center gap-1 px-3 py-2 border-b text-xs font-semibold text-muted-foreground">
            <FolderTree className="h-3 w-3" /> PROJECT
          </div>
          {renderFileTree(files)}
        </div>

        {/* Editor / Cheat panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {tab === "editor" ? (
            <>
              {/* Tabs */}
              {activeFile && (
                <div className="flex items-center gap-0 border-b bg-card/30 shrink-0">
                  <div className="px-3 py-1.5 text-xs border-r bg-background text-foreground flex items-center gap-1">
                    <FileCode className="h-3 w-3" /> {activeFile.name}
                  </div>
                </div>
              )}
              {/* Code area */}
              <div className="flex-1 overflow-hidden relative">
                {activeFile ? (
                  <div className="flex h-full">
                    {/* Line numbers */}
                    <div className="bg-card/30 text-muted-foreground text-xs py-2 px-2 text-right select-none overflow-hidden font-mono leading-5 shrink-0">
                      {activeFile.content.split("\n").map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    <Textarea
                      value={activeFile.content}
                      onChange={(e) => updateContent(e.target.value)}
                      className="flex-1 font-mono text-xs leading-5 border-0 rounded-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-background p-2"
                      spellCheck={false}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Select a file to edit</div>
                )}
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="border-t bg-card/30 shrink-0">
                  <div className="flex items-center gap-1 px-3 py-1 border-b text-xs font-semibold text-muted-foreground">
                    <Eye className="h-3 w-3" /> PREVIEW
                  </div>
                  <div className="h-32 bg-background flex items-center justify-center">
                    <div className="w-48 h-24 bg-primary/20 rounded border border-primary/30 flex items-center justify-center text-xs text-primary">
                      🎮 Game Running...
                    </div>
                  </div>
                </div>
              )}

              {/* Console */}
              {showConsole && (
                <div className="border-t bg-card/30 shrink-0">
                  <div className="flex items-center gap-1 px-3 py-1 border-b text-xs font-semibold text-muted-foreground cursor-pointer" onClick={() => setShowConsole(!showConsole)}>
                    <Terminal className="h-3 w-3" /> CONSOLE
                  </div>
                  <div className="h-24 overflow-y-auto p-2 font-mono text-xs text-muted-foreground bg-background">
                    {consoleOutput.map((line, i) => <div key={i}>{line}</div>)}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {renderCheatPanel()}
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center px-3 py-1 bg-primary text-primary-foreground text-xs shrink-0">
        <span>SPC Game Maker Studio</span>
        <span className="ml-auto">{activeFile?.name || "No file"}</span>
      </div>

      {/* Skip Level */}
      <div className="absolute bottom-12 right-4">
        <SkipLevel nextLevel={6} nextPath="/" />
      </div>
    </div>
  );
};

function parseCheatNumber(s: string): number {
  const clean = s.toLowerCase().trim().replace(/,/g, "");
  const m: Record<string, number> = { million: 1e6, billion: 1e9, trillion: 1e12, quadrillion: 1e15, quintillion: 1e18, sextillion: 1e21, septillion: 1e24, octillion: 1e27, nonillion: 1e30, decillion: 1e33, undecillion: 1e36 };
  for (const [w, v] of Object.entries(m)) { if (clean.includes(w)) return (parseFloat(clean.replace(w, "").trim()) || 1) * v; }
  return parseInt(clean) || 0;
}

function formatCheatNumber(n: number): string {
  if (n >= 1e36) return (n / 1e36).toFixed(1) + " undecillion";
  if (n >= 1e33) return (n / 1e33).toFixed(1) + " decillion";
  if (n >= 1e15) return (n / 1e15).toFixed(1) + " quadrillion";
  if (n >= 1e12) return (n / 1e12).toFixed(1) + " trillion";
  if (n >= 1e9) return (n / 1e9).toFixed(1) + " billion";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + " million";
  return n.toLocaleString();
}

export default SPCGameMaker;
