function fitTextSize(label, size, width) {
  const units = Array.from(label).reduce((sum, char) => sum +
    (char.codePointAt(0) > 255 ? 1 : char === ' ' ? 0.35 : 0.7), 0);
  return Math.min(size, Math.floor(width / Math.max(1, units)));
}

function text(label, x, y, size, color, width, family) {
  const fit = fitTextSize(label, size, width);
  const safe = label.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  // Keep Chinese glyphs visibly bold even when Windows substitutes a regular-weight font.
  const cjkStroke = /[\u3400-\u9fff]/u.test(label)
    ? ` stroke="${color}" stroke-width="${(fit * 0.018).toFixed(2)}" stroke-linejoin="round"`
    : '';
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="${family}" font-size="${fit}" font-weight="700" fill="${color}"${cjkStroke}>${safe}</text>`;
}

function fontFor(language) {
  // Share one font stack so switching Chinese scripts does not change stroke weight.
  return language === 'english' ? 'Arial' : 'Microsoft YaHei, Microsoft JhengHei, SimSun, MingLiU, Arial';
}

module.exports = { text, fontFor, fitTextSize };
