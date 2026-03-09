import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { unlockLevel, getUnlockedLevel } from "@/lib/levels";

const AppleCollector = () => {
  const [completed, setCompleted] = useState(false);
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

  const complete = () => {
    setCompleted(true);
    unlockLevel(4);
    toast({ title: "🎉 Level Complete!", description: "Level 4 unlocked!" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <h2 className="text-3xl text-primary">Level 3 – Apple Collector</h2>
      <p className="text-muted-foreground">🍎 Collect 500 apples in 5 minutes</p>
      <p className="text-sm text-muted-foreground italic">(Full game coming soon – use button to test progression)</p>

      {!completed ? (
        <Button onClick={complete} variant="secondary" className="mt-4">
          Complete Level (Test)
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-2xl text-secondary">✅ Level Complete!</p>
          <Button onClick={() => navigate("/game-builder")}>Continue to Level 4 →</Button>
        </div>
      )}
    </div>
  );
};

export default AppleCollector;
