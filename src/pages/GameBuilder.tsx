import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { unlockLevel, getUnlockedLevel } from "@/lib/levels";

const GameBuilder = () => {
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const unlocked = getUnlockedLevel() >= 4;

  if (!unlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="text-destructive text-xl">🔒 Complete Level 3 first!</p>
        <Link to="/"><Button variant="outline">Back to Home</Button></Link>
      </div>
    );
  }

  const complete = () => {
    setCompleted(true);
    unlockLevel(5);
    toast({ title: "🎉 Level Complete!", description: "Final level unlocked!" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <h2 className="text-3xl text-primary">Level 4 – Game Builder</h2>
      <p className="text-xl text-muted-foreground">Game Builder Coming Soon</p>

      {!completed ? (
        <Button onClick={complete} variant="secondary" className="mt-4">
          Complete Level (Test)
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-2xl text-secondary">✅ Level Complete!</p>
          <Button onClick={() => navigate("/spc-game-maker")}>Continue to Final Level →</Button>
        </div>
      )}
    </div>
  );
};

export default GameBuilder;
