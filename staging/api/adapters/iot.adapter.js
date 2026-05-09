async function process({ session_id, data, sessionMgr }) {
  if (!data || !data.sensor) throw new Error("data.sensor obrigatorio");
  return { tipo: "iot", sensor: data.sensor, valor: data.valor, unidade: data.unidade || null };
}
module.exports = { process };
