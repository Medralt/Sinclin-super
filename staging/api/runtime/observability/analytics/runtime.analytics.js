const fs =
require("fs");

const path =
require("path");

const {
  telemetry
} =
require("../../cognition/telemetry/telemetry.bus");

function runtimeAnalytics(
  event = "runtime.analytics"
) {

  const logPath =
    path.join(
      process.cwd(),
      "runtime",
      "logs",
      "runtime.analytics.log"
    );

  const payload = {

    event,

    timestamp:
      new Date().toISOString()
  };

  fs.appendFileSync(
    logPath,
    JSON.stringify(payload) + "\n"
  );

  telemetry(
    event,
    payload
  );

  console.log(
    "[SINCLIN_ANALYTICS]",
    event
  );

  return payload;
}

module.exports = {
  runtimeAnalytics
};
