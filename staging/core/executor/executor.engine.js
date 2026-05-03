const fs = require('fs');
const path = require('path');

const suggestionsFile = path.resolve(__dirname, '../evolution/suggestions.json');
const historyFile = path.resolve(__dirname, 'history.json');
const versionsPath = path.resolve(__dirname, 'versions');

function readJSON(file) {
    return JSON.parse(fs.readFileSync(file));
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function snapshot() {
    const versionId = Date.now();
    const target = path.join(versionsPath, versionId.toString());

    fs.mkdirSync(target);

    copyDir(path.resolve(__dirname, '../src'), path.join(target, 'src'));

    return versionId;
}

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const file of fs.readdirSync(src)) {
        const s = path.join(src, file);
        const d = path.join(dest, file);

        if (fs.lstatSync(s).isDirectory()) {
            copyDir(s, d);
        } else {
            fs.copyFileSync(s, d);
        }
    }
}

function applySuggestion(suggestion) {

    // SIMULAÇÃO DE PATCH (expandir depois)
    const change = {
        file: "decision.engine.js",
        change: "melhoria sugerida"
    };

    return change;
}

function execute() {

    const suggestions = readJSON(suggestionsFile);
    if (suggestions.length === 0) {
        console.log("SEM SUGESTOES");
        return;
    }

    const latest = suggestions[suggestions.length - 1];

    const versionId = snapshot();

    const patch = applySuggestion(latest);

    let history = readJSON(historyFile);

    history.push({
        id: Date.now(),
        version: versionId,
        suggestion: latest,
        patch
    });

    writeJSON(historyFile, history);

    console.log("EXECUTADO:");
    console.log({
        version: versionId,
        patch
    });
}

function rollback(versionId) {

    const src = path.join(versionsPath, versionId.toString(), 'src');
    const dest = path.resolve(__dirname, '../src');

    copyDir(src, dest);

    console.log("ROLLBACK OK:", versionId);
}

module.exports = {
    execute,
    rollback
};
