const os = require("os");

const {
  telemetry
} =
require("../telemetry/telemetry.bus");

function cognitiveScanner() {

  const analysis = {

    uptime:
      process.uptime(),

    memory:
      process.memoryUsage(),

    cpu:
      os.cpus().length,

    timestamp:
      new Date().toISOString()
  };

  telemetry(
    "scanner_analysis",
    analysis
  );

  return analysis;
}

module.exports = {
  cognitiveScanner
};
