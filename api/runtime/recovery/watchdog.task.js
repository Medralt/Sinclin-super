const {
  runtimeWatchdog
} =
require("../recovery/runtime.watchdog");

const {
  healthPropagation
} =
require("../health/health.propagation");

function watchdogTask() {

  runtimeWatchdog(
    "healthy"
  );

  healthPropagation(
    "healthy"
  );

  return true;
}

module.exports = {
  watchdogTask
};
