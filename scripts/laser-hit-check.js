"use strict";

const fs = require("node:fs");
const path = require("node:path");

const gamePath = path.join(__dirname, "..", "game.js");
const source = fs.readFileSync(gamePath, "utf8");

if (!/canLaserDamageTarget\(target, beam\)/.test(source)) {
  throw new Error("Laser damage should use its own beam overlap check.");
}

if (!/visible && rectsOverlap\(beam, hitbox\)/.test(source)) {
  throw new Error("Laser should damage partially visible targets instead of waiting for target center.");
}

console.log("Laser hit check passed.");
