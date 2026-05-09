const personas = {

  doctor: {
    id: "doctor",
    priority: 10,
    tone: "clinical_operational",
    memory: true
  },

  collaborator: {
    id: "collaborator",
    priority: 7,
    tone: "operational_support",
    memory: true
  },

  patient: {
    id: "patient",
    priority: 5,
    tone: "empathetic_clinical",
    memory: true
  },

  marketing: {
    id: "marketing",
    priority: 3,
    tone: "commercial_intelligence",
    memory: true
  },

  commercial: {
    id: "commercial",
    priority: 4,
    tone: "conversion_assistant",
    memory: true
  }
};

function resolvePersona(type = "patient") {

  return (
    personas[type] ||
    personas.patient
  );
}

module.exports = {
  personas,
  resolvePersona
};
