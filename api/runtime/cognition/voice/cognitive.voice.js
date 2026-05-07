const {
  appendMemory
} =
require("../memory/cognitive.memory");

const {
  telemetry
} =
require("../telemetry/telemetry.bus");

async function cognitiveVoice(
  payload = {}
) {

  appendMemory(
    payload.session || "anonymous",
    payload
  );

  telemetry(
    "voice_interaction",
    payload
  );

  return {

    ok: true,

    voice: true,

    presence: true,

    timestamp:
      new Date().toISOString()
  };
}

module.exports = {
  cognitiveVoice
};
