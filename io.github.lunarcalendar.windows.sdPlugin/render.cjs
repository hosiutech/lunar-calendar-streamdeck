const fs = require('node:fs');
const path = require('node:path');
const { Resvg } = require('@resvg/resvg-js');
const { dailyColors } = require('./daily-colors.cjs');
const { renderTopZone } = require('./render-top-zone.cjs');
const { renderDateZone } = require('./render-date-zone.cjs');
const { renderLunarZone } = require('./render-lunar-zone.cjs');

const fonts = path.join(process.env.WINDIR ?? 'C:/Windows', 'Fonts');
const renderOptions = { font: {
  fontFiles: ['arial.ttf', 'arialbd.ttf', 'msjh.ttc', 'msjhbd.ttc', 'msyh.ttc', 'msyhbd.ttc', 'mingliu.ttc',
    'mingliub.ttc', 'simsun.ttc', 'simsunb.ttf'].map(name => path.join(fonts, name)).filter(file => fs.existsSync(file)),
  loadSystemFonts: true,
  defaultFontFamily: 'Arial'
} };

function renderKey(calendar, settings, context) {
  const [date, weekday, lunar, term] = settings.textColor === 'random'
    ? dailyColors(calendar.day, context) : Array(4).fill(settings.textColor);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
    <rect width="512" height="512" fill="#050505"/>
    ${renderTopZone(calendar, settings, term)}
    ${renderDateZone(calendar, settings, date, weekday)}
    ${renderLunarZone(calendar, settings, lunar)}
  </svg>`;
  return 'data:image/png;base64,' + new Resvg(svg, renderOptions).render().asPng().toString('base64');
}

module.exports = { renderKey };
