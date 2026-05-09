const fs = require("fs");

function validateStructure() {

  const required = [

    "./runtime/orchestration/orchestrator.js",

    "./runtime/cognition/scanner/cognitive.scanner.js",

    "./runtime/cognition/memory/cognitive.memory.js",

    "./runtime/cognition/voice/cognitive.voice.js",

    "./runtime/cognition/agents/agents.engine.js"
  ];

  return {

    valid:
      required.every(
        f => fs.existsSync(f)
      ),

    required,

    timestamp:
      new Date().toISOString()
  };
}

module.exports = {
  validateStructure
};
