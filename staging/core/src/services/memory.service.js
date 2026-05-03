const fs = require('fs');
const path = require('path');

const base = path.resolve(__dirname, '../../memory');
const patientsFile = path.join(base, 'patients.json');
const sessionsFile = path.join(base, 'sessions.json');

function read(file) {
    return JSON.parse(fs.readFileSync(file));
}

function write(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function createOrUpdatePatient(data) {
    const patients = read(patientsFile);

    let patient = patients.find(p => p.nome === data.nome);

    if (!patient) {
        patient = { id: Date.now(), ...data };
        patients.push(patient);
    } else {
        Object.assign(patient, data);
    }

    write(patientsFile, patients);
    return patient;
}

function saveSession(sessionId, data) {
    const sessions = read(sessionsFile);
    sessions[sessionId] = data;
    write(sessionsFile, sessions);
}

function getSession(sessionId) {
    const sessions = read(sessionsFile);
    return sessions[sessionId] || {};
}

module.exports = {
    createOrUpdatePatient,
    saveSession,
    getSession
};
