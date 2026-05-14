# SINCLIN — Roadmap de Evolução
**Versão:** 2.2 | **Atualizado:** 2026-05-14

---

## Filosofia de Evolução

Toda nova capacidade passa pelo ciclo:

```
Scanner de completude → Proposta → Aprovação (Master) → Implementação → Scanner valida
```

Nenhum módulo é implementado fora deste ciclo. A governança protege a coerência do sistema.

---

## Fase 0 — Fundação Operacional (em andamento)

**Objetivo:** Plataforma estável, segura e auto-observável em produção.

### Concluído ✅
- [x] Stack React/Vite/TypeScript + shadcn/ui funcional
- [x] Deploy automático via Render (frontend + backend)
- [x] Supabase Auth (email/senha + confirmação por e-mail)
- [x] AuthGuard em todas as rotas protegidas
- [x] Módulos clínicos core: agenda, prontuário, evolução, prescrições, procedimentos
- [x] Módulos de pacientes: cadastro, histórico, documentos, anamnese SIOC, cuidados, visão 360
- [x] Módulo financeiro completo: caixa, faturamento, contas a pagar, relatórios, convênios
- [x] Marketing core: overview, leads, funil, CRM
- [x] Administrativo completo: usuários, permissões, unidades, equipe, logs, auditoria
- [x] Conhecimento core: biblioteca, protocolos, assistente IA
- [x] Centro de Análise: scanner runtime, achados, governança com PIN master
- [x] Scanner de completude (baseado em stubRoutes.ts — fonte única da verdade)
- [x] Fila de governança: propostas → aprovar/rejeitar/adiar
- [x] Chat IA com 7 personas (GPT-4o-mini)
- [x] TTS (briefing matinal por voz)
- [x] Sessões SIOC e memória longitudinal no Supabase
- [x] HMAC-SHA256 para auth do Master (PIN + secret → token)

### Pendente ⬜
- [ ] Configuração de env vars em produção (Render + Supabase — ação manual)
- [ ] Render rewrite rule para SPA routing (ação manual no dashboard)
- [ ] 17 módulos stub aprovados e implementados (ciclo de governança)
- [ ] Controle de acesso por perfil via RLS no Supabase
- [ ] 2FA por SMS (Twilio)

---

## Fase 1 — Módulo de Serviços, Comissionamento e Fiscal (próxima)

**Objetivo:** Construir o núcleo operacional-financeiro do SINCLIN — o que conecta serviços prestados à margem líquida real.

**Documentação de referência:** `docs/SERVICE_MODEL.md`

### Etapa 1.1 — Fundação (multi-tenant + especialidades)
- [ ] Tabela `clinics` com `clinic_id` como chave de isolamento
- [ ] `tenant_config` — plano contratado, regime fiscal, base de comissão padrão
- [ ] `specialties` — especialidades configuráveis por tenant (estética, podologia, etc.)
- [ ] RLS em todas as tabelas existentes usando `clinic_id`
- [ ] Migrations em `docs/migrations/`

### Etapa 1.2 — Catálogo de Serviços
- [ ] `services` — catálogo com duração, preço base, especialidade
- [ ] `service_supplies` — insumos consumidos por serviço (vínculo com estoque)
- [ ] `assets` — equipamentos com valor, vida útil e horas/mês
- [ ] `service_assets` — ativos utilizados por serviço (custo-hora automático)
- [ ] UI: página `/config/servicos` — CRUD de serviços e insumos

### Etapa 1.3 — Pacotes
- [ ] `service_packages` — agrupamento com preço combinado e validade
- [ ] `package_items` — serviços e quantidades dentro do pacote
- [ ] UI: página `/config/pacotes` — CRUD de pacotes
- [ ] Vínculo com agendamento e financeiro

### Etapa 1.4 — Comissionamento
- [ ] `commission_rules` — por profissional/especialidade/serviço
- [ ] Bases de cálculo: bruto / líquido de impostos / líquido de insumos / líquido total
- [ ] UI: página `/config/comissoes` — regras por profissional
- [ ] Lançamento automático de provisão de comissão ao executar atendimento

