# Codex Brief: Port Bug Blaster Into A Native iOS App

## Goal

Create a full-screen native iOS app version of **Bug Blaster: Swarm Run** from an empty iOS workspace. Preserve the browser game's mechanics, pacing, scoring, visual identity, UI states, characters, power-ups, boss behavior, and leaderboard flow. The iOS app should feel like the same game, but rendered crisply on modern iPhones and iPads with high-definition image assets.

Use the existing web repo only as the source of truth for mechanics and art direction. Do not wrap the web page in a WebView. Build a real iOS app.

## Source Of Truth

Reference these files from the original repo:

- `game.js`: complete game logic, constants, spawn timing, collision rules, drawing behavior, score storage, audio behavior, UI states, and progression.
- `index.html`: overlay, onboarding, mute, restart, initials entry, and control structure.
- `styles.css`: responsive/full-screen intent for mobile and the general arcade presentation.
- `assets/*.svg`: original art direction for player, bugs, bosses, pickups, scenery, and UI accents.
- `README.md`: player-facing feature list and gameplay constraints.
- `api/scores.js`: current score API contract.

Keep all numerical tuning from `game.js` unless there is a clearly documented reason to adapt it for device frame timing.

## Platform And Architecture

Build with Swift and SpriteKit unless there is a strong repo-local reason to choose another native Apple framework. SpriteKit is preferred because this is a 2D side-scrolling action game with sprites, particles, fixed-timestep updates, collision boxes, generated audio effects, and full-screen rendering.

Target iOS first. The game should run full-screen in landscape orientation. Support modern iPhone sizes and iPad by preserving the original logical game coordinate system and scaling it to the available safe render area.

Use this structure:

- `BugBlasterApp.swift`: app entry point.
- `GameViewController` or SwiftUI host: presents a SpriteKit scene full-screen.
- `GameScene.swift`: main update loop, state machine, input routing, entity updates, collision handling, rendering layer composition.
- `Models/`: plain Swift structs/classes for player, bullets, enemies, bosses, pickups, particles, weapons, scores.
- `Services/ScoreService.swift`: local and remote leaderboard fetch/post logic.
- `Services/AudioService.swift`: generated sound effects and mute persistence.
- `Resources/GeneratedArt/`: high-definition generated PNG/WebP assets derived from the SVG source.
- `Resources/OriginalSVG/`: keep the original SVG files for traceability if licensing and app-size constraints allow.

Do not add a game engine beyond SpriteKit. Do not build the app as a WebView. Do not depend on remote image loading for core game assets.

## Visual Asset Generation Requirement

Use ImageGen to create high-definition, high-quality raster images for every visible game element based on the existing SVG assets and current canvas rendering style. The goal is crisp native rendering with no blurred SVG scaling artifacts.

For each original SVG, generate a high-resolution transparent PNG or WebP asset at multiple useful sizes. Preserve the silhouette, color language, readability, and arcade-toy personality of the original SVG. Do not redesign the game into a different genre or mood.

Required generated asset list:

- `player`: runner with blaster, readable shirt region that can be recolored per level.
- Enemies: `ground-crawler`, `flying-bug`, `fast-skitter`, `tank-beetle`, `zigzag-bug`, `mini-swarm`.
- Bosses: `giant-beetle-boss`, `wasp-queen-boss`.
- Power-ups: `power-rapid`, `power-spread`, `power-pierce`, `power-laser`, `power-rocket`, `power-drone`, `power-health`, `power-max-health`, `ui-bolt` for Level Up.
- Scenery: `cloud`, `tree`, `bush`, `hills`.
- UI accents: `ui-badge`.

The repo also contains older obstacle and unused pickup art (`hurdle-log`, `hurdle-rock`, `hurdle-spikes`, `power-score`, `power-shield`, `collector`, `bug-fast`, `bug-flying`, `bug-ground`, `hill`). Preserve them only in an archival/original-assets folder unless they are still referenced by the final iOS implementation. Do not introduce obstacles or shield/score power-ups into gameplay.

