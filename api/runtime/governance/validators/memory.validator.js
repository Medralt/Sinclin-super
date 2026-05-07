const fs =
require("fs");

function validateMemory() {

  return {

    valid:
      fs.existsSync(
        process.cwd() +
        "/runtime/cognition/memory/cognitive.memory.js"
      )
  };
}

module.exports = {
  validateMemory
};
