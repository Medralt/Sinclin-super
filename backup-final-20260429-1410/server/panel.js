const express = require('express');
const { resolve } = require('../actions/actions');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('SINCLIN CORE STABLE V1');
});

app.post('/sinclin', async (req, res) => {

  const input = req.body.input || '';

  const action = resolve(input);
  const result = await action.execute();

  res.json(result);
});

app.listen(process.env.PORT || 10000);
