const { getCalendar } = require('./calendar.cjs');
const { windowsDate } = require('./windows-date.cjs');
const { findOutlook } = require('./outlook-path.cjs');
const { runCalendarAction } = require('./calendar-action.cjs');
const { normalizeSettings } = require('./settings.js');
const { renderKey } = require('./render.cjs');

const argv = process.argv.slice(2);
const args = new Map();
for (let i = 0; i < argv.length; i += 2) args.set(argv[i], argv[i + 1]);

const socket = new WebSocket(`ws://127.0.0.1:${args.get('-port')}`);
const keys = new Map();
let refreshTimer;

function send(message) {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
}

function sendPreview(context, payload) {
  send({ event: 'sendToPropertyInspector', context,
    action: 'io.github.lunarcalendar.windows.date', payload });
}

function refresh(context, { preview = false, applied, date = windowsDate() } = {}) {
  const key = keys.get(context);
  if (!key) return;
  try {
    const signature = JSON.stringify([date, key.settings]);
    if (key.signature !== signature) {
      const calendar = getCalendar(null, key.settings, date);
      key.image = renderKey(calendar, key.settings, context);
      key.signature = signature;
      send({ event: 'setImage', context, payload: { image: key.image, target: 0 } });
      preview = true;
    }
    if (preview || applied !== undefined) sendPreview(context, { image: key.image, applied });
  } catch (error) {
    console.error('Could not render Lunar Calendar key:', error);
    if (applied !== undefined) sendPreview(context, { applied, error: 'Saved, but the key image could not update.' });
  }
}

function refreshVisible() {
  const date = windowsDate();
  for (const context of keys.keys()) refresh(context, { date });
}

socket.addEventListener('open', () => {
  send({ event: args.get('-registerEvent'), uuid: args.get('-pluginUUID') });
  refreshTimer = setInterval(refreshVisible, 1000);
});

socket.addEventListener('close', () => clearInterval(refreshTimer));
socket.addEventListener('message', ({ data }) => {
  const { event, context, payload } = JSON.parse(data);
  switch (event) {
    case 'willAppear':
      keys.set(context, { settings: normalizeSettings(payload.settings) });
      refresh(context);
      break;
    case 'willDisappear':
      keys.delete(context);
      break;
    case 'didReceiveSettings': {
      const key = keys.get(context);
      if (key) {
        key.settings = normalizeSettings(payload.settings);
        const pending = key.pending;
        const confirmed = pending && JSON.stringify(key.settings) === JSON.stringify(pending.settings);
        if (confirmed) delete key.pending;
        refresh(context, { applied: confirmed ? pending.requestId : undefined });
      }
      break;
    }
    case 'propertyInspectorDidAppear':
      refresh(context, { preview: true });
      break;
    case 'sendToPlugin': {
      if (payload?.settings) {
        const key = keys.get(context);
        if (!key) {
          sendPreview(context, { applied: payload.requestId, error: 'This key is unavailable. Reselect it and try again.' });
          break;
        }
        const settings = normalizeSettings(payload.settings);
        key.pending = { settings, requestId: payload.requestId };
        send({ event: 'setSettings', context, payload: settings });
        send({ event: 'getSettings', context });
        break;
      }
      refresh(context, { preview: true });
      if (payload?.preview) {
        findOutlook().then(executable => sendPreview(context, { outlookAvailable: Boolean(executable) }))
          .catch(error => console.error('Could not detect Outlook:', error));
      }
      break;
    }
    case 'systemDidWakeUp':
      refreshVisible();
      break;
    case 'keyUp':
      runCalendarAction(normalizeSettings(payload.settings).buttonAction, context, send)
        .catch(error => {
          console.error('Could not open calendar:', error);
          send({ event: 'showAlert', context });
        });
      break;
  }
});
