# Sentinel Sense

Sentinel Sense is a cinematic hazard-simulation and risk-awareness dashboard built with React, TypeScript, high-performance Canvas 2D, Express, and the Gemini API. It combines an optional server-side AI analysis path with a deterministic browser/server fallback engine, so the interactive demo still works when no API key or backend is available.

> **Safety notice:** Sentinel Sense is an educational simulation and portfolio project. It is not an emergency-warning system, medical device, weather service, seismic monitor, or substitute for official government and local-authority guidance.

## Highlights

- Nine simulated risk domains: flood, fire, typhoon, crop disease, medical emergency, traffic, power outage, water quality, and earthquake
- Server-side Gemini structured-output analysis
- Deterministic local simulation when Gemini is unavailable or disabled
- Static-host fallback for GitHub Pages and portfolio embedding
- Procedural Canvas 2D visualizations, audio feedback, accessibility controls, and adaptive performance mode
- Input bounds, request-size limits, security headers, health endpoint, graceful shutdown, and production asset caching
- Automated GitHub Actions validation

## Tech stack

- React 19 and TypeScript
- Vite and Tailwind CSS 4
- Canvas 2D, Motion, and Lucide React
- Express 4 and `@google/genai`
- esbuild for the production server bundle

## Quick start

### Requirements

- Node.js 20.19 or newer; Node.js 22 is recommended
- npm
- A Gemini API key only when remote AI analysis is desired

### Setup

```bash
git clone https://github.com/zelop301/sentinel-sense.git
cd sentinel-sense
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`.

The app automatically uses the local simulation engine when `GEMINI_API_KEY` is empty.

## Performance

Performance Mode is enabled by default. It caps continuous canvas loops, lowers pixel density and particle counts, disables the animated custom cursor, and pauses work in hidden tabs. Use **Accessibility & HUD Controls** to enable full cinematic effects. See [docs/PERFORMANCE.md](docs/PERFORMANCE.md) for details.

The cinematic calibration sequence is optional and can be launched with `?calibrate=1`.

## Environment variables

| Variable | Scope | Required | Purpose |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | Server | No | Enables Gemini-assisted predictions. Never expose it to browser code. |
| `GEMINI_MODEL` | Server | No | Overrides the default Gemini model string. |
| `PORT` | Server | No | Express port; defaults to `3000`. |
| `VITE_API_BASE_URL` | Browser | No | Public backend origin when frontend and API are deployed separately. |

## Commands

```bash
npm run dev          # Start the full-stack development server with watch mode
npm run typecheck    # Validate TypeScript
npm run build        # Build browser assets and the Express server
npm run start        # Run the production build
npm run check        # Typecheck and build
npm run clean        # Remove generated output
```

## Deployment

### Full-stack Node deployment

1. Configure `GEMINI_API_KEY` in the hosting provider's secret manager.
2. Use `npm ci && npm run build` as the build command.
3. Use `npm start` as the start command.
4. Expose the provider-assigned `PORT`.

### Static frontend deployment

The Vite build uses relative asset paths and can be served from a subdirectory. Without a backend, Sentinel Sense automatically switches to the browser simulation engine. To connect a separately deployed API, set `VITE_API_BASE_URL` during the frontend build.

## API

- `GET /api/health` — service and AI-configuration status
- `GET /api/scans` — recent in-memory scan summaries
- `POST /api/predict` — sanitized simulation inputs and prediction output

Example:

```bash
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Metro Manila",
    "temperature": 33,
    "humidity": 82,
    "windSpeed": 35,
    "precipitation": 20,
    "seismicActivity": 1.2,
    "cropHealthIndex": 70,
    "infrastructureLoad": 80,
    "waterPh": 6.8,
    "customScenario": "Heavy rain during evening rush hour",
    "forceLocal": true
  }'
```

## Repository structure

```text
src/
  components/           Visual and dashboard modules
  data/                 Demo scans and reusable presets
  utils/                Audio and deterministic prediction engines
server.ts                Express API and production host
scripts/clean.mjs        Cross-platform cleanup
.github/workflows/ci.yml Continuous integration
```

## Security

- Keep all real secrets in local `.env` files or your host's secret manager.
- Do not put API keys in `VITE_*` variables; those are bundled into browser code.
- Review [SECURITY.md](SECURITY.md) before public deployment.

## License

Apache License 2.0. See [LICENSE](LICENSE).
