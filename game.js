"use strict";

const DEBUG = false;
const WIDTH = 960;
const HEIGHT = 360;
const GROUND_Y = 304;
const GRAVITY = 1900;
const SHOOT_LANE_Y = GROUND_Y - 36;
const STORAGE_KEY = "bugBlasterRunnerHighScore";
const LEADERBOARD_KEY = "bugBlasterRunnerLeaderboard";
const PERSONAL_SCORES_KEY = "bugBlasterRunnerPersonalScores";
const ONBOARDING_KEY = "bugBlasterRunnerOnboardingSeen";
const ADVANCED_PROGRESS_KEY = "bugBlasterAdvancedProgress";
const SCORE_API = "/api/scores";
const PRODUCTION_SCORE_API = "https://game.phunnysunny.com/api/scores";
const LEADERBOARD_LIMIT = 10;
const MONSTER_MASH_WINDOW = 10;
const MONSTER_MASH_TRIGGER_COUNT = 30;
const CURSED_LOOTBOX_CHANCE = 0.05;
const CURSED_UI_SCALE_STEP = 0.1;
const ASSET_PATHS = {
  player: "assets/player.svg",
  groundCrawler: "assets/ground-crawler.svg",
  flyingBug: "assets/flying-bug.svg",
  fastSkitter: "assets/fast-skitter.svg",
  tankBeetle: "assets/tank-beetle.svg",
  zigzagBug: "assets/zigzag-bug.svg",
  miniSwarm: "assets/mini-swarm.svg",
  giantBeetleBoss: "assets/giant-beetle-boss.svg",
  waspQueenBoss: "assets/wasp-queen-boss.svg",
  cloud: "assets/cloud.svg",
  tree: "assets/tree.svg",
  bush: "assets/bush.svg",
  hills: "assets/hills.svg",
  badge: "assets/ui-badge.svg",
  rapidPower: "assets/power-rapid.svg",
  spreadPower: "assets/power-spread.svg",
  piercePower: "assets/power-pierce.svg",
  laserPower: "assets/power-laser.svg",
  rocketPower: "assets/power-rocket.svg",
  dronePower: "assets/power-drone.svg",
  healthPower: "assets/power-health.svg",
  maxHealthPower: "assets/power-max-health.svg",
  upgradePower: "assets/ui-bolt.svg"
};

const WEAPONS = {
  rapid: { name: "Rapid Fire", label: "R", color: "#ff5f57", duration: 10, asset: "rapidPower" },
  spread: { name: "Spread Shot", label: "3", color: "#8b5cf6", duration: 10, asset: "spreadPower" },
  pierce: { name: "Piercing Shot", label: "P", color: "#2f66d5", duration: 11, asset: "piercePower" },
  laser: { name: "Laser Beam", label: "L", color: "#f43f5e", duration: 4, asset: "laserPower" },
  rocket: { name: "Rocket Shot", label: "X", color: "#f97316", duration: 11, asset: "rocketPower" },
  drone: { name: "Drone Helper", label: "D", color: "#5fc8a6", duration: 12, asset: "dronePower" }
};

const PICKUPS = {
  ...WEAPONS,
  health: { name: "Health", label: "+", color: "#47c26b", asset: "healthPower" },
  maxHealth: { name: "Max Health", label: "H", color: "#22c55e", asset: "maxHealthPower" },
  upgrade: { name: "Level Up", label: "L", color: "#ffd166", asset: "upgradePower" }
};

const MAX_UPGRADE_LEVEL = 10;
const LEVEL_BASE_SCORE = 500;
const CORE_LEVEL_COLORS = [
  { shirt: "#2f8fdd", shot: "#fff4a3", stroke: "#d9731f", glow: "#fff4a3" },
  { shirt: "#35b6ff", shot: "#8ee8ff", stroke: "#176d9b", glow: "#8ee8ff" },
  { shirt: "#2dd4bf", shot: "#74f7c1", stroke: "#14785f", glow: "#74f7c1" },
  { shirt: "#47c26b", shot: "#c8ff7a", stroke: "#55851a", glow: "#c8ff7a" },
  { shirt: "#ffd166", shot: "#ffe866", stroke: "#a05b14", glow: "#ffe866" },
  { shirt: "#f97316", shot: "#ff9d4d", stroke: "#8f2e12", glow: "#ff9d4d" },
  { shirt: "#f43f5e", shot: "#ff75a0", stroke: "#8a1231", glow: "#ff75a0" },
  { shirt: "#8b5cf6", shot: "#c4a7ff", stroke: "#43208e", glow: "#c4a7ff" },
  { shirt: "#4f46e5", shot: "#a5b4fc", stroke: "#2d237f", glow: "#a5b4fc" },
  { shirt: "#ecfeff", shot: "#ffffff", stroke: "#2f66d5", glow: "#9af6ff" }
];

const OUTFITS = {
  classic: { name: "Classic Runner", shirt: null, accent: "#ffd166", note: "Original Bug Blaster look." },
  sunset: { name: "Sunset Jacket", shirt: "#ff6b35", accent: "#ffe866", note: "Bright orange outfit tint." },
  mint: { name: "Mint Scout", shirt: "#5fc8a6", accent: "#ecfeff", note: "Cool green outfit tint." },
  violet: { name: "Violet Volt", shirt: "#8b5cf6", accent: "#f5d0fe", note: "Electric purple outfit tint." },
  shadow: { name: "Shadow Suit", shirt: "#19323c", accent: "#9af6ff", note: "Dark suit with blue highlights." }
};

const BULLET_STYLES = {
  spark: { name: "Spark Rounds", shot: null, stroke: null, glow: null, shape: "ellipse", note: "Classic glowing bug blaster shots." },
  bubble: { name: "Bubble Bursts", shot: "#7dd3fc", stroke: "#0ea5e9", glow: "#bae6fd", shape: "bubble", note: "Round blue plasma bubbles." },
  ember: { name: "Ember Bolts", shot: "#fb923c", stroke: "#7c2d12", glow: "#fed7aa", shape: "diamond", note: "Angular orange bolts." },
  star: { name: "Star Shots", shot: "#fde047", stroke: "#a16207", glow: "#fef9c3", shape: "star", note: "Tiny star-shaped rounds." }
};

const ACROBATICS = {
  classic: { name: "Classic Jump", note: "Reliable standard jump." },
  backflip: { name: "Backflip", note: "Spin through every jump." },
  hover: { name: "Two-Second Hover", note: "Hold jump while falling to hover for up to 2 seconds." }
};

const LOOT_REWARDS = [
  { category: "outfits", id: "sunset" },
  { category: "outfits", id: "mint" },
  { category: "outfits", id: "violet" },
  { category: "outfits", id: "shadow" },
  { category: "bullets", id: "bubble" },
  { category: "bullets", id: "ember" },
  { category: "bullets", id: "star" },
  { category: "acrobatics", id: "backflip" },
  { category: "acrobatics", id: "hover" }
];
const ROCKET = {
  baseSpeed: 660,
  speedUpgrade: 28,
  baseInterval: 0.44,
  intervalUpgrade: 0.018,
  minInterval: 0.28,
  baseDamage: 4,
  upgradedDamage: 5,
  splashRadius: 118,
  bossSplashRadius: 132,
  splashDamage: 4,
  bossSplashDamage: 3,
  knockback: 132
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function coreLevelColors(level) {
  return CORE_LEVEL_COLORS[clamp(Math.floor(level) - 1, 0, MAX_UPGRADE_LEVEL - 1)];
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function circleRectOverlap(cx, cy, radius, rect) {
  const closestX = clamp(cx, rect.x, rect.x + rect.w);
  const closestY = clamp(cy, rect.y, rect.y + rect.h);
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy <= radius * radius;
}

class AssetManager {
  constructor(paths) {
    this.images = {};
    Object.entries(paths).forEach(([key, src]) => {
      const img = new Image();
      img.src = src;
      this.images[key] = img;
    });
  }

  get(key) {
    return this.images[key];
  }
}

class AudioManager {
  constructor() {
    this.context = null;
    this.muted = localStorage.getItem("bugBlasterMuted") === "true";
  }

  ensure() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.context = new AudioContext();
    }
    if (this.context && this.context.state === "suspended") this.context.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("bugBlasterMuted", String(this.muted));
  }

  beep(type) {
    if (this.muted) return;
    this.ensure();
    if (!this.context) return;
    const now = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const data = {
      shoot: [520, 0.025, 0.035, "square"],
      hit: [180, 0.04, 0.055, "sawtooth"],
      pop: [760, 0.05, 0.06, "triangle"],
      power: [920, 0.08, 0.09, "sine"],
      damage: [95, 0.16, 0.12, "sawtooth"],
      boss: [140, 0.45, 0.18, "square"],
      win: [680, 0.25, 0.13, "triangle"],
      grave: [56, 0.7, 0.16, "sawtooth"],
      over: [70, 0.55, 0.18, "sawtooth"]
    }[type] || [440, 0.05, 0.04, "sine"];
    osc.frequency.setValueAtTime(data[0], now);
    osc.type = data[3];
    gain.gain.setValueAtTime(data[2], now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + data[1]);
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(now);
    osc.stop(now + data[1]);
  }

  playMonsterMash() {
    this.ensure();
    if (!this.context) return;
    this.muted = false;
    localStorage.setItem("bugBlasterMuted", "false");
    const now = this.context.currentTime;
    const notes = [
      [196, 0, 0.18], [196, 0.22, 0.18], [247, 0.44, 0.18], [262, 0.66, 0.26],
      [247, 0.98, 0.16], [220, 1.18, 0.16], [196, 1.38, 0.32], [0, 1.76, 0.08],
      [196, 1.9, 0.18], [196, 2.12, 0.18], [247, 2.34, 0.18], [294, 2.56, 0.26],
      [262, 2.88, 0.16], [247, 3.08, 0.16], [220, 3.28, 0.34],
      [165, 3.72, 0.2], [196, 3.96, 0.2], [220, 4.2, 0.2], [247, 4.44, 0.44]
    ];
    notes.forEach(([frequency, offset, duration], index) => {
      if (!frequency) return;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = index % 4 === 0 ? "square" : "triangle";
      osc.frequency.setValueAtTime(frequency, now + offset);
      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.075, now + offset + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + duration);
      osc.connect(gain);
      gain.connect(this.context.destination);
      osc.start(now + offset);
      osc.stop(now + offset + duration + 0.04);
    });
    for (let beat = 0; beat < 10; beat++) {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(82, now + beat * 0.48);
      gain.gain.setValueAtTime(0.001, now + beat * 0.48);
      gain.gain.exponentialRampToValueAtTime(0.05, now + beat * 0.48 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + beat * 0.48 + 0.18);
      osc.connect(gain);
      gain.connect(this.context.destination);
      osc.start(now + beat * 0.48);
      osc.stop(now + beat * 0.48 + 0.22);
    }
  }
}

