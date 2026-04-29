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

Open `index.html` directly in Chrome for pure local play. For local static verification, run:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

For shared top-10 score backend verification, run:

```sh
vercel dev
```

Then verify `GET /api/scores` and a qualifying game-over initials submission. The API falls back to `.data/scores.json` locally when KV/Upstash env vars are absent.

Core checks: start screen appears with the score dashboard, Enter starts, player jumps, auto-shooting works, only enemies spawn, bosses appear, power-ups require jumping, weapon power-ups work, health restores one heart up to current max, max-health pickup increases max health and refills, score/high score persist, qualifying scores accept three initials, and restart works without a refresh.

## Boundaries

Keep the project plain HTML/CSS/JS with Canvas. The only backend code should be the lightweight Vercel-compatible `/api/scores` score service. Do not add React, TypeScript, Phaser, Pixi, bundlers, external audio, large raster backgrounds, shield/score/generic power-ups, or non-enemy obstacle mechanics. Health and Max Health are allowed as the only non-weapon pickups.
