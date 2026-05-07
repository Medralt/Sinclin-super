const fs = require("fs");
const path = require("path");

const telemetryPath = path.join(
  __dirname,
  "telemetry.log"
);

function telemetry(
  type,
  payload = {}
) {

  const entry = {

    type,
    payload,

    timestamp:
      new Date().toISOString()
  };

  console.log(
    "[SINCLIN_TELEMETRY]",
    entry
  );

  fs.appendFileSync(
    telemetryPath,
    JSON.stringify(entry) + "\n"
  );
}

module.exports = {
  telemetry
};
