const {
  validateStructure
} =
require("../runtime/validation/structure.validation");

console.log(
  JSON.stringify(
    validateStructure(),
    null,
    2
  )
);
