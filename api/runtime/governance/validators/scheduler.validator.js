const fs =
require("fs");

function validateScheduler() {

  return {

    valid:
      fs.existsSync(
        process.cwd() +
        "/runtime/scheduler/cognitive.scheduler.js"
      )
  };
}

module.exports = {
  validateScheduler
};
