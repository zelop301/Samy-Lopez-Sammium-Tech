# Performance Guide

Sentinel Sense uses multiple animated canvas layers. Version 1.1 starts in **Performance Mode** so the dashboard remains responsive on ordinary laptops and integrated graphics.

## What Performance Mode changes

- Caps ambient canvases to approximately 15–20 FPS
- Caps full-effects canvases to approximately 24–30 FPS
- Limits canvas device-pixel ratio to 1–1.25
- Reduces neural-web depth layers, particles, dust, beams, and glyphs
- Disables expensive canvas blur and most CSS pulse/spin effects
- Disables the custom animated cursor
- Pauses animation loops when the browser tab is hidden
- Skips the cinematic calibration sequence during normal startup

Open **Accessibility & HUD Controls → Performance Mode** to switch between the optimized and full cinematic profiles.

## Optional cinematic calibration

The original calibration sequence is now lazy-loaded and opt-in. Open the application with:

```text
http://localhost:3000/?calibrate=1
```

## Troubleshooting lag

1. Keep Performance Mode enabled.
2. Close duplicate Sentinel Sense or Cosmos OS tabs.
3. Disable browser battery saver only when testing full cinematic mode.
4. Use the production build for realistic performance:

```bash
npm run build
npm start
```

5. In Windows Task Manager, verify the browser is using hardware acceleration.
6. Use the browser's built-in cursor by keeping Performance Mode enabled.
