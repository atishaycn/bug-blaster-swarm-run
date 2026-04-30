"use strict";

const fs = require("node:fs");
const path = require("node:path");

const gamePath = path.join(__dirname, "..", "game.js");
const source = fs.readFileSync(gamePath, "utf8");
const fireLaserSource = source.match(/\n  fireLaser\(\) \{[\s\S]*?\n  \}\n\n  updateSpawns/)?.[0];

if (!fireLaserSource) {
  throw new Error("fireLaser method is missing.");
}

if (!/canLaserDamageTarget\(target, beam\)/.test(source)) {
  throw new Error("Laser damage should use its own beam overlap check.");
}

if (!/visible = hitbox\.x < WIDTH && hitbox\.x \+ hitbox\.w > 0/.test(source)) {
  throw new Error("Laser should damage partially visible targets instead of waiting for target center.");
}

if (/canDamageTarget\(target\)/.test(fireLaserSource)) {
  throw new Error("Laser must not use bullet-style center visibility gating.");
}

if (!/if \(type === "laser"\) this\.fireTimer = 0;/.test(source)) {
  throw new Error("Laser pickup should fire immediately instead of showing a harmless beam first.");
}

console.log("Laser hit check passed.");
