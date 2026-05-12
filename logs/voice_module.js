//////////////////////////////
// SINCLIN VOICE MODULE
//////////////////////////////

const API_URL = "https://api.sinclin.net/chat";

// ==========================
// SPEECH TO TEXT
// ==========================
function startListening(sessionId) {

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("SpeechRecognition não suportado");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'pt-BR';

  recognition.onresult = async (event) => {
    const text = event.results[0][0].transcript;

    console.log("USER:", text);

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

    console.log("BOT:", data.text);

    speak(data.text);
  };

  recognition.start();
}

// ==========================
// TEXT TO SPEECH
// ==========================
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  speechSynthesis.speak(utterance);
}

// ==========================
// AUTO START (OPCIONAL)
// ==========================
function startSinclinVoice() {
  const sessionId = "voice-session-" + Date.now();

  document.getElementById("sinclin-voice-btn")
    .addEventListener("click", () => {
      startListening(sessionId);
    });
}
