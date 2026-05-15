# CLAUDE.md — SINCLIN Project Context
**Atualizado:** 2026-05-15

Este arquivo é o briefing completo para sessões Claude Code no repositório `sinclin-fente` (frontend React/Vite). Leia antes de qualquer ação.

---

## O que é o SINCLIN

SINCLIN é uma **plataforma cognitiva de gestão para negócios de saúde e bem-estar** (clínicas, consultórios, estética). Não é software de gestão: é uma **infraestrutura de presença** — o sistema conhece a clínica, seus pacientes e sua equipe, e age como colaborador cognitivo.

**Stack principal:**
- Frontend: React 18 + Vite 5 + TypeScript + shadcn/ui + Tailwind CSS
- Backend: Node.js + Express (`staging/api/server.js` — NÃO `api/server.js` que é stub vazio)
- IA: Anthropic Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) — substituiu OpenAI em mai/2026
- DB: Supabase PostgreSQL (`gbulvsjcufyyscgzlsrt`) com RLS ativo
- Deploy: Render (frontend `app.sinclin.net`, backend `api.sinclin.net`)

---

## Repositórios

| Repo | Conteúdo | Deploy |
|---|---|---|
| `Medralt/sinclin-fente` | Frontend React/Vite (este repo) | Render Static → `app.sinclin.net` |
| `Medralt/Sinclin-super` | Backend API Node/Express | Render Web Service → `api.sinclin.net` |

---

## Estrutura de Src (frontend)

```
src/
├── core/
│   ├── auth.ts          ← Supabase Auth helpers
│   ├── localDb.ts       ← Supabase client (único ponto de acesso ao DB)
│   ├── apiConfig.ts     ← API_BASE_URL
│   ├── profile.ts       ← Perfil local (professional/collaborator/prospect)
│   ├── scanner.ts       ← Scanners de runtime, dados, interação + completude
│   ├── stubRoutes.ts    ← FONTE ÚNICA de rotas "Em implementação" (MarketingShell)
│   ├── tts.ts           ← useTTS (Web Speech API)
│   ├── voice.ts         ← useVoice + comandos de voz
│   ├── intelligence.ts  ← computeHealth, decide, impact_score
│   ├── execution.ts     ← executeFix (auto-correção)
│   ├── coverage.ts      ← CoverageAudit
│   └── engineering.ts   ← EngineeringConsole
├── components/
│   ├── AppLayout.tsx    ← Layout raiz: GlobalHeader + TopNav (AppSidebar NÃO está em uso)
│   ├── GlobalHeader.tsx ← Tarja superior: logo + busca por módulo + índices econômicos
│   ├── AppSidebar.tsx   ← ÓRFÃO — existe mas não importado
│   ├── TopNav.tsx       ← Menu principal filtrado por perfil
│   ├── SinclinChat.tsx  ← Chat IA universal (8 personas via Claude Haiku)
│   ├── VoicePresence.tsx← Orb animado de presença de voz
│   └── AIRelay.tsx      ← Relay de findings para IA
└── pages/
    ├── Welcome.tsx           ← Entrada ritual + auth
    ├── Dashboard.tsx         ← Dashboard com briefing matinal por voz
    ├── FiscalDashboard.tsx   ← Vencimentos agregados + NFS-e/Impostos/ANVISA
    ├── PatientCadastro.tsx   ← Formulário AVEC-compatível + campos dinâmicos + ViaCEP
    ├── PatientImport.tsx     ← Importação CSV do AVEC em lote (50/batch)
    ├── ConfigFormularios.tsx ← Campos customizados por formulário e tenant
    ├── ConfigServicos.tsx    ← Catálogo de serviços com insumos e ativos
    ├── ConfigPacotes.tsx     ← Pacotes de serviços
    ├── ConfigComissoes.tsx   ← Regras de comissão (4 bases)
    ├── ConfigFiscal.tsx      ← Regras de impostos
    ├── ConfigCustos.tsx      ← Custos operacionais com rateio
    ├── FinanceiroMargem.tsx  ← DRE simplificado por serviço
    ├── AnalysisCenter.tsx    ← Centro de Análise (scanner + governança)
    ├── MarketingShell.tsx    ← Stub "Em implementação" para rotas não implementadas
    └── [demais páginas funcionais]
```

---

## Regras Arquiteturais

1. **`stubRoutes.ts` é fonte única de verdade** para módulos não implementados. Para adicionar stub: inserir em `STUB_ROUTES`. Para remover (após implementar): remover de `STUB_ROUTES` e criar `<Route>` real no `App.tsx`.

2. **`staging/api/server.js`** é o servidor real. `api/server.js` na raiz é stub vazio — nunca edite esse.

3. **`AppSidebar.tsx`** não está em uso. O layout usa `TopNav.tsx`. Não reintroduza o sidebar sem aprovação.

4. **RLS é inviolável.** Toda tabela operacional exige `clinic_id`. Queries sem `clinic_id` válido são bloqueadas pelo Supabase.

5. **Multi-tenant por design.** `clinic_id` é chave de isolamento de todos os dados. Nunca fazer query sem filtro de tenant.

6. **Supabase ativo:** apenas `gbulvsjcufyyscgzlsrt`. Projetos `ufdeaqfblrrsjuvwiqig` (inativo) e `ucduacwytvghkhnselux` (legado, outra conta) não devem ser usados.

---

## Banco de Dados — Tabelas Ativas

