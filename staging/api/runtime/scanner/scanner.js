const fs = require("fs");
const path = require("path");

function scannerLog(type, data = {}) {

  const entry = {
    type,
    data,
    timestamp: new Date().toISOString()
  };

  console.log(
    "[SINCLIN_SCANNER]",
    entry
  );

  const logPath = path.join(
    __dirname,
    "..",
    "logs",
    "scanner.log"
  );

  fs.appendFileSync(
    logPath,
    JSON.stringify(entry) + "\n"
  );
}

module.exports = {
  scannerLog
};

/* =====================================
   SINCLIN COGNITIVE SCANNER
===================================== */

const {
  cognitiveAnalysis
} =
require("./analysis/cognitive.analysis");

function runCognitiveScanner() {

  const analysis =
    cognitiveAnalysis();

  scannerLog(
    "cognitive_runtime_analysis",
    analysis
  );

  return analysis;
}

module.exports.runCognitiveScanner =
  runCognitiveScanner;

/* ===================================== */
