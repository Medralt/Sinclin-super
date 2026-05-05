const express = require('express');
const app = express();

app.use(express.json());

app.post('/chat', (req, res) => {
  try {
    const engine = require('../../core/src/sioc/resolve/decision.engine');

    if (!req.body || !req.body.raw_text) {
      return res.status(400).json({
        text: 'invalid input',
        next_step: null,
        structured: { error: true }
      });
    }

    const result = engine.run(req.body);

    if (!result || typeof result !== 'object') {
      return res.status(500).json({
        text: 'invalid engine response',
        next_step: null,
        structured: { error: true }
      });
    }

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      text: 'internal error',
      next_step: null,
      structured: { error: true }
    });
  }
});

app.get('/', (req, res) => res.send('API OK'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(API ON ));
