const { spawnSync } = require('node:child_process');
const { renameSync } = require('node:fs');
const path = require('node:path');
const manifest = require('./io.github.lunarcalendar.windows.sdPlugin/manifest.json');

const plugin = manifest.UUID + '.sdPlugin';
const result = spawnSync('cmd.exe', [
  '/d', '/c', 'streamdeck.cmd', 'pack', plugin, '--output', 'dist',
  '--force', '--no-update-check', '--no-file-list'
], { cwd: __dirname, stdio: 'inherit' });

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const output = path.join('dist', 'hosiu.lunarcalendar.windows.streamDeckPlugin');
renameSync(
  path.join(__dirname, 'dist', manifest.UUID + '.streamDeckPlugin'),
  path.join(__dirname, output)
);
console.log('Installer saved to ' + output);
