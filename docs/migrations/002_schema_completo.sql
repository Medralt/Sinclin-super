-- ============================================================
-- SINCLIN — Schema completo do banco de dados
-- Executar no Supabase SQL Editor do projeto gbulvsjcufyyscgzlsrt
-- ============================================================

-- PATIENTS
create table if not exists public.patients (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  document    text,
  birth_date  date,
  phone       text,
  email       text,
  notes       text,
  status      text not null default 'ativo',
  created_by  uuid,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- APPOINTMENTS
create table if not exists public.appointments (
  id                  uuid primary key default gen_random_uuid(),
  patient_id          uuid references public.patients(id) on delete cascade,
  procedure           text,
  status              text not null default 'agendado',
  scheduled_at        timestamptz not null,
  amount              numeric(10,2),
  financial_record_id uuid,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- FINANCIAL RECORDS
create table if not exists public.financial_records (
  id          uuid primary key default gen_random_uuid(),
  description text not null,
  type        text not null check (type in ('receita','despesa')),
  amount      numeric(10,2) not null default 0,
  status      text not null default 'pendente',
  due_date    date,
  patient_id  uuid references public.patients(id) on delete set null,
  created_by  uuid,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- CLINICAL PROTOCOLS
create table if not exists public.clinical_protocols (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  procedure   text,
  indication  text,
  description text,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- KNOWLEDGE ARTICLES
create table if not exists public.knowledge_articles (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  content     text,
  category    text,
  tags        text[],
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- LEADS
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text,
  phone       text,
  source      text,
  status      text not null default 'novo',
  patient_id  uuid references public.patients(id) on delete set null,
  created_by  uuid,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- SCANNER FINDINGS
create table if not exists public.scanner_findings (
  id            uuid primary key default gen_random_uuid(),
  scan_type     text not null,
  severity      text not null default 'baixo',
  category      text not null,
  title         text not null,
  description   text,
  status        text not null default 'aberto',
  suggested_fix jsonb,
  target        jsonb,
  detected_at   timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create unique index if not exists scanner_findings_dedup
  on public.scanner_findings (category, (target->>'url'))
  where status = 'aberto';

-- SCANNER FIXES
create table if not exists public.scanner_fixes (
  id          uuid primary key default gen_random_uuid(),
  finding_id  uuid references public.scanner_findings(id) on delete set null,
  action      text not null,
  success     boolean not null default false,
  result      jsonb,
  executed_at timestamptz not null default now()
);

-- AI PROMPT REQUESTS
create table if not exists public.ai_prompt_requests (
  id                uuid primary key default gen_random_uuid(),
  finding_id        uuid references public.scanner_findings(id) on delete set null,
  finding_snapshot  jsonb not null default '{}',
  status            text not null default 'aguardando',
  mode              text not null default 'manual',
  origin            text,
  generated_prompt  text,
  error_message     text,
  processed_by      text,
  requested_by      uuid,
  requested_at      timestamptz not null default now(),
  processed_at      timestamptz,
  executed_at       timestamptz
);

-- AUDIT LOGS
create table if not exists public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid,
  action      text not null,
  entity      text,
  entity_id   text,
  metadata    jsonb,
  created_at  timestamptz not null default now()
);

-- SIOC SESSIONS (backend)
create table if not exists public.sioc_sessions (
  id          text primary key,
  sioc_step   text not null default 'start',
  paciente    jsonb not null default '{}',
  anamnese    jsonb not null default '{}',
  devices     jsonb not null default '{}',
  events      jsonb not null default '[]',
  meta        jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- RLS — Row Level Security
-- Libera acesso público (anon) para o frontend funcionar.
-- Em produção, refine por usuário autenticado.
-- ============================================================

alter table public.patients           enable row level security;
alter table public.appointments       enable row level security;
alter table public.financial_records  enable row level security;
alter table public.clinical_protocols enable row level security;
alter table public.knowledge_articles enable row level security;
alter table public.leads              enable row level security;
alter table public.scanner_findings   enable row level security;
alter table public.scanner_fixes      enable row level security;
alter table public.ai_prompt_requests enable row level security;
alter table public.audit_logs         enable row level security;
alter table public.sioc_sessions      enable row level security;

-- Políticas abertas (anon pode tudo) — ajustar conforme auth evoluir
do $$
declare t text;
begin
  foreach t in array array[
    'patients','appointments','financial_records','clinical_protocols',
    'knowledge_articles','leads','scanner_findings','scanner_fixes',
    'ai_prompt_requests','audit_logs','sioc_sessions'
  ] loop
    execute format(
      'create policy if not exists "anon_all" on public.%I for all to anon using (true) with check (true)',
      t
    );
  end loop;
end $$;
