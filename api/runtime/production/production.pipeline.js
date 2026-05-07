const {
  telemetry
} =
require("../cognition/telemetry/telemetry.bus");

const {
  productionGuard
} =
require("./guards/production.guard");

const {
  productionValidation
} =
require("./validation/production.validation");

function productionPipeline() {

  productionGuard();

  const checks =
    productionValidation();

  telemetry(
    "production.pipeline.ok",
    checks
  );

  console.log(
    "[SINCLIN_PRODUCTION]",
    "validated"
  );

  return checks;
}

module.exports = {
  productionPipeline
};
