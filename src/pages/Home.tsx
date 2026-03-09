import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gamepad2, UserPlus, LogIn, Trophy, Settings, Sparkles } from "lucide-react";

const navItems = [
  { to: "/signup", label: "Create Account", icon: UserPlus },
  { to: "/login", label: "Login", icon: LogIn },
  { to: "/game", label: "Play Tap Challenge", icon: Gamepad2 },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/settings", label: "Settings", icon: Settings },
];

const quizTopics = ["Math", "English", "Hindi", "EVS", "Computer Science", "AI"];

const Home = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
    <div className="flex items-center gap-3">
      <Sparkles className="h-10 w-10 text-primary" />
      <h1 className="text-3xl md:text-5xl text-primary">SPC Minigames</h1>
    </div>
    <p className="text-lg text-muted-foreground max-w-md">Challenge yourself with fun minigames and quizzes!</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
      {navItems.map(({ to, label, icon: Icon }) => (
        <Link key={to} to={to} className="w-full">
          <Button variant="outline" className="w-full h-14 gap-2 text-base shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-button)] transition-shadow">
            <Icon className="h-5 w-5" /> {label}
          </Button>
        </Link>
      ))}
    </div>

    <div className="mt-8 rounded-lg border bg-card p-6 max-w-md w-full shadow-[var(--shadow-card)]">
      <h2 className="text-xl mb-3 text-secondary">Future Challenges</h2>
      <p className="text-muted-foreground mb-4">🍎 Apple Collector: Collect 500 apples in 5 minutes.</p>
      <h3 className="text-lg mb-2 text-accent font-display">Olympiad Quizzes</h3>
      <div className="flex flex-wrap gap-2">
        {quizTopics.map((t) => (
          <span key={t} className="rounded-full border bg-muted px-3 py-1 text-sm text-muted-foreground">{t}</span>
        ))}
      </div>
    </div>
  </div>
);

export default Home;
