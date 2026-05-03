"use strict";

const fs = require("node:fs");
const path = require("node:path");

const gamePath = path.join(__dirname, "..", "game.js");
const source = fs.readFileSync(gamePath, "utf8");

if (!/const GASOLINE_IGNITION_HEIGHT = 92;/.test(source)) {
  throw new Error("Gasoline ignition should use a taller visible hit zone.");
}

if (!/function bulletIgnitesGasoline\(bullet, pool\)/.test(source)) {
  throw new Error("Gasoline ignition should use a dedicated bullet overlap helper.");
}

if (!/const prevX = Number\.isFinite\(bullet\.prevX\)/.test(source)) {
  throw new Error("Gasoline ignition should consider the bullet's previous position.");
}

if (!/if \(bulletIgnitesGasoline\(bullet, pool\)\)/.test(source)) {
  throw new Error("Bullet collision should use the gasoline ignition helper.");
}

console.log("Gasoline ignition check passed.");
