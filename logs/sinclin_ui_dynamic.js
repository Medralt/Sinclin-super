//////////////////////////////
// SINCLIN UI DINÂMICA CORE
//////////////////////////////

const API_URL = "https://api.sinclin.net/chat";

// ==========================
// STATE
// ==========================
let sessionId = "session-" + Date.now();

// ==========================
// UI BASE (NÃO QUEBRA VISUAL)
// ==========================
const container = document.createElement('div');
container.id = "sinclin-container";
container.style.padding = "20px";
document.body.appendChild(container);

// ==========================
// RENDER MESSAGE
// ==========================
function renderText(text, type="bot") {

  const msg = document.createElement('div');
  msg.innerText = text;

  msg.style.margin = "10px";
  msg.style.padding = "12px";
  msg.style.borderRadius = "12px";
  msg.style.maxWidth = "70%";

  if (type === "user") {
    msg.style.background = "#d1e7ff";
    msg.style.marginLeft = "auto";
    msg.style.textAlign = "right";
  } else {
    msg.style.background = "#f1f1f1";
  }

  container.appendChild(msg);
}

// ==========================
// RENDER INPUT DINÂMICO
// ==========================
function renderInput(type="text", placeholder="Digite...") {

  const input = document.createElement("input");
  input.type = type;
  input.placeholder = placeholder;

  input.style.width = "100%";
  input.style.padding = "10px";
  input.style.marginTop = "10px";

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      send(input.value);
      input.remove();
    }
  });

  container.appendChild(input);
  input.focus();
}

// ==========================
// VOICE (OPCIONAL)
// ==========================
function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "pt-BR";
  speechSynthesis.speak(u);
}

// ==========================
// CORE SEND
// ==========================
async function send(text) {

  if (!text) return;

  renderText(text, "user");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      id: sessionId,
      raw_text: text
    })
  });

  const data = await res.json();

  handleResponse(data);
}

// ==========================
// HANDLE RESPONSE DINÂMICO
// ==========================
function handleResponse(data) {

  // fallback compatível
  if (!data) return;

  // TEXTO
  if (data.text) {
    renderText(data.text, "bot");
    speak(data.text);
  }

  // ======================
  // NOVA CAMADA DINÂMICA
  // ======================
  if (data.ui) {

    const ui = data.ui;

    // INPUT DINÂMICO
    if (ui.input === "number") {
      renderInput("number", ui.label || "Digite número");
    }

    else if (ui.input === "text") {
      renderInput("text", ui.label || "Digite...");
    }

    else if (ui.input === "none") {
      // não renderiza nada
    }

  } else {

    // fallback antigo (garante compatibilidade total)
    renderInput("text", "Digite...");
  }
}

// ==========================
// START
// ==========================
window.onload = () => {

  renderText("Sistema SINCLIN iniciado");

  renderInput();
};
