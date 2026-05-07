function presenceAnalysis(
  sessions = {}
) {

  const active =
    Object.keys(sessions).length;

  return {

    activeSessions:
      active,

    operational:
      active >= 0,

    timestamp:
      new Date().toISOString()
  };
}

module.exports = {
  presenceAnalysis
};
