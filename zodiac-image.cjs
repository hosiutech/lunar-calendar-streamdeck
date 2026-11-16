const fs = require('node:fs');
const path = require('node:path');
const { PNG } = require('pngjs');
const icons = new Map();

function zodiacImage(name) {
  if (!icons.has(name)) {
    const file = path.join(__dirname, 'zodiac', name + '.png');
    let icon = null;
    if (fs.existsSync(file)) {
      const png = PNG.sync.read(fs.readFileSync(file));
      let left = png.width;
      let top = png.height;
      let right = -1;
      let bottom = -1;
      for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
          if (png.data[(y * png.width + x) * 4 + 3] === 0) continue;
          left = Math.min(left, x);
          top = Math.min(top, y);
          right = Math.max(right, x);
          bottom = Math.max(bottom, y);
        }
      }
      if (right >= 0) {
        const width = right - left + 1;
        const height = bottom - top + 1;
        const cropped = new PNG({ width, height });
        PNG.bitblt(png, cropped, left, top, width, height, 0, 0);
        const scale = Math.min(1, 205 / width, 155 / height);
        icon = { width: Math.round(width * scale), height: Math.round(height * scale),
          data: PNG.sync.write(cropped).toString('base64') };
      }
    }
    icons.set(name, icon);
  }
  return icons.get(name);
}

module.exports = { zodiacImage };