ImageGen prompts should request:

- crisp 2D arcade game sprite art
- transparent background for characters, pickups, UI icons, and scenery props
- high-definition output with sharp edges and no blur
- readable silhouette at small in-game sizes
- no text baked into sprites unless the source asset already requires it
- consistent lighting, outline weight, and palette across the whole set

Generate at least `1x`, `2x`, and `3x` scale variants or a single high-resolution source that Xcode can downsample cleanly into an asset catalog. Verify every generated asset in-game on device/simulator for edge clarity and readability.

## Core Game Constants To Preserve

Original logical canvas:

- Width: `960`
- Height: `360`
- Ground Y: `304`
- Shoot lane Y: `GROUND_Y - 36`
- Initial world speed: `230`
- Maximum world speed: `520`
- World speed increase: `230 + elapsed * 4.4`
- Score drift: `elapsed * 8.5` points per second
- Player contact damage: `0.5`
- Player invincibility after damage: `2.2s`
- Level max health gain: `0.5`
- Leaderboard size: `10`

Use a fixed logical coordinate system equivalent to `960x360` and scale it to the SpriteKit scene. Gameplay numbers should be in logical units, not raw screen pixels, so tuning carries over across devices.

## Game States

Implement the same state machine:

- `start`: draw the start/leaderboard overlay and wait for tap/start.
- `playing`: update world, player, weapons, spawns, collisions, score, UI.
- `paused`: freeze gameplay and show pause overlay.
- `gameover`: show final score, leaderboard, and restart or initials entry.
- onboarding visible: first-run modal shown before the first run; dismiss by tap or primary button.
- pending leaderboard entry: capture exactly three initials before returning to normal restart flow.

Persist onboarding, mute, high score, fallback leaderboard, and personal best scores using `UserDefaults`.

## Input

Map the browser controls to iOS:

- Tap anywhere: start, jump, restart, or focus initials entry depending on state.
- Optional external keyboard:
  - Space / ArrowUp / W: jump
  - Enter: start/restart/submit initials
  - P: pause/unpause
  - M: mute/unmute
  - Backspace and A-Z: initials entry
- Add a visible mute control and restart affordance equivalent to the web version.
- For initials entry, use a native input overlay or SpriteKit text entry bridge that accepts three A-Z characters and a Save action.

Touch input must never scroll or leave the game. The app should be immersive full-screen.

## Player

Preserve player behavior:

- Initial position: `x = 94`
- Base size: `58 x 72`
- Initial health/max health: `3`
- Jump only when grounded.
- Jump velocity: `-760`
- Gravity in current implementation: `2050 * dt` in `Player.update`.
- Grounded when bottom reaches `GROUND_Y`.
- Barrel position: `x + 55 * scale`, `y + 36 * scale`.
- Hitbox: `x + 10 * scale`, `y + 8 * scale`, width `w - 16 * scale`, height `h - 8 * scale`.
- Invincibility blink after damage.
- Recoil when firing.
- Stomp bounce velocity: `-560`.
- Level growth: 1% per level after level 1, capped so the player never exceeds the game screen.

The player's shirt color changes by level. Preserve the current level palette and cycle it after the tenth level. The default shot color changes with the same palette.

## Weapons And Projectiles

Preserve the weapon set:

- Rapid Fire: `10s`, faster fire interval.
- Spread Shot: `10s`, three vertical shots, expanding to five shots at level bonus 5.
- Piercing Shot: `11s`, bullets hit multiple enemies.
- Laser Beam: `4s`, short duration, frequent damage ticks, beam width grows with level.
- Rocket Shot: `11s`, heavy projectile with splash damage and knockback.
- Drone Helper: `12s`, companion drone fires extra bullets.

Weapon pickup behavior:

- If no active weapon, activate immediately.
- If another weapon is active, queue the pickup.
- When the active weapon expires, activate the next queued weapon.
- Show a power toast after collection.

