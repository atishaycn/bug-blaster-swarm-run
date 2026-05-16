const STORAGE_KEYS = {
  globalEnabled: "globalEnabled",
  disabledHosts: "disabledHosts"
};

const globalToggle = document.getElementById("global-toggle");
const siteToggle = document.getElementById("site-toggle");
const siteLabel = document.getElementById("site-label");
const statusText = document.getElementById("status");

let activeHost = "";
let disabledHosts = {};

function defaults() {
  return {
    [STORAGE_KEYS.globalEnabled]: true,
    [STORAGE_KEYS.disabledHosts]: {}
  };
}

function setStatus(message) {
  statusText.textContent = message;
}

function getHostname(tabUrl) {
  try {
    const url = new URL(tabUrl);
    return url.hostname || url.href;
  } catch {
    return "";
  }
}

function render(settings) {
  disabledHosts = settings[STORAGE_KEYS.disabledHosts] || {};
  const globalEnabled = settings[STORAGE_KEYS.globalEnabled] !== false;
  const siteEnabled = activeHost ? !disabledHosts[activeHost] : false;

  globalToggle.checked = globalEnabled;
  siteToggle.checked = globalEnabled && siteEnabled;
  siteToggle.disabled = !activeHost || !globalEnabled;
  siteLabel.textContent = activeHost || "Unsupported page";

  if (!globalEnabled) {
    setStatus("Dark mode is off everywhere.");
  } else if (activeHost && !siteEnabled) {
    setStatus("Dark mode is off for this site.");
  } else if (activeHost) {
    setStatus("Dark mode is active on this site.");
  } else {
    setStatus("This Chrome page cannot be changed by extensions.");
  }
}

async function load() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  activeHost = getHostname(tab?.url || "");
  const settings = await chrome.storage.sync.get(defaults());
  render(settings);
}

globalToggle.addEventListener("change", async () => {
  await chrome.storage.sync.set({
    [STORAGE_KEYS.globalEnabled]: globalToggle.checked
  });
  const settings = await chrome.storage.sync.get(defaults());
  render(settings);
});

siteToggle.addEventListener("change", async () => {
  if (!activeHost) {
    return;
  }

  const nextDisabledHosts = {
    ...disabledHosts
  };

  if (siteToggle.checked) {
    delete nextDisabledHosts[activeHost];
  } else {
    nextDisabledHosts[activeHost] = true;
  }

  await chrome.storage.sync.set({
    [STORAGE_KEYS.disabledHosts]: nextDisabledHosts
  });
  const settings = await chrome.storage.sync.get(defaults());
  render(settings);
});

load();
