const fs = require("fs");
const path = require("path");

function runtimeLog(type, message, data = {}) {

  const entry = {
    type,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  console.log(
    "[SINCLIN_RUNTIME]",
    entry
  );

  const logPath = path.join(
    __dirname,
    "runtime.log"
  );

  fs.appendFileSync(
    logPath,
    JSON.stringify(entry) + "\n"
  );
}

module.exports = {
  runtimeLog
};
