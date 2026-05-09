const fs = require("fs");
const path = require("path");

const telemetryPath = path.join(
  __dirname,
  "voice.telemetry.log"
);

function telemetry(
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
    "[SINCLIN_VOICE]",
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