class BackgroundLayer {
  constructor(imageKey, y, speedFactor, spacing, scale, alpha, widthHint, heightHint) {
    this.imageKey = imageKey;
    this.y = y;
    this.speedFactor = speedFactor;
    this.spacing = spacing;
    this.scale = scale;
    this.alpha = alpha;
    this.widthHint = widthHint;
    this.heightHint = heightHint;
    this.offset = rand(0, spacing);
  }

  update(dt, worldSpeed) {
    this.offset = (this.offset - worldSpeed * this.speedFactor * dt) % this.spacing;
  }

  draw(ctx, assets) {
    const img = assets.get(this.imageKey);
    ctx.save();
    ctx.globalAlpha = this.alpha;
    for (let x = this.offset - this.spacing; x < WIDTH + this.spacing; x += this.spacing) {
      const w = this.widthHint * this.scale;
      const h = this.heightHint * this.scale;
      ctx.drawImage(img, x, this.y, w, h);
    }
    ctx.restore();
  }
}

class Player {
  constructor() {
    this.x = 94;
    this.w = 58;
    this.h = 72;
    this.y = GROUND_Y - this.h;
    this.vy = 0;
    this.health = 3;
    this.maxHealth = 3;
    this.invincible = 0;
    this.grounded = true;
    this.walkTime = 0;
    this.recoil = 0;
    this.airTime = 0;
    this.hoverTime = 0;
  }

  reset() {
    this.y = GROUND_Y - this.h;
    this.vy = 0;
    this.health = 3;
    this.maxHealth = 3;
    this.invincible = 0;
    this.grounded = true;
    this.walkTime = 0;
    this.recoil = 0;
    this.airTime = 0;
    this.hoverTime = 0;
  }

  jump(acrobatics = "classic") {
    if (this.grounded) {
      this.vy = -760;
      this.grounded = false;
      this.airTime = 0;
      this.hoverTime = acrobatics === "hover" ? 2 : 0;
    }
  }

  update(dt, acrobatics = "classic", jumpHeld = false) {
    this.walkTime += dt;
    this.vy += 2050 * dt;
    if (acrobatics === "hover" && jumpHeld && !this.grounded && this.vy > -80 && this.hoverTime > 0) {
      this.hoverTime = Math.max(0, this.hoverTime - dt);
      this.vy = Math.min(this.vy, 72);
    }
    this.y += this.vy * dt;
    if (this.y + this.h >= GROUND_Y) {
      this.y = GROUND_Y - this.h;
      this.vy = 0;
      this.grounded = true;
      this.airTime = 0;
      this.hoverTime = 0;
    } else {
      this.airTime += dt;
    }
    if (this.invincible > 0) this.invincible -= dt;
    this.recoil = Math.max(0, this.recoil - dt * 6);
  }

  damage() {
    if (this.invincible > 0) return false;
    this.health -= 1;
    this.invincible = 1.15;
    return true;
  }

  barrel() {
    return { x: this.x + 55, y: this.y + 36 };
  }

  hitbox() {
    return { x: this.x + 10, y: this.y + 8, w: this.w - 16, h: this.h - 8 };
  }

