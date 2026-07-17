import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cpu, ShieldAlert, Sparkles, Volume2, VolumeX, Eye, HelpCircle, Activity, LayoutGrid, Sliders } from "lucide-react";
import { audioEngine } from "../utils/AudioEngine";

export type AtmosphereTheme = "crimson" | "amber" | "cyan" | "emerald";

interface SystemControlPanelProps {
  atmosphere: AtmosphereTheme;
  setAtmosphere: (theme: AtmosphereTheme) => void;
  isHighContrast: boolean;
  setIsHighContrast: (val: boolean) => void;
  isReducedMotion: boolean;
  setIsReducedMotion: (val: boolean) => void;
  isVoiceAssistActive: boolean;
  setIsVoiceAssistActive: (val: boolean) => void;
  isScanning: boolean;
  overallThreat: number;
  isFocusMode: boolean;
  setIsFocusMode: (val: boolean) => void;
}

export default function SystemControlPanel({
  atmosphere,
  setAtmosphere,
  isHighContrast,
  setIsHighContrast,
  isReducedMotion,
  setIsReducedMotion,
  isVoiceAssistActive,
  setIsVoiceAssistActive,
  isScanning,
  overallThreat,
  isFocusMode,
  setIsFocusMode,
}: SystemControlPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fps, setFps] = useState(60);
  const [cpuUsage, setCpuUsage] = useState(12);
  const [gpuLoad, setGpuLoad] = useState(8);
  const [memory, setMemory] = useState(124.6);
  
  // Lightweight telemetry sampler. The previous implementation ran another
  // requestAnimationFrame loop solely to display decorative metrics.
  useEffect(() => {
    const sampleTelemetry = () => {
      const baseFps = isReducedMotion ? 24 : 30;
      setFps(baseFps + Math.floor(Math.random() * 3) - 1);

      const cpuBase = isReducedMotion ? 8 : isScanning ? 34 : overallThreat > 60 ? 22 : 12;
      setCpuUsage(Math.max(4, Math.min(95, cpuBase + Math.floor(Math.random() * 5) - 2)));

      const gpuBase = isReducedMotion ? 4 : isScanning ? 21 : 10;
      setGpuLoad(Math.max(3, Math.min(90, gpuBase + Math.floor(Math.random() * 4) - 2)));

      setMemory((previous) =>
        Number(Math.max(96, previous + (Math.random() - 0.5) * 0.4).toFixed(1))
      );
    };

    sampleTelemetry();
    const timer = window.setInterval(sampleTelemetry, 1_500);
    return () => window.clearInterval(timer);
  }, [isScanning, isReducedMotion, overallThreat]);

  const handleToggle = () => {
    audioEngine.playTactileClick();
    setIsOpen(!isOpen);
  };

  const handleThemeChange = (theme: AtmosphereTheme) => {
    audioEngine.playTactileClick();
    setAtmosphere(theme);
  };

  const atmosphereMeta = {
    crimson: { label: "Sentinel Crimson", border: "border-red-900/60", bg: "bg-red-950/20", text: "text-red-400" },
    amber: { label: "Tactical Amber", border: "border-amber-900/60", bg: "bg-amber-950/20", text: "text-amber-400" },
    cyan: { label: "Bioluminescent Cyan", border: "border-cyan-950/80", bg: "bg-cyan-950/20", text: "text-cyan-400" },
    emerald: { label: "Neural Emerald", border: "border-emerald-900/60", bg: "bg-emerald-950/20", text: "text-emerald-400" },
  };

  return (
    <div className="relative w-full z-30 font-mono">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/95 border border-zinc-900/80 backdrop-blur-xl shadow-2xl">
        {/* Dynamic telemetry status stream readout */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
            <Activity className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
              <span>SYSTEM PERFORMANCE RADIAL</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-xs text-zinc-300 font-bold flex items-center gap-3.5 mt-0.5">
              <span>FPS: <span className="text-emerald-400">{fps}</span></span>
              <span>CPU: <span className="text-zinc-400">{cpuUsage}%</span></span>
              <span>GPU: <span className="text-zinc-400">{gpuLoad}%</span></span>
              <span>MEM: <span className="text-zinc-400">{memory}MB</span></span>
            </div>
          </div>
        </div>

        {/* HUD control bar buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Selector triggers */}
          <div className="flex items-center gap-1 bg-black/60 border border-zinc-900 rounded-xl p-1">
            {(["crimson", "amber", "cyan", "emerald"] as AtmosphereTheme[]).map((t) => {
              const isActive = atmosphere === t;
              return (
                <button
                  key={t}
                  onClick={() => handleThemeChange(t)}
                  className={`w-5 h-5 rounded-md cursor-pointer border transition-all ${
                    t === "crimson"
                      ? "bg-red-600 border-red-700 hover:scale-110"
                      : t === "amber"
                      ? "bg-amber-500 border-amber-600 hover:scale-110"
                      : t === "cyan"
                      ? "bg-cyan-500 border-cyan-600 hover:scale-110"
                      : "bg-emerald-500 border-emerald-600 hover:scale-110"
                  } ${isActive ? "ring-2 ring-white scale-110" : "opacity-40"}`}
                  title={`Shift focus color to ${t}`}
                />
              );
            })}
          </div>

          {/* Immersive Cinematic vs Focus High-Density Selector */}
          <div className="flex items-center gap-1 bg-black/60 border border-zinc-900 rounded-xl p-1">
            <button
              onClick={() => {
                audioEngine.playTactileClick();
                setIsFocusMode(false);
              }}
              className={`px-2.5 py-1 text-[8.5px] rounded-lg font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                !isFocusMode
                  ? "bg-red-950/40 text-red-400 border border-red-900/40 shadow-[0_0_8px_rgba(193,18,31,0.15)]"
                  : "text-zinc-500 hover:text-zinc-300 border border-transparent"
              }`}
              title="Activate Cinematic Spatial Mode"
            >
              <Sparkles className="w-3 h-3" />
              <span>Cinematic</span>
            </button>
            <button
              onClick={() => {
                audioEngine.playTactileClick();
                setIsFocusMode(true);
              }}
              className={`px-2.5 py-1 text-[8.5px] rounded-lg font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                isFocusMode
                  ? "bg-red-950/40 text-red-400 border border-red-900/40 shadow-[0_0_8px_rgba(193,18,31,0.15)]"
                  : "text-zinc-500 hover:text-zinc-300 border border-transparent"
              }`}
              title="Activate High-Density Analytical Focus"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>Focus HUD</span>
            </button>
          </div>

          {/* Quick Vocal Assistance Toggle */}
          <button
            onClick={() => {
              audioEngine.playTactileClick();
              setIsVoiceAssistActive(!isVoiceAssistActive);
            }}
            className={`p-2 rounded-xl border cursor-pointer flex items-center gap-1.5 transition-all text-[9px] uppercase tracking-wider ${
              isVoiceAssistActive
                ? "bg-red-950/30 border-red-800 text-red-400 shadow-[0_0_10px_rgba(193,18,31,0.15)]"
                : "bg-zinc-900/60 border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
            title="Speech alerts synthesizer toggle"
          >
            {isVoiceAssistActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">Voice Assist</span>
          </button>

          {/* More Controls Expand Toggler */}
          <button
            onClick={handleToggle}
            className={`p-2 rounded-xl border cursor-pointer flex items-center gap-1.5 transition-all text-[9px] uppercase tracking-wider ${
              isOpen
                ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-red-500" />
            <span>Accessibility & HUD Controls</span>
          </button>
        </div>
      </div>

      {/* Expanded Accessibility Customization Matrix */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-2 bg-zinc-950/95 border border-zinc-900 rounded-2xl shadow-xl z-20 relative"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-900/40">
              
              {/* Box 1: Visual Accessibility */}
              <div className="bg-black/40 border border-zinc-900/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
                    <Eye className="w-3.5 h-3.5 text-red-500" />
                    High Contrast Matrix
                  </h4>
                  <p className="text-[10px] text-zinc-500 leading-normal mb-4 font-sans">
                    Forces pure high-intensity color profiles and pure blacks to optimize visibility for low-light or outdoor operations.
                  </p>
                </div>
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    setIsHighContrast(!isHighContrast);
                  }}
                  className={`w-full py-2 rounded-lg border text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    isHighContrast
                      ? "bg-zinc-100 text-zinc-950 border-white"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {isHighContrast ? "ACTIVE • High Contrast" : "ENABLE HIGH CONTRAST"}
                </button>
              </div>

              {/* Box 2: Kinetic Compensation */}
              <div className="bg-black/40 border border-zinc-900/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
                    <Cpu className="w-3.5 h-3.5 text-red-500" />
                    Performance Mode
                  </h4>
                  <p className="text-[10px] text-zinc-500 leading-normal mb-4 font-sans">
                    Caps canvas frame rates, lowers particle density, disables expensive blur effects, and pauses nonessential animation work.
                  </p>
                </div>
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    setIsReducedMotion(!isReducedMotion);
                  }}
                  className={`w-full py-2 rounded-lg border text-[10px] font-bold uppercase transition-all cursor-pointer ${
                    isReducedMotion
                      ? "bg-red-950/40 text-red-400 border-red-900/60"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {isReducedMotion ? "ACTIVE • PERFORMANCE MODE" : "ENABLE PERFORMANCE MODE"}
                </button>
              </div>

              {/* Box 3: Atmospheric Telemetry Summary */}
              <div className="bg-black/40 border border-zinc-900/80 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-red-500" />
                    Active Atmosphere Theme
                  </h4>
                  <p className="text-[10px] text-zinc-500 leading-normal mb-3 font-sans">
                    Configures the volumetric wavelengths of the neural grid and projection lasers. Adjusts sensory contrast.
                  </p>
                  <div className={`text-[10px] p-2 rounded border font-mono flex items-center justify-between ${atmosphereMeta[atmosphere].border} ${atmosphereMeta[atmosphere].bg}`}>
                    <span className="text-zinc-400 uppercase">Selected Wavelength:</span>
                    <span className={`${atmosphereMeta[atmosphere].text} font-bold uppercase`}>
                      {atmosphereMeta[atmosphere].label}
                    </span>
                  </div>
                </div>
                <div className="text-[8.5px] text-zinc-600 text-center font-mono mt-2">
                  SENTINEL CORE SECURITY MODULE v7.85
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
