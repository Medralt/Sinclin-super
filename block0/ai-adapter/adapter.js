module.exports = function aiAdapter(payload, mockAI) {
    const response = mockAI(payload);

    return {
        response: response.text,
        actions: response.actions,
        confidence: response.confidence
    };
};
