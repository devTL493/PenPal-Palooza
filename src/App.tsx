
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Compose from "./pages/Compose";
import PenPals from "./pages/PenPals";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LetterDetail from "./pages/LetterDetail";
import ConversationPage from "./pages/ConversationPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/letter/:id" element={<LetterDetail />} />
          <Route path="/conversation/:id" element={<ConversationPage />} />
          <Route path="/compose" element={<Compose />} />
          <Route path="/penpals" element={<PenPals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
