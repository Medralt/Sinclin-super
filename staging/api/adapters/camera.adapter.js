async function process({ session_id, data, sessionMgr }) {
  if (!data || !data.frame) throw new Error("data.frame obrigatorio");
  return { tipo: "camera", subtipo: data.tipo || "foto", frame_size: data.frame.length, captured_at: new Date().toISOString() };
}
module.exports = { process };
