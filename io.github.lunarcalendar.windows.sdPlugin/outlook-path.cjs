const { execFile } = require('node:child_process');
const { statSync } = require('node:fs');
const path = require('node:path');

function isOutlook(file) {
  if (!path.win32.isAbsolute(file) || path.win32.basename(file).toLowerCase() !== 'outlook.exe') return false;
  try {
    return statSync(file).isFile();
  } catch {
    return false;
  }
}

function queryAppPath(hive, view) {
  const registry = hive + '\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\OUTLOOK.EXE';
  const reg = path.join(process.env.SystemRoot || 'C:/Windows', 'System32', 'reg.exe');
  return new Promise(resolve => {
    execFile(reg, ['query', registry, '/ve', '/reg:' + view], {
      windowsHide: true, timeout: 2500
    }, (error, stdout) => {
      const value = error ? '' : stdout.match(/\bREG_(?:EXPAND_)?SZ[ \t]+([^\r\n]+)/)?.[1].trim();
      resolve((value || '').replace(/^"|"$/g, '').replace(/%([^%]+)%/g, (match, key) => process.env[key] ?? match));
    });
  });
}

async function findOutlook() {
  if (process.platform !== 'win32') return undefined;
  const folders = [process.env.ProgramFiles, process.env['ProgramFiles(x86)']].filter(Boolean);
  const officePaths = folders.flatMap(folder => ['root/Office16', 'Office16'].map(office =>
    path.join(folder, 'Microsoft Office', office, 'OUTLOOK.EXE')));
  const installed = officePaths.find(isOutlook);
  if (installed) return installed;
  const registered = await Promise.all(['HKCU', 'HKLM'].flatMap(hive =>
    ['64', '32'].map(view => queryAppPath(hive, view))));
  return registered.find(isOutlook);
}

module.exports = { findOutlook };
