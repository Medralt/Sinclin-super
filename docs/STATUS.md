# SINCLIN — Status de Implementação
**Versão:** 2.2 | **Atualizado:** 2026-05-14

---

## Legenda

| Símbolo | Estado |
|---|---|
| ✅ | Implementado e funcional |
| 🔶 | Parcialmente implementado |
| 🔴 | Stub — "Em implementação" (MarketingShell) |
| ⬜ | Pendente / não iniciado |

---

## Módulo: Autenticação e Acesso

| Funcionalidade | Estado | Notas |
|---|---|---|
| Login email/senha (Supabase Auth) | ✅ | signIn + signUp via localDb |
| Registro com confirmação por e-mail | ✅ | Supabase email confirmation flow |
| AuthGuard (proteção de rotas) | ✅ | Redireciona /welcome sem sessão |
| Seleção de perfil (professional/collaborator/prospect) | ✅ | Persiste em localStorage |
| Confirmação por SMS / 2FA | ⬜ | Aguarda provider Twilio |
| Controle de perfis/roles no Supabase | ⬜ | metadata.role salvo no signUp, RLS pendente |

---

## Módulo: Clínico

| Rota | Componente | Estado | Notas |
|---|---|---|---|
| `/clinico/agenda` | ClinicalAgenda | ✅ | Agenda funcional |
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
| `/pacientes` | Patients | ✅ | Lista de pacientes |
| `/pacientes/:id` | PatientView360 | ✅ | Visão 360 do paciente |
| `/pacientes/cadastro` | PatientCadastro | ✅ | |
| `/pacientes/historico` | PatientHistorico | ✅ | |
| `/pacientes/documentos` | PatientDocumentos | ✅ | |
| `/pacientes/anamnese` | PatientAnamnese | ✅ | SIOC integrado |
| `/pacientes/cuidados` | PatientCare | ✅ | Pós-procedimento |
| `/pacientes/fotos` | MarketingShell | 🔴 | Fotos clínicas com comparativo temporal |

---

## Módulo: Financeiro

| Rota | Componente | Estado | Notas |
|---|---|---|---|
| `/financeiro` | Financial | ✅ | Visão geral |
| `/financeiro/caixa` | FinancialCaixa | ✅ | |
| `/financeiro/faturamento` | FinancialFaturamento | ✅ | |
| `/financeiro/pagar` | FinancialPagar | ✅ | |
| `/financeiro/relatorios` | FinancialRelatorios | ✅ | |
| `/financeiro/convenios` | FinancialConvenios | ✅ | |

---

## Módulo: Marketing

| Rota | Componente | Estado | Notas |
|---|---|---|---|
| `/marketing` | MarketingOverview | ✅ | Visão geral |
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

## Módulo: Administrativo

| Rota | Componente | Estado | Notas |
|---|---|---|---|
| `/admin/usuarios` | AdminUsuarios | ✅ | |
| `/admin/permissoes` | AdminPermissoes | ✅ | |
| `/admin/unidades` | AdminUnidades | ✅ | |
| `/admin/equipe` | AdminEquipe | ✅ | |
| `/admin/logs` | AdminLogs | ✅ | |
| `/admin/auditoria` | AdminAuditoria | ✅ | |

---

## Módulo: Conhecimento

| Rota | Componente | Estado | Notas |
|---|---|---|---|
| `/conhecimento` | KnowledgeLibrary | ✅ | |
| `/conhecimento/biblioteca` | KnowledgeLibrary | ✅ | |
| `/conhecimento/protocolos` | ClinicalProtocols | ✅ | |
| `/conhecimento/ia` | KnowledgeAssistant | ✅ | |
| `/conhecimento/treinamentos` | MarketingShell | 🔴 | severity: medio |
| `/conhecimento/documentacao` | MarketingShell | 🔴 | severity: medio |
| `/conhecimento/faq` | MarketingShell | 🔴 | severity: medio |

---

## Módulo: Configurações

| Rota | Componente | Estado | Notas |
|---|---|---|---|
| `/config/preferencias` | MarketingShell | 🔴 | severity: alto |
| `/config/integracoes` | MarketingShell | 🔴 | severity: medio |
| `/config/api` | MarketingShell | 🔴 | severity: baixo |
| `/config/seguranca` | MarketingShell | 🔴 | severity: alto |
| `/config/backup` | MarketingShell | 🔴 | severity: medio |
| `/config/ui` | MarketingShell | 🔴 | severity: alto |

---

## Módulo: Centro de Análise

| Funcionalidade | Estado | Notas |
|---|---|---|
| Aba Scanner (runtime) | ✅ | Detecta erros de runtime, componentes com stub |
| Aba Achados | ✅ | Lista findings da tabela `scanner_findings` |
| Aba Governança | ✅ | PIN master → fila de propostas (aprovar/rejeitar/adiar) |
| Scanner de completude | ✅ | Gera 17 propostas a partir de `stubRoutes.ts` |
| Submissão de propostas para Supabase | ✅ | POST /master/proposals com auth Bearer |
| Aprovação/rejeição/adiamento | ✅ | PATCH /master/proposals/:id |

---

## Módulo: Presença / IA

