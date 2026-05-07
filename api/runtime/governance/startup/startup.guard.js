const {
  governanceEngine
} =
require("../governance.engine");

function startupGuard() {

  return governanceEngine();
}

module.exports = {
  startupGuard
};
