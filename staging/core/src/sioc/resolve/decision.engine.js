const actions = require('../actions/action.registry');
const aiEngine = require('../../services/ai.engine');
const memory = require('../../services/memory.service');

async function decisionEngine(req) {

    const sessionId = req.session_id || "default";
    let session = memory.getSession(sessionId);

    const state = session.step || "start";
    const raw = req.input?.raw_text || "";
    const structured = req.input?.structured || {};

    // MERGE DADOS
    session.data = { ...session.data, ...structured };

    let response;

    if (state === "start") {
        response = actions.iniciar_anamnese(req);
    }
    else if (state === "coletar_nome") {
        response = actions.coletar_nome(req);
    }
    else if (state === "coletar_idade") {
        response = actions.coletar_idade(req);
    }
    else if (state === "coletar_queixa") {
        response = actions.coletar_queixa(req);
    }
    else if (state === "coletar_tempo") {
        response = actions.coletar_tempo(req);
    }
    else if (state === "coletar_intensidade") {
        response = actions.finalizar(req);

        // SALVAR PACIENTE
        memory.createOrUpdatePatient(session.data);
    }
    else {
        const ai = await aiEngine({ content: raw });
        response = actions.fallback_ia(req, ai);
    }

    // ATUALIZAR ESTADO
    session.step = response.next_step;
    memory.saveSession(sessionId, session);

    return response;
}

module.exports = decisionEngine;
