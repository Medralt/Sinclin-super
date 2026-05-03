const axios = require('axios');

(async () => {
    try {
        const res = await axios.post('http://localhost:3000/input', {
            input: "quero agendar um procedimento"
        });

        console.log("TESTE OK:", res.data);
    } catch (err) {
        console.error("TESTE FALHOU:", err.message);
    }
})();
