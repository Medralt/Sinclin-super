const sessions = {};

function createSession(id) {

  if (!sessions[id]) {

    sessions[id] = {

      id,

      created:
        new Date().toISOString(),

      history: [],
      context: {}
    };
  }

  return sessions[id];
}

function appendHistory(id, entry) {

  if (!sessions[id]) {
    createSession(id);
  }

  sessions[id]
    .history
    .push(entry);
}

module.exports = {
  sessions,
  createSession,
  appendHistory
};

/* =====================================
   SINCLIN LONGITUDINAL MEMORY
===================================== */

const {
  appendLongitudinal
} =
require("./longitudinal/longitudinal.memory");

const {
  semanticIndex
} =
require("./semantic/semantic.memory");

const {
  resolveProfile
} =
require("./profiles/profile.engine");

function cognitiveMemory(
  id,
  text
) {

  const profile =
    resolveProfile(id);

  const semantic =
    semanticIndex(text);

  appendLongitudinal(
    id,
    {
      text,
      semantic,
      profile
    }
  );

  return {
    ok: true,
    profile,
    semantic
  };
}

module.exports.cognitiveMemory =
  cognitiveMemory;

/* ===================================== */
