# SINCLIN — Modelo de Serviços, Comissionamento e Fiscal
**Versão:** 1.0 | **Atualizado:** 2026-05-14

---

## Visão Geral

O módulo de serviços é o núcleo operacional-financeiro do SINCLIN. Ele conecta o que a clínica oferece (serviços e pacotes) com o que ela gasta (insumos, ativos, custos operacionais, impostos) e o que ela distribui (comissões aos profissionais), gerando a margem líquida real de cada atendimento.

---

## Circuito Financeiro Completo

```
Receita bruta do serviço / pacote
  - Impostos e taxas (ISS, etc. — alíquota configurável por especialidade)
  - Insumos/produtos consumidos (baixa automática no estoque)
  - Depreciação de ativos/equipamentos utilizados (custo-hora)
  - Comissão do profissional (calculada sobre base configurável)
  - Rateio de custos operacionais fixos e variáveis
  ══════════════════════════════════════════
  = Margem líquida real do atendimento
```

Esse circuito é executado automaticamente ao registrar um atendimento/serviço. Todos os lançamentos são rastreáveis no módulo financeiro.

---

## Especialidades (Configurável por Tenant)

Cada clínica configura suas próprias especialidades. Não há categoria fixa.

**Exemplos de uso:**
- Clínica estética
- Odontologia
- Massoterapeuta
- Podologia
- Fisioterapia
- Nutrição
- Qualquer combinação

As especialidades definem: nomenclatura dos serviços, regras fiscais aplicáveis, e tipos de insumos/ativos típicos.

---

## Schema de Dados

### `specialties` — Especialidades configuráveis por tenant
```sql
create table specialties (
  id           uuid primary key default gen_random_uuid(),
  clinic_id    uuid not null references clinics(id),
  name         text not null,               -- "Estética", "Podologia", etc.
  description  text,
  active       boolean not null default true,
  created_at   timestamptz default now()
);
```

### `services` — Catálogo de serviços
```sql
create table services (
  id              uuid primary key default gen_random_uuid(),
  clinic_id       uuid not null references clinics(id),
  specialty_id    uuid references specialties(id),
  name            text not null,
  description     text,
  duration_min    integer,                  -- duração em minutos
  base_price      numeric(10,2) not null,
  active          boolean not null default true,
  created_at      timestamptz default now()
);
```

### `service_supplies` — Insumos consumidos por serviço
```sql
create table service_supplies (
  id              uuid primary key default gen_random_uuid(),
  service_id      uuid not null references services(id),
  inventory_item_id uuid not null,          -- referência ao estoque
  quantity        numeric(10,4) not null,   -- quantidade consumida
  unit            text not null             -- ml, g, un, etc.
);
```

### `assets` — Ativos e equipamentos
```sql
create table assets (
  id                  uuid primary key default gen_random_uuid(),
  clinic_id           uuid not null references clinics(id),
  name                text not null,
  acquisition_value   numeric(10,2) not null,
  useful_life_months  integer not null,     -- vida útil estimada
  monthly_hours       integer not null,     -- horas de uso esperadas/mês
  -- custo/hora = acquisition_value / (useful_life_months * monthly_hours)
  active              boolean not null default true,
  acquired_at         date not null
);
```

### `service_assets` — Ativos utilizados por serviço
```sql
create table service_assets (
  id           uuid primary key default gen_random_uuid(),
  service_id   uuid not null references services(id),
  asset_id     uuid not null references assets(id),
  hours_used   numeric(5,2) not null default 1  -- horas de uso do ativo por execução
);
```

### `service_packages` — Pacotes de serviços
```sql
create table service_packages (
  id           uuid primary key default gen_random_uuid(),
  clinic_id    uuid not null references clinics(id),
  name         text not null,
  description  text,
  price        numeric(10,2) not null,     -- preço do pacote (pode ser < soma dos serviços)
  valid_days   integer,                    -- validade em dias após contratação
  active       boolean not null default true,
  created_at   timestamptz default now()
);
```

### `package_items` — Serviços dentro de um pacote
```sql
create table package_items (
  id           uuid primary key default gen_random_uuid(),
  package_id   uuid not null references service_packages(id),
  service_id   uuid not null references services(id),
  quantity     integer not null default 1
);
```