  draw(ctx, assets, coreLevel = 0, customization = defaultAdvancedProgress().equipped) {
    const blink = this.invincible > 0 && Math.floor(this.invincible * 14) % 2 === 0;
    if (blink) ctx.globalAlpha = 0.45;
    const drawX = this.x - this.recoil * 5;
    const acrobatics = customization.acrobatics || "classic";
    const rotation = acrobatics === "backflip" && !this.grounded ? this.airTime * Math.PI * 3.2 : 0;
    ctx.save();
    if (rotation) {
      ctx.translate(drawX + this.w / 2, this.y + this.h / 2);
      ctx.rotate(rotation);
      ctx.drawImage(assets.get("player"), -this.w / 2, -this.h / 2, this.w, this.h);
    } else {
      ctx.drawImage(assets.get("player"), drawX, this.y, this.w, this.h);
    }
    const colors = coreLevelColors(coreLevel);
    const outfit = OUTFITS[customization.outfit] || OUTFITS.classic;
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = outfit.shirt || colors.shirt;
    tracePlayerShirt(ctx, rotation ? -this.w / 2 : drawX, rotation ? -this.h / 2 : this.y, this.w, this.h);
    ctx.fill();
    ctx.restore();
    if (outfit.accent) {
      ctx.fillStyle = outfit.accent;
      ctx.beginPath();
      ctx.arc(rotation ? 3 : drawX + this.w / 2 + 3, rotation ? -this.h / 2 + 18 : this.y + 18, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    if (DEBUG) drawRect(ctx, this.hitbox(), "#ff00ff");
  }
}

class Bullet {
  constructor(x, y, vx, vy, type, damage, pierce, colors, bulletStyle = "spark") {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.type = type;
    this.damage = damage;
    this.pierce = pierce;
    this.radius = type === "rocket" ? 8 : 4;
    this.dead = false;
    this.hitIds = new Set();
    this.colors = colors;
    this.bulletStyle = bulletStyle;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.x > WIDTH + 80 || this.y < -80 || this.y > HEIGHT + 80) this.dead = true;
  }

  draw(ctx) {
    ctx.save();
    const cosmetic = BULLET_STYLES[this.bulletStyle] || BULLET_STYLES.spark;
    const fill = cosmetic.shot || this.colors?.shot || (this.type === "rocket" ? "#f97316" : this.type === "drone" ? "#9af6ff" : "#fff4a3");
    ctx.fillStyle = fill;
    ctx.strokeStyle = cosmetic.stroke || this.colors?.stroke || (this.type === "rocket" ? "#19323c" : "#d9731f");
    ctx.lineWidth = 2;
    ctx.shadowColor = cosmetic.glow || this.colors?.glow || fill;
    ctx.shadowBlur = this.type === "rocket" ? 12 : 8;
    if (this.type === "rocket") {
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, 13, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffcc4d";
      ctx.beginPath();
      ctx.moveTo(this.x - 12, this.y);
      ctx.lineTo(this.x - 22, this.y - 5);
      ctx.lineTo(this.x - 22, this.y + 5);
      ctx.fill();
    } else {
      if (cosmetic.shape === "diamond") {
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y);
        ctx.lineTo(this.x, this.y - 8);
        ctx.lineTo(this.x - 12, this.y);
        ctx.lineTo(this.x, this.y + 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (cosmetic.shape === "star") {
        drawStar(ctx, this.x, this.y, 5, 11, 5);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, cosmetic.shape === "bubble" ? 8 : 10, cosmetic.shape === "bubble" ? 8 : this.radius + 1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  hitbox() {
    return { x: this.x - 12, y: this.y - 8, w: 24, h: 16 };
  }
}

let nextEnemyId = 1;

class Enemy {
  constructor(type, x, yOverride) {
    const cfg = Enemy.config(type);
    this.id = nextEnemyId++;
    this.type = type;
    this.x = x;
    this.w = cfg.w;
    this.h = cfg.h;
    this.baseY = yOverride ?? cfg.y;
    this.y = this.baseY;
    this.speed = cfg.speed * rand(0.92, 1.1);
    this.maxHealth = cfg.health;
    this.health = cfg.health;
    this.score = cfg.score;
    this.asset = cfg.asset;
    this.dead = false;
    this.time = rand(0, 10);
    this.hitFlash = 0;
  }

  static config(type) {
    return {
      ground: { w: 58, h: 40, y: GROUND_Y - 40 - 2, speed: 198, health: 1, score: 10, asset: "groundCrawler" },
      flying: { w: 62, h: 44, y: SHOOT_LANE_Y - 30, speed: 176, health: 1, score: 15, asset: "flyingBug" },
      fast: { w: 46, h: 30, y: GROUND_Y - 30 - 12, speed: 290, health: 1, score: 20, asset: "fastSkitter" },
      tank: { w: 86, h: 60, y: GROUND_Y - 60 + 2, speed: 145, health: 3, score: 40, asset: "giantBeetleBoss" },
      zigzag: { w: 62, h: 44, y: SHOOT_LANE_Y - 30, speed: 184, health: 2, score: 25, asset: "flyingBug" },
      mini: { w: 36, h: 24, y: SHOOT_LANE_Y - 14, speed: 238, health: 1, score: 5, asset: "fastSkitter" }
    }[type];
  }

  update(dt, worldSpeed) {
    this.time += dt;
    this.x -= (this.speed + worldSpeed * 0.2) * dt;
    if (this.knockbackVx) {
      this.x += this.knockbackVx * dt;
      this.knockbackVx *= Math.pow(0.025, dt);
      if (Math.abs(this.knockbackVx) < 8) this.knockbackVx = 0;
    }
    if (this.type === "flying" || this.type === "mini" || this.type === "zigzag") {
      this.y = this.baseY + Math.sin(this.time * 8) * 2;
    }
    if (this.hitFlash > 0) this.hitFlash -= dt;
    if (this.x + this.w < -80) this.dead = true;
  }

  damage(amount) {
    this.health -= amount;
    this.hitFlash = 0.1;
    if (this.health <= 0) this.dead = true;
  }

  knockbackFrom(x, force) {
    const centerX = this.x + this.w / 2;
    const direction = centerX >= x ? 1 : -1;
    this.knockbackVx = (this.knockbackVx || 0) + direction * force;
  }

  hitbox() {
    return { x: this.x + 3, y: this.y + 3, w: this.w - 6, h: this.h - 6 };
  }

  draw(ctx, assets, graveyardMode = false) {
    ctx.save();
    if (this.hitFlash > 0) {
      ctx.filter = "brightness(2.4)";
    }
    const wingPulse = this.type === "flying" || this.type === "mini" ? Math.sin(this.time * 18) * 0.04 + 1 : 1;
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    ctx.scale(1, wingPulse);
    ctx.drawImage(assets.get(this.asset), -this.w / 2, -this.h / 2, this.w, this.h);
    if (graveyardMode) {
      ctx.globalCompositeOperation = "source-atop";
      ctx.fillStyle = "rgba(126, 211, 83, 0.46)";
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#d8ff9a";
      ctx.beginPath();
      ctx.arc(-this.w * 0.14, -this.h * 0.12, 3, 0, Math.PI * 2);
      ctx.arc(this.w * 0.12, -this.h * 0.12, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    if (this.maxHealth > 1) {
      ctx.fillStyle = "rgba(16, 24, 32, 0.45)";
      ctx.fillRect(this.x, this.y - 8, this.w, 4);
      ctx.fillStyle = "#ffcc4d";
      ctx.fillRect(this.x, this.y - 8, this.w * (this.health / this.maxHealth), 4);
    }
    if (DEBUG) drawRect(ctx, this.hitbox(), "#ff0044");
  }
}

class Boss {
  constructor(kind, count, timeAlive) {
    this.kind = kind;
    this.x = WIDTH + 120;
    this.w = kind === "beetle" ? 150 : 138;
    this.h = kind === "beetle" ? 104 : 108;
    this.baseY = kind === "beetle" ? GROUND_Y - this.h : SHOOT_LANE_Y - 62;
    this.y = this.baseY;
    this.maxHealth = Math.floor((kind === "beetle" ? 34 : 28) + count * 13 + timeAlive * 0.14);
    this.health = this.maxHealth;
    this.time = 0;
    this.spawnTimer = 2.6;
    this.dead = false;
    this.entered = false;
    this.hitFlash = 0;
    this.asset = kind === "beetle" ? "giantBeetleBoss" : "waspQueenBoss";
  }

  update(dt, game) {
    this.time += dt;
    const targetX = this.kind === "beetle" ? 710 : 735;
    if (this.x > targetX) this.x -= 72 * dt;
    else {
      this.entered = true;
      this.x = targetX + Math.sin(this.time * 1.2) * 26 + (this.knockbackOffset || 0);
    }
    if (this.knockbackOffset) {
      this.knockbackOffset *= Math.pow(0.035, dt);
      if (Math.abs(this.knockbackOffset) < 1) this.knockbackOffset = 0;
    }
    if (this.kind === "wasp") this.y = this.baseY + Math.sin(this.time * 1.9) * 12;
    else this.y = this.baseY + Math.sin(this.time * 1.35) * 8;
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = this.kind === "wasp" ? rand(2.1, 3.0) : rand(2.8, 3.8);
      const type = this.kind === "wasp" ? (Math.random() < 0.55 ? "mini" : "flying") : (Math.random() < 0.7 ? "ground" : "fast");
      game.spawnEnemy(type, this.x - 10);
    }
    if (this.hitFlash > 0) this.hitFlash -= dt;
  }

  damage(amount) {
    this.health -= amount;
    this.hitFlash = 0.1;
    if (this.health <= 0) this.dead = true;
  }

  knockbackFrom(x, force) {
    const centerX = this.x + this.w / 2;
    const direction = centerX >= x ? 1 : -1;
    this.knockbackOffset = clamp((this.knockbackOffset || 0) + direction * force * 0.18, -26, 26);
  }

  hitbox() {
    return { x: this.x + 14, y: this.y + 16, w: this.w - 28, h: this.h - 24 };
  }

  draw(ctx, assets) {
    ctx.save();
    if (this.hitFlash > 0) ctx.filter = "brightness(2.1)";
    ctx.drawImage(assets.get(this.asset), this.x, this.y, this.w, this.h);
    ctx.restore();
    if (DEBUG) drawRect(ctx, this.hitbox(), "#f00");
  }
}

class PowerUp {
  constructor(type, x, y) {
    this.type = type;
    this.pickup = PICKUPS[type];
    this.x = x;
    this.baseY = y;
    this.y = y;
    this.w = 34;
    this.h = 34;
    this.time = rand(0, 10);
    this.dead = false;
  }

  update(dt, worldSpeed) {
    this.time += dt;
    this.x -= (worldSpeed * 0.88 + 72) * dt;
    this.y = this.baseY + Math.sin(this.time * 4) * 12;
    if (this.x + this.w < -40) this.dead = true;
  }

  hitbox() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  draw(ctx, assets) {
    ctx.save();
    ctx.shadowColor = this.pickup.color;
    ctx.shadowBlur = 10;
    ctx.drawImage(assets.get(this.pickup.asset), this.x - 2, this.y - 2, this.w + 4, this.h + 4);
    ctx.restore();
    if (DEBUG) drawRect(ctx, this.hitbox(), "#00ff00");
  }
}

class Particle {
  constructor(x, y, color, size, vx, vy, life) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
  }

  update(dt) {
    this.life -= dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += 300 * dt;
  }

  draw(ctx) {
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

class Game {
  constructor(canvas, muteButton, restartButton) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.muteButton = muteButton;
    this.restartButton = restartButton;
    this.initialsPanel = document.getElementById("initialsPanel");
    this.initialsInput = document.getElementById("initialsInput");
    this.initialsSave = document.getElementById("initialsSave");
    this.onboardingPanel = document.getElementById("onboardingPanel");
    this.onboardingButton = document.getElementById("onboardingButton");
    this.lootboxPanel = document.getElementById("lootboxPanel");
    this.lootboxOptions = document.getElementById("lootboxOptions");
    this.lootboxToast = document.getElementById("lootboxToast");
    this.lootboxToastTimer = 0;
    this.onboardingVisible = localStorage.getItem(ONBOARDING_KEY) !== "true";
    this.initialsPanelVisible = false;
    this.lootboxPanelVisible = false;
    this.assets = new AssetManager(ASSET_PATHS);
    this.audio = new AudioManager();
    this.player = new Player();
    this.advancedProgress = loadAdvancedProgress();
    this.applyAdvancedUiScale();
    this.leaderboard = loadLeaderboard();
    this.personalScores = loadPersonalScores();
    this.pendingEntry = null;
    this.initials = "";
    this.layers = [
      new BackgroundLayer("hills", 226, 0.11, 310, 1.08, 0.7, 180, 70),
      new BackgroundLayer("cloud", 48, 0.08, 300, 0.84, 0.92, 130, 54),
      new BackgroundLayer("tree", 184, 0.2, 245, 0.42, 0.58, 76, 108),
      new BackgroundLayer("bush", 272, 0.38, 170, 0.55, 0.82, 126, 50)
    ];
    this.state = "start";
    this.highScore = Math.max(Number(localStorage.getItem(STORAGE_KEY) || 0), this.leaderboard[0]?.score || 0);
    this.lastTime = 0;
    this.bindInput();
    this.reset();
    this.updateOnboarding();
    this.syncScores();
    this.updateButtons();
    requestAnimationFrame((t) => this.loop(t));
  }

  reset() {
    this.player.reset();
    this.bullets = [];
    this.enemies = [];
    this.powerUps = [];
    this.particles = [];
    this.boss = null;
    this.score = 0;
    this.elapsed = 0;
    this.worldSpeed = 230;
    this.spawnTimer = 0.55;
    this.powerTimer = 7;
    this.upgradeTimer = 28;
    this.fireTimer = 0.04;
    this.droneFireTimer = 0.3;
    this.laserTick = 0;
    this.activeWeapon = null;
    this.weaponTimer = 0;
    this.weaponDuration = 0;
    this.weaponQueue = [];
    this.upgradeLevel = 1;
    this.bossCount = 0;
    this.nextBossTime = 45;
    this.difficulty = 0;
    this.pendingEntry = null;
    this.initials = "";
    this.playerLevel = 0;
    this.pendingLevel = 0;
    this.lootboxChoices = [];
    this.jumpHeld = false;
    this.graveyardMode = false;
    this.fakeoutTimer = 0;
    this.fakeoutDuration = 4.2;
    this.fakeoutPlayerX = this.player.x;
    this.monsterMashPresses = [];
    this.monsterMashCooldown = 0;
    this.updateButtons();
  }

  bindInput() {
    window.addEventListener("keydown", (event) => {
      if (this.pendingEntry) {
        if (/^[a-z]$/i.test(event.key)) {
          event.preventDefault();
          this.addInitial(event.key.toUpperCase());
        } else if (event.key === "Backspace") {
          event.preventDefault();
          this.removeInitial();
        } else if (event.key === "Enter") {
          event.preventDefault();
          this.submitInitials();
        }
        return;
      }
      if (this.state === "levelup") return;
      if (this.onboardingVisible) {
        if (event.key === "Enter" || event.key === " " || event.code === "Space") {
          event.preventDefault();
          this.dismissOnboarding();
        }
        return;
      }
      if (["Space", "ArrowUp"].includes(event.code) || event.key.toLowerCase() === "w") {
        event.preventDefault();
        this.jumpHeld = true;
        this.actionJump();
      } else if (event.key === "Enter") {
        event.preventDefault();
        this.startOrRestart();
      } else if (event.key.toLowerCase() === "p") {
        this.togglePause();
      } else if (event.key.toLowerCase() === "m") {
        if (!this.registerMonsterMashPress()) this.audio.toggleMute();
        this.updateButtons();
      }
    });
    window.addEventListener("keyup", (event) => {
      if (["Space", "ArrowUp"].includes(event.code) || event.key.toLowerCase() === "w") {
        this.jumpHeld = false;
      }
    });
    window.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      const target = event.target;
      if (target.closest?.("button, input, textarea, select, form, a")) return;
      event.preventDefault();
      if (this.onboardingVisible) {
        this.dismissOnboarding();
        return;
      }
      if (this.pendingEntry) {
        this.focusInitialsInput();
        return;
      }
      if (this.state === "levelup") return;
      this.jumpHeld = true;
      this.actionJump();
    }, { passive: false });
    window.addEventListener("pointerup", () => {
      this.jumpHeld = false;
    });
    window.addEventListener("pointercancel", () => {
      this.jumpHeld = false;
    });
    this.canvas.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (this.onboardingVisible) {
        this.dismissOnboarding();
        return;
      }
      if (!this.pendingEntry && this.state !== "levelup") {
        this.jumpHeld = true;
        this.actionJump();
      }
    }, { passive: false });
    this.restartButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.startOrRestart();
    });
    this.muteButton.addEventListener("click", () => {
      this.audio.toggleMute();
      this.updateButtons();
    });
    this.initialsInput.addEventListener("input", () => {
      this.initials = this.initialsInput.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
      this.initialsInput.value = this.initials;
      this.checkProgressWipeCode();
      this.updateInitialsPanel();
    });
    this.initialsPanel.addEventListener("submit", (event) => {
      event.preventDefault();
      this.submitInitials();
    });
    this.initialsPanel.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });
    this.onboardingButton?.addEventListener("click", (event) => {
      event.stopPropagation();
      this.dismissOnboarding();
    });
    this.onboardingPanel?.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });
    this.lootboxOptions?.addEventListener("click", (event) => {
      const button = event.target.closest?.("[data-loot-index]");
      if (!button) return;
      this.claimLootbox(Number(button.dataset.lootIndex));
    });
    this.lootboxPanel?.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });
  }

  startOrRestart() {
    if (this.pendingEntry) return;
    if (this.onboardingVisible) return;
    if (this.state === "levelup") return;
    if (this.state === "fakeout") return;
    this.audio.ensure();
    if (this.state === "start" || this.state === "gameover") {
      this.reset();
      this.state = "playing";
      this.updateButtons();
    }
  }

  actionJump() {
    if (this.onboardingVisible) return;
    if (this.state === "fakeout") return;
    if (this.state === "playing") this.player.jump(this.currentAcrobatics());
    else if (this.state === "start" || this.state === "gameover") this.startOrRestart();
  }

  togglePause() {
    if (this.state === "playing") {
      this.state = "paused";
      this.updateButtons();
    } else if (this.state === "paused") {
      this.state = "playing";
      this.updateButtons();
    }
  }

  updateButtons() {
    this.muteButton.textContent = this.audio.muted ? "Sound Off" : "Sound On";
    this.restartButton.classList.toggle("is-visible", this.state === "gameover" && !this.pendingEntry);
    this.updateInitialsPanel();
    this.updateLootboxPanel();
  }

  dismissOnboarding() {
    if (!this.onboardingVisible) return;
    this.onboardingVisible = false;
    localStorage.setItem(ONBOARDING_KEY, "true");
    this.updateOnboarding();
  }

  updateOnboarding() {
    if (!this.onboardingPanel) return;
    this.onboardingPanel.classList.toggle("is-visible", this.onboardingVisible);
    this.onboardingPanel.setAttribute("aria-hidden", String(!this.onboardingVisible));
    if (this.onboardingButton) this.onboardingButton.disabled = !this.onboardingVisible;
    if (this.onboardingVisible) window.setTimeout(() => this.onboardingButton?.focus({ preventScroll: true }), 0);
  }

  updateInitialsPanel() {
    if (!this.initialsPanel || !this.initialsInput || !this.initialsSave) return;
    const visible = Boolean(this.pendingEntry);
    const wasVisible = this.initialsPanelVisible;
    this.initialsPanelVisible = visible;
    this.initialsPanel.classList.toggle("is-visible", visible);
    this.initialsInput.disabled = !visible;
    this.initialsSave.disabled = this.initials.length !== 3;
    if (!visible) {
      this.initialsInput.value = "";
      return;
    }
    if (this.initialsInput.value !== this.initials) this.initialsInput.value = this.initials;
    if (!wasVisible) window.setTimeout(() => this.focusInitialsInput(), 0);
  }

  focusInitialsInput() {
    if (!this.pendingEntry || !this.initialsInput) return;
    this.initialsInput.focus({ preventScroll: true });
    this.initialsInput.select();
  }

  addInitial(letter) {
    if (!this.pendingEntry || this.initials.length >= 3) return;
    this.initials += letter;
    this.checkProgressWipeCode();
    this.updateInitialsPanel();
  }

  removeInitial() {
    if (!this.pendingEntry) return;
    this.initials = this.initials.slice(0, -1);
    this.updateInitialsPanel();
  }

  submitInitials() {
    if (!this.pendingEntry || this.initials.length !== 3) return;
    if (this.checkProgressWipeCode()) return;
    const entry = { initials: this.initials, score: this.pendingEntry.score };
    this.leaderboard = normalizeScores([...this.leaderboard, entry]);
    saveLocalLeaderboard(this.leaderboard);
    postScore(entry).then((scores) => {
      if (scores.length) this.setLeaderboard(scores);
    });
    this.highScore = Math.max(this.highScore, this.leaderboard[0]?.score || 0);
    this.pendingEntry = null;
    this.initials = "";
    this.updateButtons();
  }

  currentAcrobatics() {
    return this.advancedProgress.equipped.acrobatics || "classic";
  }

  currentBulletStyle() {
    return this.advancedProgress.equipped.bullet || "spark";
  }

  currentUiScale() {
    return clamp(Number(this.advancedProgress.curse?.uiScale) || 1, 1, 4);
  }

  applyAdvancedUiScale() {
    document.documentElement.style.setProperty("--advanced-ui-scale", this.currentUiScale().toFixed(3));
  }

  registerMonsterMashPress() {
    const now = performance.now() / 1000;
    this.monsterMashPresses = this.monsterMashPresses.filter((time) => now - time <= MONSTER_MASH_WINDOW);
    this.monsterMashPresses.push(now);
    if (this.monsterMashPresses.length < MONSTER_MASH_TRIGGER_COUNT || now < this.monsterMashCooldown) {
      return this.monsterMashPresses.length > 1;
    }
    this.monsterMashPresses = [];
    this.monsterMashCooldown = now + 6;
    this.audio.playMonsterMash();
    this.updateButtons();
    for (let i = 0; i < 36; i++) {
      this.spawnParticle(rand(190, WIDTH - 110), rand(86, GROUND_Y - 20), "#b6ff72", rand(2, 6), rand(-80, 80), rand(-180, -20), 0.72);
    }
    return true;
  }

  checkProgressWipeCode() {
    if (this.initials !== "SAI") return false;
    wipeLocalProgress();
    this.leaderboard = [];
    this.personalScores = [];
    this.highScore = 0;
    this.advancedProgress = defaultAdvancedProgress();
    this.applyAdvancedUiScale();
    this.pendingEntry = null;
    this.initials = "";
    this.reset();
    this.state = "start";
    this.updateButtons();
    return true;
  }

  checkLevelProgress() {
    const nextLevel = this.playerLevel + 1;
    if (Math.floor(this.score) < scoreForLevel(nextLevel)) return;
    this.pendingLevel = nextLevel;
    this.lootboxChoices = buildLootboxChoices(this.advancedProgress, nextLevel);
    this.state = "levelup";
    this.updateButtons();
  }

  updateLootboxPanel() {
    if (!this.lootboxPanel || !this.lootboxOptions) return;
    const visible = this.state === "levelup";
    const wasVisible = this.lootboxPanelVisible;
    this.lootboxPanelVisible = visible;
    this.lootboxPanel.classList.toggle("is-visible", visible);
    this.lootboxPanel.setAttribute("aria-hidden", String(!visible));
    if (!visible) {
      this.lootboxOptions.replaceChildren();
      return;
    }
    if (!wasVisible) {
      this.lootboxOptions.replaceChildren(...this.lootboxChoices.map((choice, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "lootbox-option";
        button.dataset.lootIndex = String(index);
        button.innerHTML = `<strong>${escapeHtml(choice.categoryLabel)}</strong><span>${escapeHtml(lootboxChoiceDescription(choice.category))}</span>`;
        return button;
      }));
      window.setTimeout(() => this.lootboxOptions.querySelector("button")?.focus({ preventScroll: true }), 0);
    }
  }

  claimLootbox(index) {
    if (this.state !== "levelup") return;
    const choice = this.lootboxChoices[index];
    if (!choice) return;
    unlockAdvancedReward(this.advancedProgress, choice);
    const cursed = rollCursedLootbox(this.advancedProgress);
    saveAdvancedProgress(this.advancedProgress);
    this.applyAdvancedUiScale();
    this.playerLevel = Math.max(this.playerLevel, this.pendingLevel);
    this.pendingLevel = 0;
    this.lootboxChoices = [];
    this.state = "playing";
    this.audio.beep("power");
    for (let i = 0; i < 18; i++) this.spawnParticle(this.player.x + 32, this.player.y + 28, choice.color, rand(2, 6), rand(-180, 180), rand(-230, -40), 0.58);
    if (cursed) {
      this.audio.beep("grave");
      for (let i = 0; i < 24; i++) this.spawnParticle(this.player.x + 32, this.player.y + 28, "#b6ff72", rand(2, 6), rand(-220, 220), rand(-260, -30), 0.72);
    }
    this.showLootboxToast(choice, cursed);
    this.updateButtons();
    this.checkLevelProgress();
  }

  showLootboxToast(choice, cursed) {
    if (!this.lootboxToast) return;
    window.clearTimeout(this.lootboxToastTimer);
    const curseText = cursed ? " Cursed: UI grew by 10%." : "";
    this.lootboxToast.textContent = `Unlocked ${choice.categoryLabel}: ${choice.name}. ${choice.note}${curseText}`;
    this.lootboxToast.classList.add("is-visible");
    this.lootboxToast.setAttribute("aria-hidden", "false");
    this.lootboxToastTimer = window.setTimeout(() => {
      this.lootboxToast.classList.remove("is-visible");
      this.lootboxToast.setAttribute("aria-hidden", "true");
    }, 2000);
  }

  async syncScores() {
    const scores = await fetchScores();
    if (scores) this.setLeaderboard(scores);
  }

  setLeaderboard(scores) {
    this.leaderboard = normalizeScores(scores);
    saveLocalLeaderboard(this.leaderboard);
    this.highScore = Math.max(this.highScore, this.leaderboard[0]?.score || 0);
  }

  loop(timestamp) {
    const dt = Math.min(0.033, (timestamp - this.lastTime) / 1000 || 0);
    this.lastTime = timestamp;
    if (this.state === "playing") this.update(dt);
    if (this.state === "fakeout") this.updateFakeout(dt);
    this.draw();
    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    this.elapsed += dt;
    this.difficulty = this.elapsed / 90;
    this.worldSpeed = Math.min(520, 230 + this.elapsed * 4.4);
    this.score += dt * 8.5;
    this.layers.forEach((layer) => layer.update(dt, this.worldSpeed));
    this.player.update(dt, this.currentAcrobatics(), this.jumpHeld);
    this.updateWeapons(dt);
    this.updateSpawns(dt);
    this.bullets.forEach((b) => b.update(dt));
    this.enemies.forEach((e) => e.update(dt, this.worldSpeed));
    if (this.boss) this.boss.update(dt, this);
    this.powerUps.forEach((p) => p.update(dt, this.worldSpeed));
    this.particles.forEach((p) => p.update(dt));
    this.handleCollisions();
    this.cleanup();
    this.saveHighScore();
    this.checkLevelProgress();
  }

  updateFakeout(dt) {
    this.fakeoutTimer += dt;
    this.layers.forEach((layer) => layer.update(dt, 150));
    this.particles.forEach((p) => p.update(dt));
    this.fakeoutPlayerX = Math.min(520, this.fakeoutPlayerX + 118 * dt);
    if (this.fakeoutTimer > this.fakeoutDuration) {
      this.graveyardMode = true;
      this.fakeoutTimer = 0;
      this.fakeoutPlayerX = this.player.x;
      this.state = "playing";
      this.audio.beep("grave");
      this.updateButtons();
    }
  }

  updateWeapons(dt) {
    const powerBonus = this.powerBonusLevel();
    if (this.activeWeapon) {
      this.weaponTimer -= dt;
      if (this.weaponTimer <= 0) this.activateNextQueuedWeapon();
    }
    this.fireTimer -= dt;
    const weapon = this.activeWeapon;
    const interval = this.weaponInterval(weapon);
    if (this.fireTimer <= 0) {
      this.fireTimer = interval;
      if (weapon === "laser") {
        this.fireLaser();
      } else if (weapon === "spread") {
        this.fireBullet(-95);
        this.fireBullet(0);
        this.fireBullet(95);
        if (powerBonus >= 5) {
          this.fireBullet(-155);
          this.fireBullet(155);
        }
      } else if (weapon === "rocket") {
        this.fireBullet(0, "rocket", this.projectileDamage("rocket"), 1, ROCKET.baseSpeed + powerBonus * ROCKET.speedUpgrade);
      } else {
        const type = weapon === "pierce" || powerBonus >= 6 ? "pierce" : "normal";
        this.fireBullet(0, type, this.projectileDamage(type), this.projectilePierce(type));
      }
    }
    if (weapon === "drone") {
      this.droneFireTimer -= dt;
      if (this.droneFireTimer <= 0) {
        this.droneFireTimer = clamp(0.34 - powerBonus * 0.012, 0.24, 0.34);
        const barrel = this.player.barrel();
        this.bullets.push(new Bullet(barrel.x - 18, barrel.y - 34, 720 + powerBonus * 18, 0, "drone", this.projectileDamage("drone"), this.dronePierce(), coreLevelColors(this.upgradeLevel), this.currentBulletStyle()));
        this.audio.beep("shoot");
      }
    }
  }

  weaponInterval(weapon) {
    const powerBonus = this.powerBonusLevel();
    if (weapon === "rapid") return clamp(0.17 - powerBonus * 0.006, 0.12, 0.17);
    if (weapon === "rocket") return clamp(ROCKET.baseInterval - powerBonus * ROCKET.intervalUpgrade, ROCKET.minInterval, ROCKET.baseInterval);
    if (weapon === "laser") return clamp(0.08 - powerBonus * 0.003, 0.055, 0.08);
    return clamp(0.34 - powerBonus * 0.02, 0.2, 0.34);
  }

  projectileDamage(type) {
    const bonus = this.powerBonusLevel() >= 4 ? 1 : 0;
    if (type === "rocket") return bonus ? ROCKET.upgradedDamage : ROCKET.baseDamage;
    return 1 + bonus;
  }

  projectilePierce(type) {
    const powerBonus = this.powerBonusLevel();
    if (type === "pierce") return Math.min(5, 3 + Math.floor(powerBonus / 4));
    return powerBonus >= 6 ? 2 : 1;
  }

  dronePierce() {
    return this.powerBonusLevel() >= 7 ? 2 : 1;
  }

  powerBonusLevel() {
    return Math.max(0, this.upgradeLevel - 1);
  }

  weaponDurationFor(type) {
    const base = WEAPONS[type].duration;
    const powerBonus = this.powerBonusLevel();
    const perLevel = type === "laser" ? 0.12 : 0.35;
    const maxExtra = type === "laser" ? 1.2 : 3.5;
    return base + Math.min(maxExtra, powerBonus * perLevel);
  }

  fireBullet(vy = 0, type = "normal", damage = 1, pierce = 1, speed = 760) {
    const barrel = this.player.barrel();
    const colors = type === "rocket" ? null : coreLevelColors(this.upgradeLevel);
    this.bullets.push(new Bullet(barrel.x, barrel.y, speed + this.powerBonusLevel() * 24, vy, type, damage, pierce, colors, this.currentBulletStyle()));
    this.player.recoil = 1;
    this.audio.beep("shoot");
  }

  fireLaser() {
    const barrel = this.player.barrel();
    const beamH = 12 + Math.floor(this.powerBonusLevel() / 3) * 2;
    const beam = { x: barrel.x, y: barrel.y - beamH / 2, w: WIDTH - barrel.x, h: beamH };
    this.spawnParticle(barrel.x + 70, barrel.y, "#f43f5e", 3, rand(80, 220), rand(-60, 60), 0.18);
    const targets = [...this.enemies];
    if (this.boss) targets.push(this.boss);
    targets.forEach((target) => {
      if (this.canDamageTarget(target) && rectsOverlap(beam, target.hitbox())) {
        target.damage(1);
        this.spawnHit(target.x + target.w * 0.45, target.y + target.h * 0.5, "#f43f5e");
      }
    });
    this.audio.beep("shoot");
  }

  updateSpawns(dt) {
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = clamp(0.95 - this.elapsed * 0.0055, 0.28, 0.95);
      this.spawnFormation();
    }
    this.powerTimer -= dt;
    if (this.powerTimer <= 0) {
      this.powerTimer = this.boss ? rand(7, 10) : rand(10, 15);
      this.spawnPowerUp();
    }
    this.upgradeTimer -= dt;
    if (this.upgradeTimer <= 0 && this.upgradeLevel < MAX_UPGRADE_LEVEL) {
      this.upgradeTimer = rand(38, 50);
      this.spawnPowerUp("upgrade");
    }
    if (!this.boss && this.elapsed >= this.nextBossTime) {
      this.spawnBoss();
    }
  }

  spawnFormation() {
    const stage = this.elapsed;
    const options = ["single"];
    if (stage > 6) options.push("groundPair", "flyingPair");
    if (stage > 18) options.push("mixed", "fastLine");
    if (stage > 42) options.push("tankEscort", "zigzagMix");
    if (stage > 75) options.push("miniSwarm", "mixed", "tankEscort");
    const pick = options[Math.floor(Math.random() * options.length)];
    const x = WIDTH + rand(10, 42);
    if (pick === "groundPair") {
      this.spawnEnemy("ground", x);
      this.spawnEnemy("ground", x + 118);
    } else if (pick === "flyingPair") {
      this.spawnEnemy("flying", x);
      this.spawnEnemy("flying", x + 106);
    } else if (pick === "mixed") {
      this.spawnEnemy("ground", x);
      this.spawnEnemy("flying", x + 96);
    } else if (pick === "fastLine") {
      this.spawnEnemy("fast", x);
      this.spawnEnemy("fast", x + 92);
    } else if (pick === "tankEscort") {
      this.spawnEnemy("tank", x);
      this.spawnEnemy("mini", x + 118);
      this.spawnEnemy("ground", x + 178);
    } else if (pick === "zigzagMix") {
      this.spawnEnemy("zigzag", x);
      this.spawnEnemy("ground", x + 122);
    } else if (pick === "miniSwarm") {
      for (let i = 0; i < 5; i++) this.spawnEnemy("mini", x + i * 46);
    } else {
      const pool = stage < 20 ? ["ground", "ground", "flying"] : stage < 45 ? ["ground", "flying", "fast"] : ["ground", "flying", "fast", "tank", "zigzag", "mini"];
      this.spawnEnemy(pool[Math.floor(Math.random() * pool.length)], x);
    }
  }

  spawnEnemy(type, x = WIDTH + 50, y) {
    if (x < this.player.x + 260) x = this.player.x + 260;
    this.enemies.push(new Enemy(type, x, y));
  }

  canDamageTarget(target) {
    return target.x + target.w * 0.5 < WIDTH - 8;
  }

  collectWeapon(type) {
    if (this.activeWeapon) {
      this.weaponQueue.push(type);
      return;
    }
    this.activateWeapon(type);
  }

  activateWeapon(type) {
    this.activeWeapon = type;
    this.weaponDuration = this.weaponDurationFor(type);
    this.weaponTimer = this.weaponDuration;
    if (type === "drone") this.droneFireTimer = 0.3;
    if (type === "laser") this.laserTick = 0;
  }

  activateNextQueuedWeapon() {
    const nextWeapon = this.weaponQueue.shift();
    if (nextWeapon) {
      this.activateWeapon(nextWeapon);
    } else {
      this.activeWeapon = null;
      this.weaponTimer = 0;
      this.weaponDuration = 0;
    }
  }

  spawnBoss() {
    this.bossCount += 1;
    this.boss = new Boss(this.bossCount % 2 === 1 ? "beetle" : "wasp", this.bossCount, this.elapsed);
    this.nextBossTime = this.elapsed + 48 + this.bossCount * 8;
    this.audio.beep("boss");
  }

  spawnPowerUp(forceType) {
    const keys = ["rapid", "spread", "pierce", "laser", "rocket", "drone", "health", "maxHealth"];
    if (this.elapsed > 40 && this.upgradeLevel < MAX_UPGRADE_LEVEL) keys.push("upgrade");
    const type = forceType || keys[Math.floor(Math.random() * keys.length)];
    const y = rand(142, 208);
    this.powerUps.push(new PowerUp(type, WIDTH + 48, y));
  }

  handleCollisions() {
    const playerBox = this.player.hitbox();
    this.powerUps.forEach((power) => {
      if (!power.dead && rectsOverlap(playerBox, power.hitbox())) {
        power.dead = true;
        const pickup = PICKUPS[power.type];
        if (power.type === "health") {
          const restore = this.powerBonusLevel() >= 5 ? 2 : 1;
          this.player.health = Math.min(this.player.maxHealth, this.player.health + restore);
        } else if (power.type === "maxHealth") {
          this.player.maxHealth += this.powerBonusLevel() >= 8 ? 2 : 1;
          this.player.health = this.player.maxHealth;
        } else if (power.type === "upgrade") {
          this.upgradeLevel = Math.min(MAX_UPGRADE_LEVEL, this.upgradeLevel + 1);
        } else {
          this.collectWeapon(power.type);
        }
        this.audio.beep("power");
        for (let i = 0; i < 12; i++) this.spawnParticle(power.x + 18, power.y + 18, pickup.color, rand(2, 5), rand(-150, 150), rand(-210, -50), 0.45);
      }
    });
    this.enemies.forEach((enemy) => {
      if (!enemy.dead && rectsOverlap(playerBox, enemy.hitbox()) && this.player.damage()) {
        enemy.damage(1);
        this.spawnHit(this.player.x + 35, this.player.y + 35, "#ff5f57");
        this.audio.beep("damage");
      }
    });
    if (this.boss && rectsOverlap(playerBox, this.boss.hitbox()) && this.player.damage()) {
      this.spawnHit(this.player.x + 35, this.player.y + 35, "#ff5f57");
      this.audio.beep("damage");
    }
    this.bullets.forEach((bullet) => {
      if (bullet.dead) return;
      let hitSomething = false;
      this.enemies.forEach((enemy) => {
        if (enemy.dead || bullet.hitIds.has(enemy.id)) return;
        if (this.canDamageTarget(enemy) && circleRectOverlap(bullet.x, bullet.y, bullet.radius + 2, enemy.hitbox())) {
          bullet.hitIds.add(enemy.id);
          enemy.damage(bullet.damage);
          hitSomething = true;
          this.spawnHit(bullet.x, bullet.y, bullet.type === "rocket" ? "#f97316" : "#ffcc4d");
          this.audio.beep("hit");
          if (bullet.type === "rocket") this.explode(bullet.x, bullet.y, ROCKET.splashRadius, ROCKET.splashDamage);
          if (bullet.hitIds.size >= bullet.pierce) bullet.dead = true;
        }
      });
      if (!bullet.dead && this.boss && this.canDamageTarget(this.boss) && circleRectOverlap(bullet.x, bullet.y, bullet.radius + 2, this.boss.hitbox())) {
        this.boss.damage(bullet.damage);
        hitSomething = true;
        this.spawnHit(bullet.x, bullet.y, bullet.type === "rocket" ? "#f97316" : "#ffcc4d");
        if (bullet.type === "rocket") this.explode(bullet.x, bullet.y, ROCKET.bossSplashRadius, ROCKET.bossSplashDamage);
        bullet.dead = true;
      }
      if (hitSomething && bullet.type !== "pierce") bullet.dead = bullet.type !== "rocket" || bullet.dead;
    });
    this.enemies.forEach((enemy) => {
      if (enemy.dead && enemy.health <= 0 && !enemy.scored) {
        enemy.scored = true;
        this.score += enemy.score;
        this.audio.beep("pop");
        for (let i = 0; i < 6; i++) this.spawnParticle(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, "#8ef58d", rand(2, 5), rand(-120, 120), rand(-170, -30), 0.35);
      }
    });
    if (this.boss && this.boss.dead) {
      this.score += 300 + this.bossCount * 80;
      this.audio.beep("win");
      this.spawnPowerUp();
      for (let i = 0; i < 34; i++) this.spawnParticle(this.boss.x + this.boss.w / 2, this.boss.y + this.boss.h / 2, "#ffcc4d", rand(3, 7), rand(-230, 230), rand(-260, 40), 0.85);
      const shouldStartGraveyard = this.boss.kind === "beetle" && this.bossCount === 1 && !this.graveyardMode;
      this.boss = null;
      if (shouldStartGraveyard) this.startGraveyardFakeout();
    }
    if (this.player.health <= 0) this.gameOver();
  }

  startGraveyardFakeout() {
    this.state = "fakeout";
    this.fakeoutTimer = 0;
    this.fakeoutPlayerX = this.player.x;
    this.enemies = [];
    this.powerUps = [];
    this.bullets = [];
    this.nextBossTime = this.elapsed + 34;
    for (let i = 0; i < 24; i++) this.spawnParticle(rand(500, 780), GROUND_Y - rand(6, 40), "#2d2438", rand(3, 8), rand(-70, 70), rand(-170, -20), 0.9);
    this.updateButtons();
  }

  explode(x, y, radius, damage) {
    this.enemies.forEach((enemy) => {
      if (!enemy.dead && this.canDamageTarget(enemy) && circleRectOverlap(x, y, radius, enemy.hitbox())) {
        enemy.damage(damage);
        enemy.knockbackFrom(x, ROCKET.knockback);
      }
    });
    if (this.boss && this.canDamageTarget(this.boss) && circleRectOverlap(x, y, radius, this.boss.hitbox())) {
      this.boss.damage(damage);
      this.boss.knockbackFrom(x, ROCKET.knockback);
    }
    for (let i = 0; i < 32; i++) this.spawnParticle(x, y, "#f97316", rand(3, 8), rand(-340, 340), rand(-300, 110), 0.58);
  }

  spawnHit(x, y, color) {
    for (let i = 0; i < 5; i++) this.spawnParticle(x, y, color, rand(2, 4), rand(-90, 90), rand(-130, 30), 0.25);
  }

  spawnParticle(x, y, color, size, vx, vy, life) {
    if (this.particles.length < 160) this.particles.push(new Particle(x, y, color, size, vx, vy, life));
  }

  cleanup() {
    this.bullets = this.bullets.filter((b) => !b.dead).slice(-95);
    this.enemies = this.enemies.filter((e) => !e.dead).slice(-80);
    this.powerUps = this.powerUps.filter((p) => !p.dead).slice(-8);
    this.particles = this.particles.filter((p) => p.life > 0).slice(-160);
  }

  gameOver() {
    this.state = "gameover";
    const finalScore = Math.floor(this.score);
    this.highScore = Math.max(this.highScore, finalScore);
    localStorage.setItem(STORAGE_KEY, String(this.highScore));
    if (finalScore > 0) {
      this.personalScores = savePersonalScore([...this.personalScores, { score: finalScore, elapsed: this.elapsed }]);
    }
    this.audio.beep("over");
    if (qualifiesForLeaderboard(this.leaderboard, finalScore)) {
      this.pendingEntry = { score: finalScore };
      this.initials = "";
    } else {
      this.pendingEntry = null;
    }
    this.updateButtons();
  }

  saveHighScore() {
    const score = Math.floor(this.score);
    if (score > this.highScore) {
      this.highScore = score;
      localStorage.setItem(STORAGE_KEY, String(this.highScore));
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    this.drawBackground(ctx);
    this.layers.forEach((layer) => layer.draw(ctx, this.assets));
    this.drawGround(ctx);
    this.powerUps.forEach((p) => p.draw(ctx, this.assets));
    this.bullets.forEach((b) => b.draw(ctx));
    if (this.activeWeapon === "laser" && this.state === "playing") this.drawLaser(ctx);
    if (this.boss) this.boss.draw(ctx, this.assets);
    this.enemies.forEach((e) => e.draw(ctx, this.assets, this.graveyardMode));
    if (this.state === "fakeout") this.drawFakeoutPlayer(ctx);
    else this.player.draw(ctx, this.assets, this.upgradeLevel, this.advancedProgress.equipped);
    if (this.activeWeapon === "drone") this.drawDrone(ctx);
    this.particles.forEach((p) => p.draw(ctx));
    this.drawUI(ctx);
    if (this.state === "start") this.drawStartOverlay(ctx);
    if (this.state === "paused") this.drawOverlay(ctx, "Paused", "Take a breath.", "Press P to Resume");
    if (this.state === "fakeout") this.drawFakeoutOverlay(ctx);
    if (this.state === "levelup") this.drawOverlay(ctx, `Level ${this.pendingLevel}`, "Pick one lootbox.", "CHOOSE A REWARD");
    if (this.state === "gameover") this.drawGameOverOverlay(ctx);
  }

  drawBackground(ctx) {
    if (this.graveyardMode || this.state === "fakeout") {
      const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      sky.addColorStop(0, "#0b1024");
      sky.addColorStop(0.58, "#17203d");
      sky.addColorStop(1, "#24304c");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "rgba(236, 254, 255, 0.82)";
      ctx.beginPath();
      ctx.arc(792, 62, 27, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(11, 16, 36, 0.9)";
      ctx.beginPath();
      ctx.arc(780, 54, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(216, 236, 244, 0.72)";
      for (let i = 0; i < 18; i++) {
        const x = (i * 71 + 34) % WIDTH;
        const y = 24 + (i * 37) % 116;
        ctx.fillRect(x, y, 2, 2);
      }
      return;
    }
    const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    sky.addColorStop(0, "#8bdcff");
    sky.addColorStop(0.66, "#d8f6ff");
    sky.addColorStop(1, "#f7fff2");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "rgba(255,255,255,0.34)";
    ctx.beginPath();
    ctx.arc(800, 58, 28, 0, Math.PI * 2);
    ctx.fill();
  }

  drawGround(ctx) {
    if (this.graveyardMode || this.state === "fakeout") {
      ctx.fillStyle = "#171b24";
      ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);
      ctx.fillStyle = "#293524";
      ctx.fillRect(0, GROUND_Y - 10, WIDTH, 14);
      ctx.fillStyle = "rgba(216, 236, 244, 0.34)";
      for (let x = 32; x < WIDTH; x += 106) this.drawTombstone(ctx, x, GROUND_Y - 42, 30, 42);
      this.drawOpenGrave(ctx, 548, GROUND_Y - 7, 112, 28);
      return;
    }
    ctx.fillStyle = "#72523a";
    ctx.fillRect(0, GROUND_Y, WIDTH, HEIGHT - GROUND_Y);
    ctx.fillStyle = "#65bd65";
    ctx.fillRect(0, GROUND_Y - 10, WIDTH, 14);
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    const dashOffset = -(this.elapsed * this.worldSpeed) % 48;
    for (let x = dashOffset; x < WIDTH; x += 48) ctx.fillRect(x, GROUND_Y + 22, 24, 4);
  }

  drawTombstone(ctx, x, y, w, h) {
    ctx.save();
    ctx.fillStyle = "rgba(127, 143, 166, 0.74)";
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + h * 0.35);
    ctx.quadraticCurveTo(x + w / 2, y - 8, x + w, y + h * 0.35);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(11, 16, 36, 0.42)";
    ctx.fillRect(x + 8, y + 17, w - 16, 3);
    ctx.restore();
  }

  drawOpenGrave(ctx, x, y, w, h) {
    ctx.save();
    ctx.fillStyle = "rgba(4, 6, 12, 0.82)";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(126, 91, 54, 0.9)";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();
  }

  drawFakeoutPlayer(ctx) {
    ctx.save();
    const fall = clamp((this.fakeoutTimer - 2.55) / 1.1, 0, 1);
    const y = this.player.y + fall * 58;
    ctx.globalAlpha = 1 - fall * 0.72;
    ctx.translate(this.fakeoutPlayerX + this.player.w / 2, y + this.player.h / 2);
    ctx.rotate(fall * 0.45);
    ctx.drawImage(this.assets.get("player"), -this.player.w / 2, -this.player.h / 2, this.player.w, this.player.h);
    ctx.restore();
  }

  drawFakeoutOverlay(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(8, 14, 28, 0.34)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.textAlign = "center";
    ctx.font = "900 22px Avenir, sans-serif";
    ctx.fillStyle = "#ecfeff";
    const text = this.fakeoutTimer < 1.7 ? "That beetle was only guarding the graveyard." : this.fakeoutTimer < 3 ? "The runner falls in..." : "Night falls. The swarm rises.";
    ctx.fillText(text, WIDTH / 2, 118);
    ctx.restore();
  }

  drawLaser(ctx) {
    const barrel = this.player.barrel();
    ctx.save();
    ctx.globalAlpha = 0.72 + Math.sin(this.elapsed * 42) * 0.2;
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 5;
    ctx.shadowColor = "#f43f5e";
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(barrel.x, barrel.y);
    ctx.lineTo(WIDTH, barrel.y);
    ctx.stroke();
    ctx.restore();
  }

  drawDrone(ctx) {
    const barrel = this.player.barrel();
    const x = barrel.x - 36;
    const y = barrel.y - 44 + Math.sin(this.elapsed * 6) * 6;
    ctx.save();
    ctx.fillStyle = "#47c26b";
    ctx.strokeStyle = "#10243b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(x, y, 24, 16, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#c8fff0";
    ctx.fillRect(x + 18, y + 5, 12, 5);
    ctx.restore();
  }

  drawUI(ctx) {
    const score = Math.floor(this.score);
    this.highScore = Math.max(this.highScore, score);
    ctx.save();
    ctx.scale(this.currentUiScale(), this.currentUiScale());
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "rgba(255, 250, 240, 0.9)";
    roundRect(ctx, 16, 14, 328, 56, 8);
    ctx.fill();
    ctx.fillStyle = "#19323c";
    ctx.font = "800 18px Avenir, sans-serif";
    const fullHearts = "♥".repeat(Math.max(0, this.player.health));
    const emptyHearts = "♡".repeat(Math.max(0, this.player.maxHealth - Math.max(0, this.player.health)));
    ctx.fillText(`Health ${fullHearts}${emptyHearts}`, 30, 38);
    ctx.font = "800 16px Avenir, sans-serif";
    ctx.fillText(`Score ${score}   High ${this.highScore}`, 30, 60);
    this.drawLevelBar(ctx, score);
    if (this.activeWeapon) {
      const weapon = WEAPONS[this.activeWeapon];
      const text = `${weapon.name} ${this.weaponTimer.toFixed(1)}s`;
      const textW = ctx.measureText(text).width + 34;
      ctx.fillStyle = "rgba(25, 50, 60, 0.9)";
      roundRect(ctx, WIDTH - textW - 16, 14, textW, 42, 8);
      ctx.fill();
      ctx.fillStyle = "#fff4d8";
      ctx.font = "800 15px Avenir, sans-serif";
      ctx.fillText(text, WIDTH - textW, 40);
      ctx.fillStyle = weapon.color;
      roundRect(ctx, WIDTH - 86, 48, 70 * (this.weaponTimer / this.weaponDuration), 6, 3);
      ctx.fill();
    } else {
      const text = this.upgradeLevel ? `Default Blaster Lv ${this.upgradeLevel}` : "Default Blaster";
      const textW = ctx.measureText(text).width + 34;
      ctx.fillStyle = "rgba(25, 50, 60, 0.9)";
      roundRect(ctx, WIDTH - textW - 16, 14, textW, 42, 8);
      ctx.fill();
      ctx.fillStyle = "#fff4d8";
      ctx.font = "800 15px Avenir, sans-serif";
      ctx.fillText(text, WIDTH - textW, 40);
    }
    if (this.upgradeLevel) {
      ctx.fillStyle = "rgba(25, 50, 60, 0.88)";
      roundRect(ctx, WIDTH - 160, 62, 144, 26, 8);
      ctx.fill();
      ctx.fillStyle = "#ffd166";
      roundRect(ctx, WIDTH - 88, 78, 66 * (this.upgradeLevel / MAX_UPGRADE_LEVEL), 5, 3);
      ctx.fill();
      ctx.fillStyle = "#fff4d8";
      ctx.font = "800 13px Avenir, sans-serif";
      ctx.fillText(`Level ${this.upgradeLevel}/${MAX_UPGRADE_LEVEL}`, WIDTH - 142, 80);
    }
    if (this.audio.muted) {
      ctx.fillStyle = "rgba(25, 50, 60, 0.88)";
      roundRect(ctx, WIDTH - 96, this.upgradeLevel ? 94 : 62, 80, 26, 8);
      ctx.fill();
      ctx.fillStyle = "#fff4d8";
      ctx.font = "800 13px Avenir, sans-serif";
      ctx.fillText("Muted", WIDTH - 78, this.upgradeLevel ? 112 : 80);
    }
    if (this.graveyardMode) {
      ctx.fillStyle = "rgba(8, 14, 28, 0.86)";
      roundRect(ctx, 16, 110, 166, 26, 8);
      ctx.fill();
      ctx.fillStyle = "#b6ff72";
      ctx.font = "800 13px Avenir, sans-serif";
      ctx.fillText("Graveyard Zombies", 30, 128);
    }
    if (this.boss) this.drawBossBar(ctx);
    ctx.restore();
  }

  drawLevelBar(ctx, score) {
    const nextLevel = this.playerLevel + 1;
    const currentFloor = this.playerLevel > 0 ? scoreForLevel(this.playerLevel) : 0;
    const nextScore = scoreForLevel(nextLevel);
    const progress = clamp((score - currentFloor) / (nextScore - currentFloor), 0, 1);
    const x = 16;
    const y = 76;
    const w = 328;
    const h = 34;
    const barX = x + 14;
    const barY = y + 23;
    const barW = w - 88;
    ctx.fillStyle = "rgba(25, 50, 60, 0.88)";
    roundRect(ctx, x, y, w, h, 8);
    ctx.fill();
    const fill = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    fill.addColorStop(0, "#5fc8a6");
    fill.addColorStop(1, "#ffd166");
    ctx.fillStyle = fill;
    roundRect(ctx, barX, barY, barW * progress, 7, 4);
    ctx.fill();
    ctx.fillStyle = "#fff4d8";
    ctx.font = "800 13px Avenir, sans-serif";
    ctx.fillText(`Level ${this.playerLevel}  Next ${nextScore}`, x + 14, y + 16);
    ctx.textAlign = "right";
    ctx.fillText(`${Math.floor(progress * 100)}%`, x + w - 14, y + 16);
    ctx.textAlign = "left";
  }

  drawBossBar(ctx) {
    const x = 252;
    const y = 72;
    const w = 506;
    const h = 34;
    const labelW = 174;
    ctx.fillStyle = "rgba(16,24,32,0.72)";
    roundRect(ctx, x, y, w, h, 5);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.font = "900 13px ui-rounded, system-ui";
    ctx.fillText(this.boss.kind === "beetle" ? "Giant Beetle Boss" : "Wasp Queen Boss", x + 12, y + h / 2);
    ctx.fillStyle = "rgba(8,14,28,0.6)";
    ctx.fillRect(x + labelW, y + 9, w - labelW - 14, 16);
    ctx.fillStyle = "#ff5f57";
    ctx.fillRect(x + labelW + 2, y + 11, (w - labelW - 18) * (this.boss.health / this.boss.maxHealth), 12);
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.strokeRect(x + labelW, y + 9, w - labelW - 14, 16);
    ctx.textBaseline = "alphabetic";
  }

  drawStartOverlay(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(18, 32, 38, 0.64)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    this.drawLeaderboardPanel(ctx, 90, 34, 780, 302, {
      title: "BUG BLASTER",
      subtitle: "GLOBAL TOP 10  /  YOUR BEST 10",
      prompt: "PRESS ENTER OR TAP TO START"
    });
    ctx.restore();
  }

  drawGameOverOverlay(ctx) {
    ctx.save();
    ctx.fillStyle = "rgba(18, 32, 38, 0.68)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    this.drawLeaderboardPanel(ctx, 90, 18, 780, 326, {
      title: this.pendingEntry ? "NEW HIGH SCORE" : "GAME OVER",
      subtitle: `FINAL ${Math.floor(this.score)}  HIGH ${this.highScore}`,
      prompt: this.pendingEntry ? "TYPE 3 LETTERS BELOW  TAP SAVE" : "PRESS ENTER OR TAP TO RESTART",
      score: this.pendingEntry?.score || null,
      initials: this.initials
    });
    ctx.restore();
  }

  drawOverlay(ctx, title, subtitle, prompt) {
    ctx.save();
    ctx.fillStyle = "rgba(18, 32, 38, 0.62)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "rgba(255, 250, 240, 0.94)";
    roundRect(ctx, 222, 86, 516, 178, 8);
    ctx.fill();
    ctx.drawImage(this.assets.get("badge"), 390, 102, 180, 64);
    ctx.textAlign = "center";
    ctx.fillStyle = "#19323c";
    ctx.font = "900 44px Avenir, sans-serif";
    ctx.fillText(title, WIDTH / 2, 188);
    ctx.font = "700 17px Avenir, sans-serif";
    ctx.fillStyle = "#5f7480";
    ctx.fillText(subtitle, WIDTH / 2, 218);
    ctx.font = "900 18px Avenir, sans-serif";
    ctx.fillStyle = "#c94b25";
    ctx.fillText(prompt, WIDTH / 2, 246);
    ctx.restore();
  }

  drawLeaderboardPanel(ctx, x, y, w, h, options) {
    ctx.save();
    const glow = this.elapsed + performance.now() / 1000;
    ctx.fillStyle = "rgba(8, 14, 28, 0.94)";
    roundRect(ctx, x, y, w, h, 8);
    ctx.fill();
    drawLedGrid(ctx, x + 8, y + 8, w - 16, h - 16);
    ctx.strokeStyle = "#ff7148";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#ff7148";
    ctx.shadowBlur = 10;
    roundRect(ctx, x + 10, y + 10, w - 20, h - 20, 8);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.textAlign = "center";
    ctx.font = "900 28px 'Courier New', monospace";
    drawGlowText(ctx, options.title, x + w / 2, y + 42, "#ffe866", "#ff3d2e");
    ctx.font = "800 15px 'Courier New', monospace";
    drawGlowText(ctx, options.subtitle, x + w / 2, y + 66, "#dfeeff", "#80bdff");

    const rows = this.leaderboard.slice(0, LEADERBOARD_LIMIT);
    const personalRows = this.personalScores.slice(0, LEADERBOARD_LIMIT);
    while (rows.length < LEADERBOARD_LIMIT) rows.push({ initials: "---", score: 0 });
    while (personalRows.length < LEADERBOARD_LIMIT) personalRows.push({ score: 0, elapsed: 0 });
    ctx.textAlign = "left";
    ctx.font = "900 13px 'Courier New', monospace";
    drawGlowText(ctx, "GLOBAL", x + 66, y + 88, "#dfeeff", "#66d7ff");
    drawGlowText(ctx, "YOU", x + w - 294, y + 88, "#dfeeff", "#66d7ff");
    ctx.font = "800 16px 'Courier New', monospace";
    for (let i = 0; i < LEADERBOARD_LIMIT; i++) {
      const row = rows[i];
      const personalRow = personalRows[i];
      const rowY = y + 106 + i * 14;
      const hue = i === 0 ? ["#ff6548", "#ffe866"] : i < 3 ? ["#7cff9a", "#cfff6e"] : ["#5bc7ff", "#87a8ff"];
      ctx.fillStyle = hue[0];
      ctx.shadowColor = hue[0];
      ctx.shadowBlur = 8;
      ctx.fillText(`${ordinal(i + 1)} ${row.initials.padEnd(3, " ")}`, x + 54, rowY);
      ctx.textAlign = "right";
      ctx.fillStyle = hue[1];
      ctx.shadowColor = hue[1];
      ctx.fillText(row.score ? String(row.score).padStart(5, " ") : "-----", x + 330, rowY);
      ctx.textAlign = "left";
      ctx.fillStyle = hue[0];
      ctx.shadowColor = hue[0];
      ctx.fillText(ordinal(i + 1), x + w - 330, rowY);
      ctx.textAlign = "right";
      ctx.fillStyle = hue[1];
      ctx.shadowColor = hue[1];
      ctx.fillText(personalRow.score ? String(personalRow.score).padStart(5, " ") : "-----", x + w - 54, rowY);
      ctx.textAlign = "left";
    }

    if (options.score) {
      const entryY = y + h - 58;
      ctx.textAlign = "center";
      ctx.font = "900 18px 'Courier New', monospace";
      drawGlowText(ctx, `YOUR SCORE ${options.score}`, x + w / 2, entryY - 22, "#ffffff", "#9bd8ff");
      const slots = (options.initials || "").padEnd(3, "_").split("").join(" ");
      const pulse = Math.sin(glow * 5) > 0 ? "#ffffff" : "#ffed68";
      ctx.font = "900 34px 'Courier New', monospace";
      drawGlowText(ctx, slots, x + w / 2, entryY + 12, pulse, "#ff7148");
    }

    ctx.textAlign = "center";
    ctx.font = "900 13px 'Courier New', monospace";
    drawGlowText(ctx, options.prompt, x + w / 2, y + h - 18, "#ffffff", "#66d7ff");
    ctx.restore();
  }
}

