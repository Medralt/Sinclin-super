const fs = require('fs');
const path = require('path');

const logPath = path.resolve(__dirname, '../../logs/ai.log');

function log(step, data) {
    fs.appendFileSync(logPath, JSON.stringify({step,data,time:new Date()}) + '\\n');
}

async function aiEngine(input) {
    log("INPUT", input);
    const response = "[IA MOCK] " + input.content;
    log("OUTPUT", response);
    return response;
}

module.exports = aiEngine;
