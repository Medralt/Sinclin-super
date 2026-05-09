const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true, status: "online", timestamp: new Date().toISOString() });
});

app.post("/chat", (req, res) => {
  res.json({ ok: true, response: "SINCLIN online", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("[SINCLIN] API ON", PORT));
