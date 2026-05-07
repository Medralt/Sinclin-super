const {
  governanceEngine
} =
require("../runtime/governance/governance.engine");

console.log(
  JSON.stringify(
    governanceEngine(),
    null,
    2
  )
);
