# Proper Dark Mode Chrome Extension

A small Manifest V3 Chrome extension that turns normal web pages into dark mode by default.

## Install Locally

1. Open `chrome://extensions`.
2. Turn on Developer mode.
3. Click Load unpacked.
4. Select this folder: `chrome-dark-mode-extension`.

## Controls

- All pages: global on/off switch. It is on by default.
- This site: per-site switch for the active tab.

The extension stores settings with `chrome.storage.sync`, so Chrome can sync preferences across profiles when sync is enabled.

## Files

- `manifest.json`: Chrome extension manifest.
- `content.js`: Injects and removes the dark-mode CSS.
- `popup.html`, `popup.css`, `popup.js`: Popup controls for global and per-site toggles.
