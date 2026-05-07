const profiles = {};

function resolveProfile(
  id,
  type = "patient"
) {

  if (!profiles[id]) {

    profiles[id] = {

      id,

      type,

      created:
        new Date().toISOString(),

      preferences: {},

      telemetry: {},

      continuity: {
        sessions: 0
      }
    };
  }

  profiles[id]
    .continuity
    .sessions++;

  return profiles[id];
}

module.exports = {
  profiles,
  resolveProfile
};
