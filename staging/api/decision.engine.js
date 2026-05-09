const sessions = {};
function run(p) {
  try {
    const id = p.session_id;
    if (!id) return { text: "session_id obrigatorio.", next_step: "error", structured: {} };
    if (!sessions[id]) sessions[id] = { step: "start", data: { paciente: {}, anamnese: {} } };
    const s = sessions[id];
    const t = (p.input && p.input.raw_text) ? p.input.raw_text.trim() : "";
    let r = "";
    switch (s.step) {
      case "start":
        s.step = "coletar_id";
        r = "Vamos iniciar a anamnese. Informe o identificador do paciente (CPF ou ID):";
        break;
      case "coletar_id":
        if (!t) { r = "Por favor, informe o identificador:"; break; }
        s.data.paciente.id = t; s.step = "coletar_nome"; r = "Qual o nome do paciente?";
        break;
      case "coletar_nome":
        if (!t) { r = "Por favor, informe o nome:"; break; }
        s.data.paciente.nome = t; s.step = "coletar_idade"; r = "Qual a idade?";
        break;
      case "coletar_idade":
        if (!t) { r = "Por favor, informe a idade:"; break; }
        s.data.paciente.idade = t; s.step = "coletar_queixa"; r = "Qual a principal queixa?";
        break;
      case "coletar_queixa":
        if (!t) { r = "Por favor, descreva a queixa:"; break; }
        s.data.anamnese.queixa = t; s.step = "coletar_intensidade"; r = "Intensidade de 0 a 10?";
        break;
      case "coletar_intensidade": {
        if (!t) { r = "Informe de 0 a 10:"; break; }
        const n = parseInt(t, 10);
        if (isNaN(n) || n < 0 || n > 10) { r = "Numero entre 0 e 10:"; break; }
        s.data.anamnese.intensidade = n;
        s.step = "finalizado";
        r = "Anamnese finalizada. " + (s.data.paciente.nome || "Paciente") + " — " + s.data.anamnese.queixa + " (" + n + "/10).";
        break;
      }
      case "finalizado":
        r = "Anamnese ja concluida para este paciente.";
        break;
      default:
        s.step = "start"; r = "Reiniciando anamnese.";
    }
    return { text: r, next_step: s.step, structured: s.data };
  } catch (e) {
    console.error("[SIOC_ENGINE_ERROR]", e.message);
    return { text: "Erro interno no engine SIOC.", next_step: "error", structured: {} };
  }
}
function getSession(id) { return sessions[id] || null; }
function clearSession(id) { delete sessions[id]; }
module.exports = { run, getSession, clearSession };
