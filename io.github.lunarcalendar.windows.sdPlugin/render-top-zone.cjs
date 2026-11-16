const { zodiacImage } = require('./zodiac-image.cjs');
const { text, fontFor } = require('./text-svg.cjs');
const { renderSolarTerm } = require('./render-solar-term.cjs');

function renderTopZone(calendar, settings, color) {
  const elements = [];
  const font = fontFor(settings.solarTermLanguage);
  if (settings.showZodiac) {
    const x = calendar.term ? 160 : 256;
    const icon = zodiacImage(calendar.animalFile);
    elements.push(icon
      ? `<image x="${x - Math.ceil(icon.width / 2)}" y="${15 + Math.floor((155 - icon.height) / 2)}" width="${icon.width}" height="${icon.height}" href="data:image/png;base64,${icon.data}"/>`
      : text(calendar.animal, x, 123, 90, '#F3F3F3', 190, font));
  }
  if (calendar.term) {
    elements.push(renderSolarTerm(calendar.term, settings.showZodiac, color, font));
  }
  return elements.join('');
}

module.exports = { renderTopZone };