| Tabela | Descrição |
|---|---|
| `patients` | Cadastro — 33 colunas: core + AVEC + custom_fields (jsonb) |
| `form_configs` | Campos configuráveis por formulário por tenant |
| `facial_analysis` | Resultados do scanner de beleza facial (Claude Vision) |
| `appointments` | Agendamentos |
| `financial_records` | Lançamentos financeiros |
| `scanner_findings` | Achados do scanner de runtime |
| `scanner_fixes` | Histórico de correções |
| `scanner_proposals` | Propostas de evolução (governança) |
| `sioc_sessions` | Sessões de anamnese guiada (SIOC) |
| `presence_memory` | Memória longitudinal por `session_key` |

**Migrations executadas:** `docs/migrations/ALL_FASE1.sql`, `patients_fields.sql`, `form_configs.sql`, `presence_memory_schema.sql`, `facial_analysis.sql`

---

## Backend — Endpoints Principais

| Endpoint | Descrição |
|---|---|
| `POST /chat` | Claude Haiku, 8 personas, Presence Engine |
| `POST /scanner/clinical` | Claude Vision análise clínica |
| `POST /sioc/device/facial_scanner` | Scanner de beleza → Claude Vision |
| `POST /sioc` | Anamnese guiada |
| `GET /health` | Health check |
| `POST /master/auth` | PIN → token HMAC-SHA256 |
| `GET/POST/PATCH /master/proposals` | Governança de propostas |

---

## Personas da IA (Claude Haiku 4.5)

| Persona | Domínio |
|---|---|
| `clinical` | Anamnese SIOC, prontuário, condutas |
| `scanner` | Análise técnica, achados do sistema |
| `orchestrator` | Assistente geral, integração de domínios |
| `admin` | Usuários, permissões, configurações |
| `financial` | Caixa, faturamento, análise financeira |
| `marketing` | Leads, funil, CRM, campanhas |
| `patient_care` | Pós-procedimento, cuidados, acompanhamento |
| `prospect` | Experiência de prospecção |

---

## Ciclo de Governança

```
stubRoutes.ts → scanner detecta → submitProposals() → scanner_proposals
    → Master acessa Centro de Análise → PIN → Aprovar/Rejeitar/Adiar
    → Aprovada → implementação na próxima sessão → stub removido
```

Auth do master: `POST /master/auth` com PIN → token HMAC-SHA256 em `sessionStorage`.

---

## Estado de Produção (mai/2026)

- Frontend: `app.sinclin.net` — ✅ operacional, independente do Lovable
- Backend: `api.sinclin.net` — ✅ operacional (Claude Haiku, Presence Engine, SIOC, scanner facial)
- Supabase: `gbulvsjcufyyscgzlsrt` — ACTIVE_HEALTHY
- AuthGuard: ⚠️ temporariamente desativado (pass-through ao Dashboard)
- Env vars no Render: ⬜ CRÍTICO — `ANTHROPIC_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` pendentes de configuração manual

---

## Env Vars

### Frontend (Render Static)
```
VITE_SUPABASE_URL=https://gbulvsjcufyyscgzlsrt.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Backend (Render Web Service — nunca no repositório)
```
ANTHROPIC_API_KEY           ← Claude Haiku 4.5
SUPABASE_URL                ← https://gbulvsjcufyyscgzlsrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY   ← service role (não anon)
MASTER_PIN                  ← obrigatório em produção
MASTER_SECRET               ← obrigatório em produção
SIOC_FACIAL_SCANNER_ENABLED ← true para ativar scanner de beleza
```

---

## Módulos — Estado Resumido

**Totalmente implementados (✅):** Clínico (agenda, prontuário, evolução, prescrições), Pacientes (cadastro, importação AVEC, 360, SIOC, cuidados), Financeiro completo, Marketing core (leads, funil, CRM), Configurações (serviços, pacotes, comissões, fiscal, custos, formulários), Conhecimento core, Módulo Fiscal com Vencimentos, Centro de Análise com governança, Chat IA + voz + SIOC + Presence Engine.

**Stubs MarketingShell (🔴):** 17 módulos definidos em `stubRoutes.ts` — implementação controlada pelo ciclo de governança.

---

## Protocolo para Esta Sessão

1. **Preservar o core estável** — nunca modificar sem necessidade clara
2. **Stubs via `stubRoutes.ts`** — nunca implementar rotas fora do ciclo de governança
3. **`clinic_id` obrigatório** em toda query ao Supabase
4. **Fenomenologia frágil** — `Welcome.tsx`, `VoicePresence.tsx`, `useTTS`, `Dashboard.tsx` (briefing por voz): preservar primeiro, otimizar depois
5. **Modelo IA:** Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) — não reverter para OpenAI
6. **Deploy:** push para `main` no `sinclin-fente` → Render auto-deploy. Testar `curl https://api.sinclin.net/health` após deploy do backend.

---

## Roadmap Resumido

| Fase | Estado | Descrição |
|---|---|---|
| 0 — Fundação | 🔶 Em andamento | Env vars produção + 17 stubs aprovados |
| 1 — Serviços/Comissões/Fiscal | 🔶 UI pronta, tabelas planejadas | Circuito financeiro completo |
| 2 — Completude | ⬜ | Eliminar todos os stubs |
| 2b — IA Ampliada | ⬜ | Relatórios narrados, briefing personalizado, sugestões proativas |
| 3 — Portal do Paciente | ⬜ | PWA/app para pacientes |
| 4 — SaaS | ⬜ | Planos, billing, marketplace |

**Planos SaaS:** Essencial R$249 · Clínico R$499 · Pro R$899 · Enterprise R$1.799/mês

---

*Documentação completa: `docs/STATUS.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/PRODUCT.md`, `docs/SERVICE_MODEL.md`, `docs/governance/GOVERNANCE.md`*
