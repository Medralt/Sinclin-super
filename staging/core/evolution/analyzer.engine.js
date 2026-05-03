const readLogs = require('./logs.reader');
const aiEngine = require('../src/services/ai.engine');
const fs = require('fs');
const path = require('path');

const suggestionsFile = path.resolve(__dirname, 'suggestions.json');

async function analyze() {

    const logs = readLogs();

    if (logs.length === 0) {
        console.log("SEM LOGS PARA ANALISAR");
        return;
    }

    const summary = logs.slice(-20); // últimos eventos

    const prompt = {
        type: "system_analysis",
        logs: summary
    };

    const aiResponse = await aiEngine({
        content: JSON.stringify(prompt)
    });

    const suggestion = {
        id: Date.now(),
        suggestion: aiResponse,
        created_at: new Date().toISOString()
    };

    let existing = [];
    if (fs.existsSync(suggestionsFile)) {
        existing = JSON.parse(fs.readFileSync(suggestionsFile));
    }

    existing.push(suggestion);

    fs.writeFileSync(suggestionsFile, JSON.stringify(existing, null, 2));

    console.log("SUGESTAO GERADA:");
    console.log(suggestion);
}

module.exports = analyze;
