import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Preferencias = lazy(() => import("./pages/Preferencias"));
const Scanner = lazy(() => import("./pages/Scanner"));
const Receitas = lazy(() => import("./pages/Receitas"));
const Educacao = lazy(() => import("./pages/Educacao"));
const Biblioteca = lazy(() => import("./pages/Biblioteca"));
const Historico = lazy(() => import("./pages/Historico"));
const PlanoSemanal = lazy(() => import("./pages/PlanoSemanal"));
const DiarioAlimentar = lazy(() => import("./pages/DiarioAlimentar"));
const AssistenteIA = lazy(() => import("./pages/AssistenteIA"));
const Evolucao = lazy(() => import("./pages/Evolucao"));
const Guias = lazy(() => import("./pages/Guias"));
const Vendas = lazy(() => import("./pages/Vendas"));
const Checkout = lazy(() => import("./pages/Checkout"));
const DesignSystem = lazy(() => import("./pages/DesignSystem"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: true, retry: 1 } },
});

const PageFallback = () => (
  <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
    <p className="text-sm text-muted-foreground">Carregando…</p>
  </div>
);

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
          <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/vendas" element={<Vendas />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={<Index />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/dashboard" element={<P><Dashboard /></P>} />
            <Route path="/preferencias" element={<P><Preferencias /></P>} />
            <Route path="/scanner" element={<P><Scanner /></P>} />
            <Route path="/receitas" element={<P><Receitas /></P>} />
            <Route path="/educacao" element={<P><Educacao /></P>} />
            <Route path="/biblioteca" element={<P><Biblioteca /></P>} />
            <Route path="/historico" element={<P><Historico /></P>} />
            <Route path="/plano-semanal" element={<P><PlanoSemanal /></P>} />
            <Route path="/diario" element={<P><DiarioAlimentar /></P>} />
            <Route path="/assistente" element={<P><AssistenteIA /></P>} />
            <Route path="/evolucao" element={<P><Evolucao /></P>} />
            <Route path="/guias" element={<P><Guias /></P>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
