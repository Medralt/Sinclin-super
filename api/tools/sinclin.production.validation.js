const {
  productionPipeline
} =
require("../runtime/production/production.pipeline");

console.log(
  JSON.stringify(
    productionPipeline(),
    null,
    2
  )
);
