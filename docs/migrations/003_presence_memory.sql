-- SINCLIN — Presence Engine memory table
-- Execute no Supabase SQL Editor do projeto gbulvsjcufyyscgzlsrt

create table if not exists public.presence_memory (
  id          uuid primary key default gen_random_uuid(),
  session_key text not null,
  profile     text,
  context     jsonb not null default '{}',
  messages    jsonb not null default '[]',
  last_intent text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create unique index if not exists presence_memory_session_key
  on public.presence_memory(session_key);

alter table public.presence_memory enable row level security;

drop policy if exists "anon_all" on public.presence_memory;
create policy "anon_all" on public.presence_memory
  for all to anon using (true) with check (true);
