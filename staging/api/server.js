console.log('=== SINCLIN BOOT START ===');
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT_EXCEPTION:', err.stack);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED_REJECTION:', err);
});
const express = require('express');
const app = express();

app.use(express.json());


console.log('=== SINCLIN BOOT ===');

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT_EXCEPTION:', err.stack);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED_REJECTION:', err);
});

app.post('/chat', (req, res) => {
  try {

    console.log('REQ:', JSON.stringify(req.body));

    const path = require('path');
    const engine = require(path.join(__dirname, '../../core/src/sioc/resolve/decision.engine'));

    let payload = req.body || {};

    if (!payload.input) payload = { input: payload };
    if (!payload.input.raw_text) payload.input.raw_text = "";

    const result = engine.run(payload);

    console.log('RESULT:', JSON.stringify(result));

    return res.status(200).json(result);

  } catch (err) {

    console.error('ROUTE_ERROR:', err.stack);

    return res.status(200).json({
      text: 'SINCLIN_CAPTURE',
      next_step: null,
      structured: {
        error: true,
        message: err.message,
        stack: err.stack
      }
    });
  }
});

});
  }
});
    }

    return return res.json(result); ('API OK'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(API ON ));











