"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const gamePath = path.join(__dirname, "..", "game.js");
const source = fs.readFileSync(gamePath, "utf8");
const colorsSource = source.match(/const CORE_LEVEL_COLORS = \[[\s\S]*?\n\];/)?.[0];

if (!colorsSource) {
  throw new Error("CORE_LEVEL_COLORS is missing.");
}

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${colorsSource}\nthis.CORE_LEVEL_COLORS = CORE_LEVEL_COLORS;`, sandbox);

const { CORE_LEVEL_COLORS } = sandbox;
const uniqueShirts = new Set(CORE_LEVEL_COLORS.map((level) => level.shirt));
const uniqueShots = new Set(CORE_LEVEL_COLORS.map((level) => level.shot));

if (CORE_LEVEL_COLORS.length < 10) {
  throw new Error("Level visuals should keep enough palette entries for readable cycling.");
}

if (uniqueShirts.size !== CORE_LEVEL_COLORS.length || uniqueShots.size !== CORE_LEVEL_COLORS.length) {
  throw new Error("Every level needs distinct shirt and shot colors.");
}

if (!/player\.draw\(ctx, this\.assets, this\.upgradeLevel(?:,|\))/.test(source)) {
  throw new Error("Player drawing must receive the current upgrade level.");
}

if (!/coreLevelColors\(this\.upgradeLevel\)/.test(source)) {
  throw new Error("Bullets must use the current upgrade-level color palette.");
}

if (!/tracePlayerShirt\(ctx,[\s\S]*?this\.w, this\.h\)/.test(source)) {
  throw new Error("Player shirt tint must use the exact shirt path instead of a shifted overlay.");
}

if (!/const LEVEL_BASE_SCORE = 500;/.test(source) || !/function scoreForLevel\(level\)/.test(source)) {
  throw new Error("Advanced mode must keep score-based level thresholds.");
}

if (/MAX_UPGRADE_LEVEL/.test(source) || !/this\.upgradeLevel \+= 1/.test(source) || !/setPowerScale\(this\.upgradeLevel\)/.test(source)) {
  throw new Error("Level Up pickups must scale indefinitely and grow the player with each level.");
}

if (!/ADVANCED_PROGRESS_KEY/.test(source) || !/function buildLootboxChoices/.test(source)) {
  throw new Error("Advanced mode must persist customization progress and provide lootbox choices.");
}

if (!/ctx\.textBaseline = "middle";[\s\S]*Giant Beetle Boss[\s\S]*labelW/.test(source)) {
  throw new Error("Boss bar label should be vertically centered and separated from the health meter.");
}

console.log("Level visual progression check passed.");
