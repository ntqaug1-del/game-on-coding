import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/index";
import NotFound from "./pages/not-found/index";
import UtilityDetails from "./pages/utility-details/index";
import TextToSpeech from "./pages/text-to-speech/index";
import AudioLibrary from "./pages/text-to-speech/library/index";
import SpinWheel from "./pages/spin-wheel/index";
import Resume from "./pages/resume/index";
import UnitConverter from './pages/unit-converter/index';
import QRCodeGenerator from './pages/qr-code-generator/index';
import DiceRoller from './pages/dice-roller/index';
import FootballFormationBuilder from './pages/football-formation/index';
import EliteWeb from './pages/elite-web/index';
import VisitCounterDemo from './pages/visit-counter-demo/index';
import HomeDemo from './pages/home-demo/index';
import AIDataAnalysis from './pages/ai-data-analysis/index';
import StudentRanking from './pages/student-ranking/index';
import StudentManagement from './pages/student-ranking/students';
import Leaderboard from './pages/student-ranking/leaderboard';

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="football-formation-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/utility/:id" element={<UtilityDetails />} />
          <Route path="/text-to-speech" element={<TextToSpeech />} />
          <Route path="/text-to-speech/library" element={<AudioLibrary />} />
          <Route path="/spin-wheel" element={<SpinWheel />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/unit-converter" element={<UnitConverter />} />
          <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
          <Route path="/dice-roller" element={<DiceRoller />} />
          <Route path="/football-formation-builder" element={<FootballFormationBuilder />} />
          <Route path="/elite-web" element={<EliteWeb />} />
          <Route path="/visit-counter-demo" element={<VisitCounterDemo />} />
          <Route path="/home-demo" element={<HomeDemo />} />
           <Route path="/ai-data-analysis" element={<AIDataAnalysis />} />
           <Route path="/student-ranking" element={<StudentRanking />} />
           <Route path="/student-ranking/:classId/students" element={<StudentManagement />} />
           <Route path="/student-ranking/:classId/leaderboard" element={<Leaderboard />} />
           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