Preserve formulas:

- Rapid interval: `clamp(0.17 - powerBonus * 0.006, 0.12, 0.17)`
- Rocket interval: `clamp(0.44 - powerBonus * 0.018, 0.28, 0.44)`
- Laser interval: `clamp(0.08 - powerBonus * 0.003, 0.055, 0.08)`
- Default interval: `clamp(0.34 - powerBonus * 0.02, 0.2, 0.34)`
- Default bullet speed: `760 + powerBonus * 24`
- Rocket speed: `660 + powerBonus * 28`
- Rocket base damage: `4 + floor(powerBonus / 3)`
- Other projectile damage: `1 + floor(powerBonus / 4)`
- Pierce count: `3 + floor(powerBonus / 3)` for pierce shots
- Normal pierce: `1 + floor(powerBonus / 8)`
- Drone pierce: `1 + floor(powerBonus / 7)`
- Weapon duration: base duration plus `powerBonus * 0.35`, except laser uses `powerBonus * 0.12`

Rocket constants:

- Splash radius: `118`
- Boss splash radius: `132`
- Splash damage: `4`
- Boss splash damage: `3`
- Knockback: `132`

## Enemies

Port all enemy types and tuning:

- Ground Crawler: `58x40`, ground lane, speed `198`, health `1`, score `10`, asset `ground-crawler`.
- Flying Bug: `62x44`, shoot lane, speed `176`, health `1`, score `15`, asset `flying-bug`.
- Fast Skitter: `46x30`, ground lane, speed `290`, health `1`, score `20`, asset `fast-skitter`.
- Tank Beetle: `86x60`, ground lane, speed `145`, health `3`, score `40`, asset `tank-beetle` or the current heavy beetle equivalent.
- Zigzag Bug: `62x44`, shoot lane, speed `184`, health `2`, score `25`, asset `zigzag-bug`.
- Mini Swarm Bug: `36x24`, shoot lane, speed `238`, health `1`, score `5`, asset `mini-swarm`.

Enemy speed is randomized by `0.92...1.1`. Flying, zigzag, and mini enemies bob vertically with `sin(time * 8) * 2`. Offscreen enemies are removed.

Do not add rocks, hurdles, logs, spikes, or non-enemy obstacles. The challenge is enemy contact, swarm density, boss pressure, and weapon timing.

## Bosses

Port both bosses:

- Giant Beetle Boss:
  - Size: `150x104`
  - Ground boss
  - Target X: `710`
  - Base health: `34 + bossCount * 13 + elapsed * 0.14`
  - Spawns ground or fast enemies every `2.8...3.8s`
- Wasp Queen Boss:
  - Size: `138x108`
  - Flying boss
  - Target X: `735`
  - Base health: `28 + bossCount * 13 + elapsed * 0.14`
  - Vertical movement: `sin(time * 1.9) * 12`
  - Spawns mini or flying enemies every `2.1...3.0s`

Boss schedule:

- First boss at `45s`.
- Alternate beetle, wasp, beetle, wasp.
- After each boss spawn, set next boss time to `elapsed + 48 + bossCount * 8`.
- Boss defeat gives `300 + bossCount * 80` score, plays win sound, emits particles, and drops a power-up.

Boss side contact damages the player. Stomping a boss deals `3` damage and bounces the player.

## Power-Ups And Leveling

All power-ups float above the standing lane and require jumping:

- Random y: `142...208`
- Size: `34x34`
- Movement: scroll left at `worldSpeed * 0.88 + 72`
- Bobbing: `sin(time * 4) * 12`

Random power-up pool:

- `rapid`
- `spread`
- `pierce`
- `laser`
- `rocket`
- `drone`
- `health`
- `maxHealth`
- after 40s, include `upgrade`

Timers:

- First power timer: `7s`
- Normal next power: `10...15s`
- During boss: `7...10s`
- First upgrade timer: `28s`
- Later upgrade timer: `38...50s`

