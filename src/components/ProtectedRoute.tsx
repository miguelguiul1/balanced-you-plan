import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSetupStatus } from "@/hooks/useOnboarding";

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { data: setup, isLoading: setupLoading } = useSetupStatus();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/auth" replace />;
  if (setupLoading || !setup) return <Spinner />;

  const onOnboarding = location.pathname === "/onboarding";

  // Sem configuração → onboarding. Já configurado → nunca fica preso no onboarding.
  if (setup.needsOnboarding && !onOnboarding) return <Navigate to="/onboarding" replace />;
  if (!setup.needsOnboarding && onOnboarding) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
