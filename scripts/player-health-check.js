"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const gamePath = path.join(__dirname, "..", "game.js");
const source = fs.readFileSync(gamePath, "utf8");
const constantsSource = source.match(/const PLAYER_HIT_DAMAGE = [\s\S]*?const STORAGE_KEY/)?.[0]?.replace(/\nconst STORAGE_KEY$/, "");

if (!constantsSource) {
  throw new Error("Player hit damage constants are missing.");
}

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${constantsSource}\nthis.PLAYER_HIT_DAMAGE = PLAYER_HIT_DAMAGE;\nthis.PLAYER_HIT_INVINCIBILITY = PLAYER_HIT_INVINCIBILITY;\nthis.LEVEL_MAX_HEALTH_GAIN = LEVEL_MAX_HEALTH_GAIN;`, sandbox);

if (sandbox.PLAYER_HIT_DAMAGE >= 1) {
  throw new Error("Player hits should drain health progressively, not remove a full heart at once.");
}

if (sandbox.PLAYER_HIT_INVINCIBILITY < 2) {
  throw new Error("Player needs at least two seconds of post-hit invulnerability.");
}

if (sandbox.LEVEL_MAX_HEALTH_GAIN <= 0) {
  throw new Error("Level upgrades should increase max health.");
}

if (!/this\.health = Math\.max\(0, this\.health - amount\)/.test(source)) {
  throw new Error("Player damage should clamp health after subtracting the hit amount.");
}

if (!/this\.invincible = PLAYER_HIT_INVINCIBILITY/.test(source)) {
  throw new Error("Player damage should refresh invulnerability on every accepted hit.");
}

if (!/healthRatio = clamp\(this\.player\.health \/ this\.player\.maxHealth/.test(source)) {
  throw new Error("Health UI should render proportional health progress.");
}

if (!/Health \$\{Math\.round\(healthRatio \* 100\)\}%/.test(source)) {
  throw new Error("Health UI should show a percentage.");
}

if (!/this\.player\.increaseMaxHealth\(LEVEL_MAX_HEALTH_GAIN\)/.test(source)) {
  throw new Error("Level Up pickups should increase max health.");
}

if (/\"♥\"\.repeat/.test(source) || /\"♡\"\.repeat/.test(source)) {
  throw new Error("Health UI should not depend on integer-only heart strings.");
}

console.log("Player health check passed.");
