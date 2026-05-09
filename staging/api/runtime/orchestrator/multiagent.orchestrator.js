const doctor =
require("../agents/doctor/doctor.agent");

const patient =
require("../agents/patient/patient.agent");

const collaborator =
require("../agents/collaborator/collaborator.agent");

const marketing =
require("../agents/marketing/marketing.agent");

const commercial =
require("../agents/commercial/commercial.agent");

const agents = {
  doctor,
  patient,
  collaborator,
  marketing,
  commercial
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
  resolveAgent
};
