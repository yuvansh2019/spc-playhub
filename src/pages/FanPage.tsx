import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Star, Gamepad2, Users } from "lucide-react";

const FanPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
      <Link to="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-6 w-6" />
      </Link>

      <div className="flex items-center gap-3">
        <Heart className="h-10 w-10 text-destructive animate-pulse" />
        <h1 className="text-3xl md:text-4xl text-primary">SPC Fan Page</h1>
        <Heart className="h-10 w-10 text-destructive animate-pulse" />
      </div>

      <div className="max-w-lg text-center space-y-4">
        <p className="text-lg text-muted-foreground">
          Welcome to the official SPC Minigames fan page! 🎮
        </p>

        <div className="bg-card border rounded-lg p-6 space-y-3 shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-primary">About SPC Games</h2>
            <Star className="h-5 w-5 text-accent" />
          </div>
          <p className="text-muted-foreground">
            SPC Minigames is the ultimate challenge platform with tap challenges, 
            math puzzles, apple collecting, game building, and the legendary SPC Runner!
          </p>
          <p className="text-muted-foreground">
            The official SPC game is so unique that no one can recreate it — 
            not even with tools like Replit or Lovable. There's no public repo, 
            making it truly one of a kind! 🏆
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-3 shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Game Characters</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-2xl">🐱</p>
              <p className="font-semibold">Talking Tom</p>
              <p className="text-muted-foreground">The hero, chasing Roy from HQ</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-2xl">🦝</p>
              <p className="font-semibold">Roy the Raccoon</p>
              <p className="text-muted-foreground">The villain who steals gold!</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-2xl">🐶</p>
              <p className="font-semibold">Talking Ben</p>
              <p className="text-muted-foreground">Inventor whose jetpack Roy stole</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-2xl">🕷️</p>
              <p className="font-semibold">Spider-Man</p>
              <p className="text-muted-foreground">Guest hero from Marvel</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-3 shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Skins & Powers</h2>
          </div>
          <div className="space-y-2 text-sm text-left">
            <p>🦸 <strong>Superhero</strong> — Double jump ability</p>
            <p>🏀 <strong>Basketball Player</strong> — Dribble to clear path, gets stronger with each dribble</p>
            <p>🎓 <strong>Super Student</strong> — Uses mind power to clear obstacles</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground italic">
          Are you a true SPC fan? Complete all challenges and prove it! 💪
        </p>
      </div>

      <Link to="/">
        <Button variant="outline" className="gap-2">
          <Gamepad2 className="h-4 w-4" /> Back to Games
        </Button>
      </Link>
    </div>
  );
};

export default FanPage;
