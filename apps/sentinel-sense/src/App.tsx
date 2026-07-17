import React, { lazy, Suspense, useEffect, useState } from "react";
import { Radio, AlertTriangle, ShieldCheck, ShieldAlert, Cpu, Heart, Volume2, Globe, RotateCcw } from "lucide-react";
import { PredictionResult, SimulationInputs, HistoricalScan } from "./types";
import SentinelRadar from "./components/SentinelRadar";
import PredictorControls from "./components/PredictorControls";
import HazardGrid from "./components/HazardGrid";
import AlertsTicker from "./components/AlertsTicker";
import HistorySidebar from "./components/HistorySidebar";
import HolographicSpiderCenterpiece from "./components/HolographicSpiderCenterpiece";
import BackgroundNeuralWeb from "./components/BackgroundNeuralWeb";
import AutonomousResponseEngine from "./components/AutonomousResponseEngine";
import AiDecisionPipeline from "./components/AiDecisionPipeline";
import { audioEngine } from "./utils/AudioEngine";
import SentinelLogo from "./components/SentinelLogo";
import { AnimatePresence, motion } from "motion/react";
import SystemControlPanel, { AtmosphereTheme } from "./components/SystemControlPanel";
import PredictiveTimeline from "./components/PredictiveTimeline";
import DataQualityEngine from "./components/DataQualityEngine";
import AiDecisionReasoning from "./components/AiDecisionReasoning";
import EngineeringDashboard from "./components/EngineeringDashboard";
import { DEMO_SCANS, PRESET_INPUTS } from "./data/demoScans";
import { getFallbackPrediction } from "./utils/predictionEngine";
import { getInitialPerformanceMode, hasFinePointer, savePerformanceMode } from "./utils/performance";

const NeuralCalibration = lazy(() => import("./components/NeuralCalibration"));
const BrandPhilosophy = lazy(() => import("./components/BrandPhilosophy"));
const SentinelCursor = lazy(() => import("./components/SentinelCursor"));

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

const apiUrl = (path: string) => `${API_BASE_URL}${path}`;

const CALIBRATION_SESSION_KEY = "sentinel_calibration_complete_v2";

function shouldShowCalibration(): boolean {
  const mode = new URLSearchParams(window.location.search).get("calibrate");
  if (mode === "1") return true;
  if (mode === "0") return false;

  try {
    return window.sessionStorage.getItem(CALIBRATION_SESSION_KEY) !== "true";
  } catch {
    return true;
  }
}