| Funcionalidade | Estado | Notas |
|---|---|---|
| Chat IA universal (SinclinChat) | ✅ | 7 personas via OpenAI GPT-4o-mini |
| TTS (Web Speech API) | ✅ | Briefing matinal por voz no Dashboard |
| VoicePresence (orb animado) | ✅ | Componente de presença de voz |
| Comandos de voz (useVoice) | ✅ | |
| Sessões SIOC (anamnese guiada) | ✅ | Tabela `sioc_sessions` |
| Memória longitudinal | ✅ | Tabela `presence_memory` |

---

## Backend (API)

| Endpoint | Estado | Notas |
|---|---|---|
| `POST /chat` | ✅ | Chat com persona selecionada |
| `POST /master/auth` | ✅ | Valida PIN, retorna token HMAC |
| `GET /master/proposals` | ✅ | Lista propostas (requer token) |
| `POST /master/proposals` | ✅ | Submete propostas (requer token) |
| `PATCH /master/proposals/:id` | ✅ | Aprova/rejeita/adia (requer token) |
| `GET /master/stats` | ✅ | Estatísticas (requer token) |
| Supabase client inicializado | ✅ | Requer SUPABASE_URL + SUPABASE_KEY em prod |

---

## Projetos Supabase — Decisão Definitiva (2026-05-14)

| Projeto | Status | Decisão |
|---|---|---|
| `gbulvsjcufyyscgzlsrt` — Sinclin | ACTIVE_HEALTHY | ✅ **ÚNICO projeto oficial** — schema completo, na conta principal |
| `ufdeaqfblrrsjuvwiqig` — sinclin_ia | INACTIVE | 🗑️ Pode ser deletado — experimento pausado |
| `ucduacwytvghkhnselux` — (legado) | Ativo (outra conta) | 🚫 Não usar — era o projeto antigo, pertence a conta diferente |

## Pendências de Configuração (ação manual necessária)

| Item | Responsável | Estado |
|---|---|---|
| Render frontend: `VITE_SUPABASE_URL=https://gbulvsjcufyyscgzlsrt.supabase.co` | Usuário/Render dashboard | ⬜ **CRÍTICO** |
| Render frontend: `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key do `gbulvsjcufyyscgzlsrt`) | Usuário/Render dashboard | ⬜ **CRÍTICO** |
| Render backend: `SUPABASE_URL=https://gbulvsjcufyyscgzlsrt.supabase.co` | Usuário/Render dashboard | ⬜ |
| Render backend: `SUPABASE_KEY` (service role key do `gbulvsjcufyyscgzlsrt`) | Usuário/Render dashboard | ⬜ |
| Render: vars `MASTER_PIN`, `MASTER_SECRET` no API service | Usuário/Render dashboard | ⬜ |
| Supabase `gbulvsjcufyyscgzlsrt`: Site URL = `https://app.sinclin.net` | Usuário/Supabase dashboard | ⬜ |
| Supabase `gbulvsjcufyyscgzlsrt`: Redirect URL = `https://app.sinclin.net/**` | Usuário/Supabase dashboard | ⬜ |
| Provider SMS / Twilio para 2FA | Usuário | ⬜ |

---

---

## Módulo: Serviços, Comissionamento e Fiscal (Fase 1 — planejado)

**Referência completa:** `docs/SERVICE_MODEL.md`

| Funcionalidade | Estado | Notas |
|---|---|---|
| Multi-tenant (`clinic_id` + RLS) | ⬜ | Fundação de toda a Fase 1 |
| `tenant_config` (plano, fiscal, comissão) | ⬜ | |
| Especialidades configuráveis por tenant | ⬜ | Substitui categorias fixas |
| Catálogo de serviços | ⬜ | `/config/servicos` |
| Insumos por serviço (vínculo estoque) | ⬜ | |
| Ativos/equipamentos + depreciação | ⬜ | Custo-hora automático |
| Pacotes de serviços | ⬜ | `/config/pacotes` |
| Regras de comissão | ⬜ | `/config/comissoes` |
| Taxas e impostos por especialidade | ⬜ | `/config/fiscal` |
| Custos operacionais com rateio | ⬜ | `/config/custos` |
| Circuito financeiro completo | ⬜ | Lançamentos automáticos |
| Relatórios de margem líquida real | ⬜ | DRE simplificado |

---

## Produto SaaS (Fase 4 — planejado)

**Referência completa:** `docs/PRODUCT.md`

| Funcionalidade | Estado | Notas |
|---|---|---|
| Planos: Essencial / Clínico / Pro / Enterprise | ⬜ | R$ 249 / 499 / 899 / 1.799 |
| Enforcement de plano no código | ⬜ | Feature flags por `tenant_config.plan` |
| Onboarding wizard por tenant | ⬜ | |
| Billing / assinaturas | ⬜ | Stripe ou similar |
| Portal de gestão de tenants | ⬜ | |

---

## Contagem de Stubs (gerado de stubRoutes.ts)

- **Total de rotas stub:** 17
- **Por severidade:** crítico: 0 · alto: 9 · médio: 7 · baixo: 1  
- **Por módulo:** marketing: 7 · config: 6 · knowledge: 3 · clinical: 1
