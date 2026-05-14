-- ═══════════════════════════════════════════════════════════════════════════
-- SINCLIN — presence_memory: schema completo para Presence Engine
-- Executar no SQL Editor do Supabase (gbulvsjcufyyscgzlsrt)
-- ═══════════════════════════════════════════════════════════════════════════

-- Garante que as colunas necessárias existem
alter table public.presence_memory
  add column if not exists session_key   text,
  add column if not exists profile       text,
  add column if not exists context       jsonb not null default '{}',
  add column if not exists messages      jsonb not null default '[]',
  add column if not exists last_intent   text,
  add column if not exists updated_at    timestamptz not null default now();

-- Índice único em session_key (necessário para o upsert do Presence Engine)
create unique index if not exists presence_memory_session_key_idx
  on public.presence_memory (session_key)
  where session_key is not null;

-- RLS: permite operações do service role (backend usa SUPABASE_SERVICE_ROLE_KEY)
alter table public.presence_memory enable row level security;

create policy if not exists "service_all_presence_memory"
  on public.presence_memory
  for all
  using (true)
  with check (true);
