import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { path: "/", label: "Início" },
  { path: "/preferencias", label: "Meu Perfil" },
  { path: "/scanner", label: "Scanner" },
  { path: "/receitas", label: "Receitas" },
  { path: "/educacao", label: "Educação" },
  { path: "/biblioteca", label: "Alimentos" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-foreground">
          Evolua<span className="text-primary">+</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-2 ml-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="w-3 h-3" />
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1 text-muted-foreground">
                <LogOut className="w-4 h-4" /> Sair
              </Button>
            </div>
          ) : (
            <Link to="/auth" className="ml-3">
              <Button variant="hero" size="sm" className="gap-1">
                <LogIn className="w-4 h-4" /> Entrar
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md animate-fade-in">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <button
                onClick={() => { handleSignOut(); setOpen(false); }}
                className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sair ({user.email?.split("@")[0]})
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium bg-primary/10 text-primary flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Entrar / Cadastrar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