Pickup effects:

- Health restores `1`, or `2` once `powerBonus >= 5`.
- Max Health increases max health by `1`, or `2` once `powerBonus >= 8`, and refills health.
- Level Up increments `upgradeLevel`, scales the player, increases max health by `0.5`, improves default weapon scaling, changes shirt/shot color, and continues indefinitely.

Do not add shield, score boost, generic boosts, or obstacle mechanics.

## Spawning And Difficulty

Preserve spawn progression:

- Spawn timer starts at `0.55s`.
- After each enemy formation, timer becomes `clamp(0.95 - elapsed * 0.0055, 0.28, 0.95)`.
- Difficulty scalar is `elapsed / 90`.

Formation unlocks:

- Always: `single`.
- After `6s`: `groundPair`, `flyingPair`.
- After `18s`: `mixed`, `fastLine`.
- After `42s`: `tankEscort`, `zigzagMix`.
- After `75s`: `miniSwarm`, plus more mixed/tank choices.

Formation definitions:

- `groundPair`: two ground crawlers spaced by `118`.
- `flyingPair`: two flying bugs spaced by `106`.
- `mixed`: ground plus flying at `+96`.
- `fastLine`: two fast skitters spaced by `92`.
- `tankEscort`: tank, mini at `+118`, ground at `+178`.
- `zigzagMix`: zigzag plus ground at `+122`.
- `miniSwarm`: five mini bugs spaced by `46`.
- `single`: stage-dependent random pool.

Clamp spawned enemies so they never appear closer than `player.x + 260`.

## Collision Rules

Port the same collision helpers:

- Rectangle overlap for player/pickup/enemy/boss.
- Circle-rectangle overlap for bullet/enemy/boss.
- Stomp collision: player vertical velocity greater than `120` and player bottom at or above the upper `45%` of the target hitbox.

Player collisions:

- Stomping an enemy kills it and bounces the player without contact damage.
- Side/body contact damages the player by `0.5`, grants invincibility, and damages the enemy by `1`.
- Boss stomp deals `3`.
- Boss side/body contact damages only the player.

Bullet collisions:

- Bullets can only damage visible targets whose center is inside the screen threshold.
- Piercing bullets track already-hit target IDs.
- Rocket impact explodes and applies splash to enemies and bosses.
- Laser damages every visible target whose hitbox overlaps the beam.

Cleanup caps:

- Bullets: last `95`
- Enemies: last `80`
- Power-ups: last `8`
- Particles: last `160`

## Rendering

Keep the game visually full-screen and arcade-clean:

- Use a sky gradient equivalent to the current canvas background.
- Preserve parallax layers: hills, clouds, trees, bushes.
- Preserve ground: brown base, green grass strip, moving dash marks.
- Draw power-ups, bullets, laser, bosses, enemies, player, drone, particles, and UI in the same relative order as the web game.
- Use SpriteKit particles for hit sparks, pickup bursts, rocket explosions, and boss defeat bursts.
- Preserve hit flash, wing pulse, boss bobbing, drone hover, player recoil, and invincibility blink.
- Preserve the LED-style start/game-over leaderboard panel and boss health bar.

Use native fonts where appropriate, but keep the visual hierarchy:

- Chunky rounded/system font for HUD.
- Monospaced arcade style for leaderboard rows.
- Bright score colors and glow effects.

## HUD And Overlays

Implement:

- Health percentage with horizontal health bar.
- Score and high score.
- Active weapon timer and progress bar.
- Default Blaster level when no weapon is active.
- Level progress bar toward the next upgrade spawn.
- Muted pill when muted.
- Boss health bar with boss name.
- Start overlay with global top 10 and personal best 10.
- Pause overlay.
- Game-over overlay with final score and high score.
- Three-letter initials entry for qualifying global scores.
- First-run onboarding card with the same concepts:
  - tap/jump
  - auto-shooting
  - jump into power-ups
  - bosses
  - top 10 goal

