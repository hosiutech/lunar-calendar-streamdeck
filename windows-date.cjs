const path = require('node:path');
const koffi = require('koffi');

const systemTime = koffi.struct('SYSTEMTIME', {
  year: 'uint16_t',
  month: 'uint16_t',
  weekday: 'uint16_t',
  day: 'uint16_t',
  hour: 'uint16_t',
  minute: 'uint16_t',
  second: 'uint16_t',
  milliseconds: 'uint16_t'
});

const kernel = koffi.load(path.join(process.env.SystemRoot || 'C:/Windows', 'System32', 'kernel32.dll'));
const getLocalTime = kernel.func('void __stdcall GetLocalTime(_Out_ SYSTEMTIME *time)');

function windowsDate() {
  const time = {};
  getLocalTime(time);
  const { year, month, day, weekday } = time;
  return { year, month, day, weekday };
}

module.exports = { windowsDate };
