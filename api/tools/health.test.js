const http = require("http");

http.get(
  "http://localhost:3000/health",
  (res) => {

    console.log(
      "[SINCLIN_HEALTH]",
      res.statusCode
    );
  }
);
