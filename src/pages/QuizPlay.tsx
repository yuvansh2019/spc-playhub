import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { quizSubjects } from "@/lib/quizData";
import { useToast } from "@/hooks/use-toast";

const QuizPlay = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const subject = quizSubjects.find((s) => s.id === subjectId);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!subject) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="text-destructive text-xl">Subject not found!</p>
        <Link to="/quizzes"><Button variant="outline">Back to Quizzes</Button></Link>
      </div>
    );
  }

  const question = subject.questions[currentQ];

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (index === question.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= subject.questions.length) {
      setFinished(true);
      toast({
        title: "Quiz Complete!",
        description: `You scored ${score + (selected === question.answer ? 0 : 0)}/${subject.questions.length}`,
      });
    } else {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (finished) {
    const finalScore = score;
    const total = subject.questions.length;
    const percentage = Math.round((finalScore / total) * 100);

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
        <Link to="/quizzes" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h2 className="text-3xl text-primary">{subject.emoji} {subject.name} – Results</h2>
        <div className="rounded-lg border bg-card p-8 shadow-[var(--shadow-card)] text-center">
          <p className="text-5xl mb-4">{percentage >= 70 ? "🎉" : percentage >= 40 ? "👍" : "😢"}</p>
          <p className="text-2xl text-secondary">{finalScore} / {total}</p>
          <p className="text-muted-foreground mt-2">{percentage}% correct</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => { setCurrentQ(0); setScore(0); setSelected(null); setAnswered(false); setFinished(false); }} variant="outline">
            Retry
          </Button>
          <Button onClick={() => navigate("/quizzes")}>Back to Quizzes</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Link to="/quizzes" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <h2 className="text-2xl text-primary">{subject.emoji} {subject.name}</h2>
      <p className="text-sm text-muted-foreground">Question {currentQ + 1} of {subject.questions.length}</p>

      {/* Progress bar */}
      <div className="w-full max-w-md h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${((currentQ + 1) / subject.questions.length) * 100}%` }}
        />
      </div>

      <div className="rounded-lg border bg-card p-6 w-full max-w-md shadow-[var(--shadow-card)]">
        <p className="text-lg mb-6">{question.question}</p>
        <div className="flex flex-col gap-3">
          {question.options.map((option, i) => {
            let variant: "outline" | "default" | "destructive" | "secondary" = "outline";
            let icon = null;
            if (answered) {
              if (i === question.answer) {
                variant = "secondary";
                icon = <CheckCircle2 className="h-4 w-4" />;
              } else if (i === selected && i !== question.answer) {
                variant = "destructive";
                icon = <XCircle className="h-4 w-4" />;
              }
            }

            return (
              <Button
                key={i}
                variant={variant}
                className="w-full justify-start gap-2 h-12 text-left"
                onClick={() => handleSelect(i)}
                disabled={answered}
              >
                <span className="font-body text-sm opacity-60">{String.fromCharCode(65 + i)}.</span>
                {option}
                {icon && <span className="ml-auto">{icon}</span>}
              </Button>
            );
          })}
        </div>
      </div>

      {answered && (
        <Button onClick={handleNext} size="lg">
          {currentQ + 1 >= subject.questions.length ? "See Results" : "Next Question →"}
        </Button>
      )}
    </div>
  );
};

export default QuizPlay;
