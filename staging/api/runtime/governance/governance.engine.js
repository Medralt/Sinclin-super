const {
  validateEnv
} =
require("./validators/env.validator");

const {
  validateScheduler
} =
require("./validators/scheduler.validator");

const {
  validateTelemetry
} =
require("./validators/telemetry.validator");

const {
  validateMemory
} =
require("./validators/memory.validator");

const {
  validateVoice
} =
require("./validators/voice.validator");

const {
  validateOrchestration
} =
require("./validators/orchestration.validator");

const {
  validateContracts
} =
require("./validators/contracts.validator");

const {
  telemetry
} =
require("../cognition/telemetry/telemetry.bus");

function governanceEngine() {

  const checks = {

    env:
      validateEnv(),

    scheduler:
      validateScheduler(),

    telemetry:
      validateTelemetry(),

    memory:
      validateMemory(),

    voice:
      validateVoice(),

    orchestration:
      validateOrchestration(),

    contracts:
      validateContracts()
  };

  const failed =
    Object.entries(checks)
      .filter(([_, v]) => !v.valid);

  if (failed.length > 0) {

    telemetry(
      "runtime.validation.failed",
      failed
    );

    console.error(
      "[SINCLIN_GOVERNANCE]",
      failed
    );

    process.exit(1);
  }

  telemetry(
    "runtime.validation.ok",
    checks
  );

  console.log(
    "[SINCLIN_GOVERNANCE]",
    "validated"
  );

  return checks;
}

module.exports = {
  governanceEngine
};
