# Changelog

## 1.1.0 - 2026-07-17

### Fixed

- Severe frame drops caused by multiple uncapped canvas loops
- Development-only duplicate effect initialization from React StrictMode
- Canvas backing buffers scaling to excessive device-pixel ratios
- Animation effects restarting on cursor and centerpiece hover changes
- Neural background audio initialization running on mouse movement
- Unnecessary per-frame Three.js object allocation

### Changed

- Performance Mode is enabled by default and saved locally
- Canvas loops now use adaptive 15–30 FPS caps and pause in hidden tabs
- Particle, depth-layer, dust, beam, and glyph counts were reduced
- Custom cursor and cinematic calibration are lazy/optional
- Decorative system metrics now update with a lightweight interval
- Removed the unused Three.js runtime and type dependencies

## 1.0.0 - 2026-07-17

### Added

- Deterministic browser fallback for static hosting
- Configurable API base URL and Gemini model
- Health endpoint, input sanitization, request limits, security headers, and graceful shutdown
- Cross-platform scripts and production build pipeline
- CI workflow, contribution guide, security policy, license, and professional README

### Changed

- Renamed the package to `@sammium/sentinel-sense`
- Split major frontend dependencies into separate production chunks
- Replaced AI Studio-specific setup text and artifacts with GitHub-ready project documentation
