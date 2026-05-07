const {
  telemetry
} =
require("../cognition/telemetry/telemetry.bus");

function runtimeFailover(
  type
) {

  telemetry(
    "runtime.failover",
    {
      type,
      timestamp:
        new Date().toISOString()
    }
  );

  console.log(
    "[SINCLIN_FAILOVER]",
    type
  );

  return {
    failover: true,
    type
  };
}

module.exports = {
  runtimeFailover
};
