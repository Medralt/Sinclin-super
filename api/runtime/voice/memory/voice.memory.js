const fs = require("fs");
const path = require("path");

const MEMORY_PATH = path.join(
  __dirname,
  "voice.memory.json"
);

function loadMemory() {

  if (!fs.existsSync(MEMORY_PATH)) {
    return {};
  }

  return JSON.parse(
    fs.readFileSync(
      MEMORY_PATH,
      "utf8"
    )
  );
}

function persistMemory(memory) {

  fs.writeFileSync(
    MEMORY_PATH,
    JSON.stringify(
      memory,
      null,
      2
    )
  );
}

function appendMemory(
  sessionId,
  data
) {

  const memory =
    loadMemory();

  if (!memory[sessionId]) {
    memory[sessionId] = [];
  }

  memory[sessionId]
    .push({
      ...data,
      timestamp:
        new Date().toISOString()
    });

  persistMemory(memory);
}

module.exports = {
  appendMemory,
  loadMemory
};
