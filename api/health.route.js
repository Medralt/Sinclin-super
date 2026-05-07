const express = require("express");

const router = express.Router();

const {
  healthcheck
} = require(
  "../runtime/health/health"
);

router.get(
  "/health",
  (req, res) => {

    res.json(
      healthcheck()
    );
  }
);

module.exports = router;
