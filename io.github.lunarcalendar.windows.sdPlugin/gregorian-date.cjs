const englishMonths = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
const englishWeek = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ');
const chineseWeek = '日一二三四五六';

function formatGregorian(date, { dateLanguage, showYear }) {
  const { day, month, year, weekday } = date;
  const english = dateLanguage === 'english';
  const dayText = showYear ? String(day).padStart(2, '0') : day;
  const monthText = showYear ? String(month).padStart(2, '0') : month;
  const yearText = String(year).slice(-2);
  const dateLabel = english
    ? `${englishMonths[month - 1]} ${dayText}${showYear ? `, ${yearText}` : ''}`
    : `${showYear ? `${yearText}年` : ''}${monthText}月${dayText}日`;
  return {
    date: dateLabel,
    weekday: english ? englishWeek[weekday] : `星期${chineseWeek[weekday]}`
  };
}

module.exports = { formatGregorian };
