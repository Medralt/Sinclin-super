function detect(input) {

  if (!input) return 'unknown';

  const lower = input.toLowerCase();

  if (lower.match(/\d+\s*u/)) return 'procedure_register';
  if (lower.includes('toxina')) return 'procedure_register';

  return 'unknown';
}

module.exports = { detect };
