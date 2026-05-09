const eventBus =
require("./events/eventBus");

const {
  scannerLog
} =
require("./scanner/scanner");

const {
  runtimeLog
} =
require("./logs/runtimeLogger");

function initializeRuntime() {

  runtimeLog(
    "startup",
    "runtime initialized"
  );

  scannerLog(
    "runtime_initialized"
  );

  eventBus.emit(
    "runtime:started",
    {
      online: true
    }
  );
}

module.exports = {
  initializeRuntime
};

/* =====================================
   SINCLIN MULTIAGENT
===================================== */

const {
  resolveAgent
} =
require("./orchestrator/multiagent.orchestrator");

const {
  evolutionEvent
} =
require("./evolution/adaptive/adaptive.engine");

const primaryAgent =
  resolveAgent("patient");

evolutionEvent(
  "runtime_multiagent_initialized",
  {
    primaryAgent
  }
);

/* ===================================== */
