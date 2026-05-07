const {
  runtimeMetrics
} =
require("../observability/metrics/runtime.metrics");

const {
  runtimeAnalytics
} =
require("../observability/analytics/runtime.analytics");

function observabilityTask() {

  runtimeMetrics();

  runtimeAnalytics(
    "runtime.observability"
  );

  return true;
}

module.exports = {
  observabilityTask
};
