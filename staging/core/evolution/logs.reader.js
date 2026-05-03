const fs = require('fs');
const path = require('path');

const logFile = path.resolve(__dirname, '../logs/ai.log');

function readLogs() {
    if (!fs.existsSync(logFile)) return [];

    const lines = fs.readFileSync(logFile, 'utf-8')
        .split('\\n')
        .filter(l => l.trim());

    return lines.map(l => {
        try { return JSON.parse(l); }
        catch { return null; }
    }).filter(Boolean);
}

module.exports = readLogs;
