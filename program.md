# Program Brief

## Purpose

`game2` contains **Bug Blaster: Swarm Run**, a zero-build browser Canvas game. The player survives a side-scrolling bug swarm with auto-shooting, jumps, weapon power-ups, and periodic boss bugs.

## Important Files

- `index.html`: static shell, one-time onboarding, and overlay structure.
- `styles.css`: responsive page, frame, and overlay styling. Desktop keeps the centered card layout; phone widths (`max-width: 680px`) switch to a viewport-filling app shell.
- `game.js`: all gameplay, rendering, input, audio, scoring, and state management.
- `assets/`: lightweight SVG assets for player, bugs, bosses, scenery, and UI accents.
- `README.md`: player-facing run instructions and gameplay notes.

## Run And Verify

Open `index.html` directly in Chrome for pure local play. Run the syntax and rocket-balance regression check with:

```sh
npm run check
```

For local static verification, run:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

For shared top-10 score backend verification, run:

```sh
vercel dev
```

Then verify `GET /api/scores` and a qualifying game-over initials submission. The frontend tries the same-origin `/api/scores` first, then falls back to `https://game.phunnysunny.com/api/scores` so static/local copies still sync with the production leaderboard. The API falls back to `.data/scores.json` locally and `/tmp/bug-blaster-scores.json` on Vercel when KV/Upstash env vars are absent; configure KV/Upstash for durable production scores. A missing score file should produce an empty leaderboard, and a successful empty backend response should clear the browser fallback leaderboard. The in-canvas dashboard also shows a browser-local personal best-10 list stored under `bugBlasterRunnerPersonalScores`; it updates on every positive-score game over and does not sync to the backend.

Gameplay checks: a first-time player sees the short onboarding card once, start screen appears with the global and personal score dashboard, Enter starts, player jumps, tap-to-jump works from the full page on phones without page scrolling, auto-shooting works, only enemies spawn, bosses appear, power-ups require jumping, weapon power-ups work and scale with level, Laser Beam is strong but short, weapon pickups collected while another weapon is active queue and activate after the current weapon expires, health restores one heart early and more later, max-health pickup increases max health and refills, Level Up runs from level 1 through level 10, level pickups arrive slowly enough to make full leveling a longer target, level pickups permanently improve the current run's default weapon scaling and visibly change the player shirt/default shot colors by level, score/high score persist, personal best-10 scores persist in localStorage, qualifying scores accept three initials by keyboard or the mobile name field and Save button, and restart works without a refresh.

Advanced branch checks: on `advanced-version`, score also acts as experience with thresholds 500, 1000, 2000, then doubling by level. Crossing a threshold pauses play in `levelup` state, renders the three-choice lootbox panel, and resumes after one choice. Lootboxes show only the reward category before opening, then unlock/equip local customization in `bugBlasterAdvancedProgress`: outfits tint the player, bullet types change projectile cosmetics, and acrobatics can enable backflip jumps or a hold-to-hover move with up to two seconds of hover per jump. Every opened lootbox has a 5% cursed chance to persistently multiply UI scale by another 10% in `bugBlasterAdvancedProgress`. Defeating the first Giant Beetle Boss starts a fakeout scene where the runner falls into an open grave, then gameplay resumes in a night graveyard theme with zombie-styled enemies. Mashing `M` 30 times within 10 seconds plays the generated monster mash riff while normal slower `M` presses still toggle mute. In the high-score initials flow, entering `SAI` clears local high score, local leaderboard, personal bests, onboarding state, and advanced customization progress, then returns to the start screen.

After successful code changes, push the current branch to the remote repository and verify the resulting Vercel deployment before calling the work complete. Use the linked Vercel project in `.vercel/` when available, inspect deployment status, and confirm the deployed app responds. If push or Vercel verification is blocked by auth, permissions, network, or unrelated failing checks, record the blocker explicitly and leave the repo in the best verified local state.

## Boundaries

Keep the project plain HTML/CSS/JS with Canvas. The only backend code should be the lightweight Vercel-compatible `/api/scores` score service. Do not add React, TypeScript, Phaser, Pixi, bundlers, external audio, large raster backgrounds, shield/score/generic power-ups, or non-enemy obstacle mechanics. Health, Max Health, and Level Up are allowed as non-weapon pickups.
