const sessions = new Map();
const TTL = 4 * 60 * 60 * 1000;
function create(id) {
  const s = { id, created_at: Date.now(), updated_at: Date.now(),
              paciente: {}, anamnese: {}, devices: {}, events: [], sioc_step: "start", meta: {} };
  sessions.set(id, s); return s;
}
function get(id) {
  const s = sessions.get(id);
  if (!s) return null;
  if (Date.now() - s.updated_at > TTL) { sessions.delete(id); return null; }
  return s;
}
function getOrCreate(id) { return get(id) || create(id); }
function update(id, patch) {
  const s = get(id); if (!s) return null;
  Object.assign(s, patch, { updated_at: Date.now() }); return s;
}
function pushEvent(id, ev) {
  const s = get(id); if (!s) return;
  s.events.push({ ts: Date.now(), ...ev }); s.updated_at = Date.now();
}
function setDeviceData(id, type, data) {
  const s = get(id); if (!s) return null;
  s.devices[type] = { ...data, captured_at: Date.now() };
  s.updated_at = Date.now();
  pushEvent(id, { type: "device_data", device: type });
  return s;
}
function clear(id) { sessions.delete(id); }
function stats() { return { active_sessions: sessions.size }; }
module.exports = { create, get, getOrCreate, update, pushEvent, setDeviceData, clear, stats };
