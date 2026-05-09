const fs = require("fs");
const path = require("path");

const evolutionPath = path.join(
  __dirname,
  "evolution.log"
);

function evolutionEvent(
  type,
  data = {}
) {

  const entry = {
    type,
    data,
    timestamp:
      new Date().toISOString()
  };

  console.log(
    "[SINCLIN_EVOLUTION]",
    entry
  );

  fs.appendFileSync(
    evolutionPath,
    JSON.stringify(entry) + "\n"
  );
}

function adaptiveBehavior(
  session = {}
) {

  return {

    adaptive: true,

    suggestions: [
      "improve_continuity",
      "increase_followup"
    ],

    analyzedAt:
      new Date().toISOString()
  };
}

module.exports = {
  evolutionEvent,
  adaptiveBehavior
};
