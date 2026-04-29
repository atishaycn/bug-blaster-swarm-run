# Program Brief

## Purpose

`game2` contains **Bug Blaster: Swarm Run**, a zero-build browser Canvas game. The player survives a side-scrolling bug swarm with auto-shooting, jumps, weapon power-ups, and periodic boss bugs.

## Important Files

- `index.html`: static shell and overlay structure.
- `styles.css`: responsive page, frame, and overlay styling.
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

Core checks: start screen appears with the global and personal score dashboard, Enter starts, player jumps, tap-to-jump works from the full page on phones without page scrolling, auto-shooting works, only enemies spawn, bosses appear, power-ups require jumping, weapon power-ups work, weapon pickups collected while another weapon is active queue and activate after the current weapon expires, health restores one heart up to current max, max-health pickup increases max health and refills, Blaster Core pickups permanently improve the current run's default weapon scaling and visibly change the player shirt/default shot colors by level, score/high score persist, personal best-10 scores persist in localStorage, qualifying scores accept three initials by keyboard or the mobile name field and Save button, and restart works without a refresh.

## Boundaries

Keep the project plain HTML/CSS/JS with Canvas. The only backend code should be the lightweight Vercel-compatible `/api/scores` score service. Do not add React, TypeScript, Phaser, Pixi, bundlers, external audio, large raster backgrounds, shield/score/generic power-ups, or non-enemy obstacle mechanics. Health, Max Health, and Blaster Core are allowed as non-weapon pickups.
