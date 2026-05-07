const fs = require("fs");
const path = require("path");

const telemetryPath = path.join(
  __dirname,
  "memory.telemetry.log"
);

function memoryTelemetry(
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
    "[SINCLIN_MEMORY]",
    entry
  );

  fs.appendFileSync(
    telemetryPath,
    JSON.stringify(entry) + "\n"
  );
}

module.exports = {
  memoryTelemetry
};
