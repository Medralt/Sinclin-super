const express = require('express');
const app = express();

app.use(express.json());

app.post('/chat', (req, res) => {
  try {
    const engine = require('../../core/src/sioc/resolve/decision.engine');

    const payload = {
      input: {
        raw_text: (req.body && req.body.raw_text) ? req.body.raw_text : ""
      }
    };

    const result = engine.run(payload);

    return res.json(result);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      text: 'internal_error',
      next_step: null,
      structured: { error: true }
    });
  }
});

app.get('/', (req, res) => res.send('API OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('SINCLIN RUNNING ON', PORT);
});
