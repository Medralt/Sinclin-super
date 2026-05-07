function validateChatRequest(
  req,
  res,
  next
) {

  const body = req.body;

  if (
    !body ||
    !body.raw_text
  ) {

    return res.status(400)
      .json({
        error:
          "invalid_request"
      });
  }

  next();
}

module.exports =
  validateChatRequest;
