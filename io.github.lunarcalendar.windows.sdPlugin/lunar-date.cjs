const months = ' 正二三四五六七八九十冬臘';

function formatLunar(lunar, { lunarLanguage, lunarFormat }) {
  const month = Math.abs(lunar.getMonth());
  const simplified = lunarLanguage === 'simplified';
  const leap = lunar.getMonth() < 0 ? (simplified ? '闰' : '閏') : '';
  const monthName = simplified && month === 12 ? '腊' : months[month];
  const short = `${leap}${monthName}月${lunar.getDayInChinese()}`;
  return lunarFormat === 'short' ? short : `${lunar.getYearInGanZhi()}年 ${short}`;
}

module.exports = { formatLunar };
