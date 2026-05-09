function operationalPresence(
  context = {}
) {

  return {

    active: true,

    contextual: true,

    adaptive: true,

    persona:
      context.persona || "patient",

    timestamp:
      new Date().toISOString()
  };
}

module.exports = {
  operationalPresence
};
