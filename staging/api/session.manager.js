const supabase = require("./supabase.client");

const sessions = new Map();
const TTL = 4 * 60 * 60 * 1000;
const TABLE = "sioc_sessions";

// ── Supabase helpers (non-blocking) ──────────────────────────────────────────

async function dbUpsert(session) {
  if (!supabase) return;
  try {
    await supabase.from(TABLE).upsert({
      id: session.id,
      sioc_step: session.sioc_step,
      paciente: session.paciente,
      anamnese: session.anamnese,
      devices: session.devices,
      events: session.events,
      meta: session.meta,
      updated_at: new Date(session.updated_at).toISOString(),
      created_at: new Date(session.created_at).toISOString(),
    }, { onConflict: "id" });
  } catch (e) {
    console.warn("[session.manager] upsert falhou:", e.message);
  }
}

async function dbLoad(id) {
  if (!supabase) return null;
  try {
    const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
    if (!data) return null;
    return {
      id: data.id,
      created_at: new Date(data.created_at).getTime(),
      updated_at: new Date(data.updated_at).getTime(),
      sioc_step: data.sioc_step || "start",
      paciente: data.paciente || {},
      anamnese: data.anamnese || {},
      devices: data.devices || {},
      events: data.events || [],
      meta: data.meta || {},
    };
  } catch (e) {
    console.warn("[session.manager] dbLoad falhou:", e.message);
    return null;
  }
}

// ── Core API ─────────────────────────────────────────────────────────────────

function create(id) {
  const s = {
    id,
    created_at: Date.now(),
    updated_at: Date.now(),
    sioc_step: "start",
    paciente: {},
    anamnese: {},
    devices: {},
    events: [],
    meta: {},
  };
  sessions.set(id, s);
  dbUpsert(s);
  return s;
}

async function get(id) {
  const s = sessions.get(id);
  if (s) {
    if (Date.now() - s.updated_at > TTL) { sessions.delete(id); return null; }
    return s;
  }
  const fromDb = await dbLoad(id);
  if (!fromDb) return null;
  if (Date.now() - fromDb.updated_at > TTL) return null;
  sessions.set(id, fromDb);
  return fromDb;
}

async function getOrCreate(id) {
  return (await get(id)) || create(id);
}

async function update(id, patch) {
  const s = await get(id);
  if (!s) return null;
  Object.assign(s, patch, { updated_at: Date.now() });
  dbUpsert(s);
  return s;
}

async function pushEvent(id, ev) {
  const s = await get(id);
  if (!s) return;
  s.events.push({ ts: Date.now(), ...ev });
  s.updated_at = Date.now();
  dbUpsert(s);
}

async function setDeviceData(id, type, data) {
  const s = await get(id);
  if (!s) return null;
  s.devices[type] = { ...data, captured_at: Date.now() };
  s.updated_at = Date.now();
  pushEvent(id, { type: "device_data", device: type });
  dbUpsert(s);
  return s;
}

function clear(id) {
  sessions.delete(id);
  if (supabase) supabase.from(TABLE).delete().eq("id", id).then(() => {}).catch(() => {});
}

function stats() { return { active_sessions: sessions.size }; }

module.exports = { create, get, getOrCreate, update, pushEvent, setDeviceData, clear, stats };
