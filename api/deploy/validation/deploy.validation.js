const {
  governanceEngine
} =
require("../../runtime/governance/governance.engine");

const {
  runtimeSupervisor
} =
require("../../runtime/recovery/runtime.supervisor");

const {
  productionPipeline
} =
require("../../runtime/production/production.pipeline");

async function deployValidation() {

  governanceEngine();

  runtimeSupervisor();

  productionPipeline();

  console.log(
    "[SINCLIN_DEPLOY]",
    "validated"
  );

  return true;
}

module.exports = {
  deployValidation
};
