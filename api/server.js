const express = require("express");
const cors = require("cors");

const {
  initializeCognitiveRuntime
} =
require("../runtime/core/cognitive.boot");

const {
  orchestrate
} =
require("../runtime/orchestration/orchestrator");

const {
  cognitiveHealth
} =
require("../runtime/health/cognitive.health");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

initializeCognitiveRuntime();

/* =====================================
   CHAT
===================================== */

app.post(
  "/chat",
  async (req, res) => {

    try {

      const response =
        await orchestrate(
          req.body || {}
        );

      res.json(response);

    } catch (err) {

      console.error(
        "[SINCLIN_CHAT_ERROR]",
        err
      );

      res.status(500).json({

        ok: false,

        error:
          "runtime_failure",

        timestamp:
          new Date().toISOString()
      });
    }
  }
);

/* =====================================
   HEALTH
===================================== */

app.get(
  "/health",
  (req, res) => {

    res.json(
      cognitiveHealth()
    );
  }
);

/* =====================================
   START
===================================== */

const PORT =
process.env.PORT || 3000;

app.listen(
  PORT,
  () => {

    console.log(
      "[SINCLIN]",
      "API ON " + PORT
    );
  }
);


app.post("/chat", async (req, res) => {

  try {

    const {
      persona = "doctor",
      session = "production",
      text = ""
    } = req.body || {};

    const response =
      typeof globalThis.sinclinRuntime === "function"
      ? await globalThis.sinclinRuntime({
          persona,
          session,
          text
        })
      : `SINCLIN:${text}`;

    return res.json({
  ok: true,
  response: "SINCLIN runtime online",
  agent: {
    role: "clinical"
  },
  voice: {
    ok: true,
    voice: true,
    presence: true,
    timestamp: new Date().toISOString()
  },
  timestamp: new Date().toISOString()
});

  } catch (err) {

    console.error(
      "[SINCLIN_CHAT_FATAL]",
      err
    );

    return res.status(500).json({
      ok: false,
      error: "runtime_failure"
    });
  }
});


