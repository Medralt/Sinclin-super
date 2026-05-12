//////////////////////////////
// SINCLIN VOICE HARDEN
//////////////////////////////

let lastResponse = "";
let waitingForSpeech = false;

// ==========================
// GUARDAR ESTADO
// ==========================
function handleResponse(data) {

  if (!data || !data.text) return;

  lastResponse = data.text;

  speakAndContinue(data.text);
}

// ==========================
// BLOQUEAR SOBREPOSIÇÃO
// ==========================
function speakAndContinue(text) {

  if (waitingForSpeech) return;

  waitingForSpeech = true;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";

  utterance.onend = () => {
    waitingForSpeech = false;

    setTimeout(() => {
      startSinclinVoiceContinuous();
    }, 300);
  };

  speechSynthesis.speak(utterance);
}

// ==========================
// FILTRO DE INPUT VAZIO
// ==========================
function isValidInput(text) {
  return text && text.trim().length > 1;
}
