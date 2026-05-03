module.exports = {

    iniciar_anamnese: (req) => ({
        text: "Vamos iniciar a anamnese. Qual o nome do paciente?",
        next_step: "coletar_nome",
        structured: {}
    }),

    coletar_nome: (req) => ({
        text: "Qual a idade do paciente?",
        next_step: "coletar_idade",
        structured: req.input.structured
    }),

    coletar_idade: (req) => ({
        text: "Qual a queixa principal?",
        next_step: "coletar_queixa",
        structured: req.input.structured
    }),

    coletar_queixa: (req) => ({
        text: "Há quanto tempo o paciente apresenta isso?",
        next_step: "coletar_tempo",
        structured: req.input.structured
    }),

    coletar_tempo: (req) => ({
        text: "Qual a intensidade da dor ou desconforto?",
        next_step: "coletar_intensidade",
        structured: req.input.structured
    }),

    finalizar: (req) => ({
        text: "Anamnese inicial concluída",
        next_step: null,
        structured: req.input.structured
    }),

    fallback_ia: (req, ai) => ({
        text: ai,
        structured: {}
    })

};
