# SINCLIN — Status do Projeto (09/05/2026)

## O que está funcionando AGORA
- API online: https://sinclin-api.onrender.com (usar esta URL temporariamente)
- API domínio: https://api.sinclin.net (DNS propagando, usar onrender por enquanto)
- Engine: GPT-4o-mini (OPENAI_API_KEY configurada no Render)
- UI: Lovable (sinclin-fente.lovable.app) conectada e respondendo com IA real
- Repositório: github.com/Medralt/Sinclin-super
- Servidor: staging/api/server.js (Express + OpenAI, limpo, sem runtime)
- Deploy: automático no push para branch main

## Próxima tarefa — Fase 2: SIOC
- ANTES de qualquer mudança: fazer backup do staging/api/server.js
- Integrar SIOC de C:\sinclin\core\ de forma incremental
- try/catch em TUDO
- Testar localmente antes de qualquer push
- Nunca substituir server.js sem teste local confirmado

## Regras de ouro
- Testar localmente antes de push
- Commit separado por mudança funcional
- Rollback imediato se quebrar
- O server.js atual é o estado estável — preservar sempre
