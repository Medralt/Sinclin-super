const fs =
require("fs");

function validateTelemetry() {

  return {

    valid:
      fs.existsSync(
        process.cwd() +
        "/runtime/cognition/telemetry/telemetry.bus.js"
      )
  };
}

module.exports = {
  validateTelemetry
};
