const cors = require("cors");

const corsConfig = cors({

  origin: "*",

  methods: [
    "GET",
    "POST"
  ],

  allowedHeaders: [
    "Content-Type"
  ]
});

module.exports = corsConfig;
