# Plano de Expansão do Evolua

O escopo enviado é grande (≈15 módulos novos, sistema de assinatura, IA, gráficos, upload de fotos, biblioteca com milhares de alimentos). Executar tudo em uma só rodada geraria código instável e crédito desperdiçado. Proponho entregar em **6 fases incrementais**, cada uma testável e utilizável ao final.

Antes de começar, preciso confirmar 2 pontos rápidos abaixo. Enquanto isso, esta é a divisão:

---

## Fase 1 — Fundação Free (Dashboard + Hidratação + Perfil)
- **Nova página `/dashboard`** como home pós-login: cards de calorias consumidas, água, metas diárias, barra de progresso animada, saudação.
- **Sistema de hidratação** no Dashboard e no Diário: botões +250/+500/+750/+1000ml, total, meta, % atingida, mensagens motivacionais automáticas.
- **Nova tabela `water_log`** (data, ml, user_id).
- **Nova tabela `user_goals`** (calorias, água, proteína, peso alvo).
- **Perfil Alimentar** ampliado: expandir `/preferencias` com objetivos múltiplos, restrições clássicas (lactose/glúten/vegano/vegetariano) e campo livre.

## Fase 2 — Biblioteca de Alimentos robusta
- Nova tabela `foods` (nome, categoria, calorias, macros, fibras, sódio, porção, benefícios).
- Seed inicial com ~300 alimentos TACO/USDA (Brasil-first). *Não é viável semear "milhares" manualmente; usaremos ~300 curados + busca IA para o restante.*
- Página `/biblioteca` reformulada: busca instantânea, filtros por categoria, cards com macros completos.

## Fase 3 — Diário Alimentar melhorado + Plano Inteligente
- Diário: seleção de alimento vindo da nova biblioteca + peso em gramas + cálculo automático de macros.
- Plano Alimentar: refinar prompt do `meal-plan` para considerar orçamento, rotina, alimentos rejeitados e restrições estruturadas.

## Fase 4 — Assinatura Evolua Plus (paywall)
- Tabela `subscriptions` (user_id, plano, status, expira_em).
- Componente `<PlusGate>` que bloqueia rotas premium e mostra CTA para `/vendas`.
- Atualizar `/vendas` com 3 planos (Mensal R$29,90 / Semestral R$129,90 / Anual R$249,90) e links Kirvano separados.
- Marcar como premium: Scanner, Receitas, Histórico completo, IA Nutricional, Fotos de evolução, Medidas corporais, Relatórios.

## Fase 5 — Módulos Premium (corpo + evolução + relatórios)
- **Medidas Corporais**: tabela `body_measurements`, formulário, histórico.
- **Evolução Corporal**: dashboard com gráficos (recharts) de peso/IMC/cintura, comparação semanal e mensal.
- **Fotos de Evolução**: bucket `progress-photos` (privado), upload frente/lado/costas, comparador antes/depois.
- **Relatórios Semanal/Mensal**: edge function que agrega dados e gera resumo com IA.

## Fase 6 — IA Nutricional + Educação expandida + Receitas corrigidas
- **Assistente IA** (`/assistente`): chat com contexto do perfil, histórico e metas (Gemini 2.5 Flash, streaming).
- **Receitas premium**: refazer edge function `generate-recipes` com filtros por categoria (rápida, fitness, hipo/hiper, vegetariana, café/almoço/jantar/lanche/pós-treino) e persistência.
- **Educação**: novos módulos (Emagrecimento, Ganho de Massa, Rótulos, Macros, Micros, Ciência, Estratégias, Mitos, Saudável) com artigos estruturados no banco.

---

## Decisões técnicas
- Design system atual mantido (sage green + cream, Space Grotesk/DM Sans).
- Todas as tabelas novas com RLS por `auth.uid()` e GRANTs corretos.
- Upload de fotos: bucket privado, signed URLs.
- Gráficos: `recharts` (já disponível).
- Paywall: verificação client + edge function (não confio só no client).
- Kirvano continua BYOK — usuário cola os 3 links de checkout quando tiver.

---

## Preciso confirmar antes de começar

**1. Como o usuário vira Plus?**
Kirvano notifica via webhook, ou por enquanto libero manualmente (via marcação no banco) enquanto integramos o webhook depois?

**2. Começo pela Fase 1 (Dashboard + Hidratação + Perfil)?**
Esta fase já entrega valor imediato para todos os usuários free e não depende de decisões de pagamento. Recomendo começar por ela e seguir em ordem — cada fase leva uma rodada de mensagens.

Responda "sim" para iniciar a Fase 1, ou diga se prefere outra ordem / juntar fases.
