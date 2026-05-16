const STYLE_ID = "proper-dark-mode-style";
const STORAGE_KEYS = {
  globalEnabled: "globalEnabled",
  disabledHosts: "disabledHosts"
};

const DARK_MODE_CSS = `
:root {
  color-scheme: dark !important;
}

html.proper-dark-mode,
html.proper-dark-mode body {
  background: #0f1117 !important;
  color: #e6e8ee !important;
}

html.proper-dark-mode body {
  scrollbar-color: #4b5567 #151922 !important;
}

html.proper-dark-mode :where(
  main, section, article, aside, header, footer, nav,
  div, p, span, li, dd, dt, td, th, label, summary,
  form, fieldset, details, dialog
) {
  border-color: #313847 !important;
  color: #e6e8ee !important;
}

html.proper-dark-mode :where(
  main, section, article, aside, header, footer, nav,
  div, form, fieldset, details, dialog,
  table, thead, tbody, tfoot, tr, td, th,
  ul, ol, li
) {
  background-color: transparent !important;
}

html.proper-dark-mode :where(
  [style*="background"],
  [style*="Background"],
  [bgcolor]
) {
  background-color: transparent !important;
}

html.proper-dark-mode :where(
  [style*="color"],
  [style*="Color"]
) {
  color: #e6e8ee !important;
}

html.proper-dark-mode :where(
  body, main, section, article, aside, header, footer, nav,
  form, fieldset, details, dialog,
  table, thead, tbody, tfoot, tr, td, th,
  pre, code, blockquote
) {
  box-shadow: none !important;
}

html.proper-dark-mode :where(
  input, textarea, select, button,
  [contenteditable="true"], [role="textbox"]
) {
  background-color: #171b24 !important;
  border-color: #3a4354 !important;
  color: #f2f4f8 !important;
}

html.proper-dark-mode :where(button, input[type="button"], input[type="submit"], input[type="reset"]) {
  background-color: #232a36 !important;
}

html.proper-dark-mode :where(button:hover, input[type="button"]:hover, input[type="submit"]:hover, input[type="reset"]:hover) {
  background-color: #2d3544 !important;
}

html.proper-dark-mode :where(a) {
  color: #8ab4ff !important;
}

html.proper-dark-mode :where(a:visited) {
  color: #c3a6ff !important;
}

html.proper-dark-mode :where(hr) {
  border-color: #313847 !important;
}

html.proper-dark-mode :where(img, picture, video, canvas, svg, iframe) {
  filter: brightness(0.92) contrast(1.04) !important;
}

html.proper-dark-mode :where(pre, code, kbd, samp) {
  background-color: #171b24 !important;
  color: #f2f4f8 !important;
}

html.proper-dark-mode ::selection {
  background: #365a96 !important;
  color: #ffffff !important;
}
`;

function getHost() {
  return window.location.hostname || window.location.href;
}

function getDefaults() {
  return {
    [STORAGE_KEYS.globalEnabled]: true,
    [STORAGE_KEYS.disabledHosts]: {}
  };
}

function shouldEnable(settings) {
  const host = getHost();
  const globalEnabled = settings[STORAGE_KEYS.globalEnabled] !== false;
  const disabledHosts = settings[STORAGE_KEYS.disabledHosts] || {};
  return globalEnabled && !disabledHosts[host];
}

function installStyle() {
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = DARK_MODE_CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  document.documentElement.classList.add("proper-dark-mode");
}

function removeStyle() {
  document.documentElement.classList.remove("proper-dark-mode");
  document.getElementById(STYLE_ID)?.remove();
}

function applyDarkMode(settings) {
  if (shouldEnable(settings)) {
    installStyle();
  } else {
    removeStyle();
  }
}

chrome.storage.sync.get(getDefaults(), applyDarkMode);

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") {
    return;
  }

  const keys = Object.keys(STORAGE_KEYS).map((key) => STORAGE_KEYS[key]);
  if (!keys.some((key) => changes[key])) {
    return;
  }

  chrome.storage.sync.get(getDefaults(), applyDarkMode);
});
