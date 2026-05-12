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
 * Inclui dimensão emocional e relacional — não só dados funcionais.
 */
function buildContextPrefix(memory) {
  if (!memory || !memory.messages?.length) return "";

  const parts = [];

  // Perfil relacional
  if (memory.profile) parts.push(`Perfil: ${memory.profile}.`);

  // Histórico contextual
  const msgCount = memory.messages.length;
  if (msgCount > 1) parts.push(`Este usuário já teve ${msgCount} trocas com o SINCLIN — mantenha continuidade.`);

  // Contexto clínico / organizacional
  if (memory.context?.clinic_size) parts.push(`Clínica com ${memory.context.clinic_size} profissionais.`);
  if (memory.context?.specialty) parts.push(`Especialidade: ${memory.context.specialty}.`);

  // Estado emocional detectado
  if (memory.context?.emotional_state) parts.push(`Estado emocional percebido: ${memory.context.emotional_state}.`);

  // Última intenção
  if (memory.last_intent) parts.push(`Última intenção: ${memory.last_intent}.`);

  // Tópicos já discutidos — evita repetição
  if (memory.context?.topics_covered?.length) {
    parts.push(`Tópicos já abordados: ${memory.context.topics_covered.join(", ")}.`);
  }

  if (!parts.length) return "";
  return `\n\n[Contexto relacional — preserve continuidade: ${parts.join(" ")}]\n`;
}

/**
 * Detecta contexto emocional e intenção a partir da mensagem do usuário.
 * Heurística leve — não requer chamada de IA extra.
 */
function detectContext(text) {
  const t = text.toLowerCase();
  const context = {};

  // Estado emocional
  if (/dor|incômodo|desconfort|ruim|pior|preocup/.test(t)) context.emotional_state = "ansioso/desconfortável";
  else if (/bem|melhor|ótimo|bom|tranquil/.test(t)) context.emotional_state = "positivo/tranquilo";

  // Intenção
  let intent = null;
  if (/agenda|consulta|marcação|horário/.test(t)) intent = "agendamento";
  else if (/financeiro|caixa|pagar|receber/.test(t)) intent = "financeiro";
  else if (/paciente|anamnese|prontuário/.test(t)) intent = "clínico";
  else if (/equipe|colaborador|usuário/.test(t)) intent = "administrativo";
  else if (/conhecer|saber|como funciona|mostrar/.test(t)) intent = "descoberta";

  return { context, intent };
}

module.exports.detectContext = detectContext;

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
