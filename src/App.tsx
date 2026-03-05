import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Preferencias from "./pages/Preferencias";
import Scanner from "./pages/Scanner";
import Receitas from "./pages/Receitas";
import Educacao from "./pages/Educacao";
import Biblioteca from "./pages/Biblioteca";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/preferencias" element={<Preferencias />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/receitas" element={<Receitas />} />
          <Route path="/educacao" element={<Educacao />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
