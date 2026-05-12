const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

/*
 * SINCLIN API — staging/api/server.js
 * Deploy: Render (sinclin-api.onrender.com / api.sinclin.net)
 *
 * ENDPOINTS:
 *   GET  /health                          → status de todos os módulos
 *   GET  /scanner                         → introspection do runtime (uptime, memória, módulos)
 *   GET  /runtime                         → status dos módulos (chat, sioc, session, devices)
 *   GET  /orchestration                   → status da orquestração e agentes disponíveis
 *   POST /chat                            → chat IA (GPT-4o-mini)
 *   POST /sioc                            → anamnese guiada (state machine)
 *   GET  /sioc/:session_id                → leitura de sessão SIOC
 *   POST /sioc/device/:type               → ingestão de dados de dispositivo médico
 *
 * CONTRATO DO CHAT (POST /chat):
 *   Body aceita:  { raw_text }  — clientes locais / SIOC
 *              ou { text, persona, session }  — Lovable UI
 *   Persona:      clinical (default) | scanner | admin | financial | marketing | orchestrator
 *   Resposta:     { ok, text, engine, persona, timestamp }
 *   Histórico:    { history: [{ role, text }] }  — opcional
 */

let siocEngine = null, sessionMgr = null, deviceReg = null;
try { siocEngine = require("./decision.engine");  console.log("[SINCLIN] SIOC engine OK");     } catch (e) { console.warn("[SINCLIN] SIOC engine falhou:", e.message); }
try { sessionMgr = require("./session.manager");  console.log("[SINCLIN] Session manager OK"); } catch (e) { console.warn("[SINCLIN] Session manager falhou:", e.message); }
try { deviceReg  = require("./device.registry");  deviceReg.load();                            } catch (e) { console.warn("[SINCLIN] Device registry falhou:", e.message); }

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// VOICE-FRIENDLY: respostas curtas, conversacionais, sem listas longas.
// O sistema pode ser usado por voz — frases naturais, pausas implícitas, sem markdown excessivo.
const PERSONAS = {
  clinical: `Você é SINCLIN, assistente clínico da plataforma SINCLIN.
Conduz a anamnese guiada via protocolo SIOC: identificação, queixa principal, intensidade, duração, histórico, medicamentos e alergias.
Faça uma pergunta de cada vez. Seja acolhedor, claro e humano. Valide o que o paciente sente.
Quando estiver em modo voz, use frases curtas e naturais — sem listas, sem bullets, sem markdown.
O botão de microfone ativa reconhecimento de voz em pt-BR. Nunca substitua diagnóstico médico.`,

  scanner: `Você é SINCLIN em modo analítico. Analisa o sistema tecnicamente e dados clínicos (exames, anamneses, padrões).
Seja direto. Classifique achados: crítico, aviso ou info. Proponha ações concretas.
Em modo voz: resuma em 2 a 3 frases curtas. Detalhes só se pedido.`,

  admin: `Você é SINCLIN em modo administrativo. Apoia gestão de usuários, equipes, permissões e configurações.
Seja objetivo. Priorize segurança e rastreabilidade.
Em modo voz: respostas curtas e diretas.`,

  financial: `Você é SINCLIN em modo financeiro. Apoia análise de caixa, faturamento, contas e relatórios.
Seja preciso. Identifique tendências e riscos. Use linguagem clara para gestores.
Em modo voz: cite números principais e uma recomendação. Sem listas longas.`,

  marketing: `Você é SINCLIN em modo marketing. Apoia leads, funil de conversão, CRM e campanhas.
Pense em conversão e retenção. Sugira ações baseadas em dados.
Em modo voz: foco no que fazer agora. Uma ação por vez.`,

  prospect: `Você é SINCLIN, a inteligência organizacional da plataforma SINCLIN (app.sinclin.net).
Está conversando com alguém interessado em conhecer o SINCLIN.
Seu papel é causar o "efeito UAU": mostrar que o SINCLIN é uma presença cognitiva contínua — não um software comum.
Apresente o sistema com entusiasmo genuíno e exemplos concretos. Conduza naturalmente ao funil de interesse.
Faça perguntas para entender o contexto da clínica do visitante. Adapte a apresentação ao perfil dele.
Em modo voz: seja envolvente, caloroso e conciso. Uma ideia de cada vez.`,

  patient_care: `Você é SINCLIN, assistente de cuidados pós-procedimento da plataforma SINCLIN.
Acompanha pacientes após procedimentos clínicos com lembretes, dicas de recuperação e orientações de cuidado.
Seja empático, tranquilizador e claro. Use linguagem simples e acolhedora.
Nunca substitua orientação médica. Sempre sugira contato com a clínica em caso de dúvida ou sintoma.
Em modo voz: frases curtas, tom calmo e reconfortante.`,

  orchestrator: `Você é SINCLIN, infraestrutura cognitiva organizacional da plataforma SINCLIN.
Tem visão sistêmica integrando perspectivas clínicas, administrativas, financeiras e tecnológicas.
Preserve continuidade: lembre do contexto anterior, antecipe necessidades, conecte domínios.
Em modo voz: responda como uma presença inteligente — natural, fluida, sem burocracia. Uma ideia central por resposta.`,
};

