"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const gamePath = path.join(__dirname, "..", "game.js");
const source = fs.readFileSync(gamePath, "utf8");
const constantsSource = source.match(/const PLAYER_HIT_DAMAGE = [\s\S]*?const STORAGE_KEY/)?.[0]?.replace(/\nconst STORAGE_KEY$/, "");

if (!constantsSource) {
  throw new Error("Level balance constants are missing.");
}

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${constantsSource}
this.LEVEL_MAX_HEALTH_GAIN = LEVEL_MAX_HEALTH_GAIN;
this.ENEMY_LEVEL_HEALTH_INTERVAL = ENEMY_LEVEL_HEALTH_INTERVAL;
this.ENEMY_TIME_HEALTH_INTERVAL = ENEMY_TIME_HEALTH_INTERVAL;
this.ENEMY_LEVEL_SPEED_GAIN = ENEMY_LEVEL_SPEED_GAIN;
this.ENEMY_LEVEL_SPEED_CAP = ENEMY_LEVEL_SPEED_CAP;`, sandbox);

const checks = [
  ["level health gain should be helpful without making full-health streaks trivial", sandbox.LEVEL_MAX_HEALTH_GAIN <= 0.25],
  ["enemy health should scale within the first few level-ups", sandbox.ENEMY_LEVEL_HEALTH_INTERVAL <= 3],
  ["late-run enemy health should keep scaling by elapsed time", sandbox.ENEMY_TIME_HEALTH_INTERVAL <= 45],
  ["enemy speed should gain with player level", sandbox.ENEMY_LEVEL_SPEED_GAIN > 0],
  ["enemy speed scaling should be capped", sandbox.ENEMY_LEVEL_SPEED_CAP <= 0.2]
];

const failed = checks.filter(([, ok]) => !ok).map(([message]) => message);

if (failed.length) {
  throw new Error(`Level balance check failed:\n- ${failed.join("\n- ")}`);
}

if (!/scaleEnemyForRun\(enemy\)/.test(source)) {
  throw new Error("Spawned enemies should be scaled for the current run.");
}

if (!/enemy\.maxHealth \+=/.test(source) || !/enemy\.speed \*= speedScale/.test(source)) {
  throw new Error("Enemy scaling should affect both durability and speed.");
}

if (!/target\.x \+ target\.w < WIDTH - 12/.test(source)) {
  throw new Error("Bullets should wait until enemies are fully visible before damaging them.");
}

console.log("Level balance check passed.");
