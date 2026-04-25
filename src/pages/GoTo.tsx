import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Home as HomeIcon, Gamepad2, BookOpen, Hammer, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const GoTo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const destinations = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/admin", label: "Admin Console", icon: Shield },
    { path: "/game", label: "Main Game", icon: Gamepad2 },
    { path: "/quizzes", label: "Olympiad Quizzes", icon: BookOpen },
    { path: "/spc-game-maker", label: "SPC Game Maker Studio", icon: Hammer },
    { path: "/game-builder", label: "Game Builder", icon: Hammer },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <h2 className="text-3xl text-primary">Where do you want to go?</h2>
      {user ? (
        <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Not signed in. <Link to="/login.page?redirect=/go-to" className="text-primary underline">Login</Link>
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
        {destinations.map(({ path, label, icon: Icon }) => (
          <Button
            key={path}
            variant="outline"
            className="h-16 justify-start gap-3"
            onClick={() => navigate(path)}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GoTo;
