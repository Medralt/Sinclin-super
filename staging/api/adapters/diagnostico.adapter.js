async function process({ session_id, data, sessionMgr }) {
  if (!data || !data.resultado) throw new Error("data.resultado obrigatorio");
  return { tipo: "diagnostico", resultado: data.resultado, unidade: data.unidade || null };
}
module.exports = { process };
