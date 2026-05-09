const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

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

let geminiModel = null;
let engineOnline = false;

try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");
  const genAI = new GoogleGenerativeAI(apiKey);
  geminiModel = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: SYSTEM_PROMPT
  });
  engineOnline = true;
  console.log("[SINCLIN] Gemini engine online");
} catch (err) {
  console.warn("[SINCLIN] Gemini engine offline:", err.message);
}

/* =====================================
   HEALTH
===================================== */

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    status: "online",
    engine: engineOnline ? "gemini-2.0-flash" : "offline",
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

  if (!engineOnline || !geminiModel) {
    return res.status(503).json({
      ok: false,
      text: "Motor de IA temporariamente indisponível.",
      error: "engine_offline",
      timestamp: new Date().toISOString()
    });
  }

  try {
    const chatHistory = history
      .filter(m => m.role && m.text)
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }]
      }));

    const chat = geminiModel.startChat({ history: chatHistory });
    const result = await chat.sendMessage(text);
    const responseText = result.response.text();

    return res.json({
      ok: true,
      text: responseText,
      engine: "gemini-2.0-flash",
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("[SINCLIN_CHAT_ERROR]", err.message);
    return res.status(500).json({
      ok: false,
      text: "Não foi possível processar sua mensagem. Tente novamente.",
      error: "generation_failed",
      debug: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

/* =====================================
   START
===================================== */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("[SINCLIN] API ON", PORT));
