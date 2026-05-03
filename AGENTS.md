# AGENTS.md

## Project Instructions

This repo follows the global OpenClaw/Codex working model, with the project-specific rules below taking precedence for work in `/Users/suns/Developer/bug-blaster-swarm-run`.

## Standing Project Context

- Primary repo: `https://github.com/atishaycn/bug-blaster-swarm-run`
- Local path: `/Users/suns/Developer/bug-blaster-swarm-run`
- Always work from the `advanced-version` branch unless bossman explicitly says otherwise.
- Treat this as the default/only project for Telegram work until bossman changes the standing instruction.
- GitHub CLI and Vercel CLI are expected to be available and authenticated before project work begins.
- Production URL: `https://game2-ashen-theta.vercel.app`
- Vercel production deployment aliases currently include `https://game.phunnysunny.com`, `https://game2-ashen-theta.vercel.app`, and `https://bug-blaster-swarm-run-atishay-jains-projects-b62c3561.vercel.app`.

## Start-of-Work Checklist

Before making changes:

1. `cd /Users/suns/Developer/bug-blaster-swarm-run`
2. Verify `git branch --show-current` is `advanced-version`; switch to it if needed.
3. Check `git status --short --branch` and preserve/report any pre-existing user changes.
4. Verify tool auth when relevant: `gh auth status` and `vercel whoami`.

## Delivery Rule

- After successful code changes, push the branch to the remote repository.
- Verify the deployed result with Vercel after pushing. Use the linked Vercel project in `.vercel/` when available, inspect the deployment status, and confirm the live deployment responds before calling the work complete.
- If `.vercel/` is not present, use the production URL/repo information above and `vercel inspect`/deployment aliases to verify the live deployment.
- If pushing or deployment verification is blocked by authentication, network, permissions, or a failing check outside the change scope, report the exact blocker and leave the repo in the best verified local state.

## Verification

- Run the narrowest relevant local check before pushing. For general gameplay or backend changes, use `npm run check`.
- For score API or deployment-sensitive changes, also verify through Vercel (`vercel dev` locally when useful, and the production or preview deployment after push).

## Boundaries

- Keep the app plain HTML, CSS, JavaScript, Canvas, and the lightweight Vercel-compatible score API.
- Do not add a frontend framework, bundler, game engine, or large assets unless the user explicitly changes the project direction.
