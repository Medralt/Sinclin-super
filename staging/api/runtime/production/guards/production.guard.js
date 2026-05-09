const {
  telemetry
} =
require("../../cognition/telemetry/telemetry.bus");

function productionGuard() {

  const required = [
    "NODE_ENV"
  ];

  const missing =
    required.filter(
      k => !process.env[k]
    );

  if (missing.length > 0) {

    telemetry(
      "production.guard.failed",
      {
        missing
      }
    );

    console.error(
      "[SINCLIN_PRODUCTION_GUARD]",
      missing
    );

    process.exit(1);
  }

  telemetry(
    "production.guard.ok",
    {
      status: "validated"
    }
  );

  return true;
}

module.exports = {
  productionGuard
};
