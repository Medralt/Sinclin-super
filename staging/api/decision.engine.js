/*
 * SIOC Decision Engine — stateless.
 * O estado (step, data) vem do session.manager; nenhum estado interno.
 * run({ session_id, input, current_step, current_data }) → { text, next_step, structured }
 */

function run({ session_id, input, current_step, current_data }) {
  try {
    if (!session_id) return { text: "session_id obrigatorio.", next_step: "error", structured: {} };
    const step = current_step || "start";
    const data = current_data || { paciente: {}, anamnese: {} };
    const t = (input && input.raw_text) ? input.raw_text.trim() : "";
    let r = "";
    let next = step;

    switch (step) {
      case "start":
        next = "coletar_id";
        r = "Vamos iniciar a anamnese. Informe o identificador do paciente (CPF ou ID):";
        break;
      case "coletar_id":
        if (!t) { r = "Por favor, informe o identificador:"; break; }
        data.paciente.id = t; next = "coletar_nome"; r = "Qual o nome do paciente?";
        break;
      case "coletar_nome":
        if (!t) { r = "Por favor, informe o nome:"; break; }
        data.paciente.nome = t; next = "coletar_idade"; r = "Qual a idade?";
        break;
      case "coletar_idade":
        if (!t) { r = "Por favor, informe a idade:"; break; }
        data.paciente.idade = t; next = "coletar_queixa"; r = "Qual a principal queixa?";
        break;
      case "coletar_queixa":
        if (!t) { r = "Por favor, descreva a queixa:"; break; }
        data.anamnese.queixa = t; next = "coletar_intensidade"; r = "Intensidade de 0 a 10?";
        break;
      case "coletar_intensidade": {
        if (!t) { r = "Informe de 0 a 10:"; break; }
        const n = parseInt(t, 10);
        if (isNaN(n) || n < 0 || n > 10) { r = "Número entre 0 e 10:"; break; }
        data.anamnese.intensidade = n;
        next = "finalizado";
        r = `Anamnese finalizada. ${data.paciente.nome || "Paciente"}: ${data.anamnese.queixa} (${n}/10).`;
        break;
      }
      case "finalizado":
        r = "Anamnese já concluída para este paciente.";
        break;
      default:
        next = "start"; r = "Reiniciando anamnese.";
    }
    return { text: r, next_step: next, structured: data };
  } catch (e) {
    console.error("[SIOC_ENGINE_ERROR]", e.message);
    return { text: "Erro interno no engine SIOC.", next_step: "error", structured: {} };
  }
}

module.exports = { run };
