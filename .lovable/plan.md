## Objetivo
Transformar o Hero da home (`/`) em um visual premium, mantendo o texto legível e o estilo minimalista sage/creme atual.

## Mudanças

### 1. Fundo
- Substituir a imagem `hero-bg.jpg` por um **gradiente radial suave branco → verde claro** (usando os tokens `--background` e `--primary`).
- Adicionar 2 blobs orbes borrados (verde sálvia e creme quente) posicionados nas laterais com `blur-3xl` e opacidade baixa para dar profundidade.
- Sutil textura de grain via SVG noise para toque premium.

### 2. Elementos decorativos SVG
- **Folhas orgânicas** em SVG (3–5 unidades) nas bordas/cantos, em verde sálvia com opacidade 15–25%, animação flutuante (translateY + rotate leve, 6–8s loop).
- **Linhas orgânicas** onduladas em SVG na base e no topo, bem discretas.
- **Partículas** (pequenos círculos verdes/creme, 8–12 unidades) com animação de flutuação vertical em tempos e delays diferentes.

### 3. Mockup de celular
- Adicionar um **mockup de smartphone** SVG (frame moderno, sem marca) numa das laterais mostrando uma tela mock do app: card de refeição com prato, calorias e macros. Escondido em telas < md, visível em desktop.
- Segunda opção de mockup menor do lado oposto (menu semanal ou lista de compras), com leve parallax no scroll.

### 4. Animações
- **Parallax leve** no scroll: mockups e folhas se movem em velocidades diferentes (usando `useEffect` com `window.scrollY` — sem libs novas).
- **Fade + slide** no mount (já usa `animate-fade-up`; manter e escalonar delays).
- **Float** contínuo em folhas e partículas via novos keyframes no `tailwind.config.ts`.
- Respeitar `prefers-reduced-motion` (desligar float/parallax).

### 5. Camadas (garantir texto legível)
- Ordem z-index: gradiente → blobs → grain → linhas SVG → folhas/partículas → mockups (laterais, não sobrepõem o texto central) → conteúdo (texto + CTA).
- Container central com `max-w-3xl` mantido, e um leve véu (`bg-background/40 backdrop-blur-[2px]`) atrás do texto se necessário para contraste.

## Arquivos alterados
- `src/components/HeroSection.tsx` — reescrever o JSX: remover `<img heroBg>`, adicionar camadas de fundo, SVGs (folhas, linhas, mockup), partículas, e hook de parallax.
- `src/index.css` — adicionar utilities/keyframes (`float`, `float-slow`, `drift`) e classes `.grain`, `.orb` para os blobs.
- `tailwind.config.ts` — registrar animações `float`, `float-slow`, `drift`.
- (Opcional) `src/assets/hero-bg.jpg` deixa de ser usado, mas não removo o arquivo.

## Fora do escopo
- Não altero o restante da página (Calculator, footer).
- Não instalo libs novas (sem framer-motion).
- Mockup do celular será SVG desenhado inline, não imagem gerada — mantém carregamento rápido e visual limpo.

## Verificação
- Rodar Playwright em `/` e capturar screenshot em viewport desktop (1280×1800) e mobile (390×844) para confirmar: texto legível, elementos não cobrindo CTA, mockup escondido no mobile, animações rodando.
