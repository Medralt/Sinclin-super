function timeoutGuard(req, res, next) {

  req.setTimeout(
    30000
  );

  res.setTimeout(
    30000
  );

  next();
}

module.exports = timeoutGuard;
