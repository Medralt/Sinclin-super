const {
  telemetry
} =
require("../cognition/telemetry/telemetry.bus");

function healthPropagation(
  state = "healthy"
) {

  telemetry(
    "runtime.health.propagation",
    {
      state,
      timestamp:
        new Date().toISOString()
    }
  );

  console.log(
    "[SINCLIN_HEALTH]",
    state
  );

  return state;
}

module.exports = {
  healthPropagation
};
