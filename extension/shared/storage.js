/**
 * Helpers centralizados para leitura/escrita no chrome.storage.local.
 * Dados e configurações ficam separados da apresentação, permitindo
 * trocar o layout futuramente sem perder as informações do usuário.
 */

const STORAGE_KEY = 'handyData';

const DEFAULT_DATA = {
  enabled: true,
  lines: ['', '', '', '', ''],
  settings: {
    buttonVariant: 'jjk-gojo',
    handVariant: 'default',
    size: 'medium',
    buttonColor: '#ffffff',
    buttonOpacity: 1,
    handColor: '#b2b2b2',
    handOpacity: 1
  }
};

export async function getHandyData() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return { ...DEFAULT_DATA, ...(result[STORAGE_KEY] || {}) };
}

export async function setHandyData(data) {
  await chrome.storage.local.set({ [STORAGE_KEY]: data });
}

export async function getLines() {
  const data = await getHandyData();
  return data.lines || DEFAULT_DATA.lines;
}

export async function setLines(lines) {
  const data = await getHandyData();
  data.lines = lines;
  await setHandyData(data);
}

export async function getSettings() {
  const data = await getHandyData();
  return { ...DEFAULT_DATA.settings, ...(data.settings || {}) };
}

export async function setSettings(settings) {
  const data = await getHandyData();
  data.settings = { ...data.settings, ...settings };
  await setHandyData(data);
}

export async function isEnabled() {
  const data = await getHandyData();
  return data.enabled ?? DEFAULT_DATA.enabled;
}

export async function setEnabled(enabled) {
  const data = await getHandyData();
  data.enabled = enabled;
  await setHandyData(data);
}
