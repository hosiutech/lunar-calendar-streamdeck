const fs = require('node:fs');
const path = require('node:path');
const app = path.join(__dirname, 'io.github.lunarcalendar.windows.sdPlugin');
const { Resvg } = require(path.join(app, 'node_modules/@resvg/resvg-js'));
const { PNG } = require(path.join(app, 'node_modules/pngjs'));
const { getCalendar } = require(path.join(app, 'calendar.cjs'));
const { renderKey } = require(path.join(app, 'render.cjs'));
const { normalizeSettings } = require(path.join(app, 'settings.js'));
const folder = path.join(app, 'icons');
fs.mkdirSync(folder, { recursive: true });

function calendarIcon(size, fill, background = '') {
  return new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 48">
    ${background}
    <g stroke="${fill}" fill="none" stroke-width="3">
      <rect x="9" y="12" width="30" height="28" rx="5"/>
      <path d="M9 21h30 M17 8v8 M31 8v8" stroke-linecap="round"/>
    </g>
    <path d="M31 31a7 7 0 1 1-9-7 6 6 0 0 0 9 7" fill="${fill}"/>
  </svg>`).render().asPng();
}

const background = '<rect width="48" height="48" rx="9" fill="#050505"/>';
for (const [name, size, fill, bg] of [
  ['action', 20, '#FFFFFF', ''], ['action@2x', 40, '#FFFFFF', ''],
  ['plugin', 144, '#FFCC55', background], ['plugin@2x', 288, '#FFCC55', background],
  ['key', 72, '#FFCC55', background], ['key@2x', 144, '#FFCC55', background]
]) {
  fs.writeFileSync(path.join(folder, name + '.png'), calendarIcon(size, fill, bg));
}

// Use the supplied black artwork as a white mask for Stream Deck's dark sidebar.
const brand = PNG.sync.read(fs.readFileSync(path.join(__dirname, 'Hosiu-3b-blk200.png')));
for (let offset = 0; offset < brand.data.length; offset += 4) {
  const darkness = 255 - brand.data[offset];
  brand.data[offset + 3] = Math.round(brand.data[offset + 3] * darkness / 255);
  brand.data.fill(255, offset, offset + 3);
}
const logo = PNG.sync.write(brand).toString('base64');
for (const [name, size] of [['hosiu-category', 28], ['hosiu-category@2x', 56]]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><image width="${size}" height="${size}" href="data:image/png;base64,${logo}"/></svg>`;
  fs.writeFileSync(path.join(folder, name + '.png'), new Resvg(svg).render().asPng());
}

const settings = normalizeSettings();
const sample = getCalendar(new Date(2026, 10, 15, 12), settings);
const image = renderKey(sample, settings, 'example');
fs.writeFileSync(path.join(__dirname, 'preview.png'), Buffer.from(image.split(',')[1], 'base64'));