function loadLeaderboard() {
  try {
    const rows = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
    return normalizeScores(rows);
  } catch {
    return [];
  }
}

function saveLocalLeaderboard(rows) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(rows.slice(0, LEADERBOARD_LIMIT)));
  localStorage.setItem(STORAGE_KEY, String(rows[0]?.score || 0));
}

function normalizeScores(rows) {
  return (Array.isArray(rows) ? rows : [])
    .filter((row) => row && typeof row.initials === "string" && Number.isFinite(Number(row.score)))
    .map((row) => ({
      initials: row.initials.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3).padEnd(3, "A"),
      score: Math.max(0, Math.floor(Number(row.score)))
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, LEADERBOARD_LIMIT);
}

function loadPersonalScores() {
  try {
    const rows = JSON.parse(localStorage.getItem(PERSONAL_SCORES_KEY) || "[]");
    return normalizePersonalScores(rows);
  } catch {
    return [];
  }
}

function savePersonalScore(rows) {
  const normalized = normalizePersonalScores(rows);
  localStorage.setItem(PERSONAL_SCORES_KEY, JSON.stringify(normalized));
  return normalized;
}

function normalizePersonalScores(rows) {
  return (Array.isArray(rows) ? rows : [])
    .filter((row) => row && Number.isFinite(Number(row.score)))
    .map((row) => ({
      score: Math.max(0, Math.floor(Number(row.score))),
      elapsed: Math.max(0, Number(row.elapsed) || 0)
    }))
    .sort((a, b) => b.score - a.score || b.elapsed - a.elapsed)
    .slice(0, LEADERBOARD_LIMIT);
}

function scoreForLevel(level) {
  return LEVEL_BASE_SCORE * Math.pow(2, Math.max(0, level - 1));
}

function defaultAdvancedProgress() {
  return {
    unlocked: {
      outfits: ["classic"],
      bullets: ["spark"],
      acrobatics: ["classic"]
    },
    equipped: {
      outfit: "classic",
      bullet: "spark",
      acrobatics: "classic"
    },
    curse: {
      uiScale: 1
    }
  };
}

function loadAdvancedProgress() {
  const defaults = defaultAdvancedProgress();
  try {
    const saved = JSON.parse(localStorage.getItem(ADVANCED_PROGRESS_KEY) || "null");
    const progress = saved && typeof saved === "object" ? saved : defaults;
    return normalizeAdvancedProgress(progress);
  } catch {
    return defaults;
  }
}

function normalizeAdvancedProgress(progress) {
  const defaults = defaultAdvancedProgress();
  const unlocked = {
    outfits: uniqueValid([...(progress.unlocked?.outfits || []), "classic"], OUTFITS),
    bullets: uniqueValid([...(progress.unlocked?.bullets || []), "spark"], BULLET_STYLES),
    acrobatics: uniqueValid([...(progress.unlocked?.acrobatics || []), "classic"], ACROBATICS)
  };
  const equipped = {
    outfit: unlocked.outfits.includes(progress.equipped?.outfit) ? progress.equipped.outfit : defaults.equipped.outfit,
    bullet: unlocked.bullets.includes(progress.equipped?.bullet) ? progress.equipped.bullet : defaults.equipped.bullet,
    acrobatics: unlocked.acrobatics.includes(progress.equipped?.acrobatics) ? progress.equipped.acrobatics : defaults.equipped.acrobatics
  };
  const curse = {
    uiScale: clamp(Number(progress.curse?.uiScale) || defaults.curse.uiScale, 1, 4)
  };
  return { unlocked, equipped, curse };
}

function uniqueValid(values, catalog) {
  return [...new Set(values)].filter((value) => catalog[value]);
}

function saveAdvancedProgress(progress) {
  localStorage.setItem(ADVANCED_PROGRESS_KEY, JSON.stringify(normalizeAdvancedProgress(progress)));
}

function rollCursedLootbox(progress) {
  if (Math.random() >= CURSED_LOOTBOX_CHANCE) return false;
  const current = Number(progress.curse?.uiScale) || 1;
  progress.curse = {
    ...(progress.curse || {}),
    uiScale: clamp(current * (1 + CURSED_UI_SCALE_STEP), 1, 4)
  };
  return true;
}

function buildLootboxChoices(progress, level) {
  const locked = LOOT_REWARDS.filter((reward) => !progress.unlocked[reward.category].includes(reward.id));
  const pool = locked.length >= 3 ? locked : LOOT_REWARDS;
  const start = Math.floor(rand(0, pool.length));
  const choices = [];
  for (let i = 0; choices.length < 3 && i < pool.length * 2; i++) {
    const reward = pool[(start + i * 2 + level) % pool.length];
    if (!choices.some((choice) => choice.category === reward.category && choice.id === reward.id)) choices.push(formatReward(reward));
  }
  while (choices.length < 3) choices.push(formatReward(LOOT_REWARDS[(level + choices.length) % LOOT_REWARDS.length]));
  return choices;
}

function formatReward(reward) {
  const catalog = reward.category === "outfits" ? OUTFITS : reward.category === "bullets" ? BULLET_STYLES : ACROBATICS;
  const item = catalog[reward.id];
  return {
    ...reward,
    name: item.name,
    note: item.note,
    color: item.accent || item.shot || "#ffd166",
    categoryLabel: reward.category === "outfits" ? "Outfit" : reward.category === "bullets" ? "Bullet type" : "Acrobatics"
  };
}

function lootboxChoiceDescription(category) {
  if (category === "outfits") return "Unlocks a new runner look. Exact outfit stays hidden until opened. 5% cursed chance.";
  if (category === "bullets") return "Unlocks a new shot style for your blaster. Exact type stays hidden until opened. 5% cursed chance.";
  return "Unlocks a new jump move. Exact trick stays hidden until opened. 5% cursed chance.";
}

function unlockAdvancedReward(progress, reward) {
  if (!progress.unlocked[reward.category].includes(reward.id)) progress.unlocked[reward.category].push(reward.id);
  const equippedKey = reward.category === "outfits" ? "outfit" : reward.category === "bullets" ? "bullet" : "acrobatics";
  progress.equipped[equippedKey] = reward.id;
}

function wipeLocalProgress() {
  [
    STORAGE_KEY,
    LEADERBOARD_KEY,
    PERSONAL_SCORES_KEY,
    ADVANCED_PROGRESS_KEY,
    ONBOARDING_KEY
  ].forEach((key) => localStorage.removeItem(key));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

async function fetchScores() {
  for (const api of scoreApiCandidates()) {
    try {
      const response = await fetch(api, { cache: "no-store" });
      if (!response.ok) continue;
      const data = await response.json();
      return normalizeScores(data.scores);
    } catch {
      continue;
    }
  }
  return null;
}

async function postScore(entry) {
  for (const api of scoreApiCandidates()) {
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
      });
      if (!response.ok) continue;
      const data = await response.json();
      return normalizeScores(data.scores);
    } catch {
      continue;
    }
  }
  return [];
}

