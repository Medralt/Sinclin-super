const fs = require("fs");
const path = require("path");

const memoryPath = path.join(
  __dirname,
  "cognitive.memory.json"
);

function loadMemory() {

  if (!fs.existsSync(memoryPath)) {
    return {};
  }

  return JSON.parse(
    fs.readFileSync(
      memoryPath,
      "utf8"
    )
  );
}

function persistMemory(data) {

  fs.writeFileSync(
    memoryPath,
    JSON.stringify(
      data,
      null,
      2
    )
  );
}

function appendMemory(
  sessionId,
  payload = {}
) {

  const db =
    loadMemory();

  if (!db[sessionId]) {
    db[sessionId] = [];
  }

  db[sessionId].push({

    payload,

    timestamp:
      new Date().toISOString()
  });

  persistMemory(db);

  return db[sessionId];
}

module.exports = {
  loadMemory,
  appendMemory
};
