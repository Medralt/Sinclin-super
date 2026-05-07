const agents = {

  doctor: {
    role: "clinical"
  },

  patient: {
    role: "care"
  },

  collaborator: {
    role: "operations"
  },

  marketing: {
    role: "marketing"
  },

  commercial: {
    role: "commercial"
  }
};

function resolveAgent(
  type = "patient"
) {

  return (
    agents[type] ||
    agents.patient
  );
}

module.exports = {
  agents,
  resolveAgent
};
