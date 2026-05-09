const fs = require("fs");
const path = require("path");

const MEMORY_DB = path.join(
  __dirname,
  "longitudinal.memory.json"
);

function loadDB() {

  if (!fs.existsSync(MEMORY_DB)) {
    return {};
  }

  return JSON.parse(
    fs.readFileSync(
      MEMORY_DB,
      "utf8"
    )
  );
}

function persistDB(data) {

  fs.writeFileSync(
    MEMORY_DB,
    JSON.stringify(
      data,
      null,
      2
    )
  );
}

function appendLongitudinal(
  sessionId,
  payload = {}
) {

  const db = loadDB();

  if (!db[sessionId]) {
    db[sessionId] = [];
  }

  db[sessionId].push({

    payload,

    timestamp:
      new Date().toISOString()
  });

  persistDB(db);

  return db[sessionId];
}

module.exports = {
  appendLongitudinal,
  loadDB
};
