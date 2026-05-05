const express = require('express');
const app = express();

app.use(express.json());

app.post('/chat', (req, res) => {
  try {
    const engine = require('../../core/src/sioc/resolve/decision.engine');
    const result = engine.run(req.body || {});
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

app.get('/', (req, res) => res.send('API OK'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(API ON ));
