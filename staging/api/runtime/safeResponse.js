function safeResponse(data = {}) {

  return {

    text:
      data.text || "",

    next_step:
      data.next_step || null,

    structured:
      data.structured || {},

    runtime: {
      ok: true,
      timestamp:
        new Date().toISOString()
    }
  };
}

module.exports = {
  safeResponse
};
