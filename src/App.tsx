import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Game from "./pages/Game";
import HardMath from "./pages/HardMath";
import AppleCollector from "./pages/AppleCollector";
import GameBuilder from "./pages/GameBuilder";
import SPCGameMaker from "./pages/SPCGameMaker";
import Leaderboard from "./pages/Leaderboard";
import OlympiadQuizzes from "./pages/OlympiadQuizzes";
import QuizPlay from "./pages/QuizPlay";
import EndlessRunner from "./pages/EndlessRunner";
import CheatPanel from "./pages/CheatPanel";
import FanPage from "./pages/FanPage";
import AdminConsole from "./pages/AdminConsole";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/game" element={<Game />} />
            <Route path="/hard-math" element={<HardMath />} />
            <Route path="/apple-collector" element={<AppleCollector />} />
            <Route path="/game-builder" element={<GameBuilder />} />
            <Route path="/spc-game-maker" element={<SPCGameMaker />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/quizzes" element={<OlympiadQuizzes />} />
            <Route path="/quiz/:subjectId" element={<QuizPlay />} />
            <Route path="/runner" element={<EndlessRunner />} />
            <Route path="/cheat" element={<CheatPanel />} />
            <Route path="/fan" element={<FanPage />} />
            <Route path="/admin" element={<AdminConsole />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
