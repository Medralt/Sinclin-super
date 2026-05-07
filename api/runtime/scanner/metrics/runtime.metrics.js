function runtimeMetrics() {

  return {

    uptime:
      process.uptime(),

    memory:
      process.memoryUsage(),

    pid:
      process.pid,

    timestamp:
      new Date().toISOString()
  };
}

module.exports = {
  runtimeMetrics
};
