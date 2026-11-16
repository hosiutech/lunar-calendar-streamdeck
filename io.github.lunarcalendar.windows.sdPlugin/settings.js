const defaults = Object.freeze({
  textColor: 'random',
  showYear: false,
  showZodiac: true,
  showSolarTerms: true,
  lunarFormat: 'full',
  buttonAction: 'calendar'
});

function normalizeSettings(value = {}) {
  value ??= {};
  const languages = ['traditional', 'simplified', 'english'];
  const legacyLanguage = languages.includes(value.language) ? value.language : 'traditional';
  const lunarLanguages = languages.slice(0, 2);
  return {
    solarTermLanguage: languages.includes(value.solarTermLanguage) ? value.solarTermLanguage : legacyLanguage,
    dateLanguage: languages.includes(value.dateLanguage) ? value.dateLanguage : legacyLanguage,
    lunarLanguage: lunarLanguages.includes(value.lunarLanguage)
      ? value.lunarLanguage : lunarLanguages.includes(legacyLanguage) ? legacyLanguage : 'traditional',
    textColor: typeof value.textColor === 'string' && /^#[0-9a-f]{6}$/i.test(value.textColor)
      ? value.textColor : defaults.textColor,
    showYear: value.showYear === true,
    showZodiac: value.showZodiac !== false,
    showSolarTerms: value.showSolarTerms !== false,
    lunarFormat: value.lunarFormat === 'short' ? 'short' : defaults.lunarFormat,
    buttonAction: ['none', 'outlook'].includes(value.buttonAction) ? value.buttonAction : defaults.buttonAction
  };
}

if (typeof module !== 'undefined') module.exports = { normalizeSettings };
