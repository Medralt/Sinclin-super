const fs =
require("fs");

function validateOrchestration() {

  return {

    valid:
      fs.existsSync(
        process.cwd() +
        "/runtime/orchestration/orchestrator.js"
      )
  };
}

module.exports = {
  validateOrchestration
};
