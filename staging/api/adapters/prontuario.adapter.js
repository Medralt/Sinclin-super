async function process({ session_id, data, sessionMgr }) {
  return { tipo: "prontuario", status: "registrado", ts: new Date().toISOString() };
}
module.exports = { process };
