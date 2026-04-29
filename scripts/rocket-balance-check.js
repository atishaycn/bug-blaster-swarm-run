"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const gamePath = path.join(__dirname, "..", "game.js");
const source = fs.readFileSync(gamePath, "utf8");
const constantsSource = source.match(/const ROCKET = \{[\s\S]*?\n\};/)?.[0];

if (!constantsSource) {
  throw new Error("ROCKET balance constants are missing.");
}

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${constantsSource}\nthis.ROCKET = ROCKET;`, sandbox);

const { ROCKET } = sandbox;
const checks = [
  ["rocket speed should be much faster than the old 430px/s baseline", ROCKET.baseSpeed >= 620],
  ["rocket fire interval should be far below the old 0.78s baseline", ROCKET.baseInterval <= 0.48],
  ["rocket direct damage should kill most non-boss enemies outright", ROCKET.baseDamage >= 4],
  ["rocket splash radius should affect a large nearby cluster", ROCKET.splashRadius >= 110],
  ["rocket splash damage should clear tanks and clustered enemies", ROCKET.splashDamage >= 4],
  ["rocket explosions should push nearby targets around", ROCKET.knockback >= 120],
  ["boss splash should stay large enough to catch minions around the boss", ROCKET.bossSplashRadius >= ROCKET.splashRadius]
];

const failed = checks.filter(([, ok]) => !ok).map(([message]) => message);

if (failed.length) {
  throw new Error(`Rocket balance check failed:\n- ${failed.join("\n- ")}`);
}

if (!/knockbackFrom\(x, ROCKET\.knockback\)/.test(source)) {
  throw new Error("Rocket explosions must apply knockback to affected targets.");
}

console.log("Rocket balance check passed.");
