function recoveryLayer() {

  return {

    autorecovery: true,

    crashRecovery: true,

    scannerRecovery: true,

    timestamp:
      new Date().toISOString()
  };
}

module.exports = {
  recoveryLayer
};
