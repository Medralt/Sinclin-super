const {
  startupGuard
} =
require("../governance/startup/startup.guard");

const {
  runtimeSupervisor
} =
require("../recovery/runtime.supervisor");

const {
  runtimeWatchdog
} =
require("../recovery/runtime.watchdog");

const {
  watchdogTask
} =
require("../recovery/watchdog.task");

const {
  observabilityTask
} =
require("../observability/observability.task");

const {
  productionPipeline
} =
require("../production/production.pipeline");

const {
  startScheduler,
  registerTask
} =
require("../scheduler/cognitive.scheduler");

const {
  cognitiveScanner
} =
require("../cognition/scanner/cognitive.scanner");

const {
  telemetry
} =
require("../cognition/telemetry/telemetry.bus");

function initializeCognitiveRuntime() {

  startupGuard();

  runtimeSupervisor();

  runtimeWatchdog(
    "healthy"
  );

  productionPipeline();

  telemetry(
    "runtime_boot",
    {
      status: "online"
    }
  );

  registerTask(
    "cognitive_scanner",
    cognitiveScanner,
    30000
  );

  registerTask(
    "runtime_watchdog",
    watchdogTask,
    60000
  );

  registerTask(
    "runtime_observability",
    observabilityTask,
    120000
  );

  startScheduler();

  console.log(
    "[SINCLIN_RUNTIME]",
    "cognitive runtime online"
  );
}

module.exports = {
  initializeCognitiveRuntime
};
