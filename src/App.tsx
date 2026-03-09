import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Preferencias from "./pages/Preferencias";
import Scanner from "./pages/Scanner";
import Receitas from "./pages/Receitas";
import Educacao from "./pages/Educacao";
import Biblioteca from "./pages/Biblioteca";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Historico from "./pages/Historico";
import PlanoSemanal from "./pages/PlanoSemanal";
import DiarioAlimentar from "./pages/DiarioAlimentar";
import NotFound from "./pages/NotFound";
import Vendas from "./pages/Vendas";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const P = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<P><Index /></P>} />
            <Route path="/preferencias" element={<P><Preferencias /></P>} />
            <Route path="/scanner" element={<P><Scanner /></P>} />
            <Route path="/receitas" element={<P><Receitas /></P>} />
            <Route path="/educacao" element={<P><Educacao /></P>} />
            <Route path="/biblioteca" element={<P><Biblioteca /></P>} />
            <Route path="/historico" element={<P><Historico /></P>} />
            <Route path="/plano-semanal" element={<P><PlanoSemanal /></P>} />
            <Route path="/diario" element={<P><DiarioAlimentar /></P>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
