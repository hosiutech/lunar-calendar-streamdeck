const { text, fitTextSize } = require('./text-svg.cjs');

function renderSolarTerm(term, besideZodiac, color, font) {
  const x = besideZodiac ? 365 : 256;
  const width = besideZodiac ? 234 : 460;
  const [first, ...rest] = term.split(' ');
  if (!rest.length) {
    return text(first, x, 124, besideZodiac ? 72 : 104, color, width, font);
  }

  const second = rest.join(' ');
  const limit = besideZodiac ? 44 : 67;
  const size = Math.min(fitTextSize(first, limit, width), fitTextSize(second, limit, width));
  const baselines = besideZodiac ? [84, 128] : [79, 145];
  return [first, second].map((line, i) => text(line, x, baselines[i], size, color, width, font)).join('');
}

module.exports = { renderSolarTerm };
