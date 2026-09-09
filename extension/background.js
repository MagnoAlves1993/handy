import {
  isEnabled,
  setEnabled
} from './shared/storage.js';

const ACTION_TOGGLE = 'HANDY_TOGGLE';
const ACTION_STATE_CHANGED = 'HANDY_STATE_CHANGED';

/**
 * Envia uma mensagem para todas as abas abertas informando
 * que o estado ativo/inativo da extensão mudou.
 */
async function notifyAllTabs(enabled) {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.id || tab.url?.startsWith('chrome://')) continue;
    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: ACTION_STATE_CHANGED,
        enabled
      });
    } catch {
      // Aba pode não ter o content script ainda; ignora silenciosamente.
    }
  }
}

// Listener para mensagens vindas do popup ou de outras partes da extensão.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === ACTION_TOGGLE) {
    (async () => {
      const next = message.enabled ?? !(await isEnabled());
      await setEnabled(next);
      await notifyAllTabs(next);
      sendResponse({ enabled: next });
    })();
    return true; // resposta assíncrona
  }

  if (message.type === 'HANDY_GET_STATE') {
    (async () => {
      sendResponse({ enabled: await isEnabled() });
    })();
    return true;
  }
});

// Ao instalar/atualizar, garante que haja um valor padrão.
chrome.runtime.onInstalled.addListener(async () => {
  const enabled = await isEnabled();
  await notifyAllTabs(enabled);
});
