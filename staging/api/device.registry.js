const CATALOG = [
  { type: "diagnostico", label: "Aparelho de diagnostico", env_flag: "SIOC_DIAGNOSTICO_ENABLED", adapter: "./adapters/diagnostico.adapter" },
  { type: "camera",      label: "Camera / Luz de Wood",    env_flag: "SIOC_CAMERA_ENABLED",      adapter: "./adapters/camera.adapter"      },
  { type: "pagamento",   label: "Maquininha de cobranca",  env_flag: "SIOC_PAGAMENTO_ENABLED",   adapter: "./adapters/pagamento.adapter"   },
  { type: "prontuario",  label: "Prontuario HIS/FHIR",     env_flag: "SIOC_PRONTUARIO_ENABLED",  adapter: "./adapters/prontuario.adapter"  },
  { type: "iot",         label: "Sensores / Wearables",    env_flag: "SIOC_IOT_ENABLED",         adapter: "./adapters/iot.adapter"         }
];
const registry = new Map();
function load() {
  let on = 0, off = 0;
  for (const d of CATALOG) {
    if (!process.env[d.env_flag]) { console.log("[REGISTRY] " + d.type + " desativado"); off++; continue; }
    try { registry.set(d.type, { ...d, adapter: require(d.adapter) }); console.log("[REGISTRY] " + d.type + " OK"); on++; }
    catch (e) { console.warn("[REGISTRY] " + d.type + " falhou:", e.message); }
  }
  console.log("[REGISTRY] " + on + " ativo(s), " + off + " desativado(s)");
}
function get(type) { return registry.get(type) || null; }
function isActive(type) { return registry.has(type); }
function list() { return CATALOG.map(d => ({ type: d.type, label: d.label, active: registry.has(d.type) })); }
module.exports = { load, get, isActive, list };
