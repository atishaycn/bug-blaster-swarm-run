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

const canvasPointerBlock = canvasPointerStart === -1 || restartClickStart === -1
  ? ""
  : game.slice(canvasPointerStart, restartClickStart);

const windowPointerBlock = windowPointerStart === -1 || restartClickStart === -1
  ? ""
  : game.slice(windowPointerStart, restartClickStart);

if (/actionJump\(\)/.test(canvasPointerBlock) || /startOrRestart\(\)/.test(canvasPointerBlock) || /actionJump\(\)/.test(windowPointerBlock) || /startOrRestart\(\)/.test(windowPointerBlock)) {
  throw new Error("Canvas pointer controls should not trigger gameplay jumps.");
}

if (!/class BeetleGoldHunt/.test(game) || !/localStorage\.setItem\(GOLD_KEY/.test(game)) {
  throw new Error("Beetle gold hunt should manage and persist gold.");
}

if (!/updateShop\(\)/.test(game) || !/this\.gold >= 10/.test(game) || !/document\.getElementById\("goldShop"\)/.test(game)) {
  throw new Error("Gold shop should appear when beetle gold reaches 10.");
}

if (!/SECONDARY_WEAPONS/.test(game) || !/buyOrEquipWeapon\(weaponId\)/.test(game) || !/SECONDARY_EQUIPPED_KEY/.test(game)) {
  throw new Error("Gold shop should buy, persist, and equip secondary weapons.");
}

if (!/beginSecondaryFire\(event\)/.test(game) || !/updateSecondaryWeapon\(dt\)/.test(game) || !/fireSecondaryLaser\(\)/.test(game)) {
  throw new Error("Equipped secondary weapons should support hold-to-fire gameplay.");
}

if (!/findSpawnPoint\(\)/.test(game) || !/document\.querySelector\("\.canvas-wrap"\)/.test(game)) {
  throw new Error("Beetle spawns should use the full viewport while avoiding the game window.");
}

if (!/id="goldCount"/.test(html) || !/id="beetleField"/.test(html) || !/id="goldShop"/.test(html)) {
  throw new Error("Gold counter, shop, and beetle field should exist outside the game section.");
}

["Machine Gun - 30", "Laser Blaster - 60", "Shotgun - 100"].forEach((item) => {
  if (!html.includes(item)) throw new Error(`Gold shop is missing ${item}.`);
});

if (!/data-shop-weapon="machineGun"/.test(html) || !/data-shop-weapon="laserBlaster"/.test(html) || !/data-shop-weapon="shotgun"/.test(html)) {
  throw new Error("Gold shop buttons should expose weapon purchase ids.");
}

if (!/\.bonus-beetle/.test(styles) || !/\.gold-shop/.test(styles) || !/\.gold-shop button\.is-equipped/.test(styles) || !/cursor: default;/.test(styles) || !/\.beetle-field\s*\{[\s\S]*?position: fixed;[\s\S]*?inset: 0;/.test(styles)) {
  throw new Error("Bonus beetles and shop should be styled across the fixed viewport and the canvas should not look clickable.");
}

console.log("Beetle gold UI check passed.");
