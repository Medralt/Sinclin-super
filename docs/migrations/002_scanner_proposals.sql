-- SINCLIN — scanner_proposals
-- Tabela de governança: scanner propõe, master autoriza.
-- Nenhuma evolução estrutural executa sem aprovação explícita.

create table if not exists public.scanner_proposals (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text,
  type            text not null default 'feature_gap',
  severity        text not null default 'medio',
  module          text not null default 'unknown',
  proposed_fix    jsonb,
  auto_executable boolean not null default false,
  status          text not null default 'pending',
  proposed_at     timestamptz not null default now(),
  reviewed_at     timestamptz,
  reviewer_notes  text
);

-- RLS
alter table public.scanner_proposals enable row level security;

drop policy if exists "anon_all_scanner_proposals" on public.scanner_proposals;
create policy "anon_all_scanner_proposals"
  on public.scanner_proposals for all
  using (true)
  with check (true);

-- Index para filtros por status
create index if not exists scanner_proposals_status_idx
  on public.scanner_proposals (status, proposed_at desc);
