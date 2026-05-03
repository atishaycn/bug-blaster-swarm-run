"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const game = fs.readFileSync(path.join(root, "game.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");

const windowPointerStart = game.indexOf('window.addEventListener("pointerdown"');
const canvasPointerStart = game.indexOf('this.canvas.addEventListener("pointerdown"');
const restartClickStart = game.indexOf('this.restartButton.addEventListener("click"');

if (windowPointerStart !== -1 && windowPointerStart < restartClickStart) {
  throw new Error("Window pointer controls should not trigger gameplay jumps.");
}

const canvasPointerBlock = canvasPointerStart === -1 || restartClickStart === -1
  ? ""
  : game.slice(canvasPointerStart, restartClickStart);

if (/actionJump\(\)/.test(canvasPointerBlock) || /startOrRestart\(\)/.test(canvasPointerBlock)) {
  throw new Error("Canvas pointer controls should not trigger gameplay jumps.");
}

if (!/class BeetleGoldHunt/.test(game) || !/localStorage\.setItem\(GOLD_KEY/.test(game)) {
  throw new Error("Beetle gold hunt should manage and persist gold.");
}

if (!/id="goldCount"/.test(html) || !/id="beetleField"/.test(html)) {
  throw new Error("Gold counter and beetle field should exist outside the game window.");
}

if (!/\.bonus-beetle/.test(styles) || !/cursor: default;/.test(styles)) {
  throw new Error("Bonus beetles should be styled and the canvas should not look clickable.");
}

console.log("Beetle gold UI check passed.");
