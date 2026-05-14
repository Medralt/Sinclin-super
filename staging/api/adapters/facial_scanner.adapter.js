/**
 * Adapter: facial_scanner
 * Recebe imagem de scanner de beleza, usa Claude Vision para extrair
 * medidas, score e comparativo com máscara de beleza, salva no prontuário.
 */

const Anthropic = require("@anthropic-ai/sdk");

const VISION_PROMPT = `Você é um analisador especializado em resultados de scanner facial estético.
Analise esta imagem de resultado de análise facial e extraia TODOS os dados visíveis.

Retorne um JSON com esta estrutura (use null para campos não encontrados na imagem):
{
  "score_geral": número (0-100) ou null,
  "simetria": número (%) ou null,
  "proporcao_aurea": número ou null,
  "medidas": { objeto com todas as medidas encontradas },
  "mascara_beleza": { "compatibilidade": número (%), "desvios": lista de desvios encontrados },
  "recomendacoes": lista de strings com recomendações visíveis,
  "app_origem": nome do app se visível ou null,
  "resumo_clinico": texto curto em português descrevendo os achados principais
}

Retorne APENAS o JSON, sem texto adicional.`;

async function process({ session_id, data, sessionMgr }) {
  const { image_base64, image_type = "image/jpeg", paciente } = data;

  if (!image_base64) {
    throw new Error("image_base64 obrigatório");
  }

  // Inicializa cliente Anthropic
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY não configurada");
  const anthropic = new Anthropic({ apiKey });

  // Extrai dados da imagem via Claude Vision
  let structured = {};
  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: image_type,
              data: image_base64,
            },
          },
          {
            type: "text",
            text: VISION_PROMPT,
          },
        ],
      }],
    });

    const raw = response.content[0].text.trim();
    // Remove markdown code blocks se presentes
    const clean = raw.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
    structured = JSON.parse(clean);
  } catch (err) {
    console.warn("[facial_scanner] vision extraction failed:", err.message);
    structured = { raw_error: err.message };
  }

  // Monta resultado final
  const result = {
    tipo: "facial_scanner",
    paciente: paciente || null,
    session_id,
    analisado_em: new Date().toISOString(),
    dados: structured,
  };

  return result;
}

module.exports = { process };
