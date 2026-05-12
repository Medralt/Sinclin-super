//////////////////////////////
// SINCLIN VOICE CONTINUOUS
//////////////////////////////

const API_URL = "https://api.sinclin.net/chat";

let sessionId = "voice-" + Date.now();
let isListening = false;

// ==========================
// START LOOP
// ==========================
function startSinclinVoiceContinuous() {

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("SpeechRecognition não suportado");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    isListening = true;
    console.log("?? ESCUTANDO...");
  };

  recognition.onend = () => {
    isListening = false;
    console.log("?? PAROU");
  };

  recognition.onresult = async (event) => {

    const text = event.results[0][0].transcript;

    console.log("?? USER:", text);

    try {

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: sessionId,
          raw_text: text
        })
      });

      const data = await response.json();

      console.log("?? BOT:", data.text);

      speakAndContinue(data.text);

    } catch (err) {
      console.error("API ERROR", err);
      restartListening(recognition);
    }
  };

  recognition.onerror = (err) => {
    console.error("?? ERROR:", err);
    restartListening(recognition);
  };

  recognition.start();
}

// ==========================
// SPEAK + LOOP
// ==========================
function speakAndContinue(text) {

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";

  utterance.onend = () => {
    console.log("?? RETOMANDO ESCUTA...");
    startSinclinVoiceContinuous();
  };

  speechSynthesis.speak(utterance);
}

// ==========================
// FAIL SAFE
// ==========================
function restartListening(recognition) {
  setTimeout(() => {
    try {
      recognition.start();
    } catch(e) {
      startSinclinVoiceContinuous();
    }
  }, 1000);
}

// ==========================
// AUTO START
// ==========================
window.addEventListener("load", () => {
  startSinclinVoiceContinuous();
});
