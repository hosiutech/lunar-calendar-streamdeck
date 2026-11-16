const { Solar } = require('lunar-javascript');
const { localDate } = require('./local-date.cjs');
const { formatGregorian } = require('./gregorian-date.cjs');
const { formatLunar } = require('./lunar-date.cjs');
const { formatSolarTerm } = require('./solar-term.cjs');
const { getZodiac } = require('./zodiac-date.cjs');

function getCalendar(now, settings, date = localDate(now)) {
  const solar = Solar.fromYmd(date.year, date.month, date.day);
  const lunar = solar.getLunar();
  return {
    day: solar.toYmd(),
    ...formatGregorian(date, settings),
    ...getZodiac(lunar, settings.solarTermLanguage),
    lunar: formatLunar(lunar, settings),
    term: settings.showSolarTerms ? formatSolarTerm(lunar, settings.solarTermLanguage) : ''
  };
}

module.exports = { getCalendar };
