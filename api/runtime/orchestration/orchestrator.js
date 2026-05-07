const {
  resolveAgent
} =
require("../cognition/agents/agents.engine");

const {
  cognitiveVoice
} =
require("../cognition/voice/cognitive.voice");

async function orchestrate(
  payload = {}
) {

  const agent =
    resolveAgent(
      payload.persona
    );

  const voice =
    await cognitiveVoice(
      payload
    );

  return {

    ok: true,

    agent,

    voice,

    timestamp:
      new Date().toISOString()
  };
}

module.exports = {
  orchestrate
};
