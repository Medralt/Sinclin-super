function extract(text) {

    const out = {
        nome: null,
        idade: null,
        queixa: null,
        tempo: null
    };

    const nameMatch = text.match(/paciente\s+([A-Za-z]+)/i);
    if (nameMatch) out.nome = nameMatch[1];

    const ageMatch = text.match(/(\d+)\s*anos/);
    if (ageMatch) out.idade = parseInt(ageMatch[1]);

    if (text.toLowerCase().includes("dor")) {
        out.queixa = "dor";
    }

    const timeMatch = text.match(/(\d+)\s*dias/);
    if (timeMatch) out.tempo = timeMatch[1] + " dias";

    return out;
}

module.exports = extract;
