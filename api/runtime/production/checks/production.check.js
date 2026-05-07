const {
  validateRuntime
} =
require("../validation/runtime.validation");

const {
  hardeningStatus
} =
require("../hardening/hardening.engine");

const {
  recoveryStatus
} =
require("../recovery/recovery.engine");

function productionCheck() {

  return {

    validation:
      validateRuntime(),

    hardening:
      hardeningStatus(),

    recovery:
      recoveryStatus(),

    production: true,

    timestamp:
      new Date().toISOString()
  };
}

module.exports = {
  productionCheck
};
