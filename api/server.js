const express = require('express');
const decisionEngine = require('../core/src/sioc/resolve/decision.engine');

const app = express();
app.use(express.json());

app.post('/chat', async (req, res) => {
    const result = await decisionEngine(req.body);
    res.json(result);
});

app.listen(3000, () => console.log("API ON 3000"));
