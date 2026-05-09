const {
  telemetry
} =
require("../cognition/telemetry/telemetry.bus");

const {
  runtimeRecovery
} =
require("./runtime.recovery");

function runtimeSupervisor() {

  try {

    telemetry(
      "runtime.supervision.ok",
      {
        status: "healthy",
        timestamp:
          new Date().toISOString()
      }
    );

    return true;

  } catch (error) {

    telemetry(
      "runtime.supervision.failed",
      {
        error:
          error.message
      }
    );

    runtimeRecovery(
      "supervision_failure",
      {
        error:
          error.message
      }
    );

    return false;
  }
}

module.exports = {
  runtimeSupervisor
};