function scoreApiCandidates() {
  const candidates = [SCORE_API];
  if (globalThis.location?.origin !== "https://game.phunnysunny.com") {
    candidates.push(PRODUCTION_SCORE_API);
  }
  return candidates;
}

function qualifiesForLeaderboard(rows, score) {
  return score > 0 && (rows.length < LEADERBOARD_LIMIT || score > rows[rows.length - 1].score);
}

function ordinal(rank) {
  if (rank === 1) return "1ST";
  if (rank === 2) return "2ND";
  if (rank === 3) return "3RD";
  return `${rank}TH`;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function tracePlayerShirt(ctx, x, y, w, h) {
  const sx = w / 96;
  const sy = h / 96;
  ctx.beginPath();
  ctx.moveTo(x + 31 * sx, y + 44 * sy);
  ctx.bezierCurveTo(x + 40 * sx, y + 37 * sy, x + 56 * sx, y + 36 * sy, x + 65 * sx, y + 44 * sy);
  ctx.lineTo(x + 62 * sx, y + 78 * sy);
  ctx.lineTo(x + 34 * sx, y + 78 * sy);
  ctx.closePath();
}

function drawLedGrid(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  for (let yy = y; yy < y + h; yy += 6) {
    for (let xx = x; xx < x + w; xx += 6) {
      ctx.fillRect(xx, yy, 1.5, 1.5);
    }
  }
  const wash = ctx.createLinearGradient(x, y, x, y + h);
  wash.addColorStop(0, "rgba(16, 42, 75, 0)");
  wash.addColorStop(1, "rgba(18, 34, 120, 0.55)");
  ctx.fillStyle = wash;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

function drawGlowText(ctx, text, x, y, fill, glow) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.shadowColor = glow;
  ctx.shadowBlur = 9;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawStar(ctx, x, y, points, outerRadius, innerRadius) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + i * Math.PI / points;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawRect(ctx, rect, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

const canvas = document.getElementById("gameCanvas");
const muteButton = document.getElementById("muteButton");
const restartButton = document.getElementById("restartButton");
const game = new Game(canvas, muteButton, restartButton);
window.__bugBlasterGame = game;
