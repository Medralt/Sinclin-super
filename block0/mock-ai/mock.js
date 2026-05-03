module.exports = function mockAI(payload) {
    const text = payload.input.raw.toLowerCase();

    if (text.includes("agendar")) {
        return {
            text: "Agendamento identificado. Vamos prosseguir.",
            actions: [{ type: "schedule.create" }],
            confidence: 0.9
        };
    }

    return {
        text: "Entrada recebida e processada.",
        actions: [],
        confidence: 0.7
    };
};
