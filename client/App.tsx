import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SpinWheelPage from "./pages/SpinWheelPage";
import SlotsPage from "./pages/SlotsPage";
import PragmaticSlotsPage from "./pages/PragmaticSlotsPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import { Trophy, Users, Gift, Share, Gamepad2, TrendingUp, User, MessageCircle, FileText, Shield } from "lucide-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/spin-wheel" element={<SpinWheelPage />} />
          <Route path="/slots" element={<SlotsPage />} />

          {/* Game Routes */}
          <Route path="/games" element={<PlaceholderPage title="All Games" description="Browse all available sweepstakes and games" icon={<Gamepad2 className="h-12 w-12 text-gold" />} />} />
          <Route path="/scratch-cards" element={<PlaceholderPage title="Scratch Cards" description="Scratch to reveal instant prizes" icon={<Gift className="h-12 w-12 text-gold" />} />} />
          <Route path="/daily-draws" element={<PlaceholderPage title="Daily Draws" description="Enter daily prize drawings" icon={<Trophy className="h-12 w-12 text-gold" />} />} />
          <Route path="/instant-win" element={<PlaceholderPage title="Instant Win" description="Play instant win games" icon={<Gift className="h-12 w-12 text-gold" />} />} />

          {/* Community Routes */}
          <Route path="/leaderboard" element={<PlaceholderPage title="Leaderboard" description="See top players and their achievements" icon={<TrendingUp className="h-12 w-12 text-gold" />} />} />
          <Route path="/winners" element={<PlaceholderPage title="Winners Gallery" description="Browse recent winners and success stories" icon={<Trophy className="h-12 w-12 text-gold" />} />} />
          <Route path="/referrals" element={<PlaceholderPage title="Refer Friends" description="Invite friends and earn bonus entries" icon={<Share className="h-12 w-12 text-gold" />} />} />
          <Route path="/blog" element={<PlaceholderPage title="Blog" description="Latest news, tips, and winner stories" icon={<FileText className="h-12 w-12 text-gold" />} />} />

          {/* Support Routes */}
          <Route path="/help" element={<PlaceholderPage title="Help Center" description="Find answers to common questions" icon={<MessageCircle className="h-12 w-12 text-gold" />} />} />
          <Route path="/contact" element={<PlaceholderPage title="Contact Us" description="Get in touch with our support team" icon={<MessageCircle className="h-12 w-12 text-gold" />} />} />
          <Route path="/terms" element={<PlaceholderPage title="Terms of Service" description="Read our terms and conditions" icon={<FileText className="h-12 w-12 text-gold" />} />} />
          <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" description="Learn how we protect your privacy" icon={<Shield className="h-12 w-12 text-gold" />} />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
