const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

/* optional runtime boot — non-fatal if modules are absent */
try {
  const { initializeCognitiveRuntime } = require("./runtime/core/cognitive.boot");
  initializeCognitiveRuntime();
} catch (err) {
  console.warn("[SINCLIN] runtime boot skipped:", err.message);
}

/* =====================================
   HEALTH
===================================== */

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    status: "online",
    timestamp: new Date().toISOString()
  });
});

/* =====================================
   CHAT
===================================== */

app.post("/chat", (req, res) => {
  res.json({
    ok: true,
    response: "SINCLIN online",
    timestamp: new Date().toISOString()
  });
});

/* =====================================
   START
===================================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("[SINCLIN] API ON", PORT);
});
