# SINCLIN — Arquitetura Atual
**Versão:** 2.2 | **Atualizado:** 2026-05-14

---

## Repositórios

| Repo | Conteúdo | Deploy |
|---|---|---|
| `Medralt/sinclin-fente` | Frontend React/Vite | Render Static Site → `app.sinclin.net` |
| `Medralt/Sinclin-super` | Backend API Node/Express | Render Web Service → `api.sinclin.net` |

---

## Stack

### Frontend (`sinclin-fente`)
- **Framework:** React 18 + Vite 5 + TypeScript
- **UI:** shadcn/ui + Tailwind CSS
- **Roteamento:** React Router v6
- **Estado:** useState/useCallback (sem Redux/Zustand no core)
- **Auth:** Supabase Auth (`@supabase/supabase-js`)
- **DB client:** Supabase (direto do frontend para dados não-críticos)
- **Voz:** Web Speech API (`useTTS`, `useVoice`)
- **Build:** Bun (install) + npm (build) — `.npmrc legacy-peer-deps`
- **Deploy trigger:** push para `main` → Render auto-deploy

### Backend (`staging/api/server.js`)
- **Runtime:** Node.js + Express
- **IA:** Anthropic Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) — substituiu OpenAI GPT-4o-mini em mai/2026
- **Personas (8):** clinical · scanner · admin · financial · marketing · orchestrator · prospect · patient_care
- **Presence Engine:** `staging/api/presence.engine.js` — memória longitudinal por `session_key` via Supabase `presence_memory`
- **Device adapters:** `staging/api/adapters/` — padrão de plugin para instrumentos externos (facial_scanner, diagnostico, camera, iot...)
- **DB:** Supabase (`@supabase/supabase-js` via `SUPABASE_SERVICE_ROLE_KEY`)
- **Auth master:** HMAC-SHA256 (PIN + secret → token de sessão)
- **Deploy trigger:** push para `main` em Sinclin-super → Render auto-deploy
- **ATENÇÃO:** `api/server.js` (raiz) é stub vazio — o servidor real é `staging/api/server.js`

### Banco de Dados
- **Plataforma:** Supabase (PostgreSQL)
- **Projeto ativo:** `gbulvsjcufyyscgzlsrt` — "Sinclin" (ACTIVE_HEALTHY, conta principal)
- **RLS:** ativo em todas as tabelas

#### Projetos Supabase — inventário completo

| Ref | Nome | Status | Uso |
|---|---|---|---|
| `gbulvsjcufyyscgzlsrt` | Sinclin | ACTIVE_HEALTHY | **PRODUÇÃO — projeto único oficial** |
| `ufdeaqfblrrsjuvwiqig` | sinclin_ia | INACTIVE | Experimento pausado — pode ser deletado |
| `ucduacwytvghkhnselux` | — | Ativo (outra conta) | Projeto legado, não usar — app.sinclin.net apontava aqui por erro de env var no Render |

> **Regra:** apenas `gbulvsjcufyyscgzlsrt` deve ser usado. O `.env` local já aponta para ele.
> O Render precisa ter `VITE_SUPABASE_URL=https://gbulvsjcufyyscgzlsrt.supabase.co` e
> `VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdidWx2c2pjdWZ5eXNjZ3psc3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MzI3NjIsImV4cCI6MjA4NzUwODc2Mn0.FdTEv6VfGrUUOYlMXE9_3C4hi-CECRKOG7lmUCv1N28`
> configurados para o frontend. Backend: `SUPABASE_URL` e `SUPABASE_KEY` (service role) do mesmo projeto.

---

## Arquitetura Multi-Tenant

O SINCLIN é uma plataforma SaaS. Cada cliente (tenant) é uma clínica com `clinic_id` próprio. O isolamento de dados é garantido por **Row Level Security (RLS)** do Supabase — cada query retorna apenas registros do tenant autenticado.

```
tenant (clinic_id)
  └── users         → profissionais e colaboradores da clínica
  └── specialties   → especialidades configuradas (estética, podologia, etc.)
  └── services      → catálogo de serviços
  └── packages      → pacotes de serviços
  └── patients      → pacientes da clínica
  └── appointments  → agenda e atendimentos
  └── financial     → caixa, lançamentos, comissões
  └── tenant_config → plano contratado, regime fiscal, configurações
```

**Regra:** `clinic_id` é obrigatório em todas as tabelas operacionais. Queries sem `clinic_id` válido são bloqueadas pelo RLS.

---

## Tabelas Supabase

### Tabelas Operacionais (existentes)

| Tabela | Descrição | Status |
|---|---|---|
| `patients` | Cadastro de pacientes | ativo |
| `appointments` | Agendamentos | ativo |
| `financial_records` | Lançamentos financeiros | ativo |
| `scanner_findings` | Achados do scanner de runtime | ativo |
| `scanner_fixes` | Histórico de correções executadas | ativo |
| `scanner_proposals` | Propostas de evolução (governança) | ativo |
| `sioc_sessions` | Sessões de anamnese guiada (SIOC) | ativo |
| `presence_memory` | Memória longitudinal de presença | ativo |

