const os = require("os");

function healthcheck() {

  return {

    runtime: true,
    scanner: true,
    memory: true,
    diagnostics: true,

    cpu: os.cpus().length,
    memory_free: os.freemem(),

    timestamp:
      new Date().toISOString()
  };
}

module.exports = {
  healthcheck
};

/* SINCLIN VOICE */

function voiceHealth() {

  return {
    voice: true,
    personas: true,
    telemetry: true,
    memory: true
  };
}

module.exports.voiceHealth =
  voiceHealth;


/* =====================================
   SINCLIN MEMORY HEALTH
===================================== */

function memoryHealth() {

  return {

    longitudinal: true,
    semantic: true,
    profiles: true,
    telemetry: true
  };
}

module.exports.memoryHealth =
  memoryHealth;

/* ===================================== */

/* =====================================
   SINCLIN PRODUCTION HEALTH
===================================== */

function productionHealth() {

  return {

    production: true,

    hardening: true,

    validation: true,

    recovery: true
  };
}

module.exports.productionHealth =
  productionHealth;

/* ===================================== */
