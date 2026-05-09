# SINCLIN — Status do Projeto (atualizado)
## Funcionando
- API: https://sinclin-api.onrender.com
- Engine: GPT-4o-mini
- UI: sinclin-fente.lovable.app
- SIOC: decision.engine + session.manager + device.registry integrados ao server.js
- Endpoints: /health /chat /sioc /sioc/:id /sioc/device/:type
- Deploy: automatico no push para main
## Devices disponiveis (ativar via env var no Render)
- SIOC_DIAGNOSTICO_ENABLED, SIOC_CAMERA_ENABLED, SIOC_PAGAMENTO_ENABLED, SIOC_PRONTUARIO_ENABLED, SIOC_IOT_ENABLED
## Regras de ouro
- server.js: nunca substituir, apenas adicionar
- try/catch em tudo no SIOC
- testar localmente antes de push
- commit separado por mudanca funcional
- rollback imediato se quebrar
