function validateEnv() {

  const required = [
    "NODE_ENV"
  ];

  const missing =
    required.filter(
      k => !process.env[k]
    );

  return {

    valid:
      missing.length === 0,

    missing
  };
}

module.exports = {
  validateEnv
};
