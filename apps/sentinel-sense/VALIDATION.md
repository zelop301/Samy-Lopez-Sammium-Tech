# Validation Report

Validated on 2026-07-17 with Node.js 22.

## Passed checks

- `npm ci`
- `npm run typecheck` with TypeScript strict mode
- `npm run build:client`
- `npm run build:server`
- `npm audit --omit=dev` — 0 known vulnerabilities
- Clean `npm ci` validation from a fresh directory
- Production server startup with `NODE_ENV=production`
- `GET /api/health`
- `GET /api/scans`
- `POST /api/predict` using the deterministic local engine
- Nine hazard categories returned by the prediction endpoint
- Relative Vite asset paths verified for subdirectory/static hosting
- Repository scan found no embedded Google API key pattern

## Build output

The initial main application chunk was reduced from **453.87 kB to 380.16 kB**. The 36.78 kB Three.js vendor chunk was removed, while the 52.62 kB calibration module, 16.96 kB custom cursor, and 8.03 kB philosophy modal are now loaded only when needed.

Continuous animation work is capped, pixel density is bounded, hidden-tab work is paused, and Performance Mode is enabled by default.
