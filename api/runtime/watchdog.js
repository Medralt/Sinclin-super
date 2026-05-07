const fs = require("fs");

function watchdog() {

  const status = {

    runtime: true,
    scanner: true,
    logs: true,
    timestamp:
      new Date().toISOString()
  };

  fs.writeFileSync(
    "./staging/health/watchdog.json",
    JSON.stringify(
      status,
      null,
      2
    )
  );

  console.log(
    "[SINCLIN_WATCHDOG]",
    status
  );
}

module.exports = {
  watchdog
};

console.log(
  "[SINCLIN_VOICE]",
  "voice watchdog active"
);


/* =====================================
   SINCLIN COGNITIVE WATCHDOG
===================================== */

const {
  runCognitiveScanner
} =
require("./scanner/scanner");

setInterval(() => {

  runCognitiveScanner();

}, 30000);

/* ===================================== */

/* =====================================
   SINCLIN SELF ANALYSIS
===================================== */

const {
  selfAnalysis
} =
require("./analysis.engine");

setInterval(() => {

  console.log(
    "[SINCLIN_SELF_ANALYSIS]",
    selfAnalysis()
  );

}, 45000);

/* ===================================== */

/* =====================================
   SINCLIN EVOLUTION WATCHDOG
===================================== */

const {
  adaptiveBehavior
} =
require("./evolution/adaptive/adaptive.engine");

setInterval(() => {

  console.log(
    "[SINCLIN_ADAPTIVE]",
    adaptiveBehavior()
  );

}, 60000);

/* ===================================== */

/* =====================================
   SINCLIN PRODUCTION WATCHDOG
===================================== */

const {
  productionCheck
} =
require("./production/checks/production.check");

setInterval(() => {

  console.log(
    "[SINCLIN_PRODUCTION_CHECK]",
    productionCheck()
  );

}, 90000);

/* ===================================== */
