const {
  resolvePersona
} =
require("../personas/persona.engine");

function routeVoice(input = {}) {

  const type =
    input.persona ||
    "patient";

  const persona =
    resolvePersona(type);

  return {
    persona,
    route: persona.id
  };
}

module.exports = {
  routeVoice
};
