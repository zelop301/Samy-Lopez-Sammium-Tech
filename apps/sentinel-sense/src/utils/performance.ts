export interface PerformanceProfile {
  isLowPowerDevice: boolean;
  maxDevicePixelRatio: number;
  targetFps: number;
  reducedTargetFps: number;
}

type NavigatorWithMemory = Navigator & { deviceMemory?: number };

export function getPerformanceProfile(): PerformanceProfile {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      isLowPowerDevice: false,
      maxDevicePixelRatio: 1.25,
      targetFps: 30,
      reducedTargetFps: 20,
    };
  }

  const nav = navigator as NavigatorWithMemory;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const isTouchDevice = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const isLowPowerDevice = prefersReducedMotion || isTouchDevice || cores <= 4 || memory <= 4;

  return {
    isLowPowerDevice,
    maxDevicePixelRatio: isLowPowerDevice ? 1 : 1.25,
    targetFps: isLowPowerDevice ? 24 : 30,
    reducedTargetFps: isLowPowerDevice ? 15 : 20,
  };
}

export function getInitialPerformanceMode(): boolean {
  if (typeof window === "undefined") return true;

  const saved = window.localStorage.getItem("sentinel_performance_mode");
  if (saved !== null) return saved === "true";

  // Start in the safer profile. Users can disable it from the HUD controls.
  return true;
}

export function savePerformanceMode(enabled: boolean): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("sentinel_performance_mode", String(enabled));
}

export function hasFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(pointer: fine)").matches ?? true;
}
