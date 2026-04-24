import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, Unlock, UserPlus, LogIn, LogOut, Trophy, BookOpen, Gamepad2, Heart, User } from "lucide-react";
import { levels, getUnlockedLevel, loadProgressFromCloud } from "@/lib/levels";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const [unlockedLevel, setUnlockedLevel] = useState(getUnlockedLevel);
  const { user, displayName, signOut, loading } = useAuth();
  const allComplete = unlockedLevel >= 6;

  useEffect(() => {
    if (user) {
      loadProgressFromCloud().then((lvl) => {
        if (lvl) setUnlockedLevel(lvl);
      });
    }
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-10 w-10 text-primary" />
        <h1 className="text-3xl md:text-5xl text-primary">SPC Minigames</h1>
      </div>
      <p className="text-lg text-muted-foreground max-w-md text-center">
        Complete each level to unlock the next challenge!
      </p>

      <div className="flex flex-col gap-3 w-full max-w-md">
        {levels.map((level) => {
          const isUnlocked = level.id <= unlockedLevel;
          return isUnlocked ? (
            <Link key={level.id} to={level.path} className="w-full">
              <Button
                variant="outline"
                className="w-full h-14 gap-2 text-base justify-start shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-button)] transition-shadow"
              >
                <Unlock className="h-5 w-5 text-secondary" />
                Level {level.id} – {level.title}
              </Button>
            </Link>
          ) : (
            <Button
              key={level.id}
              variant="outline"
              disabled
              className="w-full h-14 gap-2 text-base justify-start opacity-50"
            >
              <Lock className="h-5 w-5" />
              Level {level.id} – {level.title}
            </Button>
          );
        })}
      </div>

      {/* SPC Runner - unlocked after all levels */}
      {allComplete && (
        <Link to="/runner" className="w-full max-w-md">
          <Button className="w-full h-14 gap-2 text-base" style={{ background: "var(--gradient-hero)" }}>
            <Gamepad2 className="h-5 w-5" /> 🎮 Play SPC Runner (Official Game)
          </Button>
        </Link>
      )}

      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        <Link to="/signup">
          <Button variant="ghost" size="sm" className="gap-1">
            <UserPlus className="h-4 w-4" /> Signup
          </Button>
        </Link>
        <Link to="/login">
          <Button variant="ghost" size="sm" className="gap-1">
            <LogIn className="h-4 w-4" /> Login
          </Button>
        </Link>
        <Link to="/leaderboard">
          <Button variant="ghost" size="sm" className="gap-1">
            <Trophy className="h-4 w-4" /> Leaderboard
          </Button>
        </Link>
        <Link to="/quizzes">
          <Button variant="ghost" size="sm" className="gap-1">
            <BookOpen className="h-4 w-4" /> Olympiad Quizzes
          </Button>
        </Link>
        <Link to="/fan">
          <Button variant="ghost" size="sm" className="gap-1">
            <Heart className="h-4 w-4" /> Fan Page
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
