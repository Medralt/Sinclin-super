function parse(input) {

  const lower = input.toLowerCase();

  let dose = null;
  let area = null;
  let substance = null;

  const doseMatch = lower.match(/(\d+)\s*u/);
  if (doseMatch) dose = parseInt(doseMatch[1]);

  if (lower.includes('glabela')) area = 'glabela';
  if (lower.includes('testa')) area = 'testa';

  if (lower.includes('toxina') || lower.includes('botox')) {
    substance = 'toxina';
  }

  return { dose, area, substance };
}

module.exports = { parse };
