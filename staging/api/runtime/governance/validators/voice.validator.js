const fs =
require("fs");

function validateVoice() {

  return {

    valid:
      fs.existsSync(
        process.cwd() +
        "/runtime/cognition/voice/cognitive.voice.js"
      )
  };
}

module.exports = {
  validateVoice
};
