const express = require('express');
const bodyParser = require('body-parser');

const uiAdapter = require('../ui-adapter/adapter');
const aiAdapter = require('../ai-adapter/adapter');
const mockAI = require('../mock-ai/mock');

const app = express();
app.use(bodyParser.json());

app.post('/input', (req, res) => {
    try {
        const adapted = uiAdapter(req.body.input);
        const aiResponse = aiAdapter(adapted, mockAI);

        res.json({
            status: "ok",
            adapted,
            aiResponse
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("SINCLIN BLOCO 0 rodando em http://localhost:3000");
});
