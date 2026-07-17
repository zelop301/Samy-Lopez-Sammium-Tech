import React, { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck, Volume2, VolumeX, Radio, Flame, Waves } from "lucide-react";
import { PredictionResult } from "../types";
import { audioEngine } from "../utils/AudioEngine";

interface SentinelRadarProps {
  prediction: PredictionResult | null;
  isScanning: boolean;
}

export default function SentinelRadar({ prediction, isScanning }: SentinelRadarProps) {
  const [muted, setMuted] = useState(true);

  const overallScore = prediction?.overallThreatScore ?? 0;
  const threatGrade = prediction?.threatGrade ?? "LOW";

  // Determine glow color classes based on threat score and the 5 Sentinel Awareness Levels
  const getThemeClasses = () => {
    if (isScanning) {
      return {
        glow: "shadow-[0_0_50px_rgba(193,18,31,0.5)] border-red-500 animate-pulse",
        text: "text-red-400",
        bg: "bg-red-950/10",
        label: "SCANNING SECTOR",
        badge: "bg-red-950/30 text-red-300 border-red-500/50"
      };
    }

    // Level 5: National Emergency (overallScore >= 81) - CRIMSON RED
    if (overallScore >= 81) {
      return {
        glow: "shadow-[0_0_60px_rgba(193,18,31,0.8)] border-red-600 ring-2 ring-red-500/30 animate-pulse",
        text: "text-red-500 font-extrabold animate-pulse",
        bg: "bg-red-950/25",
        label: "🔴 LEVEL 5: NATIONAL EMERGENCY",
        badge: "bg-red-950/40 text-red-200 border-red-500/60"
      };
    } 
    // Level 4: Critical (overallScore >= 61) - RED
    else if (overallScore >= 61) {
      return {
        glow: "shadow-[0_0_45px_rgba(239,68,68,0.7)] border-red-500 ring-1 ring-red-500/20",
        text: "text-red-500 font-bold",
        bg: "bg-red-950/15",
        label: "🔴 LEVEL 4: CRITICAL ACTIVITY",
        badge: "bg-red-900/30 text-red-200 border-red-500/50"
      };
    } 
    // Level 3: Elevated Risk (overallScore >= 46) - ORANGE
    else if (overallScore >= 46) {
      return {
        glow: "shadow-[0_0_35px_rgba(249,115,22,0.6)] border-orange-500",
        text: "text-orange-500 font-semibold",
        bg: "bg-orange-950/10",
        label: "🟠 LEVEL 3: ELEVATED THREAT",
        badge: "bg-orange-900/20 text-orange-200 border-orange-500/40"
      };
    } 
    // Level 2: Attention (overallScore >= 26) - YELLOW
    else if (overallScore >= 26) {
      return {
        glow: "shadow-[0_0_25px_rgba(234,179,8,0.4)] border-yellow-500",
        text: "text-yellow-500",
        bg: "bg-yellow-950/10",
        label: "🟡 LEVEL 2: ATTENTION CAUTION",
        badge: "bg-yellow-900/10 text-yellow-300 border-yellow-700/60"
      };
    } 
    // Level 1: Stable - STABLE GRAPHITE
    else {
      return {
        glow: "shadow-[0_0_20px_rgba(255,255,255,0.05)] border-zinc-800",
        text: "text-zinc-400",
        bg: "bg-zinc-950",
        label: "⚪ LEVEL 1: STABLE OPERATIONS",
        badge: "bg-zinc-900/40 text-zinc-300 border-zinc-800"
      };
    }
  };

  const theme = getThemeClasses();

  // Keep AudioEngine synced with state
  useEffect(() => {
    audioEngine.setMuted(muted);
    if (!muted && prediction) {
      audioEngine.updateDrone(prediction.overallThreatScore);
    }
    return () => {
      audioEngine.stopDrone();
    };
  }, [muted]);

  // Update drone sound parameters whenever the prediction updates
  useEffect(() => {
    if (!muted && prediction) {
      audioEngine.updateDrone(prediction.overallThreatScore);
    }
  }, [prediction, muted]);

  const handleToggleMute = () => {
    setMuted(!muted);
  };

  return (
    <div id="sentinel-radar" className="relative flex flex-col items-center justify-center p-6 bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl h-full min-h-[380px]">
      {/* Absolute Decorative Tech Accents */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="flex h-2.5 w-2.5 relative">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isScanning ? 'bg-red-400' : overallScore >= 81 ? 'bg-red-500' : overallScore >= 61 ? 'bg-red-400' : 'bg-zinc-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isScanning ? 'bg-red-500' : overallScore >= 81 ? 'bg-red-500' : overallScore >= 61 ? 'bg-red-500' : 'bg-zinc-500'}`}></span>
        </span>
        <span className="text-[10px] font-mono tracking-widest text-zinc-500">SENSE_FEED: ACTIVE</span>
      </div>

      <button
        id="btn-toggle-audio"
        onClick={handleToggleMute}
        className={`absolute top-3 right-3 p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer ${
          muted
            ? "bg-zinc-900/80 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
            : "bg-red-950/30 border-red-800/80 text-red-400 hover:bg-red-900/30"
        }`}
        title={muted ? "Enable Audio Warnings" : "Mute Sound alerts"}
      >
        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-400 animate-pulse" />}
      </button>

      {/* Main Pulsing Radial Core */}
      <div className="relative mt-8 mb-6 flex items-center justify-center">
        {/* Concentric Glow Wave Rings */}
        <div
          className={`absolute rounded-full border transition-all duration-700 flex items-center justify-center ${theme.glow} ${theme.bg}`}
          style={{
            width: "220px",
            height: "220px",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {/* Inner Ring 2 */}
          <div className="absolute w-[180px] h-[180px] rounded-full border border-dashed border-zinc-800 opacity-60 animate-[spin_40s_linear_infinite]"></div>

          {/* Inner Ring 3 */}
          <div className="absolute w-[140px] h-[140px] rounded-full border border-zinc-900 flex items-center justify-center bg-black/60">
            {/* Spinning sweeps line */}
            <div className={`absolute inset-0 rounded-full border border-zinc-800/20 ${isScanning ? 'animate-[spin_2s_linear_infinite]' : 'animate-[spin_12s_linear_infinite]'}`}>
              <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent to-red-500/40 origin-right ml-0 mr-auto self-center transform rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Core Value Display */}
        <div className="z-10 flex flex-col items-center justify-center text-center w-[120px] h-[120px]">
          {isScanning ? (
            <div className="flex flex-col items-center gap-1.5">
              <Radio className="w-8 h-8 text-red-500 animate-pulse" />
              <span className="text-xs font-mono text-red-400 tracking-wider">ANALYZING</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span className={`text-4xl font-mono tracking-tighter ${theme.text}`}>
                {overallScore}%
              </span>
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase mt-1">
                Risk Score
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Subtext and Status Grade Badges */}
      <div className="text-center w-full max-w-sm mt-4 flex flex-col items-center">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono tracking-wider font-semibold transition-all duration-300 ${theme.badge}`}>
          {isScanning ? (
            <Radio className="w-3.5 h-3.5 animate-spin" />
          ) : overallScore >= 61 ? (
            <ShieldAlert className="w-3.5 h-3.5" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5" />
          )}
          {theme.label}
        </div>

        <p className="text-xs text-zinc-400 font-sans mt-3 line-clamp-3 min-h-[50px] italic leading-relaxed">
          {isScanning
            ? "Configuring telemetry grids and dispatching sub-spatial AI nodes to parse current atmospheric, geological, and agricultural vectors..."
            : prediction?.summary || "Configure simulated telemetry values below or select a standard baseline zone, then trigger Sentinel Scan."}
        </p>

        {prediction?.locationName && !isScanning && (
          <div className="text-[10px] font-mono text-zinc-500 mt-2">
            Sector: <span className="text-zinc-300 font-semibold">{prediction.locationName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
