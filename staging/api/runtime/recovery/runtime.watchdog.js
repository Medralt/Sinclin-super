const {
  telemetry
} =
require("../cognition/telemetry/telemetry.bus");

function runtimeWatchdog(
  state = "healthy"
) {

  telemetry(
    `runtime.${state}`,
    {
      timestamp:
        new Date().toISOString()
    }
  );

  console.log(
    "[SINCLIN_WATCHDOG]",
    state
  );

  return state;
}

module.exports = {
  runtimeWatchdog
};
