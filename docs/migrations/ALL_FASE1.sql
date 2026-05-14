-- ═══════════════════════════════════════════════════════════════════════════
-- SINCLIN — Migrations Fase 1 (consolidado)
-- Executar de uma vez no SQL Editor do Supabase (gbulvsjcufyyscgzlsrt)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 003: Multi-tenant + Especialidades ──────────────────────────────────────

create table if not exists public.clinics (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  cnpj       text,
  phone      text,
  email      text,
  address    text,
  city       text,
  state      text,
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.clinics (id, name) values
  ('00000000-0000-0000-0000-000000000001', 'Clínica Principal')
on conflict (id) do nothing;

create table if not exists public.tenant_config (
  clinic_id       uuid primary key references public.clinics(id),
  tax_regime      text default 'simples',
  cnpj            text,
  municipal_code  text,
  commission_base text not null default 'gross',
  cost_allocation text not null default 'by_revenue',
  plan            text not null default 'clinico',
  plan_started_at date default current_date,
  updated_at      timestamptz default now()
);

insert into public.tenant_config (clinic_id) values
  ('00000000-0000-0000-0000-000000000001')
on conflict (clinic_id) do nothing;

create table if not exists public.specialties (
  id          uuid primary key default gen_random_uuid(),
  clinic_id   uuid not null references public.clinics(id),
  name        text not null,
  description text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

insert into public.specialties (clinic_id, name) values
  ('00000000-0000-0000-0000-000000000001', 'Estética Facial'),
  ('00000000-0000-0000-0000-000000000001', 'Estética Corporal'),
  ('00000000-0000-0000-0000-000000000001', 'Procedimentos Clínicos')
on conflict do nothing;

alter table public.patients        add column if not exists clinic_id uuid references public.clinics(id) default '00000000-0000-0000-0000-000000000001';
alter table public.appointments    add column if not exists clinic_id uuid references public.clinics(id) default '00000000-0000-0000-0000-000000000001';
alter table public.financial_records add column if not exists clinic_id uuid references public.clinics(id) default '00000000-0000-0000-0000-000000000001';
alter table public.sioc_sessions   add column if not exists clinic_id uuid references public.clinics(id) default '00000000-0000-0000-0000-000000000001';
alter table public.presence_memory add column if not exists clinic_id uuid references public.clinics(id) default '00000000-0000-0000-0000-000000000001';

alter table public.clinics        enable row level security;
alter table public.tenant_config  enable row level security;
alter table public.specialties    enable row level security;

create policy if not exists "anon_all_clinics"       on public.clinics       for all using (true) with check (true);
create policy if not exists "anon_all_tenant_config" on public.tenant_config for all using (true) with check (true);
create policy if not exists "anon_all_specialties"   on public.specialties   for all using (true) with check (true);

create index if not exists specialties_clinic_idx on public.specialties (clinic_id);

-- ─── 004: Serviços e Ativos ───────────────────────────────────────────────────

create table if not exists public.services (
  id           uuid primary key default gen_random_uuid(),
  clinic_id    uuid not null references public.clinics(id),
  specialty_id uuid references public.specialties(id),
  name         text not null,
  description  text,
  duration_min integer default 60,
  base_price   numeric(10,2) not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.service_supplies (
  id         uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  item_name  text not null,
  quantity   numeric(10,4) not null default 1,
  unit       text not null default 'un',
  unit_cost  numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.assets (
  id                  uuid primary key default gen_random_uuid(),
  clinic_id           uuid not null references public.clinics(id),
  name                text not null,
  description         text,
  acquisition_value   numeric(10,2) not null default 0,
  useful_life_months  integer not null default 60,
  monthly_hours       integer not null default 160,
  active              boolean not null default true,
  acquired_at         date not null default current_date,
  created_at          timestamptz not null default now()
);

create table if not exists public.service_assets (
  id         uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  asset_id   uuid not null references public.assets(id),
  hours_used numeric(5,2) not null default 1
);

alter table public.services         enable row level security;
alter table public.service_supplies enable row level security;
alter table public.assets           enable row level security;
alter table public.service_assets   enable row level security;

create policy if not exists "anon_all_services"         on public.services         for all using (true) with check (true);
create policy if not exists "anon_all_service_supplies" on public.service_supplies for all using (true) with check (true);
create policy if not exists "anon_all_assets"           on public.assets           for all using (true) with check (true);
create policy if not exists "anon_all_service_assets"   on public.service_assets   for all using (true) with check (true);

create index if not exists services_clinic_idx    on public.services (clinic_id, active);
create index if not exists services_specialty_idx on public.services (specialty_id);
create index if not exists assets_clinic_idx      on public.assets   (clinic_id, active);

-- ─── 005: Pacotes ─────────────────────────────────────────────────────────────

create table if not exists public.service_packages (
  id          uuid primary key default gen_random_uuid(),
  clinic_id   uuid not null references public.clinics(id),
  name        text not null,
  description text,
  price       numeric(10,2) not null default 0,
  valid_days  integer default 90,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.package_items (
  id         uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.service_packages(id) on delete cascade,
  service_id uuid not null references public.services(id),
  quantity   integer not null default 1
);

alter table public.service_packages enable row level security;
alter table public.package_items    enable row level security;

create policy if not exists "anon_all_service_packages" on public.service_packages for all using (true) with check (true);
create policy if not exists "anon_all_package_items"    on public.package_items    for all using (true) with check (true);

create index if not exists packages_clinic_idx on public.service_packages (clinic_id, active);

-- ─── 006: Comissões, Fiscal e Custos Operacionais ────────────────────────────

create table if not exists public.commission_rules (
  id               uuid primary key default gen_random_uuid(),
  clinic_id        uuid not null references public.clinics(id),
  professional_id  uuid,
  specialty_id     uuid references public.specialties(id),
  service_id       uuid references public.services(id),
  name             text not null,
  commission_type  text not null default 'percent',
  commission_value numeric(10,2) not null default 0,
  base             text not null default 'gross',
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);

create table if not exists public.tax_rules (
  id           uuid primary key default gen_random_uuid(),
  clinic_id    uuid not null references public.clinics(id),
  specialty_id uuid references public.specialties(id),
  name         text not null,
  tax_type     text not null default 'percent',
  tax_value    numeric(10,4) not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists public.operational_costs (
  id         uuid primary key default gen_random_uuid(),
  clinic_id  uuid not null references public.clinics(id),
  name       text not null,
  cost_type  text not null default 'fixed',
  amount     numeric(10,2) not null default 0,
  period     text not null default 'monthly',
  allocation text not null default 'by_revenue',
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.commission_rules  enable row level security;
alter table public.tax_rules         enable row level security;
alter table public.operational_costs enable row level security;

create policy if not exists "anon_all_commission_rules"  on public.commission_rules  for all using (true) with check (true);
create policy if not exists "anon_all_tax_rules"         on public.tax_rules         for all using (true) with check (true);
create policy if not exists "anon_all_operational_costs" on public.operational_costs for all using (true) with check (true);

create index if not exists commission_rules_clinic_idx  on public.commission_rules  (clinic_id, active);
create index if not exists tax_rules_clinic_idx         on public.tax_rules         (clinic_id, active);
create index if not exists operational_costs_clinic_idx on public.operational_costs (clinic_id, active);
