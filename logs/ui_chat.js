//////////////////////////////
// SINCLIN CHAT UI
//////////////////////////////

const chat = document.createElement('div');
chat.id = "sinclin-chat";
chat.style.padding = "20px";
document.body.appendChild(chat);

// ==========================
// ADD MESSAGE
// ==========================
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
}

// ==========================
// INTEGRAR COM VOZ
// ==========================
function handleResponse(data) {

  addMessage(data.text, "bot");

  speakAndContinue(data.text);
}
