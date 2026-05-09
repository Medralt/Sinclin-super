const { resolveAgent } = require("../cognition/agents/agents.engine");
const { cognitiveVoice } = require("../cognition/voice/cognitive.voice");
const { run: siocRun } = require("../../../core/src/sioc/resolve/decision.engine");

async function orchestrate(payload = {}) {

  const agent = resolveAgent(payload.persona);

  const siocModes = ["sioc", "doctor", "patient"];
  const useSioc = payload.mode === "sioc" || siocModes.includes(payload.persona);

  let sioc = null;

  if (useSioc && payload.session_id && payload.input) {
    try {
      sioc = siocRun(payload);
    } catch (err) {
      console.error("[SINCLIN_SIOC_ERROR]", err.message);
    }
  }

  const voice = await cognitiveVoice(payload);

  return {
    ok: true,
    agent,
    voice,
    sioc,
    timestamp: new Date().toISOString()
  };
}

module.exports = { orchestrate };
