const {
  resolveAgent
} =
require("../runtime/orchestrator/multiagent.orchestrator");

const {
  operationalPresence
} =
require("../runtime/presence/presence.engine");

console.log(
  "[SINCLIN_TEST]",
  resolveAgent("doctor")
);

console.log(
  "[SINCLIN_TEST]",
  operationalPresence({
    persona: "doctor"
  })
);
