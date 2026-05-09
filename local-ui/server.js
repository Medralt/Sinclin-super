const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;

function healthcheck() {
  return {
    runtime: true,
    scanner: true,
    memory: true,
    ui: true,
    timestamp: new Date().toISOString()
  };
}

function scannerLog(type) {
  const entry = { type, timestamp: new Date().toISOString() };
  console.log("[SINCLIN_UI_SCANNER]", JSON.stringify(entry));
  try {
    const logPath = path.join(__dirname, "runtime", "logs", "scanner.log");
    if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(logPath, JSON.stringify(entry) + "\n");
  } catch(e) {}
}

http.createServer((req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(healthcheck()));
    return;
  }

  if (req.method === "GET" && req.url === "/scanner") {
    scannerLog("ui_scan_request");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, scanner: "active", timestamp: new Date().toISOString() }));
    return;
  }

  if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
    try {
      const html = fs.readFileSync(path.join(__dirname, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    } catch(e) {
      res.writeHead(500);
      res.end(JSON.stringify({ ok: false, error: "html_not_found" }));
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: false, error: "not_found" }));

}).listen(PORT, () => console.log("[SINCLIN_UI] online porta " + PORT));
