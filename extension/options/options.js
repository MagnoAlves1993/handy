import { getSettings, setSettings } from '../shared/storage.js';

const fields = {
  buttonSize: document.getElementById('button-size'),
  buttonColor: document.getElementById('button-color'),
  buttonOpacity: document.getElementById('button-opacity'),
  buttonOpacityValue: document.getElementById('button-opacity-value'),
  buttonVariant: document.getElementById('button-variant'),
  handSize: document.getElementById('hand-size'),
  handColor: document.getElementById('hand-color'),
  handOpacity: document.getElementById('hand-opacity'),
  handOpacityValue: document.getElementById('hand-opacity-value'),
  handVariant: document.getElementById('hand-variant')
};

const saveBtn = document.getElementById('save-settings');
const resetBtn = document.getElementById('reset-settings');
const status = document.getElementById('status-message');

function updateOpacityLabels() {
  fields.buttonOpacityValue.textContent = `${Math.round(fields.buttonOpacity.value * 100)}%`;
  fields.handOpacityValue.textContent = `${Math.round(fields.handOpacity.value * 100)}%`;
}

async function loadSettings() {
  const settings = await getSettings();
  fields.buttonSize.value = settings.size;
  fields.buttonColor.value = settings.buttonColor;
  fields.buttonOpacity.value = settings.buttonOpacity;
  fields.buttonVariant.value = settings.buttonVariant;
  fields.handSize.value = settings.size;
  fields.handColor.value = settings.handColor;
  fields.handOpacity.value = settings.handOpacity;
  fields.handVariant.value = settings.handVariant;
  updateOpacityLabels();
}

function getCurrentSettings() {
  return {
    buttonVariant: fields.buttonVariant.value,
    handVariant: fields.handVariant.value,
    size: fields.buttonSize.value,
    buttonColor: fields.buttonColor.value,
    buttonOpacity: Number(fields.buttonOpacity.value),
    handColor: fields.handColor.value,
    handOpacity: Number(fields.handOpacity.value)
  };
}

async function save() {
  await setSettings(getCurrentSettings());

  // Notifica todas as abas para recarregarem as configurações.
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.id || tab.url?.startsWith('chrome://')) continue;
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'HANDY_SETTINGS_CHANGED' });
    } catch {
      // ignorar abas sem content script
    }
  }

  status.textContent = 'Configurações salvas com sucesso!';
  setTimeout(() => {
    status.textContent = '';
  }, 2500);
}

async function reset() {
  await setSettings({
    buttonVariant: 'jjk-gojo',
    handVariant: 'default',
    size: 'medium',
    buttonColor: '#ffffff',
    buttonOpacity: 1,
    handColor: '#b2b2b2',
    handOpacity: 1
  });
  await loadSettings();
  await save();
  status.textContent = 'Configurações restauradas para o padrão.';
  setTimeout(() => {
    status.textContent = '';
  }, 2500);
}

fields.buttonOpacity.addEventListener('input', updateOpacityLabels);
fields.handOpacity.addEventListener('input', updateOpacityLabels);

saveBtn.addEventListener('click', save);
resetBtn.addEventListener('click', reset);

loadSettings();