### `commission_rules` — Regras de comissionamento
```sql
create table commission_rules (
  id                   uuid primary key default gen_random_uuid(),
  clinic_id            uuid not null references clinics(id),
  -- escopo: por profissional, por especialidade, ou global
  professional_id      uuid,               -- null = aplica a todos
  specialty_id         uuid,               -- null = aplica a todas
  service_id           uuid,               -- null = aplica a todos
  -- tipo de comissão
  commission_type      text not null,      -- 'percent' | 'fixed'
  commission_value     numeric(10,2) not null,
  -- base de cálculo
  base                 text not null default 'gross',
  -- 'gross'         = sobre valor bruto do serviço
  -- 'net_tax'       = sobre bruto menos impostos
  -- 'net_supplies'  = sobre bruto menos insumos
  -- 'net_all'       = sobre bruto menos impostos e insumos
  active               boolean not null default true,
  created_at           timestamptz default now()
);
```

### `tax_rules` — Regras fiscais por especialidade
```sql
create table tax_rules (
  id             uuid primary key default gen_random_uuid(),
  clinic_id      uuid not null references clinics(id),
  specialty_id   uuid references specialties(id),  -- null = todas
  name           text not null,                    -- "ISS", "IRRF", etc.
  tax_type       text not null,                    -- 'percent' | 'fixed'
  tax_value      numeric(10,4) not null,
  active         boolean not null default true
);
```

### `operational_costs` — Custos operacionais (fixos e variáveis)
```sql
create table operational_costs (
  id             uuid primary key default gen_random_uuid(),
  clinic_id      uuid not null references clinics(id),
  name           text not null,                    -- "Aluguel", "Energia", etc.
  cost_type      text not null,                    -- 'fixed' | 'variable'
  amount         numeric(10,2) not null,
  period         text not null default 'monthly',  -- 'monthly' | 'daily'
  -- rateio
  allocation     text not null default 'by_revenue',
  -- 'by_revenue'     = % da receita
  -- 'by_hour'        = horas de ocupação
  -- 'by_attendance'  = número de atendimentos
  active         boolean not null default true
);
```

### `tenant_config` — Configurações por tenant
```sql
create table tenant_config (
  clinic_id       uuid primary key references clinics(id),
  -- fiscal
  tax_regime      text,              -- 'simples' | 'lucro_presumido' | 'lucro_real'
  cnpj            text,
  municipal_code  text,              -- código municipal para NFS-e
  -- comissão
  commission_base text default 'gross',  -- base padrão para novos profissionais
  -- rateio de custos
  cost_allocation text default 'by_revenue',
  -- produto contratado
  plan            text not null default 'essencial',
  -- 'essencial' | 'clinico' | 'pro' | 'enterprise'
  plan_started_at date,
  updated_at      timestamptz default now()
);
```

---

## Cálculo de Custo-Hora do Profissional

Para profissionais que executam procedimentos avulsos, o custo-hora é composto por:

```
Custo-hora =
  (Depreciação dos ativos utilizados / horas de uso)
  + (Custo dos insumos consumidos / duração do procedimento)
  + (Rateio de custo operacional / horas de atendimento no período)
```

Esse valor é calculado por procedimento na execução do atendimento e pode ser usado para:
- Definir o valor mínimo viável do serviço
- Calcular a margem antes de aplicar a comissão
- Gerar relatórios de rentabilidade por profissional

---

## Lançamentos Automáticos por Atendimento

Ao registrar um atendimento como executado, o sistema dispara:

1. **Receita bruta** → lançamento positivo em `financial_records`
2. **Impostos** → lançamento negativo (calculado pelas `tax_rules` da especialidade)
3. **Baixa de insumos** → decremento em `inventory` para cada item em `service_supplies`
4. **Depreciação de ativo** → lançamento negativo (custo-hora × horas usadas)
5. **Comissão** → lançamento de provisão para o profissional (calculado por `commission_rules`)
6. **Rateio de custos operacionais** → lançamento negativo (calculado por `operational_costs`)

Todos os lançamentos carregam `service_id`, `professional_id`, `patient_id` e `clinic_id` para rastreabilidade completa.

---

## Relatórios Previstos

| Relatório | Agrupamento |
|---|---|
| Margem líquida real | Por serviço / pacote |
| Ranking de rentabilidade | Por especialidade |
| Comissões provisionadas | Por profissional / período |
| Consumo de insumos | Por serviço / período |
| Ocupação de ativos | Por equipamento / período |
| DRE simplificado | Mensal por clínica |
