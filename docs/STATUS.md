# SINCLIN — Status de Implementação
**Versão:** 2.4 | **Atualizado:** 2026-05-15

---

## Legenda

| Símbolo | Estado |
|---|---|
| ✅ | Implementado e funcional |
| 🔶 | Parcialmente implementado |
| 🔴 | Stub — "Em implementação" (MarketingShell) |
| ⚠️ | Ativo mas com ressalva |
| ⬜ | Pendente / não iniciado |

---

## Módulo: Autenticação e Acesso

| Funcionalidade | Estado | Notas |
|---|---|---|
| Login email/senha (Supabase Auth) | ✅ | signIn + signUp via localDb |
| Registro com confirmação por e-mail | ✅ | Supabase email confirmation flow |
| AuthGuard (proteção de rotas) | ⚠️ | **Temporariamente desativado** — pass-through direto ao Dashboard |
| Seleção de perfil (professional/collaborator/prospect) | ✅ | Persiste em localStorage |
| Confirmação por SMS / 2FA | ⬜ | Aguarda provider Twilio |

---

## Módulo: Layout e Navegação

| Funcionalidade | Estado | Notas |
|---|---|---|
| GlobalHeader (tarja superior) | ✅ | Logo + pesquisa por módulo + índices econômicos |
| TopNav (menu principal) | ✅ | Filtrado por perfil professional/collaborator |
| Módulo Fiscal no menu | ✅ | Substituiu Administrativo |
| Marketing visível em todos os perfis | ✅ | |
| Margem/DRE no Financeiro | ✅ | |
| Serviços/Pacotes/Comissões/Fiscal/Custos/Formulários no Configurações | ✅ | |
| Importar do AVEC em Pacientes | ✅ | |
| Equipe migrada para Clínico | ✅ | |
| Usuários/Permissões/Unidades migrados para Configurações | ✅ | |
| AppSidebar | ⚠️ | Arquivo existe mas **não está em uso** (AppLayout usa TopNav) |

---

## Módulo: Clínico

| Rota | Componente | Estado | Notas |
|---|---|---|---|
| `/clinico/agenda` | ClinicalAgenda | ✅ | |
| `/clinico/atendimentos` | ClinicalAgenda | ✅ | Alias de agenda |
| `/clinico/procedimentos` | ClinicalProcedimentos | ✅ | |
| `/clinico/evolucao` | ClinicalEvolucao | ✅ | |
| `/clinico/prontuario` | ClinicalProntuario | ✅ | |
| `/clinico/prescricoes` | ClinicalPrescricoes | ✅ | |
| `/clinico/protocolos` | ClinicalProtocols | ✅ | |

---

## Módulo: Pacientes

| Rota | Componente | Estado | Notas |
|---|---|---|---|
| `/pacientes` | Patients | ✅ | |
| `/pacientes/:id` | PatientView360 | ✅ | Visão 360 |
| `/pacientes/cadastro` | PatientCadastro | ✅ | Formulário completo AVEC-compatível, campos dinâmicos de form_configs, masks, ViaCEP |
| `/pacientes/importar` | PatientImport | ✅ | Importação CSV do AVEC em lote (50/batch), mapeamento automático de colunas, preview |
| `/pacientes/historico` | PatientHistorico | ✅ | |
| `/pacientes/documentos` | PatientDocumentos | ✅ | |
| `/pacientes/anamnese` | PatientAnamnese | ✅ | SIOC integrado |
| `/pacientes/cuidados` | PatientCare | ✅ | Pós-procedimento com TTS proativo |
| `/pacientes/fotos` | MarketingShell | 🔴 | Fotos clínicas — severity: medio |

---

## Módulo: Financeiro

| Rota | Componente | Estado | Notas |
|---|---|---|---|
| `/financeiro` | Financial | ✅ | Contas a Receber |
| `/financeiro/caixa` | FinancialCaixa | ✅ | |
| `/financeiro/faturamento` | FinancialFaturamento | ✅ | |
| `/financeiro/pagar` | FinancialPagar | ✅ | |
| `/financeiro/margem` | FinanceiroMargem | ✅ | DRE simplificado por serviço |
| `/financeiro/relatorios` | FinancialRelatorios | ✅ | |
| `/financeiro/convenios` | FinancialConvenios | ✅ | |

---

## Módulo: Fiscal (novo — mai/2026)

