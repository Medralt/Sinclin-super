const {
  telemetry
} =
require("../../cognition/telemetry/telemetry.bus");

function runtimeMetrics() {

  const metrics = {

    uptime:
      process.uptime(),

    memory:
      process.memoryUsage(),

    timestamp:
      new Date().toISOString()
  };

  telemetry(
    "runtime.metrics",
    metrics
  );

  console.log(
    "[SINCLIN_METRICS]",
    metrics.uptime
  );

  return metrics;
}

module.exports = {
  runtimeMetrics
};
