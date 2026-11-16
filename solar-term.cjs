const simplifiedTerms = '冬至 小寒 大寒 立春 雨水 惊蛰 春分 清明 谷雨 立夏 小满 芒种 夏至 小暑 大暑 立秋 处暑 白露 秋分 寒露 霜降 立冬 小雪 大雪'.split(' ');
const traditionalTerms = '冬至 小寒 大寒 立春 雨水 驚蟄 春分 清明 穀雨 立夏 小滿 芒種 夏至 小暑 大暑 立秋 處暑 白露 秋分 寒露 霜降 立冬 小雪 大雪'.split(' ');
const englishTerms = [
  'Winter Solstice', 'Minor Cold', 'Major Cold', 'Start of Spring',
  'Rain Water', 'Awakening of Insects', 'Spring Equinox', 'Clear and Bright',
  'Grain Rain', 'Start of Summer', 'Grain Full', 'Grain in Ear',
  'Summer Solstice', 'Minor Heat', 'Major Heat', 'Start of Autumn',
  'End of Heat', 'White Dew', 'Autumn Equinox', 'Cold Dew',
  'Frost Descent', 'Start of Winter', 'Minor Snow', 'Major Snow'
];

function formatSolarTerm(lunar, language) {
  const terms = { traditional: traditionalTerms, simplified: simplifiedTerms, english: englishTerms };
  const index = simplifiedTerms.indexOf(lunar.getPrevJieQi(true).getName());
  return terms[language][index] ?? '';
}

module.exports = { formatSolarTerm };