| Rota | Componente | Estado | Notas |
|---|---|---|---|
| `/fiscal` | FiscalDashboard | ✅ | Aba Vencimentos: agrega a pagar + receber + fiscal + ANVISA + licenças |
| `/fiscal/nfse` | FiscalDashboard | 🔴 | NFS-e — severity: alto |
| `/fiscal/impostos` | FiscalDashboard | 🔴 | Apuração ISS/PIS/COFINS/IRPJ — severity: alto |
| `/fiscal/anvisa` | FiscalDashboard | 🔴 | Registros ANVISA — severity: alto |
| `/fiscal/vigilancia` | FiscalDashboard | 🔴 | Vigilância Sanitária — severity: medio |
| `/fiscal/auditoria` | FiscalDashboard | 🔴 | Auditoria e logs — severity: medio |

---

## Módulo: Marketing

| Rota | Componente | Estado | Notas |
|---|---|---|---|
| `/marketing` | MarketingOverview | ✅ | |
| `/marketing/leads` | MarketingLeads | ✅ | |
| `/marketing/funil` | MarketingFunil | ✅ | |
| `/marketing/crm` | MarketingCrm | ✅ | |
| `/marketing/campanhas` | MarketingShell | 🔴 | severity: alto |
| `/marketing/automacoes` | MarketingShell | 🔴 | severity: alto |
| `/marketing/agenda` | MarketingShell | 🔴 | Agenda Comercial — severity: medio |
| `/marketing/propostas` | MarketingShell | 🔴 | Propostas/Orçamentos — severity: alto |
| `/marketing/conversoes` | MarketingShell | 🔴 | severity: alto |
| `/marketing/relatorios` | MarketingShell | 🔴 | severity: alto |
| `/marketing/integracoes` | MarketingShell | 🔴 | severity: baixo |

---

## Módulo: Configurações

| Rota | Componente | Estado | Notas |
|---|---|---|---|
| `/config/formularios` | ConfigFormularios | ✅ | Gerencia campos customizados por formulário e tenant (add/edit/remove/ocultar) |
| `/config/servicos` | ConfigServicos | ✅ | Catálogo com insumos + depreciação de ativos |
| `/config/pacotes` | ConfigPacotes | ✅ | Pacotes de serviços |
| `/config/comissoes` | ConfigComissoes | ✅ | Regras (gross/net_tax/net_supplies/net_all) |
| `/config/fiscal` | ConfigFiscal | ✅ | Regras de impostos |
| `/config/custos` | ConfigCustos | ✅ | Custos operacionais com rateio |
| `/config/preferencias` | MarketingShell | 🔴 | severity: alto |
| `/config/integracoes` | MarketingShell | 🔴 | severity: medio |
| `/config/api` | MarketingShell | 🔴 | severity: baixo |
| `/config/seguranca` | MarketingShell | 🔴 | severity: alto |
| `/config/backup` | MarketingShell | 🔴 | severity: medio |
| `/config/ui` | MarketingShell | 🔴 | severity: alto |

---

## Módulo: Conhecimento

| Rota | Componente | Estado | Notas |
|---|---|---|---|
| `/conhecimento/biblioteca` | KnowledgeLibrary | ✅ | |
| `/conhecimento/protocolos` | ClinicalProtocols | ✅ | |
| `/conhecimento/ia` | KnowledgeAssistant | ✅ | |
| `/conhecimento/treinamentos` | MarketingShell | 🔴 | severity: medio |
| `/conhecimento/documentacao` | MarketingShell | 🔴 | severity: medio |
| `/conhecimento/faq` | MarketingShell | 🔴 | severity: medio |

---

## Módulo: Centro de Análise

| Funcionalidade | Estado | Notas |
|---|---|---|
| Scanner de runtime | ✅ | |
| Achados | ✅ | Tabela `scanner_findings` |
| Governança / propostas | ✅ | PIN master → fila de aprovação |
| Scanner de completude | ✅ | Gera propostas de stubRoutes.ts |

---

## Módulo: Presença / IA

| Funcionalidade | Estado | Notas |
|---|---|---|
| Chat IA (SinclinChat) | ✅ | 8 personas via **Anthropic Claude Haiku 4.5** |
| Presence Engine | ✅ | Memória longitudinal por session_key via Supabase `presence_memory` |
| Detecção de contexto emocional | ✅ | Heurística leve em presence.engine.js |
| TTS pt-BR (Web Speech API) | ✅ | |
| VoicePresence (orb animado) | ✅ | |
| Comandos de voz | ✅ | 16+ rotas de navegação |
| SIOC (anamnese guiada) | ✅ | State machine com persistência |
| Welcome ritual (/welcome) | ✅ | |
| ProspectExperience (/prospect) | ✅ | |
| PatientCare (/pacientes/cuidados) | ✅ | TTS proativo |

