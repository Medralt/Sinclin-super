const fs = require("fs");
const path = require("path");

const telemetryPath = path.join(
  __dirname,
  "evolution.telemetry.log"
);

function evolutionTelemetry(
  type,
  data = {}
) {

  const entry = {
    type,
    data,
    timestamp:
      new Date().toISOString()
  };

  console.log(
    "[SINCLIN_EVOLUTION_TELEMETRY]",
    entry
  );

  fs.appendFileSync(
    telemetryPath,
    JSON.stringify(entry) + "\n"
  );
}

module.exports = {
  evolutionTelemetry
};
