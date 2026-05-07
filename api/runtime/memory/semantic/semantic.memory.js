function semanticIndex(
  text = ""
) {

  return {

    keywords:
      text
        .toLowerCase()
        .split(" ")
        .filter(Boolean),

    timestamp:
      new Date().toISOString()
  };
}

module.exports = {
  semanticIndex
};
