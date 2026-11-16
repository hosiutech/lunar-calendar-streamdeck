const { text, fontFor } = require('./text-svg.cjs');

function renderDateZone(calendar, settings, dateColor, weekdayColor) {
  const font = fontFor(settings.dateLanguage);
  return text(calendar.date, 256, 282, 101, dateColor, 475, font)
    + text(calendar.weekday, 256, 382, 72, weekdayColor, 475, font);
}

module.exports = { renderDateZone };
