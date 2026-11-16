const form = document.querySelector('form');
const fieldset = form.querySelector('fieldset');
const preview = document.querySelector('#preview');
const apply = form.querySelector('button');
const status = document.querySelector('#apply-status');
const { solarTermLanguage, dateLanguage, lunarLanguage, colorMode, customColor, showYear,
  showZodiac, showSolarTerms, lunarFormat, buttonAction } = form.elements;
const outlookOption = buttonAction.querySelector('[value="outlook"]');

function updateConditionalFields() {
  solarTermLanguage.disabled = !showSolarTerms.checked;
  customColor.hidden = colorMode.value !== 'custom';
}

function loadSettings(value) {
  const settings = normalizeSettings(value);
  solarTermLanguage.value = settings.solarTermLanguage;
  dateLanguage.value = settings.dateLanguage;
  lunarLanguage.value = settings.lunarLanguage;
  lunarFormat.value = settings.lunarFormat;
  buttonAction.value = settings.buttonAction === 'outlook' ? 'none' : settings.buttonAction;
  showYear.checked = settings.showYear;
  showZodiac.checked = settings.showZodiac;
  showSolarTerms.checked = settings.showSolarTerms;
  const color = settings.textColor.toUpperCase();
  const presets = ['#FFFFFF', '#FFCC55', '#66FFCC'];
  colorMode.value = settings.textColor === 'random' ? 'random'
    : presets.includes(color) ? color : 'custom';
  if (colorMode.value === 'custom') customColor.value = color;
  updateConditionalFields();
}

window.connectElgatoStreamDeckSocket = (port, uuid, registerEvent, info, actionInfo) => {
  const { action, payload } = JSON.parse(actionInfo);
  const socket = new WebSocket(`ws://127.0.0.1:${port}`);
  // Stream Deck authenticates inspector messages against the UUID used at registration.
  const send = (event, payload) => socket.send(JSON.stringify({ event, action, context: uuid, payload }));
  let pending;
  let timer;
  let requestId = 0;
  let restoreOutlook = payload?.settings?.buttonAction === 'outlook';

  function finish(message) {
    clearTimeout(timer);
    pending = undefined;
    apply.disabled = false;
    status.textContent = message;
  }
  loadSettings(payload?.settings);
  socket.onopen = () => {
    socket.send(JSON.stringify({ event: registerEvent, uuid }));
    fieldset.disabled = false;
    send('sendToPlugin', { preview: true });
  };
  socket.onclose = () => {
    finish('Disconnected. Reselect this key to reconnect.');
    fieldset.disabled = true;
  };
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.event !== 'sendToPropertyInspector') return;
    const { image, applied, error, outlookAvailable } = message.payload;
    if (image) preview.src = image;
    if (typeof outlookAvailable === 'boolean') {
      outlookOption.hidden = outlookOption.disabled = !outlookAvailable;
      if (outlookAvailable && restoreOutlook) buttonAction.value = 'outlook';
      restoreOutlook = false;
    }
    if (pending !== undefined && applied === pending) finish(error || 'Settings applied.');
  };
  form.addEventListener('change', (event) => {
    if (event.target === buttonAction) restoreOutlook = false;
    updateConditionalFields();
    if (pending === undefined) status.textContent = 'Click Apply to save changes.';
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (socket.readyState !== WebSocket.OPEN || pending !== undefined) return;
    const settings = {
      solarTermLanguage: solarTermLanguage.value,
      dateLanguage: dateLanguage.value,
      lunarLanguage: lunarLanguage.value,
      textColor: colorMode.value === 'custom' ? customColor.value : colorMode.value,
      showYear: showYear.checked,
      showZodiac: showZodiac.checked,
      showSolarTerms: showSolarTerms.checked,
      lunarFormat: lunarFormat.value,
      buttonAction: restoreOutlook ? 'outlook' : buttonAction.value
    };
    pending = ++requestId;
    apply.disabled = true;
    status.textContent = 'Applying…';
    send('sendToPlugin', { settings, requestId: pending });
    timer = setTimeout(() => finish('Stream Deck did not confirm. Try Apply again.'), 5000);
  });
};
