# AGENTS.md

## Project Instructions

This repo follows the global Codex working model, with the project-specific rules below taking precedence for work in `/Users/sa/Developer/game2`.

## Delivery Rule

- After successful code changes, push the branch to the remote repository.
- Verify the deployed result with Vercel after pushing. Use the linked Vercel project in `.vercel/` when available, inspect the deployment status, and confirm the live deployment responds before calling the work complete.
- If pushing or deployment verification is blocked by authentication, network, permissions, or a failing check outside the change scope, report the exact blocker and leave the repo in the best verified local state.

## Verification

- Run the narrowest relevant local check before pushing. For general gameplay or backend changes, use `npm run check`.
- For score API or deployment-sensitive changes, also verify through Vercel (`vercel dev` locally when useful, and the production or preview deployment after push).

## Boundaries

- Keep the app plain HTML, CSS, JavaScript, Canvas, and the lightweight Vercel-compatible score API.
- Do not add a frontend framework, bundler, game engine, or large assets unless the user explicitly changes the project direction.