### Etapa 1.5 — Fiscal e Custos Operacionais
- [ ] `tax_rules` — ISS e outros por especialidade e alíquota
- [ ] `operational_costs` — custos fixos e variáveis com rateio configurável
- [ ] Circuito financeiro completo: receita → impostos → insumos → ativo → comissão → custo operacional → margem
- [ ] UI: página `/config/fiscal` e `/config/custos`

### Etapa 1.6 — Relatórios de Margem
- [ ] Margem líquida real por serviço / pacote
- [ ] Ranking de rentabilidade por especialidade
- [ ] DRE simplificado mensal
- [ ] Comissões provisionadas por profissional

---

## Fase 2 — Completude de Módulos

**Objetivo:** Eliminar todos os stubs. 17 módulos "Em implementação" → funcionais.

**Ordem sugerida por impacto (severidade):**

### Alta Prioridade (severity: alto)
1. `/config/preferencias` — personalização da plataforma
2. `/config/seguranca` — 2FA, sessões ativas, políticas
3. `/config/ui` — tema, logo, cores da marca
4. `/marketing/campanhas` — captação por canal
5. `/marketing/automacoes` — follow-up e réguas de relacionamento
6. `/marketing/propostas` — orçamentos comerciais
7. `/marketing/conversoes` — taxas de conversão por canal
8. `/marketing/relatorios` — relatórios consolidados

### Média Prioridade (severity: medio)
9. `/config/integracoes` — ERP, labs, operadoras, gateways
10. `/config/backup` — backups automáticos
11. `/marketing/agenda` — agenda comercial + CRM
12. `/conhecimento/treinamentos` — biblioteca de treinamentos
13. `/conhecimento/documentacao` — documentação técnica
14. `/conhecimento/faq` — perguntas frequentes
15. `/pacientes/fotos` — fotos clínicas com comparativo temporal

### Baixa Prioridade (severity: baixo)
16. `/config/api` — chaves, webhooks, documentação
17. `/marketing/integracoes` — Meta Ads, Google Analytics, RD Station

---

## Fase 2 — Inteligência Ampliada

**Objetivo:** SINCLIN como presença cognitiva ativa, não apenas repositório de dados.

- [ ] Relatórios narrados por voz (IA sintetiza e narra via TTS)
- [ ] Briefing personalizado por perfil (o que a IA sabe sobre você hoje)
- [ ] Sugestões proativas da IA baseadas em padrões (ex: "3 pacientes sem retorno há 30 dias")
- [ ] Integração Voz → Ação (comando de voz executa navegação ou busca)
- [ ] Memória longitudinal ativa (presença_memory alimenta o contexto do chat)
- [ ] Dashboard adaptativo (layout muda com base em padrão de uso)

---

## Fase 3 — Portal do Paciente

**Objetivo:** Extensão do SINCLIN para o paciente, com sua própria presença.

- [ ] Autenticação separada para pacientes (não usa Supabase Auth clínico)
- [ ] App/PWA para paciente: ver consultas, receber cuidados, histórico
- [ ] Comunicação assíncrona clínico ↔ paciente
- [ ] Confirmação de consulta com reconhecimento de identidade
- [ ] Pesquisa de satisfação pós-procedimento automatizada
- [ ] Teleatendimento (integração com WebRTC ou Zoom/Meet)

---

## Fase 4 — Produto SaaS e Escala

**Objetivo:** SINCLIN como plataforma SaaS multi-tenant comercializável.

**Documentação de referência:** `docs/PRODUCT.md`

- [ ] Planos: Essencial / Clínico / Pro / Enterprise com enforcement no código
- [ ] Onboarding guiado por tenant (wizard de configuração inicial)
- [ ] Billing e controle de assinaturas (Stripe ou similar)
- [ ] Multi-unidade (uma conta → várias clínicas, isoladas por `clinic_id`)
- [ ] Portal administrativo para gestão de tenants
- [ ] Marketplace de protocolos clínicos entre profissionais
- [ ] Integrações nativas: laboratórios, TISS/TUSS, operadoras de saúde
- [ ] API pública para parceiros (webhooks, SDK)
- [ ] Observabilidade de saúde do sistema em tempo real
- [ ] Certificação CFM / LGPD documentada

---

## Princípio de Decisão

Ao escolher o que implementar a seguir, pergunte:

> "Isso serve ao cuidado do paciente, ao crescimento da clínica ou à autonomia do sistema?"

Se a resposta for não, reconsidere.
