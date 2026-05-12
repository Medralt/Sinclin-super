/**
 * SINCLIN Presence Engine
 * Camada de memória longitudinal e continuidade experiencial.
 *
 * Fluxo: Input → Presence Engine → Orchestrator → Skills → Synthesis → Response
 *
 * A memória aqui não é histórico de chat — é continuidade experiencial:
 * contexto do usuário, perfil, intenção, estado emocional, histórico de domínios.
 */

const supabase = require("./supabase.client");

const TABLE = "presence_memory";
const MAX_MESSAGES = 30;

// Cache em memória para performance
const cache = new Map();

async function _ensureTable() {
  if (!supabase) return;
  try {
    await supabase.from(TABLE).select("id").limit(1);
  } catch (e) {
    console.warn("[Presence] table check failed:", e.message);
  }
}

/**
 * Carrega ou cria memória de presença para uma session_key.
 */
async function load(sessionKey) {
  if (cache.has(sessionKey)) return cache.get(sessionKey);

  let memory = _blank(sessionKey);

  if (supabase) {
    try {
      const { data } = await supabase
        .from(TABLE)
        .select("*")
        .eq("session_key", sessionKey)
        .single();
      if (data) memory = data;
    } catch {}
  }

  cache.set(sessionKey, memory);
  return memory;
}

/**
 * Adiciona mensagem e persiste contexto atualizado.
 */
async function append(sessionKey, role, content, meta = {}) {
  const memory = await load(sessionKey);

  const msg = { role, content, ts: new Date().toISOString(), ...meta };
  const messages = [...(memory.messages || []), msg].slice(-MAX_MESSAGES);

  // Atualiza intent se fornecido
  if (meta.intent) memory.last_intent = meta.intent;
  if (meta.profile) memory.profile = meta.profile;
  if (meta.context) memory.context = { ...memory.context, ...meta.context };

  memory.messages = messages;
  memory.updated_at = new Date().toISOString();
  cache.set(sessionKey, memory);

  // Persiste async
  _persist(sessionKey, memory);

  return memory;
}

/**
 * Retorna as últimas N mensagens formatadas para o OpenAI.
 */
function getHistory(memory, n = 10) {
  return (memory.messages || [])
    .slice(-n)
    .map((m) => ({ role: m.role, content: m.content }));
}

/**
 * Constrói prefixo de contexto para injetar no system prompt.
 */
function buildContextPrefix(memory) {
  if (!memory || !memory.messages?.length) return "";

  const parts = [];
  if (memory.profile) parts.push(`Perfil do usuário: ${memory.profile}.`);
  if (memory.last_intent) parts.push(`Última intenção detectada: ${memory.last_intent}.`);
  if (memory.context?.clinic_size) parts.push(`Tamanho da clínica: ${memory.context.clinic_size}.`);
  if (memory.context?.specialty) parts.push(`Especialidade: ${memory.context.specialty}.`);

  if (!parts.length) return "";
  return `\n\n[Contexto do usuário: ${parts.join(" ")}]\n`;
}

async function _persist(sessionKey, memory) {
  if (!supabase) return;
  try {
    await supabase.from(TABLE).upsert(
      {
        session_key: sessionKey,
        profile: memory.profile || null,
        context: memory.context || {},
        messages: memory.messages || [],
        last_intent: memory.last_intent || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "session_key" }
    );
  } catch (e) {
    console.warn("[Presence] persist failed:", e.message);
  }
}

function _blank(sessionKey) {
  return {
    session_key: sessionKey,
    profile: null,
    context: {},
    messages: [],
    last_intent: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// Garante tabela na inicialização
_ensureTable();

module.exports = { load, append, getHistory, buildContextPrefix };
