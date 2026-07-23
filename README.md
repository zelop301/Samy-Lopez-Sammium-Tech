# Sammium Portfolio Suite

A unified portfolio repository for Sam Lopez and Sammium Tech. The flagship registry currently presents **nine launchable systems**:

1. **Sammium NexusOps** — event-driven integration and automation command platform
2. **Sammium OrbitLab 5.0** — procedural deep-space exploration simulator
3. **Sammium SentinelOps** — cyber incident command and response platform
4. **Sammium QuantumVerse** — immersive quantum learning and scientific visualization
5. **Sammium AgriMind AI** — agricultural intelligence and farm operations platform
6. **Sammium Research Lab** — AI research, telemetry, simulation, and experimentation environment
7. **Sammium Cosmos OS** — interactive cosmic observatory and WebGL science platform
8. **Sammium Sentinel Sense** — predictive risk-awareness and hazard simulation dashboard
9. **Sammium AetherVerse** — cinematic holographic command universe with seven functional sectors

The portfolio combines isolated React/Vite workspaces with externally deployed full-stack projects. Static workspaces are built independently and embedded only when launched. Production services such as AetherVerse remain on Node-compatible hosts and are opened through the same portfolio experience.

## Target repository

This package is prepared for the personal portfolio repository and includes a GitHub Pages deployment workflow. See `GITHUB_DEPLOYMENT.md` for upload and activation steps.

## Repository architecture

```text
apps/
  portfolio/       Main portfolio and calibration experience
  quantumverse/    Sammium QuantumVerse source and server
  agrimind-ai/     Sammium AgriMind AI source and server
  research-lab/    Sammium Research Lab source and server
  cosmos-os/       Sammium Cosmos OS source
  sentinel-sense/  Sammium Sentinel Sense source
scripts/
  assemble-projects.mjs
.github/workflows/
  deploy-pages.yml
```

External production experiences are registered in `apps/portfolio/src/data/flagshipProjects.ts` and are not copied into the GitHub Pages bundle.

## Local setup

Requirements: Node.js 22 or newer.

```bash
npm ci
npm run lint
npm run build:pages
npm run dev
```

The portfolio development server is intended for layout and portfolio work. To run an embedded full-stack workspace with its own API, use the matching workspace command. Each server reads its own environment variables; keep API keys out of Git.

## GitHub Pages deployment

The GitHub Actions workflow builds the embedded applications, copies their static distributions into the portfolio, and publishes `apps/portfolio/dist` to GitHub Pages.

1. Open **Settings → Pages** in GitHub.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` or run the deployment workflow manually.

### Static hosting limitation

GitHub Pages serves static files only. Client-side simulations work there, while Express, Gemini, database, queue, WebSocket, and other server features require separate deployments. AetherVerse is linked to its production Render service at `https://sammium-aetherverse.onrender.com`.

## Build pipeline

```bash
npm run build:projects  # builds the embedded project clients
npm run assemble        # copies embedded builds into portfolio/public/projects
npm run build:portfolio # builds the final portfolio
npm run build:pages     # runs the complete pipeline
```

## Project routes

The portfolio uses GitHub Pages-safe hash routes. Examples:

- `#/projects/nexusops`
- `#/projects/orbitlab-v5`
- `#/projects/sentinelops`
- `#/projects/quantumverse`
- `#/projects/agrimind-ai`
- `#/projects/research-lab`
- `#/projects/cosmos-os`
- `#/projects/sentinel-sense`
- `#/projects/aetherverse`

Each route loads its experience only after the visitor launches it.
