const {
  memoryTelemetry
} =
require("../telemetry/memory.telemetry");

function memoryAnalysis(
  session = {}
) {

  const history =
    session.history || [];

  const analysis = {

    totalInteractions:
      history.length,

    active:
      history.length > 0,

    analyzedAt:
      new Date().toISOString()
  };

  memoryTelemetry(
    "memory_analysis",
    analysis
  );

  return analysis;
}

module.exports = {
  memoryAnalysis
};
