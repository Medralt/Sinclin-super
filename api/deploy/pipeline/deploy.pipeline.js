const {
  deployValidation
} =
require("../validation/deploy.validation");

async function deployPipeline() {

  await deployValidation();

  console.log(
    "[SINCLIN_DEPLOY]",
    "pipeline online"
  );

  return true;
}

module.exports = {
  deployPipeline
};
