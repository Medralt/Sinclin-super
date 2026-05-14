-- ═══════════════════════════════════════════════════════════════════════════
-- SINCLIN — facial_analysis: resultados do scanner de beleza facial
-- Executar no SQL Editor do Supabase (gbulvsjcufyyscgzlsrt)
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.facial_analysis (
  id           uuid primary key default gen_random_uuid(),
  clinic_id    uuid references public.clinics(id) default '00000000-0000-0000-0000-000000000001',
  patient_id   uuid references public.patients(id),
  paciente     text,
  session_id   text,
  dados        jsonb not null default '{}',
  analisado_em timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

alter table public.facial_analysis enable row level security;

create policy if not exists "anon_all_facial_analysis"
  on public.facial_analysis for all using (true) with check (true);

create index if not exists facial_analysis_clinic_idx   on public.facial_analysis (clinic_id);
create index if not exists facial_analysis_patient_idx  on public.facial_analysis (patient_id);
create index if not exists facial_analysis_session_idx  on public.facial_analysis (session_id);
