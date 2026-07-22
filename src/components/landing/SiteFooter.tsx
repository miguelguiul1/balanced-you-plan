import { Link } from "react-router-dom";

const SiteFooter = () => (
  <footer className="border-t border-border bg-secondary/30">
    <div className="container mx-auto px-6 py-14 grid gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <p className="font-display text-xl font-bold text-foreground">
          Balanced <span className="text-primary">You</span>
        </p>
        <p className="mt-3 text-sm text-muted-foreground max-w-sm">
          Seu nutricionista inteligente 24h. Planejamento alimentar personalizado por IA,
          adaptado ao seu objetivo, restrições e rotina.
        </p>
      </div>
      <div>
        <p className="font-display font-semibold text-sm text-foreground mb-3">Produto</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="#como-funciona" className="hover:text-primary">Como funciona</a></li>
          <li><a href="#beneficios" className="hover:text-primary">Benefícios</a></li>
          <li><a href="#planos" className="hover:text-primary">Planos</a></li>
          <li><a href="#faq" className="hover:text-primary">FAQ</a></li>
        </ul>
      </div>
      <div>
        <p className="font-display font-semibold text-sm text-foreground mb-3">Institucional</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/auth" className="hover:text-primary">Criar conta</Link></li>
          <li><Link to="/vendas" className="hover:text-primary">Assinar Plus</Link></li>
          <li><a href="mailto:contato@balancedyou.app" className="hover:text-primary">Contato</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border/60">
      <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Balanced You. Todos os direitos reservados.</p>
        <p>Feito com cuidado para sua evolução.</p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;