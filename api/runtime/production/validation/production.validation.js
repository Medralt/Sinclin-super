const fs =
require("fs");

function productionValidation() {

  const checks = {

    runtime:
      fs.existsSync(
        "./runtime/core/cognitive.boot.js"
      ),

    governance:
      fs.existsSync(
        "./runtime/governance/governance.engine.js"
      ),

    recovery:
      fs.existsSync(
        "./runtime/recovery/runtime.recovery.js"
      ),

    telemetry:
      fs.existsSync(
        "./runtime/cognition/telemetry/telemetry.bus.js"
      )
  };

  return checks;
}

module.exports = {
  productionValidation
};
