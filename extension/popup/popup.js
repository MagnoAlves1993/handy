const toggle = document.getElementById('handy-toggle');
const openOptionsBtn = document.getElementById('open-options');

async function init() {
  const response = await chrome.runtime.sendMessage({ type: 'HANDY_GET_STATE' });
  toggle.checked = response?.enabled ?? true;
}

toggle.addEventListener('change', async () => {
  const response = await chrome.runtime.sendMessage({
    type: 'HANDY_TOGGLE',
    enabled: toggle.checked
  });
  toggle.checked = response.enabled;
});

openOptionsBtn.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  window.close();
});

init();
