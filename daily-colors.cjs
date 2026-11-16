const { createHash } = require('node:crypto');

const palette = ['#FFCC55', '#FF9966', '#FF77BB', '#66FFCC', '#88DDFF',
  '#BB99FF', '#FFFF88', '#99FF77', '#FFAAEE'];

function dailyColors(day, context) {
  const seed = createHash('sha256').update(`${day}:${context}`).digest();
  const remaining = [...palette];
  return Array.from({ length: 4 }, (_, i) => remaining.splice(seed[i] % remaining.length, 1)[0]);
}

module.exports = { dailyColors };
