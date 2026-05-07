const {
  runtimeMetrics
} =
require("../metrics/runtime.metrics");

const {
  predictiveAnalysis
} =
require("../predictive/predictive.engine");

const {
  scannerTelemetry
} =
require("../telemetry/scanner.telemetry");

function cognitiveAnalysis() {

  const metrics =
    runtimeMetrics();

  const predictive =
    predictiveAnalysis(metrics);

  const analysis = {

    metrics,
    predictive,

    timestamp:
      new Date().toISOString()
  };

  scannerTelemetry(
    "cognitive_analysis",
    analysis
  );

  return analysis;
}

module.exports = {
  cognitiveAnalysis
};
