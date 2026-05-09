const express = require("express");
const cors = require("cors");

const {
  initializeCognitiveRuntime
} = require("./runtime/core/cognitive.boot");

const {
  orchestrate
} = require("./runtime/orchestration/orchestrator");

const {
  cognitiveHealth
} = require("./runtime/health/cognitive.health");

const app = express();

const ALLOWED_ORIGINS = [
  "https://sinclin-fente.lovable.app",
  "https://id-preview--cec7682e-ff4d-42a3-9df6-0918af0c9061.lovable.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      ALLOWED_ORIGINS.includes(origin) ||
      /^https:\/\/[^.]+\.lovable\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
