const express = require('express');
const app = express();

app.use(express.json());

app.post('/chat', (req, res) => {
  // SINCLIN_FORCE_INPUT_START
  if (!req.body) req.body = {};
  if (!req.body.input) {
    req.body = { input: req.body };
  }
  // SINCLIN_FORCE_INPUT_END
  try {
    const engine = require('../../core/src/sioc/resolve/decision.engine');
const path = require('path');
// SINCLIN_WRAPPER_START
function __sinclin_safe_run(engine, body){
  try{
    if(body && body.raw_text){
      return engine.run({ input: body });
    }
    return engine.run(body);
  }catch(e){
    return {
      text: "engine_error",
      next_step: null,
      structured: { error: true, message: e.message }
    };
  }
}
// SINCLIN_WRAPPER_END

    if (!req.body || !req.body.raw_text) {
      return res.status(400).json({
        text: 'invalid input',
        next_step: null,
        structured: { error: true }
      });
    }

    const result = engine.run({ input: req.body });

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



