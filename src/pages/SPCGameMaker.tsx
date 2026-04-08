import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getUnlockedLevel, unlockLevel } from "@/lib/levels";
import SkipLevel from "@/components/SkipLevel";

const SPCGameMaker = () => {
  const unlocked = getUnlockedLevel() >= 5;

  if (!unlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="text-destructive text-xl">🔒 Complete Level 4 first!</p>
        <Link to="/"><Button variant="outline">Back to Home</Button></Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <h2 className="text-3xl text-primary">Level 5 – SPC Game Maker</h2>
      <p className="text-xl text-muted-foreground">Create your own game to complete the final challenge.</p>
      <p className="text-sm text-muted-foreground italic">Coming soon!</p>
      <SkipLevel nextLevel={6} nextPath="/" />
    </div>
  );
};

export default SPCGameMaker;
