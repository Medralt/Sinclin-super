const interpreter = require('./interpreter/voice.interpreter');
const callAPI = require('./client/api.client');

let sessionId = "voice-session";

async function run(input) {

    const structured = interpreter(input);

    const payload = {
        session_id: sessionId,
        input: {
            raw_text: input,
            structured: structured
        }
    };

    const res = await callAPI(payload);

    console.log("\\n>>>", res.text);
    console.log("NEXT:", res.next_step);
}

module.exports = run;
