import { Link } from "react-router-dom";
import { Sparkles, Instagram, Linkedin, Github, Mail } from "lucide-react";

const SiteFooter = () => (
  <footer className="border-t border-border bg-secondary/40 relative overflow-hidden">
    <div className="absolute inset-0 bg-mesh pointer-events-none opacity-60" aria-hidden />
    <div className="container mx-auto px-6 py-16 grid gap-10 md:grid-cols-5 relative">
      <div className="md:col-span-2">
        <Link to="/" className="inline-flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[hsl(var(--primary-glow))] text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          Evolua <span className="text-primary">Plus</span>
        </Link>
        <p className="mt-4 text-sm text-muted-foreground max-w-sm leading-relaxed">
          Seu nutricionista inteligente 24h. Planejamento alimentar personalizado por IA,
          adaptado ao seu objetivo, restrições e rotina.
        </p>
        <div className="mt-5 flex items-center gap-2">
          {[
            { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
            { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
            { icon: Github, href: "https://github.com", label: "GitHub" },
            { icon: Mail, href: "mailto:contato@evoluaplus.app", label: "E-mail" },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-9 h-9 rounded-lg border border-border/60 bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>

      <div>
        <p className="font-display font-semibold text-sm text-foreground mb-3">Produto</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#como-funciona" className="hover:text-primary transition-colors">Como funciona</a></li>
          <li><a href="#recursos" className="hover:text-primary transition-colors">Recursos</a></li>
          <li><a href="#beneficios" className="hover:text-primary transition-colors">Benefícios</a></li>
          <li><a href="#planos" className="hover:text-primary transition-colors">Planos</a></li>
          <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
        </ul>
      </div>

      <div>
        <p className="font-display font-semibold text-sm text-foreground mb-3">Empresa</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/auth" className="hover:text-primary transition-colors">Criar conta</Link></li>
          <li><Link to="/vendas" className="hover:text-primary transition-colors">Assinar Plus</Link></li>
          <li><a href="mailto:contato@evoluaplus.app" className="hover:text-primary transition-colors">Contato</a></li>
        </ul>
      </div>

      <div>
        <p className="font-display font-semibold text-sm text-foreground mb-3">Legal</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#" className="hover:text-primary transition-colors">Termos de uso</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Política de privacidade</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
        </ul>
      </div>
    </div>

    <div className="border-t border-border/60 relative">
      <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Evolua Plus. Todos os direitos reservados.</p>
        <p className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Feito com cuidado para sua evolução.
        </p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;