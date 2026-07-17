# Project Audit

## Original issues found

### Stability and performance

- React StrictMode double-mounted multiple canvas effects during local development
- Four continuous animation systems could run at full display refresh rate simultaneously
- Full-screen canvases rendered at uncapped device-pixel ratio
- The neural background initialized audio from every mouse-move event
- Hover state restarted the centerpiece and cursor animation effects
- Three.js objects were allocated every frame for simple drone projection math
- The heavy calibration overlay loaded and ran on every startup
- Decorative telemetry used a separate requestAnimationFrame loop


- Generic package identity and minimal AI Studio README
- Windows-incompatible `rm -rf` cleanup command
- No CI, license file, contribution guide, or security policy
- Fixed server port and model with limited deployment configuration
- No API input bounds, request-size cap, security headers, health endpoint, or graceful shutdown
- Frontend stopped updating when the backend was unavailable
- Large single production JavaScript chunk
- AI Studio-only metadata and encoding artifacts

## Resolution

- Added production project metadata and cross-platform scripts
- Added browser-side deterministic simulation for static deployments
- Added configurable `VITE_API_BASE_URL`, `PORT`, and `GEMINI_MODEL`
- Added server hardening and input sanitation
- Added manual vendor chunking
- Added GitHub Actions validation and repository documentation
- Removed AI Studio-only repository artifacts
- Added adaptive frame caps, DPR limits, visibility pausing, and reduced particle profiles
- Removed per-frame Three.js allocations and the unused Three.js dependency
- Lazy-loaded calibration, philosophy, and custom-cursor modules
- Made Performance Mode the safe default while preserving an optional cinematic profile
- Replaced decorative telemetry RAF work with a low-frequency interval

## Verification target

```bash
npm ci
npm run check
npm start
curl http://localhost:3000/api/health
```

## Final validation result

All repository checks passed. See [VALIDATION.md](VALIDATION.md).
