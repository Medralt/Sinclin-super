//////////////////////////////
// SINCLIN CLINICAL FULL
//////////////////////////////

const API_URL = "https://api.sinclin.net/chat";

// ==========================
// STATE
// ==========================
let sessionId = "session-" + Date.now();
let history = [];

// ==========================
// UI
// ==========================
const chat = document.createElement('div');
chat.id = "sinclin-chat";
chat.style.padding = "20px";
document.body.appendChild(chat);

function addMessage(text, type) {

  const msg = document.createElement('div');
  msg.innerText = text;

  msg.style.margin = "10px";
  msg.style.padding = "10px";
  msg.style.borderRadius = "10px";

  if (type === "user") {
    msg.style.background = "#d1e7ff";
    msg.style.textAlign = "right";
  } else {
    msg.style.background = "#f1f1f1";
  }

  chat.appendChild(msg);

  history.push({ type, text });
}

// ==========================
// SAVE LOCAL (PRONTUÁRIO SIMPLES)
// ==========================
function saveSession() {
  localStorage.setItem("sinclin_" + sessionId, JSON.stringify(history));
}

// ==========================
// LOAD SESSION
// ==========================
function loadSession() {

  const data = localStorage.getItem("sinclin_" + sessionId);

  if (!data) return;

  history = JSON.parse(data);

  history.forEach(m => addMessage(m.text, m.type));
}

// ==========================
// SPEECH
// ==========================
function speak(text, callback) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "pt-BR";
  utter.onend = callback;
  speechSynthesis.speak(utter);
}

// ==========================
// REQUEST
// ==========================
async function send(text) {

  addMessage(text, "user");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      id: sessionId,
      raw_text: text
    })
  });

  const data = await res.json();

  addMessage(data.text, "bot");

  saveSession();

  speak(data.text, () => {
    startListening();
  });
}

// ==========================
// VOICE LOOP
// ==========================
function startListening() {

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;

  const rec = new SR();
  rec.lang = "pt-BR";

  rec.onresult = (e) => {
    const text = e.results[0][0].transcript;
    send(text);
  };

  rec.onerror = () => {
    setTimeout(startListening, 1000);
  };

  rec.start();
}

// ==========================
// START
// ==========================
window.onload = () => {
  loadSession();
  startListening();
};
