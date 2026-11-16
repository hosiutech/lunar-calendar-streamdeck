const { spawn } = require('node:child_process');
const { dirname } = require('node:path');
const { findOutlook } = require('./outlook-path.cjs');

async function runCalendarAction(action, context, send) {
  if (action === 'calendar') {
    send({ event: 'openUrl', payload: { url: 'https://calendar.google.com/calendar/' } });
  }
  if (action === 'outlook') {
    const executable = await findOutlook();
    const alert = () => send({ event: 'showAlert', context });
    if (!executable) return alert();
    // Outlook can outlive the plugin. Its working directory must allow plugin updates.
    const outlook = spawn(executable, ['/select', 'outlook:calendar'], {
      cwd: dirname(executable),
      detached: true,
      stdio: 'ignore'
    });
    outlook.on('error', alert);
    outlook.unref();
  }
}

module.exports = { runCalendarAction };
