const sessions = {};

function createVoiceSession(id) {

  if (!sessions[id]) {

    sessions[id] = {

      id,

      active: true,

      created:
        new Date().toISOString(),

      persona: "patient",

      memory: [],

      telemetry: [],

      lastInteraction:
        Date.now()
    };
  }

  return sessions[id];
}

function updateInteraction(id) {

  if (!sessions[id]) {
    createVoiceSession(id);
  }

  sessions[id]
    .lastInteraction =
      Date.now();
}

module.exports = {
  sessions,
  createVoiceSession,
  updateInteraction
};
