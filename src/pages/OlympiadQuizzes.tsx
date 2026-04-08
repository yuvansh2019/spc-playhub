import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Lock } from "lucide-react";
import { quizSubjects } from "@/lib/quizData";
import { getUnlockedLevel } from "@/lib/levels";

const OlympiadQuizzes = () => {
  const unlocked = getUnlockedLevel() >= 6;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <div className="flex items-center gap-2">
        <BookOpen className="h-8 w-8 text-primary" />
        <h1 className="text-3xl text-primary">Olympiad Quizzes</h1>
      </div>

      {!unlocked ? (
        <div className="flex flex-col items-center gap-3">
          <Lock className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground text-center max-w-sm">
            Complete all 5 levels (or skip them) to unlock Olympiad Quizzes!
          </p>
          <Link to="/"><Button variant="outline">Back to Home</Button></Link>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground">Choose a subject to start your quiz!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
            {quizSubjects.map((subject) => (
              <Link key={subject.id} to={`/quiz/${subject.id}`} className="w-full">
                <Button
                  variant="outline"
                  className="w-full h-16 gap-3 text-base shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-button)] transition-shadow"
                >
                  <span className="text-2xl">{subject.emoji}</span>
                  {subject.name}
                </Button>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OlympiadQuizzes;
