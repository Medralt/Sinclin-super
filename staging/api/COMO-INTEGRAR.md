# SINCLIN — Como integrar o SIOC ao server.js existente

## O que foi criado por este script
- decision.engine.js   (maquina de estados — anamnese)
- session.manager.js   (contexto por paciente)
- device.registry.js   (registro de devices por env var)
- adapters/            (5 esqueletos prontos)
- test-local.ps1       (teste local antes do push)

## O server.js NAO foi alterado.

## PASSO 1 — Adicionar os requires no topo do server.js
```
let siocEngine = null, sessionMgr = null, deviceReg = null;
try { siocEngine = require("./decision.engine");  console.log("[SINCLIN] SIOC engine OK");     } catch (e) { console.warn("[SINCLIN] SIOC engine falhou:", e.message); }
try { sessionMgr = require("./session.manager");  console.log("[SINCLIN] Session manager OK"); } catch (e) { console.warn("[SINCLIN] Session manager falhou:", e.message); }
try { deviceReg  = require("./device.registry");  deviceReg.load();                            } catch (e) { console.warn("[SINCLIN] Device registry falhou:", e.message); }
```

## PASSO 2 — Adicionar endpoints /sioc antes do app.listen

## PASSO 3 — Atualizar /health
  sioc: siocEngine ? "online" : "offline",
  session_manager: sessionMgr ? "online" : "offline",
  devices: deviceReg ? deviceReg.list() : [],
  sessions: sessionMgr ? sessionMgr.stats() : null,

## PASSO 4 — Push
  git add .
  git commit -m "feat: SIOC Phase 2"
  git push origin main

## Para ativar devices no Render
  SIOC_DIAGNOSTICO_ENABLED=true
  SIOC_CAMERA_ENABLED=true
  SIOC_PAGAMENTO_ENABLED=true
  SIOC_PRONTUARIO_ENABLED=true
  SIOC_IOT_ENABLED=true
