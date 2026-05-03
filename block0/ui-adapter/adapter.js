module.exports = function uiAdapter(input) {
    return {
        meta: {
            request_id: require('uuid').v4(),
            timestamp: new Date().toISOString(),
            source: "UI"
        },
        input: {
            type: "text",
            raw: input
        },
        intent: {
            primary: "unknown",
            confidence: 0.5
        }
    };
};