---

## Backend (API) — staging/api/server.js

| Endpoint | Estado | Notas |
|---|---|---|
| `POST /chat` | ✅ | Claude Haiku, personas, Presence Engine |
| `POST /scanner/clinical` | ✅ | Claude Vision para análise clínica |
| `POST /sioc/device/facial_scanner` | ✅ | Scanner de beleza → Claude Vision → facial_analysis |
| `POST /sioc` | ✅ | Anamnese guiada |
| `GET /sioc/:session_id` | ✅ | Leitura de sessão |
| `GET /health`, `/scanner`, `/runtime`, `/orchestration` | ✅ | |
| `POST /master/auth` | ✅ | PIN → token HMAC |
| `GET/POST/PATCH /master/proposals` | ✅ | Governança de propostas |
| `GET /master/stats` | ✅ | Estatísticas |

---

## Dispositivos / Instrumentos Externos

| Dispositivo | Adapter | Estado | Notas |
|---|---|---|---|
| facial_scanner | `facial_scanner.adapter.js` | ✅ | HTTP Request Shortcuts (Android) → Claude Vision → `facial_analysis` |
| diagnostico | `diagnostico.adapter.js` | 🔶 | Adapter existe, sem env flag ativa |
| camera | `camera.adapter.js` | 🔶 | Adapter existe, sem env flag ativa |
| pagamento | `pagamento.adapter.js` | 🔶 | Adapter existe, sem env flag ativa |
| prontuario | `prontuario.adapter.js` | 🔶 | Adapter existe, sem env flag ativa |
| iot | `iot.adapter.js` | 🔶 | Adapter existe, sem env flag ativa |

---

## Migrations Supabase

| Arquivo | Estado |
|---|---|
| `docs/migrations/ALL_FASE1.sql` | ✅ Executado |
| `docs/migrations/patients_fields.sql` | ✅ Executado (2026-05-15) — 28 cols + 4 índices em `patients` |
| `docs/migrations/form_configs.sql` | ✅ Executado (2026-05-15) — tabela + RLS + seed (acquisition_source, profession) |
| `docs/migrations/presence_memory_schema.sql` | ✅ Executado (2026-05-15) |
| `docs/migrations/facial_analysis.sql` | ✅ Executado (2026-05-15) |

---

## Env Vars Pendentes no Render

| Serviço | Chave | Estado |
|---|---|---|
| sinclin-runtime | `ANTHROPIC_API_KEY` | ⬜ **CRÍTICO** |
| sinclin-runtime | `SUPABASE_URL` | ⬜ **CRÍTICO** |
| sinclin-runtime | `SUPABASE_SERVICE_ROLE_KEY` | ⬜ **CRÍTICO** |
| sinclin-runtime | `SIOC_FACIAL_SCANNER_ENABLED=true` | ⬜ |
| sinclin-runtime | `MASTER_PIN` | ⬜ |
| sinclin-runtime | `MASTER_SECRET` | ⬜ |
| sinclin-fente (frontend) | `VITE_SUPABASE_URL` | ⬜ |
| sinclin-fente (frontend) | `VITE_SUPABASE_PUBLISHABLE_KEY` | ⬜ |

---

## Módulo: Serviços, Comissionamento e Fiscal (Fase 1)

| Funcionalidade | Estado | Notas |
|---|---|---|
| Multi-tenant (clinic_id + RLS) | ✅ | ALL_FASE1.sql executado |
| Catálogo de serviços | ✅ | ConfigServicos — insumos + ativos |
| Pacotes de serviços | ✅ | ConfigPacotes |
| Regras de comissão | ✅ | ConfigComissoes (4 bases) |
| Regras de impostos | ✅ | ConfigFiscal |
| Custos operacionais | ✅ | ConfigCustos |
| DRE simplificado | ✅ | FinanceiroMargem |
| Circuito financeiro completo (lançamentos automáticos) | ⬜ | Fase 2 |

---

## Produto SaaS (Fase 4 — planejado)

| Plano | Preço | Estado |
|---|---|---|
| Essencial | R$ 249/mês | ⬜ |
| Clínico | R$ 499/mês | ⬜ |
| Pro | R$ 899/mês | ⬜ |
| Enterprise | R$ 1.799/mês | ⬜ |
