const {
  createVoiceSession
} =
require("../state/voice.state");

const {
  appendMemory
} =
require("../memory/voice.memory");

const {
  telemetry
} =
require("../telemetry/voice.telemetry");

const {
  routeVoice
} =
require("../router/voice.router");

async function voicePipeline(
  payload = {}
) {

  const session =
    createVoiceSession(
      payload.id || "anonymous"
    );

  const route =
    routeVoice(payload);

  appendMemory(
    session.id,
    {
      input:
        payload.text || ""
    }
  );

  telemetry(
    "voice_pipeline",
    {
      session:
        session.id,

      persona:
        route.persona.id
    }
  );

  return {
    ok: true,
    session:
      session.id,

    persona:
      route.persona,

    response:
      "voice_runtime_online"
  };
}

module.exports = {
  voicePipeline
};
