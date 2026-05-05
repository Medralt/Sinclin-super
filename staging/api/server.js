const express = require('express');
const app = express();

app.use(express.json());

app.post('/chat', (req, res) => {
  return res.status(200).json({
    text: 'SINCLIN_OK_DIRECT',
    next_step: 'test',
    structured: { ok: true }
  });
});
  }
});
    }

    return return res.json(result); // SINCLIN_SAFE_RETURN

  } catch (err) {
    return res.status(200).json({
      text: 'engine_safe_fallback',
      next_step: null,
      structured: { error: true, message: err.message }
    });
  }
});


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

    return res.json(result); // SINCLIN_SAFE_RETURN

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









