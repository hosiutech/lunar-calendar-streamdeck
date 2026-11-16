const { text, fontFor } = require('./text-svg.cjs');

function renderLunarZone(calendar, settings, color) {
  return text(calendar.lunar, 256, 471, 53, color, 475, fontFor(settings.lunarLanguage));
}

module.exports = { renderLunarZone };