function markCalibrationComplete(): void {
  try {
    window.sessionStorage.setItem(CALIBRATION_SESSION_KEY, "true");
  } catch {
    // Storage can be unavailable in hardened/private browser contexts.
  }

  const url = new URL(window.location.href);
  if (url.searchParams.has("calibrate")) {
    url.searchParams.delete("calibrate");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch(apiUrl(path), {
      ...init,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timeoutId);
  }
}


export default function App() {
  const [isCalibrating, setIsCalibrating] = useState(shouldShowCalibration);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scans, setScans] = useState<HistoricalScan[]>([]);
  const [activeScanId, setActiveScanId] = useState<string | undefined>(undefined);
  const [isCenterpieceExpanded, setIsCenterpieceExpanded] = useState(false);
  const [isPhilosophyOpen, setIsPhilosophyOpen] = useState(false);

  // Advanced system parameters
  const [atmosphere, setAtmosphere] = useState<AtmosphereTheme>("crimson");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(getInitialPerformanceMode);
  const [isVoiceAssistActive, setIsVoiceAssistActive] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [forceLocal, setForceLocal] = useState(false);
  const [canUseCustomCursor] = useState(hasFinePointer);

  const overallThreat = currentPrediction?.overallThreatScore ?? 0;

  // Load initial scans and select the first one to populate the UI on boot
  useEffect(() => {
    fetchScans(true);
  }, []);

  useEffect(() => {
    savePerformanceMode(isReducedMotion);
  }, [isReducedMotion]);

  const fetchScans = async (selectFirst: boolean = false) => {
    try {
      const data = await fetchJson<{ scans?: HistoricalScan[] }>("/api/scans");
      const nextScans = Array.isArray(data.scans) ? data.scans : [];
      setScans(nextScans);

      if (selectFirst && nextScans.length > 0) {
        await handleSelectScan(nextScans[0].id, nextScans);
      }
    } catch (error) {
      console.warn("API unavailable; switching to the browser simulation engine.", error);
      setScans(DEMO_SCANS);

      if (selectFirst && DEMO_SCANS.length > 0) {
        const firstScan = DEMO_SCANS[0];
        const localResult = getFallbackPrediction(PRESET_INPUTS[firstScan.id]);
        setCurrentPrediction({
          ...localResult,
          id: firstScan.id,
          timestamp: firstScan.timestamp,
          fallbackActive: true,
          engine: "Biomimetic Local Simulation Engine (Browser)",
        });
        setActiveScanId(firstScan.id);
      }
    }
  };

  const applyPredictionResult = (data: PredictionResult) => {
    setCurrentPrediction(data);
    setActiveScanId(data.id);

    if (data.overallThreatScore >= 60) {
      audioEngine.playAlertTrigger();
    }

    if (isVoiceAssistActive && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const cleanName = data.locationName.replace(/\(.*?\)/g, "").trim();
        const vocalText = `Sentinel Core update. Sensor fusion complete for ${cleanName}. Threat index evaluated at ${data.overallThreatScore} percent.`;
        const utterance = new SpeechSynthesisUtterance(vocalText);
        utterance.rate = 0.95;
        utterance.pitch = 0.9;
        window.speechSynthesis.speak(utterance);
      } catch (speechError) {
        console.warn("Speech synthesis failed:", speechError);
      }
    }
  };

  const triggerSentinelScan = async (inputs: SimulationInputs) => {
    setIsScanning(true);
    audioEngine.playScanPing();

    try {
      const data = await fetchJson<PredictionResult>("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inputs, forceLocal }),
      });

      applyPredictionResult(data);
      await fetchScans(false);
    } catch (error) {
      console.warn("Prediction API unavailable; using the local simulation engine.", error);
      const localResult: PredictionResult = {
        ...getFallbackPrediction(inputs),
        fallbackActive: true,
        engine: "Biomimetic Local Simulation Engine (Browser)",
      };

      applyPredictionResult(localResult);
      setScans((current) => [
        {
          id: localResult.id,
          locationName: localResult.locationName,
          overallThreatScore: localResult.overallThreatScore,
          threatGrade: localResult.threatGrade,
          awarenessLevel: localResult.awarenessLevel,
          timestamp: localResult.timestamp,
          summary: localResult.summary,
        },
        ...current.filter((scan) => scan.id !== localResult.id),
      ].slice(0, 20));
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectScan = async (id: string, currentScansList = scans) => {
    // Look up input values in preset index, fallback to default inputs
    const inputs = PRESET_INPUTS[id] || {
      location: currentScansList.find(s => s.id === id)?.locationName || "Monitored Zone",
      temperature: 25,
      humidity: 50,
      windSpeed: 15,
      precipitation: 0,
      seismicActivity: 0.0,
      cropHealthIndex: 85,
      infrastructureLoad: 40,
      waterPh: 7.0,
      customScenario: ""
    };

    // Trigger prediction loading
    await triggerSentinelScan(inputs);
  };

  const completeCalibration = () => {
    markCalibrationComplete();
    setIsCalibrating(false);
  };

  const replayCalibration = () => {
    setIsPhilosophyOpen(false);
    setIsCalibrating(true);
  };

  // During calibration the dashboard is intentionally not mounted. This keeps
  // the immersive boot scene from competing with the dashboard canvas loops.
  if (isCalibrating) {
    return (
      <div className={isReducedMotion ? "performance-mode" : ""}>
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 grid place-items-center bg-[#050505] text-zinc-300">
              <div className="font-mono text-xs uppercase tracking-[0.3em] animate-pulse">
                Loading Sentinel calibration core…
              </div>
            </div>
          }
        >
          <NeuralCalibration
            performanceMode={isReducedMotion}
            onComplete={completeCalibration}
          />
        </Suspense>
      </div>
    );
  }

  // Determine dynamic edge glow style depending on threat intensity and Sentinel Awareness Level
  const getGlowEdgeClass = () => {
    if (isScanning) return "border-red-500/40 shadow-[inset_0_0_50px_rgba(193,18,31,0.15)]";
    if (overallThreat >= 81) return "border-red-600/50 shadow-[inset_0_0_60px_rgba(193,18,31,0.25)] ring-1 ring-red-500/30"; // Level 5 Emergency crimson glow!
    if (overallThreat >= 61) return "border-red-500/40 shadow-[inset_0_0_40px_rgba(239,68,68,0.18)]"; // Level 4 Critical
    if (overallThreat >= 46) return "border-orange-500/30 shadow-[inset_0_0_25px_rgba(249,115,22,0.12)]"; // Level 3 Elevated
    if (overallThreat >= 26) return "border-yellow-500/20 shadow-[inset_0_0_15px_rgba(234,179,8,0.08)]"; // Level 2 Attention
    return "border-zinc-800 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]";
  };

  return (
    <>
      {/* The custom cursor is disabled in performance mode and on touch devices. */}
      {canUseCustomCursor && !isReducedMotion && (
        <Suspense fallback={null}>
          <SentinelCursor
            isScanning={isScanning}
            overallThreat={overallThreat}
            isHighContrast={isHighContrast}
            isReducedMotion={isReducedMotion}
          />
        </Suspense>
      )}

      {/* Brand Philosophy Overlay Modal */}
      {isPhilosophyOpen && (
        <Suspense fallback={null}>
          <BrandPhilosophy isOpen={isPhilosophyOpen} onClose={() => setIsPhilosophyOpen(false)} />
        </Suspense>
      )}

      <div
        id="sentinel-app"
        className={`min-h-screen bg-[#090909] text-zinc-100 flex flex-col font-sans border-8 transition-all duration-1000 ${isReducedMotion ? "performance-mode" : ""} ${getGlowEdgeClass()}`}
      >
      {/* Background Procedural Neural Web */}
      <BackgroundNeuralWeb 
        isScanning={isScanning} 
        overallThreat={overallThreat} 
        atmosphere={atmosphere}
        isHighContrast={isHighContrast}
        isReducedMotion={isReducedMotion}
      />

      {/* Glow Ambient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(24,24,27,0.8)_0%,rgba(9,9,11,1)_80%)] z-0"></div>

      {/* Main Core Viewport */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 py-6 md:py-10 flex flex-col flex-1 gap-6 justify-between">
        
        {/* Header Module */}
        <header className="flex flex-col md:flex-row items-center justify-between border-b border-zinc-900 pb-6 gap-4">
          <div className="flex items-center gap-3.5">
            {/* Pulsating web-like radar core with custom biomimetic SentinelLogo */}
            <div className="p-1 rounded-2xl transition-all duration-500 bg-black/80 border border-zinc-900/60 flex items-center justify-center">
              <SentinelLogo size="sm" animateOnMount={false} isScanning={isScanning} overallThreat={overallThreat} />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-xl md:text-2xl font-mono uppercase tracking-[0.25em] text-zinc-100 font-extrabold flex items-center justify-center md:justify-start gap-1">
                Sentinel Sense<span className="text-red-500 font-bold">™</span>
              </h1>
              <p className="text-[10px] md:text-xs font-mono tracking-widest text-zinc-500 uppercase mt-0.5">
                AI Threat Assessment & Predictive Warning Dashboard
              </p>
            </div>
          </div>

          {/* Actions & Status row */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                audioEngine.playTactileClick();
                replayCalibration();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-zinc-900 hover:border-red-900/60 hover:bg-red-950/20 bg-black/60 text-[9.5px] font-mono tracking-[0.15em] text-zinc-400 hover:text-red-400 transition-all cursor-pointer select-none uppercase font-extrabold shadow-sm"
              title="Replay the immersive Sentinel calibration sequence"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Recalibrate
            </button>

            {/* Interactive Biomimetic Philosophy Button */}
            <button
              onClick={() => {
                audioEngine.playTactileClick();
                setIsPhilosophyOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-zinc-900 hover:border-red-900/60 hover:bg-red-950/20 bg-black/60 text-[9.5px] font-mono tracking-[0.15em] text-zinc-400 hover:text-red-400 transition-all cursor-pointer select-none uppercase font-extrabold shadow-sm hover:shadow-[0_0_15px_rgba(193,18,31,0.12)] animate-pulse"
            >
              🕸️ System Philosophy
            </button>

            {/* Operator Diagnostics HUD */}
            <EngineeringDashboard />

            {/* Active Compute Engine Status Badge */}
            <div className="flex items-center gap-3 bg-zinc-950/80 border border-zinc-900 rounded-2xl px-4 py-2.5 shadow-sm">
              <Cpu className="w-4 h-4 text-zinc-500 animate-pulse" />
              <div className="text-right">
                <div className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase">
                  ACTIVE ENGINE
                </div>
                <div className="text-xs font-mono font-bold">
                  {isScanning ? (
                    <span className="text-zinc-500 animate-pulse">COMPUTING...</span>
                  ) : currentPrediction?.engine ? (
                    <span className={currentPrediction.fallbackActive ? "text-red-400" : "text-emerald-400"}>
                      {currentPrediction.engine === "Gemini 3.5 Flash Model" ? "Gemini AI" : "Local Engine"}
                    </span>
                  ) : (
                    <span className="text-zinc-400">INITIALIZING...</span>
                  )}
                </div>
              </div>
            </div>

            {/* System status display badge */}
            <div className="flex items-center gap-3 bg-zinc-950/80 border border-zinc-900 rounded-2xl px-4 py-2.5">
              <Globe className="w-4 h-4 text-zinc-500 animate-spin-slow" />
              <div className="text-right">
                <div className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase">
                  AI GRID STATUS
                </div>
                <div className="text-xs font-mono font-bold text-zinc-300">
                  {isScanning ? (
                    <span className="text-red-400">ANALYZING SCENARIO...</span>
                  ) : overallThreat >= 81 ? (
                    <span className="text-red-500 animate-pulse">🔴 LEVEL 5 NATIONAL EMERGENCY</span>
                  ) : overallThreat >= 61 ? (
                    <span className="text-red-500">🔴 LEVEL 4 SEVERE CRITICAL</span>
                  ) : overallThreat >= 46 ? (
                    <span className="text-orange-400">🟠 LEVEL 3 ELEVATED RISK</span>
                  ) : overallThreat >= 26 ? (
                    <span className="text-yellow-400">🟡 LEVEL 2 ATTENTION STATUS</span>
                  ) : (
                    <span className="text-emerald-500">🟢 LEVEL 1 STABLE MONITOR</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Core System Control & Performance Diagnostics Panel */}
        <SystemControlPanel
          atmosphere={atmosphere}
          setAtmosphere={setAtmosphere}
          isHighContrast={isHighContrast}
          setIsHighContrast={setIsHighContrast}
          isReducedMotion={isReducedMotion}
          setIsReducedMotion={setIsReducedMotion}
          isVoiceAssistActive={isVoiceAssistActive}
          setIsVoiceAssistActive={setIsVoiceAssistActive}
          isScanning={isScanning}
          overallThreat={overallThreat}
          isFocusMode={isFocusMode}
          setIsFocusMode={setIsFocusMode}
        />

        {/* Fallback Active Banner */}
        {currentPrediction?.fallbackActive && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-950/45 via-zinc-950/30 to-red-950/45 border border-red-900/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_25px_rgba(193,18,31,0.1)]"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-red-950/80 border border-red-900/60 text-red-400">
                <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-500 opacity-75"></span>
                <Cpu className="w-4.5 h-4.5 animate-pulse text-red-500" />
              </div>
              <div>
                <h4 className="text-xs font-mono font-bold tracking-wider text-red-400 uppercase flex items-center gap-1.5">
                  {currentPrediction?.highDemand
                    ? "⚠️ SYSTEM CAPACITY: REMOTE ENGINE TEMPORARILY BUSY"
                    : currentPrediction?.rateLimited 
                      ? "⚠️ QUOTA ADAPTATION: BIOMIMETIC FAILOVER ACTIVE" 
                      : forceLocal 
                        ? "🕸️ LOCAL COMPUTE ENGINE ENGAGED" 
                        : "🕸️ BIOMIMETIC REDUNDANCY CASCADE ACTIVE"}
                </h4>
                <p className="text-[10px] text-zinc-400 font-sans leading-normal mt-0.5 max-w-2xl">
                  {currentPrediction?.highDemand
                    ? "The remote Gemini AI model is currently experiencing high demand. The Sentinel Core has automatically failover-transitioned to the localized Biomimetic Simulation Engine. All monitoring, radar, and threat analysis grids remain 100% active."
                    : currentPrediction?.rateLimited 
                      ? "The Gemini AI daily quota limit has been exceeded. The Sentinel Core has initiated a fully autonomous, zero-delay failover to the local high-fidelity Biomimetic Simulation Engine. All monitoring, radar, and threat analysis grids remain 100% active."
                      : forceLocal 
                        ? "Manual bypass active. The Sentinel Core is processing all environmental vectors using the localized mathematical simulator. This saves API network usage while retaining rapid prediction feedback loops."
                        : "The remote API service is temporarily unavailable. Local predictive matrix processing is active. Atmospheric, seismic, and aquatic threat evaluations remain fully calibrated at 100% capacity."}
                </p>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-md border border-red-950/80 bg-red-950/60 text-[9px] font-mono tracking-widest text-red-400 uppercase font-extrabold shrink-0">
              {currentPrediction?.highDemand
                ? "HIGH DEMAND ADAPTATION"
                : currentPrediction?.rateLimited 
                  ? "API QUOTA HEALED" 
                  : forceLocal 
                    ? "LOCAL MATRIX" 
                    : "SELF-HEALING ACTIVE"}
            </span>
          </motion.div>
        )}

        {/* Dynamic Alerts Ticker (Horizontal Ribbon) */}
        <section>
          <AlertsTicker
            alerts={currentPrediction?.senseAlerts || []}
            overallScore={overallThreat}
          />
        </section>

        {/* Dynamic Predictive Scrub Timeline */}
        <section>
          <PredictiveTimeline isScanning={isScanning} />
        </section>

        {/* SECTION 1: Top Bento Grid Row (Radar, Globe, Autonomous Response) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Box 1: Holographic Spider Centerpiece (Main Character - 100% Core & 80% Spider AI) */}
          <div className={`flex flex-col transition-all duration-700 ${isFocusMode ? "lg:col-span-8" : "lg:col-span-12"} col-span-1`}>
            <HolographicSpiderCenterpiece
              overallScore={overallThreat}
              isScanning={isScanning}
              isExpanded={!isFocusMode || isCenterpieceExpanded}
              onToggleExpand={() => setIsCenterpieceExpanded(!isCenterpieceExpanded)}
              atmosphere={atmosphere}
              isHighContrast={isHighContrast}
              isReducedMotion={isReducedMotion}
              isFocusMode={isFocusMode}
            />
          </div>

          {/* Box 2 & 3: Satellite HUD Orbits (Radar Indicator & Autonomous Response Engine) */}
          {isFocusMode && (
            <div className="lg:col-span-4 col-span-1 flex flex-col gap-6">
              <SentinelRadar
                prediction={currentPrediction}
                isScanning={isScanning}
              />
              <AutonomousResponseEngine
                overallScore={overallThreat}
                awarenessLevel={currentPrediction?.awarenessLevel ?? 1}
                locationName={currentPrediction?.locationName ?? "Monitored Zone"}
              />
            </div>
          )}

        </section>

        {/* SECTION 2: Controller & History Grid (Sliders & Log History) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Sliders Controller (8 cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <PredictorControls
              onTriggerScan={triggerSentinelScan}
              isScanning={isScanning}
              forceLocal={forceLocal}
              onToggleForceLocal={setForceLocal}
            />
          </div>

          {/* Scan logs History Sidebar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col">
            <HistorySidebar
              scans={scans}
              activeScanId={activeScanId}
              onSelectScan={handleSelectScan}
              isScanning={isScanning}
            />
          </div>

        </section>

        {/* SECTION 3: 9 danger categories matrix (Only visible in FocusHUD Mode) */}
        {isFocusMode && (
          <section className="bg-zinc-950/40 border border-zinc-900/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            {currentPrediction && (
              <HazardGrid categories={currentPrediction.categories} />
            )}
          </section>
        )}

        {/* SECTION 3.5: AI Cognitive Logic & Advanced Data Quality Diagnostics (Only visible in FocusHUD Mode) */}
        {isFocusMode && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <AiDecisionReasoning currentPrediction={currentPrediction} />
            <DataQualityEngine />
          </section>
        )}

        {/* SECTION 4: Interactive Decision Pipeline Flowchart (Only visible in FocusHUD Mode) */}
        {isFocusMode && (
          <section>
            <AiDecisionPipeline />
          </section>
        )}

        {/* Footer info & branding credits */}
        <footer className="border-t border-zinc-900/80 pt-6 flex flex-col md:flex-row items-center justify-between text-zinc-600 text-[10px] font-mono tracking-widest uppercase gap-3">
          <div>
            Sentinel Sense™ • AI Predictive Modeling System
          </div>
          <div className="flex items-center gap-1">
            Inspired by Spider-Man's Spider-Sense <Heart className="w-3.5 h-3.5 text-red-600 animate-pulse" /> zelop301@gmail.com
          </div>
        </footer>

      </div>
    </div>
    </>
  );
}
