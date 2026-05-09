const {
  telemetry
} =
require("../telemetry/voice.telemetry");

function presenceEvent(
  sessionId,
  event
) {

  telemetry(
    "presence",
    {
      sessionId,
      event
    }
  );

  return {
    ok: true,
    sessionId,
    event
  };
}

module.exports = {
  presenceEvent
};