### Tabelas Planejadas — Módulo de Serviços (Fase 1)

| Tabela | Descrição |
|---|---|
| `clinics` | Registro de tenants (clínicas) |
| `tenant_config` | Plano, regime fiscal, base de comissão, rateio de custos |
| `specialties` | Especialidades configuráveis por tenant |
| `services` | Catálogo de serviços com preço e duração |
| `service_supplies` | Insumos consumidos por serviço (vínculo com estoque) |
| `assets` | Equipamentos com valor, vida útil e horas/mês |
| `service_assets` | Ativos utilizados por serviço |
| `service_packages` | Pacotes com preço combinado e validade |
| `package_items` | Serviços e quantidades dentro de um pacote |
| `commission_rules` | Regras de comissão por profissional/especialidade/serviço |
| `tax_rules` | Impostos e taxas por especialidade e alíquota |
| `operational_costs` | Custos fixos e variáveis com política de rateio |

**Documentação completa:** `docs/SERVICE_MODEL.md`

---

## Variáveis de Ambiente

### Frontend (`.env` / Render)
```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

### Backend (Render env vars — nunca em repositório)
```
OPENAI_API_KEY
SUPABASE_URL
SUPABASE_KEY
MASTER_PIN          ← PIN do master (obrigatório definir em produção)
MASTER_SECRET       ← secret HMAC (obrigatório definir em produção)
MASTER_PHONE        ← celular para 2FA SMS (futuro)
```

---

## Estrutura Frontend (`src/`)

```
src/
├── core/
│   ├── auth.ts          ← Supabase Auth helpers (signIn, signUp, getSession)
│   ├── localDb.ts       ← Supabase client
│   ├── apiConfig.ts     ← API_BASE_URL
│   ├── profile.ts       ← Perfil local (professional/collaborator/prospect)
│   ├── scanner.ts       ← Scanners de runtime, dados, interação + completude
│   ├── stubRoutes.ts    ← FONTE ÚNICA das rotas em implementação (MarketingShell)
│   ├── tts.ts           ← useTTS (Web Speech API)
│   ├── voice.ts         ← useVoice + comandos de voz
│   ├── intelligence.ts  ← computeHealth, decide, impact_score
│   ├── execution.ts     ← executeFix (auto-correção)
│   ├── coverage.ts      ← CoverageAudit
│   └── engineering.ts   ← EngineeringConsole
│
├── components/
│   ├── AppLayout.tsx    ← Layout raiz com Sidebar + TopNav
│   ├── AppSidebar.tsx   ← Sidebar filtrada por perfil
│   ├── TopNav.tsx       ← Nav filtrado por perfil
│   ├── SinclinChat.tsx  ← Chat IA universal (personas)
│   ├── VoicePresence.tsx← Orb animado de presença de voz
│   ├── AIRelay.tsx      ← Relay de findings para IA
│   ├── CoverageAudit.tsx
│   └── EngineeringConsole.tsx
│
└── pages/
    ├── Welcome.tsx      ← Entrada ritual + auth (email/senha + confirmação)
    ├── Dashboard.tsx    ← Dashboard com briefing matinal por voz
    ├── AnalysisCenter.tsx ← Centro de Análise (scanner + governança)
    ├── MasterDashboard.tsx ← DEPRECADO (funcionalidade migrada para AnalysisCenter)
    ├── MarketingShell.tsx  ← Componente stub "Em implementação"
    └── [demais páginas funcionais]
```

---

## Fluxo de Auth

```
/welcome
  → Seleciona perfil (professional/collaborator/prospect)
  → Email + senha
  → Novo usuário: email de confirmação → retorna → login
  → Usuário existente: login direto
  → AuthGuard verifica session em todas as rotas protegidas
  → Sem sessão válida → redireciona para /welcome
```

---

## Fluxo de Governança (Scanner → Master)

```
Centro de Análise → aba "Governança"
  → PIN master → POST /master/auth → token na sessionStorage
  → "Scanner de completude" → scanCompleteness() [stubRoutes.ts]
  → submitProposals() → POST /master/proposals (17 propostas)
  → Fila: Pendentes / Aprovadas / Rejeitadas
  → Master aprova/rejeita/adia cada proposta
  → Aprovada → implementação manual na próxima sessão
```

---

## Personas da IA

| Persona | Uso |
|---|---|
| `clinical` | Anamnese SIOC, prontuário, condutas clínicas |
| `scanner` | Análise técnica do sistema, achados, recomendações |
| `orchestrator` | Assistente de conhecimento geral, integração de domínios |
| `admin` | Usuários, permissões, configurações |
| `financial` | Caixa, faturamento, análise financeira |
| `marketing` | Leads, funil, CRM, campanhas |
| `patient_care` | Pós-procedimento, cuidados, acompanhamento de pacientes |
