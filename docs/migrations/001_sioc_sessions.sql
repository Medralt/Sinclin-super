-- Tabela de sessões SIOC persistidas no Supabase
-- Executar no painel do Supabase: SQL Editor → New query → colar e executar

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

-- RLS: somente service_role pode escrever (backend usa service key)
alter table public.sioc_sessions enable row level security;

create policy "service_role full access"
  on public.sioc_sessions
  for all
  using (true)
  with check (true);

-- Índice para cleanup de sessões expiradas
create index if not exists sioc_sessions_updated_at_idx on public.sioc_sessions (updated_at);
