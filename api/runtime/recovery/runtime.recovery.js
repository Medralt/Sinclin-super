const {
  telemetry
} =
require("../cognition/telemetry/telemetry.bus");

async function runtimeRecovery(
  type,
  payload = {}
) {

  telemetry(
    "runtime.recovering",
    {
      type,
      payload,
      timestamp:
        new Date().toISOString()
    }
  );

  console.log(
    "[SINCLIN_RECOVERY]",
    type
  );

  return {
    recovered: true,
    type
  };
}

module.exports = {
  runtimeRecovery
};
