function recoveryStatus() {

  return {

    recovery: true,

    autorestart: true,

    crashHandling: true,

    scannerRecovery: true,

    timestamp:
      new Date().toISOString()
  };
}

module.exports = {
  recoveryStatus
};
