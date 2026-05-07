const fs = require("fs");

function validateRuntime() {

  const required = [

    "./runtime/core.runtime.js",

    "./runtime/watchdog.js",

    "./runtime/scanner/scanner.js",

    "./runtime/memory/sessionManager.js",

    "./runtime/voice/pipeline/voice.pipeline.js"
  ];

  const results = required.map(file => {

    return {
      file,
      exists:
        fs.existsSync(file)
    };
  });

  return {

    valid:
      results.every(r => r.exists),

    results,

    timestamp:
      new Date().toISOString()
  };
}

module.exports = {
  validateRuntime
};
