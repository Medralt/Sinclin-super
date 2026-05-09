const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

let siocEngine = null, sessionMgr = null, deviceReg = null;
try { siocEngine = require("./decision.engine");  console.log("[SINCLIN] SIOC engine OK");     } catch (e) { console.warn("[SINCLIN] SIOC engine falhou:", e.message); }
try { sessionMgr = require("./session.manager");  console.log("[SINCLIN] Session manager OK"); } catch (e) { console.warn("[SINCLIN] Session manager falhou:", e.message); }
try { deviceReg  = require("./device.registry");  deviceReg.load();                            } catch (e) { console.warn("[SINCLIN] Device registry falhou:", e.message); }

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const SYSTEM_PROMPT = `Você é SINCLIN, uma inteligência de saúde integrativa empática.
Seu papel é acolher, orientar e apoiar pacientes e profissionais de saúde com presença, clareza e cuidado genuíno.

Princípios:
- Escute com atenção antes de responder
- Use linguagem humana, calorosa e acessível — sem jargão clínico desnecessário
- Valide o que a pessoa está sentindo antes de oferecer orientação
- Integre visão física, emocional e contextual nas respostas
- Quando apropriado, sugira próximos passos concretos e gentis
- Nunca substitua consulta médica — seja claro sobre seus limites quando relevante
- Mantenha respostas focadas, úteis e com presença humana`;

let openaiClient = null;
let engineOnline = false;

try {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");
  openaiClient = new OpenAI({ apiKey });
  engineOnline = true;
  console.log("[SINCLIN] OpenAI engine online");
} catch (err) {
  console.warn("[SINCLIN] OpenAI engine offline:", err.message);
}

/* =====================================
   HEALTH
===================================== */

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    status: "online",
    engine: engineOnline ? "gpt-4o-mini" : "offline",
    sioc: siocEngine ? "online" : "offline",
    session_manager: sessionMgr ? "online" : "offline",
    devices: deviceReg ? deviceReg.list() : [],
    sessions: sessionMgr ? sessionMgr.stats() : null,
    timestamp: new Date().toISOString()
  });
});

/* =====================================
   CHAT
   Contrato da UI: envia { raw_text, id }
                   lê   data.text
===================================== */

app.post("/chat", async (req, res) => {
  const body = req.body || {};
  const text = body.raw_text || body.text || body.input || body.message || body.query || "";
  const { history = [] } = body;

  if (!text.trim()) {
    return res.status(400).json({ ok: false, error: "text is required" });
  }

  if (!engineOnline || !openaiClient) {
    return res.status(503).json({
      ok: false,
      text: "Motor de IA temporariamente indisponível.",
      error: "engine_offline",
      timestamp: new Date().toISOString()
    });
  }

  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history
        .filter(m => m.role && m.text)
        .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text })),
      { role: "user", content: text }
    ];

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages
    });

    const responseText = completion.choices[0].message.content;

    return res.json({
      ok: true,
      text: responseText,
      engine: "gpt-4o-mini",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("[SINCLIN_CHAT_ERROR]", err.message);
    return res.status(500).json({
      ok: false,
      text: "Não foi possível processar sua mensagem. Tente novamente.",
      error: "generation_failed",
      timestamp: new Date().toISOString()
    });
  }
});

/* =====================================
   SIOC — anamnese guiada
===================================== */

app.post("/sioc", (req, res) => {
  try {
    if (!siocEngine) return res.status(503).json({ ok: false, error: "sioc_offline" });
    const { session_id, raw_text } = req.body || {};
    if (!session_id) return res.status(400).json({ ok: false, error: "session_id obrigatorio" });
    if (sessionMgr) sessionMgr.getOrCreate(session_id);
    const result = siocEngine.run({ session_id, input: { raw_text: raw_text || "" } });
    if (sessionMgr && result.structured) {
      sessionMgr.update(session_id, { sioc_step: result.next_step, paciente: result.structured.paciente || {}, anamnese: result.structured.anamnese || {} });
      sessionMgr.pushEvent(session_id, { type: "sioc", step: result.next_step });
    }
    return res.json({ ok: true, text: result.text, next_step: result.next_step, structured: result.structured, timestamp: new Date().toISOString() });
  } catch (e) { console.error("[SIOC_ERROR]", e.message); return res.status(500).json({ ok: false, error: "sioc_failed" }); }
});

app.get("/sioc/:session_id", (req, res) => {
  try {
    if (!sessionMgr) return res.status(503).json({ ok: false, error: "session_manager_offline" });
    const session = sessionMgr.get(req.params.session_id);
    if (!session) return res.status(404).json({ ok: false, error: "sessao nao encontrada" });
    return res.json({ ok: true, session, timestamp: new Date().toISOString() });
  } catch (e) { return res.status(500).json({ ok: false, error: "internal_error" }); }
});

app.post("/sioc/device/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { session_id, data } = req.body || {};
    if (!session_id) return res.status(400).json({ ok: false, error: "session_id obrigatorio" });
    if (!deviceReg)  return res.status(503).json({ ok: false, error: "device_registry_offline" });
    if (!deviceReg.isActive(type)) return res.status(404).json({ ok: false, error: "device_not_active", message: "Configure a env var no Render para ativar este device." });
    const device = deviceReg.get(type);
    if (sessionMgr) sessionMgr.getOrCreate(session_id);
    let result = {};
    try { result = await device.adapter.process({ session_id, data, sessionMgr }); }
    catch (ae) { console.error("[DEVICE:" + type + "]", ae.message); return res.status(500).json({ ok: false, error: "adapter_failed" }); }
    if (sessionMgr) sessionMgr.setDeviceData(session_id, type, result);
    return res.json({ ok: true, device: type, result, timestamp: new Date().toISOString() });
  } catch (e) { return res.status(500).json({ ok: false, error: "internal_error" }); }
});


/* =====================================
   SCANNER — runtime introspection
===================================== */

app.get("/scanner", (req, res) => {
  res.json({
    ok: true,
    scanner: "active",
    runtime: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      engine: engineOnline ? "gpt-4o-mini" : "offline",
      sioc: siocEngine ? "online" : "offline",
      sessions: sessionMgr ? sessionMgr.stats() : null,
      devices: deviceReg ? deviceReg.list() : []
    },
    timestamp: new Date().toISOString()
  });
});

/* =====================================
   RUNTIME — cognitive runtime status
===================================== */

app.get("/runtime", (req, res) => {
  res.json({
    ok: true,
    status: "online",
    modules: {
      chat: engineOnline,
      sioc: !!siocEngine,
      session_manager: !!sessionMgr,
      device_registry: !!deviceReg
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/* =====================================
   ORCHESTRATION — orchestration status
===================================== */

app.get("/orchestration", (req, res) => {
  res.json({
    ok: true,
    orchestration: "active",
    agents: ["doctor", "patient", "collaborator", "marketing", "commercial"],
    active_sessions: sessionMgr ? sessionMgr.stats().active_sessions : 0,
    timestamp: new Date().toISOString()
  });
});
/* =====================================
   START
===================================== */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("[SINCLIN] API ON", PORT));

