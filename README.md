# Bug Blaster: Swarm Run

A lightweight browser-based side-scrolling survival shooter inspired by the Chrome T-Rex runner, rebuilt around automatic shooting, enemy swarms, bosses, and weapon power-ups instead of obstacles.

## Run

Open `index.html` in Chrome or any modern browser for local-only play. There is no build step or frontend framework.

For the shared top-10 score backend, run through Vercel:

```sh
vercel dev
```

The `/api/scores` endpoint uses Vercel KV or Upstash Redis REST environment variables in production. Without those variables it falls back to `.data/scores.json` locally and `/tmp/bug-blaster-scores.json` on Vercel, which is useful for demos but not durable across cold starts. A fresh backend returns an empty leaderboard until players submit scores.

## Controls

- `Space`, `ArrowUp`, or `W`: jump
- `Enter`: start or restart
- `P`: pause or unpause
- `M`: mute or unmute generated audio
- Mash `M` 30 times in 10 seconds: play the hidden monster mash riff

Mouse and touch input are disabled inside the main game window. Small beetles periodically appear outside the game window; click them to collect 1 gold in the separate gold counter.

## Gameplay

The player stays near the bottom-left, jumps with gravity, and automatically shoots from the gun barrel. Bugs continuously enter from the right. Survive as long as possible, destroy bugs for score, defeat periodic boss bugs, and jump to collect floating power-ups.

New players see a short one-time onboarding card before their first run. It explains jumping, auto-shooting, power-ups, bosses, and the leaderboard goal.

There are no hurdles, rocks, logs, spike mounds, or non-enemy obstacles. The challenge comes entirely from enemy contact, swarm density, boss pressure, and weapon timing.

## Advanced Version

The `advanced-version` branch adds a parallel progression layer. Score acts as experience: level 1 starts at 500 points, level 2 at 1,000, level 3 at 2,000, then each next level doubles the required score. When a run crosses a level threshold, gameplay pauses and the player picks one of three lootboxes. Lootboxes show only their reward category before opening, not the exact reward.

Lootboxes unlock and equip customization rewards across three categories:

- Outfits: changes the player's shirt/accent style.
- Bullet types: changes the visual shape/color of blaster rounds.
- Acrobatics: changes jump style, including backflips and a two-second hold-to-hover move.

Advanced unlocks persist locally under `bugBlasterAdvancedProgress`. After the first Giant Beetle Boss is defeated, the run briefly fakes out a death scene: the runner falls into an open grave, night falls, and the game continues in a graveyard theme with zombie-styled enemies. As an audio easter egg, pressing `M` 30 times within 10 seconds plays a generated MIDI-like monster mash riff. On the high-score initials screen, entering `SAI` wipes local progress, high score, local leaderboard, personal bests, onboarding state, and advanced unlocks.

Every opened lootbox also has a 5% cursed chance to permanently enlarge the game's UI by another 10% in this browser.

## Enemy Types

- Ground Crawler: early ground bug, 1 health, 10 points
- Flying Bug: mid-air enemy, 1 health, 15 points
- Fast Skitter: small fast bug, 1 health, 20 points
- Tank Beetle: slower heavy bug, 3 health, 40 points
- Zigzag Bug: bobbing mid-game enemy, 2 health, 25 points
- Mini Swarm Bug: tiny group enemy, 1 health, 5 points

## Boss Types

- Giant Beetle Boss: armored ground boss with high health
- Wasp Queen Boss: flying boss with vertical movement and minion spawns

Bosses appear periodically, show health bars, scale health over time, and can drop weapon power-ups when defeated.

## Top 10 Scores

The start and game-over overlays include an arcade score dashboard. Scores sync through `/api/scores` when available and fall back to `localStorage` if the backend cannot be reached. A successful empty backend response clears the in-browser fallback leaderboard. Qualifying game-over scores prompt the player to type three initials and press `Enter`, or use the on-screen name field and Save button on phone.

The same dashboard also shows the player's personal best 10 performances from this browser. Personal performances are stored only in `localStorage` and are not synced to the backend.

## Power-Ups

- Rapid Fire: much faster fire rate
- Spread Shot: three-shot vertical spread
- Piercing Shot: bullets can hit up to three enemies
- Laser Beam: pulsing continuous forward beam with a short, high-power duration
- Rocket Shot: fast heavy explosive projectile that clears clustered enemies and knocks nearby targets around
- Drone Helper: companion drone fires extra bullets
- Health: restores 1 health up to the current max
- Max Health: increases max health by 1 and refills health
- Level Up: permanent run upgrade with levels 1 through 10 that improves default fire rate first, then bullet speed, damage, light pierce, weapon duration, weapon spread, drone pierce, laser width, and stronger health pickups at higher levels

Each level also changes the player's shirt color and default shot color so the current upgrade tier is visible during play. Level pickups arrive more slowly than weapon pickups so full leveling is a longer competitive target.

All power-ups float above the standing player lane and require a jump to collect. Health, Max Health, and Level Up are the only non-weapon pickups. There are no shield, score boost, or generic power-ups. Level upgrades are permanent for the current run and help the player scale with the late-game swarm.

## Asset Strategy

The game uses the compact `cGame` SVG art direction for the player, core bugs, Collector-style boss art, power-up styling, and parallax scenery, plus matching lightweight SVG icons for the additional weapon modes. Animation is code-driven with Canvas transforms, bobbing, scrolling, recoil, hit flashes, and particles. No large background images, external audio, or sprite sheets are used.

## Performance Notes

The game uses a fixed logical canvas size of `960x360` and scales responsively with CSS. It removes offscreen bullets, enemies, particles, bosses, and power-ups. Projectile counts and particles are capped for smooth play on modest systems.

## Tech

Plain HTML, CSS, JavaScript, the HTML5 Canvas API, and an optional Vercel serverless score API. The game still plays by opening `index.html` directly; backend scores require a server environment.