All UI must be readable on iPhone. Do not let the notch, Dynamic Island, or home indicator cover important controls.

## Audio

Recreate the generated web audio with native generated tones. Do not require external sound files unless generated effects are intentionally added later.

Preserve sound event categories:

- `shoot`
- `hit`
- `power`
- `damage`
- `boss`
- `win`
- `over`
- `pop`

Persist mute state. Respect the hardware silent switch if appropriate for the app category.

## Scores And Persistence

Local persistence:

- High score
- Global leaderboard fallback
- Personal best 10 with score and elapsed survival time
- Onboarding seen
- Mute setting

Remote score API:

- Fetch: `GET https://game.phunnysunny.com/api/scores`
- Submit: `POST https://game.phunnysunny.com/api/scores`
- Request body: `{ "initials": "ABC", "score": 12345 }`
- Expected response: `{ "scores": [{ "initials": "ABC", "score": 12345 }] }`

Normalize scores exactly like the web app:

- Initials uppercase A-Z.
- Max three letters.
- Pad incomplete initials to three characters only during normalization.
- Scores are non-negative integers.
- Sort descending.
- Keep top 10.

If the remote API fails, keep the game playable and use local fallback leaderboard data.

## Verification Checklist

Before considering the iOS port complete, verify on at least one iPhone simulator and one iPad simulator:

- App launches full-screen in landscape.
- First-run onboarding appears once and persists dismissal.
- Tap starts the game.
- Tap jumps.
- Auto-shooting starts immediately during play.
- Player gravity, jump height, and ground collision match the web feel.
- Enemies spawn from the right and only enemy hazards appear.
- Stomping enemies bounces the player and avoids contact damage.
- Side contact damages the player and shows invincibility.
- All six weapons work.
- Weapon pickups queue while another weapon is active.
- Health, max health, and level pickups work.
- Leveling changes player shirt/default bullet colors and increases scale by 1% per level without exceeding screen bounds.
- Bosses appear, show health bars, spawn minions, take bullet/laser/rocket/stomp damage, and drop a power-up on defeat.
- Score, high score, personal best list, and global leaderboard render correctly.
- Qualifying score prompts for three initials.
- Remote score fetch and submit work when network is available.
- Remote score failure falls back to local data without blocking play.
- Pause, mute, restart, and game-over flows work.
- Generated HD assets are crisp at `1x`, `2x`, and `3x` display scales.
- No core sprite appears blurred, stretched, cropped incorrectly, or visually inconsistent with the rest of the set.
- Particle counts and entity caps keep the game smooth.

## Implementation Strategy

1. Create the iOS project and lock landscape full-screen presentation.
2. Copy the original SVG assets into an archival resources folder.
3. Use ImageGen to generate the HD native sprite set from the SVG references.
4. Build the SpriteKit scene with the `960x360` logical world and scaling layer.
5. Port pure data first: constants, weapons, pickups, level colors, enemy configs, rocket constants.
6. Port entities: player, bullet, enemy, boss, power-up, particle.
7. Port the update loop and spawning before polishing visuals.
8. Port collisions and score rules.
9. Add HUD, overlays, onboarding, initials entry, and persistence.
10. Add remote score service.
11. Add generated audio effects and mute.
12. Verify gameplay against the web version side by side.
13. Tune only if simulator/device feel differs, and document every tuning deviation.

## Non-Goals

- No WebView wrapper.
- No React Native.
- No frontend web framework.
- No Phaser/Pixi/Unity/Godot.
- No new obstacles.
- No shield or score-boost power-ups.
- No remote dependency for required art.
- No redesign that loses the current Bug Blaster identity.

## Final Acceptance Standard

The result is acceptable only when a player familiar with the browser game can play the iOS app and recognize the same mechanics, progression, enemies, power-ups, bosses, scoring, and arcade presentation, with all assets upgraded into crisp high-definition native images.