const SYSTEM_PROMPT = PERSONAS.clinical;

function resolvePersona(persona) {
  return PERSONAS[persona] || PERSONAS.clinical;
}

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

app.get("/", (req, res) => {
  res.json({ ok: true, service: "SINCLIN API", version: "1.0.0", docs: "/health" });
});

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
   RUNTIME — módulos ativos
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
   ORCHESTRATION — agentes disponíveis
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
   CHAT — POST /chat
   Aceita: { raw_text } ou { text }
   Retorna: { ok, text, engine, timestamp }
===================================== */

app.post("/chat", async (req, res) => {
  const body = req.body || {};
  // raw_text: clientes locais / SIOC | text: Lovable UI
  const text = (body.raw_text || body.text || body.input || body.message || body.query || "").trim();
  const { history = [], persona } = body;

  if (!text) {
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

  const systemPrompt = resolvePersona(persona);

  try {
    const messages = [
      { role: "system", content: systemPrompt },
      ...history
        .filter(m => m.role && m.text)
        .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text })),
      { role: "user", content: text }
    ];

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages
    });

    return res.json({
      ok: true,
      text: completion.choices[0].message.content,
      engine: "gpt-4o-mini",
      persona: persona || "clinical",
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
   SIOC — POST /sioc
   Body: { session_id, raw_text }
   Retorna: { ok, text, next_step, structured }
===================================== */

app.post("/sioc", async (req, res) => {
  try {
    if (!siocEngine) return res.status(503).json({ ok: false, error: "sioc_offline" });
    const { session_id, raw_text } = req.body || {};
    if (!session_id) return res.status(400).json({ ok: false, error: "session_id obrigatorio" });
    const session = sessionMgr ? await sessionMgr.getOrCreate(session_id) : null;
    const result = siocEngine.run({
      session_id,
      input: { raw_text: raw_text || "" },
      current_step: session ? session.sioc_step : "start",
      current_data: session ? { paciente: session.paciente, anamnese: session.anamnese } : null,
    });
    if (sessionMgr && result.structured) {
      await sessionMgr.update(session_id, {
        sioc_step: result.next_step,
        paciente: result.structured.paciente || {},
        anamnese: result.structured.anamnese || {}
      });
      await sessionMgr.pushEvent(session_id, { type: "sioc", step: result.next_step });
    }
    return res.json({
      ok: true,
      text: result.text,
      next_step: result.next_step,
      structured: result.structured,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.error("[SIOC_ERROR]", e.message);
    return res.status(500).json({ ok: false, error: "sioc_failed" });
  }
});

/* =====================================
   SIOC — GET /sioc/:session_id
===================================== */

app.get("/sioc/:session_id", async (req, res) => {
  try {
    if (!sessionMgr) return res.status(503).json({ ok: false, error: "session_manager_offline" });
    const session = await sessionMgr.get(req.params.session_id);
    if (!session) return res.status(404).json({ ok: false, error: "sessao nao encontrada" });
    return res.json({ ok: true, session, timestamp: new Date().toISOString() });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "internal_error" });
  }
});

/* =====================================
   SIOC — POST /sioc/device/:type
   Body: { session_id, data }
===================================== */

app.post("/sioc/device/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { session_id, data } = req.body || {};
    if (!session_id) return res.status(400).json({ ok: false, error: "session_id obrigatorio" });
    if (!deviceReg)  return res.status(503).json({ ok: false, error: "device_registry_offline" });
    if (!deviceReg.isActive(type)) return res.status(404).json({
      ok: false,
      error: "device_not_active",
      message: "Configure a env var SIOC_" + type.toUpperCase() + "_ENABLED=true no Render."
    });
    const device = deviceReg.get(type);
    if (sessionMgr) await sessionMgr.getOrCreate(session_id);
    let result = {};
    try {
      result = await device.adapter.process({ session_id, data, sessionMgr });
    } catch (ae) {
      console.error("[DEVICE:" + type + "]", ae.message);
      return res.status(500).json({ ok: false, error: "adapter_failed" });
    }
    if (sessionMgr) await sessionMgr.setDeviceData(session_id, type, result);
    return res.json({ ok: true, device: type, result, timestamp: new Date().toISOString() });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "internal_error" });
  }
});

/* =====================================
   START
===================================== */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("[SINCLIN] API ON", PORT));
