# Transformação Balanced You em SaaS Premium

O escopo enviado equivale a reconstruir praticamente todo o produto. Para entregar com qualidade profissional (e não uma versão superficial de tudo ao mesmo tempo), proponho executar em **6 fases sequenciais**. Cada fase é entregue completa, testada e polida antes de seguir para a próxima.

## Posicionamento central (aplicado em todas as fases)

> "Seu nutricionista inteligente, disponível 24 horas."

Toda copy, hierarquia visual e CTA reforçam esse posicionamento — não "mais uma calculadora".

---

## Fase 1 — Landing pública premium (`/` e `/vendas`)

Foco em conversão e clareza nos primeiros 5 segundos.

- **Hero reconstruído**: headline "Receba seu plano alimentar personalizado em menos de 2 minutos", subtítulo com IA + objetivos + restrições, CTA primário ("Criar meu plano grátis") + secundário ("Ver como funciona"), mockup real do dashboard ao lado.
- **Seção "Demonstração visual"**: mockups do dashboard, plano alimentar, receitas, lista de compras e evolução.
- **Seção "Como funciona"**: timeline de 4 passos (Responda → IA analisa → Receba plano → Acompanhe evolução).
- **Seção "Benefícios"**: 8 benefícios traduzidos como resultado (não features).
- **Prova social**: estatísticas + 6 depoimentos (marcados como placeholder até haver dados reais).
- **FAQ**: 9 perguntas do prompt, com accordion.
- **Planos**: tabela comparativa Free vs Plus (Mensal/Semestral/Anual) com plano recomendado destacado; estrutura pronta para Família/Nutricionista/Personal.
- **Footer profissional** com links institucionais.

## Fase 2 — Páginas institucionais + FAQ dedicado

- `/sobre`, `/contato`, `/privacidade`, `/termos`, `/faq`.
- Links no footer e navegação.
- SEO por rota via `react-helmet-async`.

## Fase 3 — Design system + acessibilidade + SEO técnico

- Tokens (cores, tipografia, espaçamento, sombras, radius) auditados em `index.css` e `tailwind.config.ts`.
- Componentes padronizados: Button, Card, Input, Modal, Badge, EmptyState, Skeleton.
- Microinterações, loading states, skeletons, empty states elegantes.
- Acessibilidade: contraste, ARIA, navegação por teclado, labels.
- SEO: meta tags corretas em `index.html`, Open Graph, Twitter Cards, JSON-LD Organization/WebSite/FAQPage, `sitemap.xml`, `robots.txt` revisto.
- Performance: lazy loading de rotas, compressão de imagens, WebP onde aplicável.

## Fase 4 — Dashboard premium

- Layout SaaS moderno com sidebar/topbar.
- Cards: peso atual, meta, IMC, água, calorias consumidas/restantes, macros (P/C/G).
- Progresso diário e semanal com gráficos (Recharts).
- Indicadores visuais e microinterações.
- Estados vazios elegantes.

## Fase 5 — Plano alimentar + lista de compras

- Cada refeição: nome, horário, kcal, macros, tempo de preparo, receita, substituições, ingredientes.
- Lista de compras agrupada por categoria (Proteínas, Hortifruti, Laticínios, Grãos, Temperos), com marcação de concluído.

## Fase 6 — Perfil expandido + IA conversacional avançada

- Perfil completo: objetivo, peso, altura, sexo, idade, atividade, restrições, alergias, preferências, favoritos, evitados, tempo para cozinhar, orçamento.
- Assistente IA com ações contextuais ("Vou comer pizza", "Não almocei") reorganizando o dia.

---

## Detalhes técnicos

- **Stack mantida**: React 18 + Vite + Tailwind + shadcn + Supabase (Lovable Cloud). Sem migração de framework.
- **Sem quebras no que já funciona**: Auth, Scanner, Preferências, Diário, Plano Semanal, Receitas, Educação, Biblioteca, Evolução, Guias, Assistente IA e Vendas continuam funcionando durante as fases.
- **SSR**: o app é SPA — social previews por rota exigiriam migração para TanStack Start. Posso propor essa migração depois se você quiser previews de link perfeitos por página.
- **Cada fase termina com**: build limpo, verificação visual via Playwright no preview, e um resumo do que mudou.

---

## O que preciso de você para começar

1. **Confirma começar pela Fase 1** (landing premium) agora?
2. **Depoimentos**: uso placeholders marcados ("Depoimento em breve") ou você me envia 3–6 textos reais?
3. **Mockup do produto no hero**: gero uma imagem premium do dashboard (via imagegen) ou monto o mockup em HTML/CSS puro?
4. **Preços**: mantenho Mensal R$29,90 / Semestral R$129,90 / Anual R$249,90 já configurados?

Assim que responder, começo a Fase 1 imediatamente.
