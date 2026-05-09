const fs =
require("fs");

function validateContracts() {

  return {

    valid:
      fs.existsSync(
        process.cwd() +
        "/runtime/contracts/runtime.contract.js"
      )
  };
}

module.exports = {
  validateContracts
};
