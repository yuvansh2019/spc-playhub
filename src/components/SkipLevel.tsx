import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { unlockLevel } from "@/lib/levels";
import { useToast } from "@/hooks/use-toast";

interface SkipLevelProps {
  nextLevel: number;
  nextPath: string;
}

const SkipLevel = ({ nextLevel, nextPath }: SkipLevelProps) => {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePinSubmit = () => {
    if (pin === "1111") {
      unlockLevel(nextLevel);
      setUnlocked(true);
    } else {
      toast({ title: "Incorrect password", variant: "destructive" });
    }
  };

  if (unlocked) {
    return (
      <Button onClick={() => navigate(nextPath)} variant="outline" className="mt-2">
        Continue →
      </Button>
    );
  }

  if (showPin) {
    return (
      <div className="flex items-center gap-2 mt-2">
        <Input
          type="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-32"
          maxLength={4}
        />
        <Button onClick={handlePinSubmit} variant="outline" size="sm">
          Submit
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => setShowPin(true)} variant="ghost" size="sm" className="mt-2 text-muted-foreground">
      Skip
    </Button>
  );
};

export default SkipLevel;
