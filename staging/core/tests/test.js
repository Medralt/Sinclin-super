const decisionEngine = require('../src/sioc/resolve/decision.engine');

(async () => {
    const res = await decisionEngine({
        input: { raw_text: "iniciar anamnese" }
    });

    console.log(res);
})();
