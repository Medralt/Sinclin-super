function predictiveAnalysis(
  metrics = {}
) {

  const memory =
    metrics.memory?.heapUsed || 0;

  const risk =
    memory > 500000000
      ? "high"
      : "stable";

  return {

    runtimeRisk:
      risk,

    analyzedAt:
      new Date().toISOString()
  };
}

module.exports = {
  predictiveAnalysis
};
