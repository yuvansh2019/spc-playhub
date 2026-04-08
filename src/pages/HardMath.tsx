import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { unlockLevel, getUnlockedLevel } from "@/lib/levels";
import SkipLevel from "@/components/SkipLevel";

interface MathQuestion {
  question: string;
  answer: string;
}

const questions: MathQuestion[] = [
  { question: "1108 × 2019 = ?", answer: "2237052" },
  { question: "11 × 11 × 11 = ?", answer: "1331" },
  { question: "11 × 11 = ?", answer: "121" },
  { question: "5 × 5 × 5 = ?", answer: "125" },
  { question: "10 × 10 × 10 × 10 = ?", answer: "10000" },
];

const HardMath = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [solved, setSolved] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const unlocked = getUnlockedLevel() >= 2;

  if (!unlocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="text-destructive text-xl">🔒 Complete Level 1 first!</p>
        <Link to="/"><Button variant="outline">Back to Home</Button></Link>
      </div>
    );
  }

  const check = () => {
    if (answer.trim() === questions[currentQ].answer) {
      if (currentQ < questions.length - 1) {
        toast({ title: "✅ Correct!", description: `Question ${currentQ + 2} of ${questions.length}` });
        setCurrentQ(currentQ + 1);
        setAnswer("");
      } else {
        setSolved(true);
        unlockLevel(3);
        toast({ title: "🎉 Level Complete!", description: "Level 3 unlocked!" });
      }
    } else {
      toast({ title: "Wrong answer. Try again.", variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <h2 className="text-3xl text-primary">Level 2 – Hard Math</h2>

      {!solved ? (
        <>
          <p className="text-sm text-muted-foreground">Question {currentQ + 1} of {questions.length}</p>
          <p className="text-xl text-muted-foreground">{questions[currentQ].question}</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <Input placeholder="Your answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <Button onClick={check} className="w-full">Submit</Button>
          </div>
          <SkipLevel nextLevel={3} nextPath="/apple-collector" />
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-2xl text-secondary">✅ Correct! Level Complete.</p>
          <Button onClick={() => navigate("/apple-collector")}>Continue to Level 3 →</Button>
        </div>
      )}
    </div>
  );
};

export default HardMath;
