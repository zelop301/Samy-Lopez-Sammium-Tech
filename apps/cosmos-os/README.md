# Cosmos OS

Cosmos OS is an interactive browser-based universe observatory. It combines a high-density Three.js galaxy simulation with educational laboratories for black holes, quantum states, orbital mechanics, planetary defense, cosmic scale, and research journaling.

The Orion-9 assistant can use the Gemini API when a server-side key is configured. The app remains usable without a key through local fallback responses and simulation commands.

## Highlights

- Interactive spiral and elliptical galaxy simulation with adaptive particle counts
- Galaxy collision, supernova, star-birth, dark-matter, orbit, and camera controls
- Black-hole parameter laboratory with simplified Kerr–Newman metrics
- Quantum probability and measurement sandbox
- Circular-orbit mission planner
- Near-Earth-object deflection scenario
- Cosmic scale explorer, academy lessons, and research journal
- Responsive WebGL rendering with device-aware pixel ratio and particle budgets
- Server-side Gemini integration so API keys are never exposed to the browser
- Production build, health endpoint, type checking, and GitHub Actions CI

## Technology

- React 19 and TypeScript
- Three.js
- Vite and Tailwind CSS 4
- Express
- Google Gen AI JavaScript SDK
- Motion and Lucide React

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- A modern browser with WebGL support

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

A Gemini key is optional. Without one, Orion-9 uses deterministic local responses for supported simulator commands.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | No | Server-side Gemini API key |
| `GEMINI_MODEL` | No | Model ID; defaults to `gemini-2.5-flash` |
| `PORT` | No | HTTP port; defaults to `3000` |

Never commit `.env.local` or any real API key.

## Available commands

```bash
npm run dev          # Start Express and Vite with server-file watching
npm run typecheck    # Run TypeScript validation
npm run build        # Build the Vite client and bundled Node server
npm start            # Serve the production build
npm run check        # Type-check and perform a full production build
npm run clean        # Remove generated production files
```

## Production build

```bash
npm ci
npm run build
npm start
```

The server exposes:

- `GET /api/health` — application and AI configuration status
- `POST /api/chat` — validated Orion-9 chat endpoint
- Static SPA assets from `dist/` in production

## Project structure

```text
.
├── .github/workflows/ci.yml
├── src/
│   ├── components/
│   │   ├── Academy.tsx
│   │   ├── BlackHoleLab.tsx
│   │   ├── CosmicCursor.tsx
│   │   ├── CosmicPanelAssembly.tsx
│   │   ├── CosmicWowIntro.tsx
│   │   ├── EarthGuardian.tsx
│   │   ├── MassiveScale.tsx
│   │   ├── QuantumVerse.tsx
│   │   ├── ResearchJournal.tsx
│   │   └── SpaceMissions.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── sound.ts
│   └── types.ts
├── server.ts
├── vite.config.ts
└── package.json
```

## Performance notes

The simulation automatically scales its initial particle budget using viewport size and available CPU concurrency. React telemetry updates are throttled separately from the animation loop, and the renderer resizes through `ResizeObserver`.

For very low-power devices, reduce the maximum particle counts in `src/App.tsx`. For a future major optimization, move more particle physics from JavaScript objects to typed arrays, Web Workers, or GPU compute.

## Scientific scope

Cosmos OS is an educational visualization. Several values and scenarios are intentionally simplified for interactivity and visual stability. It should not be used for scientific prediction, mission planning, or hazard assessment.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md). Report suspected key exposure privately and rotate affected credentials immediately.

## License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE).
