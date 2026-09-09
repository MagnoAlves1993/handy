const STORAGE_KEY = 'handyData';

const DEFAULT_DATA = {
  enabled: true,
  lines: ['', '', '', '', '', ''],
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

async function getHandyData() {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return { ...DEFAULT_DATA, ...(result[STORAGE_KEY] || {}) };
}

async function setHandyData(data) {
  await chrome.storage.local.set({ [STORAGE_KEY]: data });
}

async function setLines(lines) {
  const data = await getHandyData();
  data.lines = lines;
  await setHandyData(data);
}

async function isEnabled() {
  const data = await getHandyData();
  return data.enabled ?? DEFAULT_DATA.enabled;
}

const COPY_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const CHECK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

let rootEl = null;
let shadow = null;
let widgetEl = null;
let panelEl = null;
let currentLines = [];
let currentSettings = {};

const BUTTON_SVGS = {
  'jjk-gojo': chrome.runtime.getURL('assets/button-jjk-gojo.svg')
};

const HAND_SVGS = {
  default: chrome.runtime.getURL('assets/hand-default.svg')
};

async function init() {
  const enabled = await isEnabled();
  if (!enabled) return;

  await buildWidget();
  await refresh();
}

async function buildWidget() {
  if (rootEl) return;

  rootEl = document.createElement('div');
  rootEl.id = 'handy-root';

  shadow = rootEl.attachShadow({ mode: 'open' });

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = chrome.runtime.getURL('content/content.css');
  shadow.appendChild(style);

  const container = document.createElement('div');
  container.className = 'handy-container';
  shadow.appendChild(container);

  // Botão flutuante
  widgetEl = document.createElement('div');
  widgetEl.className = 'handy-widget handy-widget--medium';
  widgetEl.setAttribute('role', 'button');
  widgetEl.setAttribute('aria-label', 'Abrir painel de copiar e colar');
  widgetEl.addEventListener('click', openPanel);
  container.appendChild(widgetEl);

  // Painel de linhas
  panelEl = document.createElement('div');
  panelEl.className = 'handy-panel handy-panel--hidden handy-panel--medium';
  panelEl.setAttribute('role', 'dialog');
  panelEl.setAttribute('aria-label', 'Linhas de texto');
  container.appendChild(panelEl);

  document.body.appendChild(rootEl);
}

async function refresh() {
  const data = await getHandyData();
  currentLines = data.lines || [];
  currentSettings = { ...data.settings };
  applySettings();
  renderButton();
  if (!panelEl.classList.contains('handy-panel--hidden')) renderPanel();
}

function applySettings() {
  const s = currentSettings;

  // Tamanho
  const size = s.size || 'medium';
  widgetEl.className = `handy-widget handy-widget--${size}`;
  panelEl.className = `handy-panel handy-panel--${size} ${panelEl.classList.contains('handy-panel--hidden') ? 'handy-panel--hidden' : ''}`;

  // Cor do botão
  const buttonColor = s.buttonColor || '#ffffff';
  const buttonOpacity = s.buttonOpacity ?? 1;
  widgetEl.style.color = buttonColor;
  widgetEl.style.opacity = buttonOpacity;

  // Cor do painel
  const handColor = s.handColor || '#b2b2b2';
  const handOpacity = s.handOpacity ?? 1;
  panelEl.style.setProperty('--handy-hand-color', hexToRgba(handColor, handOpacity));
}

function renderButton() {
  const variant = currentSettings.buttonVariant || 'jjk-gojo';
  const svgUrl = BUTTON_SVGS[variant] || BUTTON_SVGS['jjk-gojo'];

  widgetEl.innerHTML = '';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');

  fetch(svgUrl)
    .then(r => r.text())
    .then(text => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'image/svg+xml');
      const imported = document.importNode(doc.documentElement, true);
      widgetEl.appendChild(imported);

      // Aplica a cor selecionada nos preenchimentos do botão.
      const fills = imported.querySelectorAll('.layer-fills path');
      fills.forEach(path => path.setAttribute('fill', currentSettings.buttonColor || '#ffffff'));
    })
    .catch(() => {
      widgetEl.textContent = '✋';
    });
}

function renderPanel() {
  panelEl.innerHTML = '';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'handy-panel__close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Fechar painel');
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', closePanel);
  panelEl.appendChild(closeBtn);

  const handWrap = document.createElement('div');
  handWrap.className = 'handy-panel__hand';
  panelEl.appendChild(handWrap);

  const variant = currentSettings.handVariant || 'default';
  const svgUrl = HAND_SVGS[variant] || HAND_SVGS['default'];

  fetch(svgUrl)
    .then(r => r.text())
    .then(text => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'image/svg+xml');
      const imported = document.importNode(doc.documentElement, true);
      handWrap.appendChild(imported);
      wirePanelInputs(imported);
    })
    .catch(() => {
      handWrap.textContent = 'Erro ao carregar o painel.';
    });
}

function wirePanelInputs(svgRoot) {
  const inputs = svgRoot.querySelectorAll('.svg-hand-line-input');
  inputs.forEach((input, index) => {
    input.value = currentLines[index] || '';
    input.addEventListener('input', () => onLineInput(index, input.value));
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const btn = input.closest('.input-wrapper')?.querySelector('.copy-btn');
        copyToClipboard(input.value, btn);
      }
    });
  });

  const copyBtns = svgRoot.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-wrapper')?.querySelector('.svg-hand-line-input');
      if (input) copyToClipboard(input.value, btn);
    });
  });
}

async function onLineInput(index, value) {
  currentLines[index] = value;
  await setLines([...currentLines]);
}

async function copyToClipboard(text, button) {
  if (!text || !button) return;

  try {
    await navigator.clipboard.writeText(text);

    const original = button.innerHTML;
    button.innerHTML = CHECK_ICON;
    button.style.opacity = '1';

    setTimeout(() => {
      button.innerHTML = original;
      button.style.opacity = '';
    }, 1500);
  } catch (err) {
    console.error('Handy: falha ao copiar', err);
  }
}

function openPanel() {
  renderPanel();
  widgetEl.classList.add('handy-widget--hidden');
  panelEl.classList.remove('handy-panel--hidden');

  const firstInput = panelEl.querySelector('.svg-hand-line-input');
  if (firstInput) firstInput.focus();
}

function closePanel() {
  panelEl.classList.add('handy-panel--hidden');
  widgetEl.classList.remove('handy-widget--hidden');
}

function showWidget() {
  if (!rootEl) {
    init();
  } else {
    rootEl.style.display = 'block';
  }
}

function hideWidget() {
  if (rootEl) {
    rootEl.style.display = 'none';
  }
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Mensagens vindas do background/popup/options.
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'HANDY_STATE_CHANGED') {
    if (message.enabled) {
      showWidget();
    } else {
      hideWidget();
    }
  }

  if (message.type === 'HANDY_SETTINGS_CHANGED') {
    refresh();
  }
});

init();
