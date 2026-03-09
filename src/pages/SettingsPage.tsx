import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [answer, setAnswer] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const { toast } = useToast();

  const check = () => {
    if (answer === "2237052") {
      setUnlocked(true);
      toast({ title: "✅ Correct! Settings unlocked." });
    } else {
      toast({ title: "Wrong answer.", variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>

      {!unlocked ? (
        <>
          <Lock className="h-10 w-10 text-muted-foreground" />
          <h2 className="text-3xl text-primary">Answer to Unlock Settings</h2>
          <p className="text-lg text-muted-foreground">1108 × 2019 = ?</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <Input placeholder="Your answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <Button onClick={check} className="w-full">Submit</Button>
          </div>
        </>
      ) : (
        <>
          <Unlock className="h-10 w-10 text-secondary" />
          <h2 className="text-3xl text-primary">Settings</h2>
          <p className="text-muted-foreground">Settings panel unlocked. More options coming soon!</p>
        </>
      )}
    </div>
  );
};

export default SettingsPage;
