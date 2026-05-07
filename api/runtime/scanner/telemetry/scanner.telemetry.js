const fs = require("fs");
const path = require("path");

const telemetryPath = path.join(
  __dirname,
  "scanner.telemetry.log"
);

function scannerTelemetry(
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
    "[SINCLIN_SCANNER_TELEMETRY]",
    entry
  );

  fs.appendFileSync(
    telemetryPath,
    JSON.stringify(entry) + "\n"
  );
}

module.exports = {
  scannerTelemetry
};
