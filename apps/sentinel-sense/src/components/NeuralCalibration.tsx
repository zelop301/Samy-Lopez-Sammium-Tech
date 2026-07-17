import React, { useEffect, useRef, useState } from "react";
import { 
  Play, 
  SkipForward, 
  Cpu, 
  Activity, 
  Terminal, 
  Zap, 
  Globe, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Sparkles, 
  AlertTriangle, 
  Power,
  Compass,
  Radio,
  Eye,
  Settings,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Variants } from "motion/react";
import SentinelLogo from "./SentinelLogo";
import { getPerformanceProfile } from "../utils/performance";

interface NeuralCalibrationProps {
  onComplete: () => void;
  performanceMode?: boolean;
}

// 1. FSM STATE DEFINITIONS matching the Sammium Sentinel AI lore
export type FsmState = 
  | "BOOT"
  | "INITIALIZE"
  | "LOAD_ASSETS"
  | "CONNECT_SERVICES"
  | "CALIBRATE_AI"
  | "VERIFY_SYSTEM"
  | "READY"
  | "ENTER_DASHBOARD";

// 3 Symbolic Phases matching Sammium lore
export type SymbolicPhase = "AWAKENING" | "UNDERSTANDING" | "PURPOSE";

interface StateConfig {
  name: FsmState;
  phase: SymbolicPhase;
  title: string;
  subtitle: string;
  percentageWeight: number;
}

const STATE_FLOW: StateConfig[] = [
  { name: "BOOT", phase: "AWAKENING", title: "CELLULAR AWAKENING", subtitle: "Microscopic biological matrices dividing and forming early synapses...", percentageWeight: 10 },
  { name: "INITIALIZE", phase: "AWAKENING", title: "GENETIC EVOLUTION", subtitle: "Generating holographic AI double-helix genome with bio-lattice patterns...", percentageWeight: 12 },
  { name: "LOAD_ASSETS", phase: "UNDERSTANDING", title: "SPIDER SILK LATTICE", subtitle: "Weaving 3D radial and spiral orb-weaver neural web arrays...", percentageWeight: 15 },
  { name: "CONNECT_SERVICES", phase: "UNDERSTANDING", title: "AUTONOMOUS MICRO-SPIDERS", subtitle: "Deploying ceramic micro-spiders to align nodes and repair structural gaps...", percentageWeight: 18 },
  { name: "CALIBRATE_AI", phase: "UNDERSTANDING", title: "GLOBAL WEB FORMATION", subtitle: "Expanding the spider-silk neural lattice around a holographic rotating Earth...", percentageWeight: 15 },
  { name: "VERIFY_SYSTEM", phase: "UNDERSTANDING", title: "PLANETARY INTELLIGENCE SENSOR FUSION", subtitle: "Binding weather feeds, hazard grid indicators, and orbital satellites...", percentageWeight: 15 },
  { name: "READY", phase: "PURPOSE", title: "SENTINEL CORE ALIGNMENT", subtitle: "All systems synchronized. See Tomorrow. Protect Today.", percentageWeight: 15 },
  { name: "ENTER_DASHBOARD", phase: "PURPOSE", title: "ACCESS COMMAND CENTRE", subtitle: "Unveiling operational dashboard...", percentageWeight: 0 }
];

interface LoadingTask {
  id: string;
  name: string;
  required: boolean;
  module: string;
  timeout: number;
  status: "INITIALIZING" | "RUNNING" | "SUCCESS" | "FAILED" | "SKIPPED";
  progress: number;
  retries: number;
  maxRetries: number;
  error?: string;
}

const INITIAL_TASKS: LoadingTask[] = [
  // AWAKENING Tasks
  { id: "synthetic_cells", name: "Bio-Synthetic Cellular Boot Sequence", required: true, module: "BOOT", timeout: 4000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  { id: "mitochondria_sync", name: "Mitochondrial Energy Core Synthesis", required: true, module: "BOOT", timeout: 4000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  { id: "dna_generation", name: "Holographic Neural DNA Sequencing", required: true, module: "INITIALIZE", timeout: 5000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  { id: "gpu_rasterizer", name: "GPU-Accelerated Silk Rasterization Pipelines", required: true, module: "INITIALIZE", timeout: 4000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  
  // UNDERSTANDING Tasks
  { id: "radial_silk", name: "Weaving Orb-Weaver Radial Silk Strings", required: true, module: "LOAD_ASSETS", timeout: 12000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  { id: "spiral_lattice", name: "Procedural Spiral Web Lattice Structure", required: true, module: "LOAD_ASSETS", timeout: 12000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  { id: "audio_synths", name: "Spatial Cardiac Ambient Resonance Synth", required: false, module: "LOAD_ASSETS", timeout: 8000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  
  { id: "deploy_spiders", name: "Deploying Robotic Micro-Spiders", required: true, module: "CONNECT_SERVICES", timeout: 10000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  { id: "repair_strands", name: "Autonomous Silk-Trail Strand Repairs", required: true, module: "CONNECT_SERVICES", timeout: 12000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  { id: "satellite_beacon", name: "Orbital Satellite communication beams", required: true, module: "CONNECT_SERVICES", timeout: 10000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  
  { id: "earth_projection", name: "Constructing Holographic Earth Particle Map", required: true, module: "CALIBRATE_AI", timeout: 12000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  { id: "weather_telemetry", name: "Planetary Climate Sensor Array Fusion", required: false, module: "CALIBRATE_AI", timeout: 8000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  { id: "flood_predict", name: "Hydrological Flood propagation simulation", required: true, module: "CALIBRATE_AI", timeout: 10000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  
  { id: "fire_sensors", name: "Thermal Fire detection satellite telemetry", required: true, module: "VERIFY_SYSTEM", timeout: 10000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  { id: "crop_scans", name: "Agricultural Leaf Blight pattern analyzer", required: false, module: "VERIFY_SYSTEM", timeout: 8000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  { id: "infrastructure_load", name: "Urban power grid load balancing models", required: true, module: "VERIFY_SYSTEM", timeout: 10000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  
  // PURPOSE Tasks
  { id: "sentinel_resonance", name: "Zero-Point Sentinel Resonance Core Sync", required: true, module: "READY", timeout: 12000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 },
  { id: "decision_matrix", name: "Final See Tomorrow cognitive model lock", required: true, module: "READY", timeout: 12000, status: "INITIALIZING", progress: 0, retries: 0, maxRetries: 3 }
];

function parseRawLog(log: string): { status: "SUCCESS" | "INITIALIZING" | "WARNING" | "FAILED"; text: string } {
  const cleanLog = log.replace(/^\[\d+\.\d+s\]\s*/, "");

  if (cleanLog.includes("Successfully calibrated")) {
    let taskName = "";
    const match = cleanLog.match(/Successfully calibrated:\s*\[([^\]]+)\]/);
    if (match) {
      taskName = match[1];
    }
    
    const taskMap: Record<string, string> = {
      "Bio-Synthetic Cellular Boot Sequence": "Cellular Boot Complete",
      "Mitochondrial Energy Core Synthesis": "Energy Core Synchronized",
      "Holographic Neural DNA Sequencing": "Neural DNA Sequenced",
      "GPU-Accelerated Silk Rasterization Pipelines": "Rasterizer Pipeline Online",
      "Weaving Orb-Weaver Radial Silk Strings": "Radial Silk Strings Woven",
      "Procedural Spiral Web Lattice Structure": "Spiral Web Lattice Built",
      "Spatial Cardiac Ambient Resonance Synth": "Ambient Synth Loaded",
      "Deploying Robotic Micro-Spiders": "Micro-Spiders Deployed",
      "Autonomous Silk-Trail Strand Repairs": "Silk Strands Repaired",
      "Orbital Satellite communication beams": "Satellite Beams Established",
      "Constructing Holographic Earth Particle Map": "Holographic Earth Rendered",
      "Planetary Climate Sensor Array Fusion": "Climate Sensor Fusion Done",
      "Hydrological Flood propagation simulation": "Flood Simulation Solved",
      "Thermal Fire detection satellite telemetry": "Thermal Satellites Synced",
      "Agricultural Leaf Blight pattern analyzer": "Blight Analyzer Armed",
      "Urban power grid load balancing models": "Grid Load Balancers Ready",
      "Zero-Point Sentinel Resonance Core Sync": "Resonance Core Synchronized",
      "Final See Tomorrow cognitive model lock": "Cognitive Model Locked"
    };

    const mapped = taskMap[taskName] || taskName;
    return { status: "SUCCESS", text: mapped };
  }

  if (cleanLog.includes("Entering state")) {
    const match = cleanLog.match(/Entering state\s*\[([^\]]+)\]/);
    const state = match ? match[1] : "";
    const stateMap: Record<string, string> = {
      "BOOT": "Initializing Cellular Awake...",
      "INITIALIZE": "Initializing DNA Genome...",
      "LOAD_ASSETS": "Weaving Neural Web...",
      "CONNECT_SERVICES": "Launching Micro-Spiders...",
      "CALIBRATE_AI": "Projecting Holographic Earth...",
      "VERIFY_SYSTEM": "Binding Planetary Sensors...",
      "READY": "Aligning Sentinel Core...",
      "ENTER_DASHBOARD": "Unveiling Dashboard..."
    };
    return { status: "INITIALIZING", text: stateMap[state] || `Aligning ${state} state...` };
  }

  if (cleanLog.includes("[RETRY]")) {
    return { status: "WARNING", text: "Retrying Telemetry Node..." };
  }

  if (cleanLog.includes("Fault on") || cleanLog.includes("[CRITICAL FAILED]")) {
    return { status: "FAILED", text: "Sync Interruption Fault" };
  }

  if (cleanLog.includes("[WATCHDOG]")) {
    return { status: "WARNING", text: "Watchdog Splicing Flow" };
  }

  if (cleanLog.includes("[SKIPPED]")) {
    return { status: "FAILED", text: "Optional Process Skipped" };
  }

  if (cleanLog.includes("awake")) {
    return { status: "INITIALIZING", text: "Calibration Core Awake" };
  }

  if (cleanLog.includes("Audio Synthesizer online")) {
    return { status: "SUCCESS", text: "Audio Synthesizer Online" };
  }

  let display = cleanLog;
  if (display.length > 35) {
    display = display.substring(0, 32) + "...";
  }

  return { status: "INITIALIZING", text: display };
}

const getOpacity = (index: number, total: number) => {
  if (total <= 1) return 1;
  return 0.3 + (index / (total - 1)) * 0.7;
};

const renderLogIcon = (status: "SUCCESS" | "INITIALIZING" | "WARNING" | "FAILED") => {
  switch (status) {
    case "SUCCESS":
      return <span className="text-[11px] font-mono text-red-500 font-bold mr-1.5 shrink-0">✓</span>;
    case "INITIALIZING":
      return (
        <span className="inline-block animate-spin text-[10px] text-zinc-100 mr-1.5 shrink-0" style={{ animationDuration: "1.5s" }}>
          ⟳
        </span>
      );
    case "WARNING":
      return <span className="text-[11px] font-mono text-amber-500 font-bold mr-1.5 shrink-0">⚠</span>;
    case "FAILED":
      return <span className="text-[11px] font-mono text-red-800/80 font-bold mr-1.5 shrink-0">✕</span>;
    default:
      return null;
  }
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 8, filter: "drop-shadow(0 0 8px rgba(193, 18, 31, 0.8))", color: "#ef4444" },
  animate: { 
    opacity: 1, 
    y: 0, 
    filter: "drop-shadow(0 0 0px rgba(193, 18, 31, 0))",
    color: "rgba(228, 228, 231, 1)",
    transition: {
      duration: 0.6,
      ease: "easeOut",
      filter: { duration: 0.8, delay: 0.2 },
      color: { duration: 0.8, delay: 0.2 }
    }
  }
};

export default function NeuralCalibration({ onComplete, performanceMode = true }: NeuralCalibrationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000, lastMoveTime: 0 });
  const performanceProfile = useRef(getPerformanceProfile()).current;
  
  // Central State Machine states
  const [fsmState, setFsmState] = useState<FsmState>("BOOT");
  const [tasks, setTasks] = useState<LoadingTask[]>(INITIAL_TASKS);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [systemIntegrity, setSystemIntegrity] = useState<"STABLE" | "WARNING" | "COMPROMISED" | "SAFE_MODE">("STABLE");
  
  // Diagnostic Metrics
  const [fps, setFps] = useState(60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [simulatedCpu, setSimulatedCpu] = useState(8.2);
  const [simulatedGpu, setSimulatedGpu] = useState(14.5);
  const [simulatedMemory, setSimulatedMemory] = useState(256.4); // MB
  const [debugLogs, setDebugLogs] = useState<string[]>(["[0.00s] Sentinel Sense Calibration core awake."]);
  const [isFullLogsOpen, setIsFullLogsOpen] = useState(false);
  
  // Audio oscillator nodes
  const droneNodeRef = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  const heartbeatTimerRef = useRef<any>(null);
  const clickIntervalRef = useRef<any>(null);

  // Locking protection for FSM states
  const hasInitializedRef = useRef<Record<string, boolean>>({});
  const initTimeRef = useRef<number>(Date.now());

  // Log debugger messages
  const logDebug = (msg: string) => {
    const elapsed = ((Date.now() - initTimeRef.current) / 1000).toFixed(2);
    setDebugLogs(prev => [`[${elapsed}s] ${msg}`, ...prev.slice(0, 49)]);
    console.log(`[Sentinel Calibration] [${elapsed}s] ${msg}`);
  };

  // Run timer
  useEffect(() => {
    initTimeRef.current = Date.now();
    const interval = setInterval(() => {
      setElapsedSeconds(Math.round((Date.now() - initTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Run tasks for current FSM State
  useEffect(() => {
    const currentTasks = tasks.filter(t => t.module === fsmState);
    if (currentTasks.length === 0) return;
    if (hasInitializedRef.current[fsmState]) return;
    hasInitializedRef.current[fsmState] = true;

    logDebug(`Entering state [${fsmState}]. Aligning telemetry tasks...`);
    currentTasks.forEach(task => {
      executeTaskWithRetry(task.id);
    });
  }, [fsmState]);

  // Task execution & retry loop
  const executeTaskWithRetry = async (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: "RUNNING" as const, progress: 5 } : t));
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const runTaskOnce = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        let currentProg = 5;
        const taskSpeed = 60 + Math.random() * 100;
        const step = 4 + Math.floor(Math.random() * 12);

        const progressInterval = setInterval(() => {
          currentProg = Math.min(100, currentProg + step);
          setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
              return { ...t, progress: currentProg };
            }
            return t;
          }));

          if (currentProg >= 100) {
            clearInterval(progressInterval);
            // Simulate 3% random transient fluctuation for cinematic realism
            const isFlake = Math.random() < 0.03 && task.required;
            if (isFlake) {
              reject(new Error("Transient bio-lattice sync fault (Cinematic Retry)"));
            } else {
              resolve();
            }
          }
        }, taskSpeed);
      });
    };

    const executeWithTimeout = async () => {
      const taskTimeout = task.timeout;
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Task exceeded strict telemetry timeout limit")), taskTimeout);
      });
      return Promise.race([runTaskOnce(), timeoutPromise]);
    };

    let attempt = 0;
    let succeeded = false;

    while (attempt <= task.maxRetries && !succeeded) {
      if (attempt > 0) {
        logDebug(`[RETRY] Retrying task [${task.name}] (Attempt ${attempt}/${task.maxRetries})...`);
        playTickSound();
      }

      try {
        await executeWithTimeout();
        succeeded = true;
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: "SUCCESS" as const, progress: 100 } : t));
        logDebug(`Successfully calibrated: [${task.name}]`);
      } catch (err: any) {
        attempt++;
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, retries: attempt, error: err.message } : t));
        logDebug(`Fault on [${task.name}]: ${err.message}`);

        if (attempt > task.maxRetries) {
          if (!task.required) {
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: "SKIPPED" as const, progress: 100 } : t));
            logDebug(`[SKIPPED] Optional task bypassed: [${task.name}]`);
            succeeded = true;
          } else {
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: "FAILED" as const } : t));
            setSystemIntegrity("WARNING");
            logDebug(`[CRITICAL FAILED] [${task.name}] failed. Initiating soft recovery...`);
            setTimeout(() => {
              logDebug(`[RECOVERY] Force bridging critical task [${task.name}] to avoid calibration block.`);
              setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: "SKIPPED" as const, progress: 100 } : t));
            }, 1000);
            succeeded = true;
          }
        }
      }
    }
  };

  // State transitions
  useEffect(() => {
    const currentTasks = tasks.filter(t => t.module === fsmState);
    if (currentTasks.length === 0) {
      advanceState();
      return;
    }

    const allFinished = currentTasks.every(t => t.status === "SUCCESS" || t.status === "SKIPPED");
    if (allFinished) {
      logDebug(`All processes in [${fsmState}] settled. Advancing sequence...`);
      advanceState();
    }
  }, [tasks, fsmState]);

  const advanceState = () => {
    const currentIdx = STATE_FLOW.findIndex(s => s.name === fsmState);
    if (currentIdx < STATE_FLOW.length - 1) {
      const nextState = STATE_FLOW[currentIdx + 1].name;
      setTimeout(() => {
        setFsmState(nextState);
        playPhaseTransitionChime(currentIdx + 1);
      }, 500);
    } else {
      logDebug("Planetary Intelligence Sentinel Grid fully aligned. Entering dashboard command controls...");
      setTimeout(() => {
        handleComplete();
      }, 1200);
    }
  };

  // Watchdog & Safe-mode fallback
  const lastStateRef = useRef<FsmState>("BOOT");
  const secondsInStateRef = useRef<number>(0);

  useEffect(() => {
    const watchdog = setInterval(() => {
      if (fsmState === lastStateRef.current) {
        secondsInStateRef.current += 1;
        if (secondsInStateRef.current >= 6) {
          logDebug(`[WATCHDOG] Stalled state [${fsmState}] detected. Splicing task flow...`);
          setTasks(prev => prev.map(t => {
            if (t.module === fsmState && (t.status === "RUNNING" || t.status === "INITIALIZING")) {
              return { ...t, status: "SKIPPED" as const, progress: 100 };
            }
            return t;
          }));
          secondsInStateRef.current = 0;
        }
      } else {
        lastStateRef.current = fsmState;
        secondsInStateRef.current = 0;
      }

      // Safe mode trigger at 25 seconds to guarantee instant access if there's any environmental lag
      const totalElapsed = Date.now() - initTimeRef.current;
      if (totalElapsed >= 25000 && fsmState !== "READY" && fsmState !== "ENTER_DASHBOARD") {
        setSystemIntegrity("SAFE_MODE");
      }
    }, 1000);

    return () => clearInterval(watchdog);
  }, [fsmState, tasks]);

  const calculateProgress = () => {
    const totalCount = tasks.length;
    if (totalCount === 0) return 100;
    const finishedWeight = tasks.reduce((sum, t) => sum + (t.progress / 100), 0);
    return Math.round((finishedWeight / totalCount) * 100);
  };

  const progress = calculateProgress();

  // Web Audio Synthesizer
  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      // Start beautiful cosmic ambient drone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(55, ctx.currentTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(80, ctx.currentTime);
      filter.Q.setValueAtTime(4, ctx.currentTime);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      droneNodeRef.current = osc;
      droneGainRef.current = gain;

      // Respiratory ambient sweep modulation
      const runSweep = () => {
        if (!audioCtxRef.current || !droneNodeRef.current) return;
        const now = audioCtxRef.current.currentTime;
        const sweepFreq = 80 + Math.sin(now * 0.4) * 35;
        filter.frequency.linearRampToValueAtTime(sweepFreq, now + 0.2);
        setTimeout(runSweep, 200);
      };
      runSweep();

      // Cardiac heartbeat loop
      const beat = () => {
        if (isAudioMuted || !audioCtxRef.current) return;
        const now = ctx.currentTime;
        [0, 0.25].forEach((delay, idx) => {
          const bOsc = ctx.createOscillator();
          const bGain = ctx.createGain();
          bOsc.type = "sine";
          bOsc.frequency.setValueAtTime(idx === 0 ? 52 : 44, now + delay);
          bGain.gain.setValueAtTime(0.28, now + delay);
          bGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.16);
          bOsc.connect(bGain);
          bGain.connect(ctx.destination);
          bOsc.start(now + delay);
          bOsc.stop(now + delay + 0.18);
        });
      };

      const loopHeartbeat = () => {
        beat();
        const interval = Math.max(700, 1400 - (progress * 7));
        heartbeatTimerRef.current = setTimeout(loopHeartbeat, interval);
      };
      loopHeartbeat();

      // Cybernetic high-frequency synaptic ticks
      const loopTicks = () => {
        if (!isAudioMuted && audioCtxRef.current) {
          const now = ctx.currentTime;
          const tOsc = ctx.createOscillator();
          const tGain = ctx.createGain();
          tOsc.type = "sine";
          tOsc.frequency.setValueAtTime(1000 + Math.random() * 800, now);
          tGain.gain.setValueAtTime(0.01, now);
          tGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
          tOsc.connect(tGain);
          tGain.connect(ctx.destination);
          tOsc.start();
          tOsc.stop(now + 0.04);
        }
        clickIntervalRef.current = setTimeout(loopTicks, 180 + Math.random() * 450);
      };
      loopTicks();

      logDebug("Immersive Audio Synthesizer online.");
    } catch (e) {
      console.warn("Audio Context failed:", e);
    }
  };

  const playPhaseTransitionChime = (phaseIdx: number) => {
    if (isAudioMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const chords = [220, 277.18, 329.63, 415.3, 493.88];
    chords.forEach((base, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(base * (1 + phaseIdx * 0.04), now + i * 0.07);
      gain.gain.setValueAtTime(0.05, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 1.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 1.5);
    });
  };

  const playTickSound = () => {
    if (isAudioMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1500, now + 0.07);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(now + 0.1);
  };

  const toggleMute = () => {
    const nextMute = !isAudioMuted;
    setIsAudioMuted(nextMute);
    if (!nextMute) {
      initAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.resume();
        if (droneGainRef.current) {
          droneGainRef.current.gain.setValueAtTime(0.05, audioCtxRef.current.currentTime);
        }
      }
    } else {
      if (droneGainRef.current && audioCtxRef.current) {
        droneGainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      }
    }
  };

  const handleComplete = () => {
    if (heartbeatTimerRef.current) clearTimeout(heartbeatTimerRef.current);
    if (clickIntervalRef.current) clearTimeout(clickIntervalRef.current);
    if (droneNodeRef.current) {
      try { droneNodeRef.current.stop(); } catch (e) {}
    }
    onComplete();
  };

  // CLEANUP ON DISPOSE
  useEffect(() => {
    return () => {
      if (heartbeatTimerRef.current) clearTimeout(heartbeatTimerRef.current);
      if (clickIntervalRef.current) clearTimeout(clickIntervalRef.current);
      if (droneNodeRef.current) {
        try { droneNodeRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  // 10. HIGH FIDELITY BIO-INSPIRED SENTINEL ENGINE (HTML5 CANVAS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let lastFrameTime = performance.now();
    let lastRenderedAt = 0;
    let frameCount = 0;
    const targetFps = performanceMode
      ? performanceProfile.reducedTargetFps
      : performanceProfile.targetFps;
    const frameInterval = 1000 / targetFps;

    // --- GEOMETRIC ENTITIES ---
    interface ExplosionParticle {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
    }
    const explosionParticles: ExplosionParticle[] = [];

    // A. Cellular Awakening (Phase 1 Cells)
    interface Cell {
      x: number; y: number; vx: number; vy: number;
      targetX: number; targetY: number;
      radius: number; targetRadius: number;
      pulseRate: number; color: string;
      id: number;
    }
    const cells: Cell[] = [];
    const maxCells = performanceMode ? 8 : 12;
    for (let i = 0; i < maxCells; i++) {
      const angle = (i / maxCells) * Math.PI * 2;
      const r = 40 + Math.random() * 60;
      cells.push({
        id: i,
        x: width / 2 + Math.cos(angle) * r,
        y: height / 2 + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        targetX: width / 2,
        targetY: height / 2,
        radius: 12 + Math.random() * 16,
        targetRadius: 12 + Math.random() * 16,
        pulseRate: 0.01 + Math.random() * 0.02,
        color: "rgba(193, 18, 31, 0.4)"
      });
    }

    // B. Holographic DNA Nodes (Phase 2 Helix)
    interface DnaParticle {
      angleOffset: number;
      yPos: number;
      size: number;
      color: string;
    }
    const dnaPoints: DnaParticle[] = [];
    const dnaNodesCount = performanceMode ? 24 : 38;
    for (let i = 0; i < dnaNodesCount; i++) {
      dnaPoints.push({
        angleOffset: (i / dnaNodesCount) * Math.PI * 4,
        yPos: -150 + (i / dnaNodesCount) * 300,
        size: 2.2 + Math.random() * 2,
        color: i % 2 === 0 ? "rgba(230, 57, 70, 0.85)" : "rgba(193, 18, 31, 0.85)"
      });
    }

    // C. Spider Silk Neural Lattice (Phase 3 Web Structure)
    interface WebNode {
      x: number; y: number; z: number;
      origX: number; origY: number; origZ: number;
      radialIndex: number;
      concentricRingIndex: number;
      integrity: number; // 0 (damaged/unbuilt) to 1 (full strength)
      pulseTimer: number;
    }
    const webNodes: WebNode[] = [];
    const radialLinesCount = performanceMode ? 6 : 8;
    const ringsCount = performanceMode ? 4 : 5;

    // Build perfect orb-weaver web mesh in 3D centered space
    for (let r = 0; r < radialLinesCount; r++) {
      const angle = (r / radialLinesCount) * Math.PI * 2;
      for (let ring = 0; ring <= ringsCount; ring++) {
        const radius = (ring / ringsCount) * 260;
        // Introduce small biological fractal noise so it feels natural
        const noiseAmt = ring === 0 ? 0 : 12;
        const offsetAngle = angle + (Math.random() - 0.5) * 0.08;
        const x = Math.cos(offsetAngle) * radius + (Math.random() - 0.5) * noiseAmt;
        const y = Math.sin(offsetAngle) * radius + (Math.random() - 0.5) * noiseAmt;
        const z = (Math.random() - 0.5) * 15;

        webNodes.push({
          x, y, z,
          origX: x, origY: y, origZ: z,
          radialIndex: r,
          concentricRingIndex: ring,
          integrity: ring === 0 ? 1 : 0.2, // Outer rings start weak and are repaired by spiders
          pulseTimer: Math.random() * Math.PI
        });
      }
    }

    // D. Autonomous Robotic Micro-Spiders (Phase 4 Maintenance Drones)
    interface MicroSpider {
      x: number; y: number; z: number;
      tx: number; ty: number; tz: number;
      currentWebNodeIndex: number;
      targetWebNodeIndex: number;
      legWalkCycle: number;
      repairAnimation: number; // 0 to 1
      isBoring: boolean;
      glowingSilkTrail: Array<{ x: number, y: number, z: number, alpha: number }>;
      bodyColor: string;
      eyeColor: string;
    }
    const roboticSpiders: MicroSpider[] = [];
    const spidersCount = performanceMode ? 2 : 3;

    for (let s = 0; s < spidersCount; s++) {
      // Position them on random web nodes
      const randNodeIdx = Math.floor(Math.random() * webNodes.length);
      const node = webNodes[randNodeIdx];
      roboticSpiders.push({
        x: node.x, y: node.y, z: node.z,
        tx: node.x, ty: node.y, tz: node.z,
        currentWebNodeIndex: randNodeIdx,
        targetWebNodeIndex: randNodeIdx,
        legWalkCycle: Math.random() * Math.PI * 2,
        repairAnimation: 0,
        isBoring: false,
        glowingSilkTrail: [],
        bodyColor: "rgba(11, 11, 11, 0.95)", // Matte black carbon shell
        eyeColor: "rgba(193, 18, 31, 1)" // Glowing Crimson sensor eye
      });
    }

    // E. Global Earth Particle Hologram (Phase 5)
    interface EarthParticle {
      x: number; y: number; z: number;
      baseX: number; baseY: number; baseZ: number;
      color: string;
      size: number;
    }
    const earthPoints: EarthParticle[] = [];
    const earthPointsCount = performanceMode ? 240 : 420;

      // Generate high-end rotating spherical map projection
      for (let i = 0; i < earthPointsCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 160;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        // We make noise-based continental clusters to symbolize lands
        const noiseValue = Math.sin(theta * 3.5) * Math.cos(phi * 3) + Math.cos(theta * 1.5) * 0.3;
        const isLand = noiseValue > -0.15;

        // Land is matte charcoal or silver-gray, with 25% glowing red active threat points
        const isRedThreatZone = isLand && (Math.random() < 0.25);
        const earthColor = isRedThreatZone 
          ? "rgba(193, 18, 31, 0.95)" // Crimson active warning zones
          : isLand 
          ? "rgba(60, 60, 65, 0.6)" // Matte Graphite dark continents
          : "rgba(193, 18, 31, 0.05)"; // Ocean ambient red glow

        earthPoints.push({
          x, y, z,
          baseX: x, baseY: y, baseZ: z,
          color: earthColor,
          size: isLand ? 1.5 + Math.random() * 1.8 : 0.8 + Math.random() * 0.6
        });
      }

    // Interactive damped vibrations on spider web strands
    interface WebVibration {
      nodeIndex: number;
      amplitude: number;
      frequency: number;
      decay: number;
      phase: number;
    }
    let webVibrations: WebVibration[] = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Dynamic telemetry fluctuations
    const runPerformanceMonitor = (now: number) => {
      frameCount++;
      if (now > lastFrameTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastFrameTime)));
        frameCount = 0;
        lastFrameTime = now;

        setSimulatedCpu(Number((5.4 + Math.sin(now * 0.001) * 2.1 + Math.random() * 1.2).toFixed(1)));
        setSimulatedGpu(Number((11.2 + Math.cos(now * 0.001) * 3.8 + Math.random() * 2.0).toFixed(1)));
        setSimulatedMemory(Number((252.3 + Math.sin(now * 0.002) * 8.4).toFixed(1)));
      }
    };

    // RENDERING PIPELINE LOOP. requestAnimationFrame still provides smooth
    // browser scheduling, while expensive drawing is capped to the selected
    // performance profile and paused for background tabs.
    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      if (document.hidden || now - lastRenderedAt < frameInterval) {
        return;
      }

      lastRenderedAt = now - ((now - lastRenderedAt) % frameInterval);
      runPerformanceMonitor(now);

      ctx.fillStyle = "rgba(5, 5, 5, 0.28)"; // Premium Void Black
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.09;
      mouse.y += (mouse.targetY - mouse.y) * 0.09;

      const t = now * 0.001;
      const cx = width / 2;
      const cy = height / 2;

      // Draw elegant futuristic calibration background grid
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(193, 18, 31, 0.025)"; // Crimson grid lines
      const grid = 120;
      for (let x = 0; x < width; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render custom camera orbital drift + respiratory breathing
      const zoomPulse = 1.0 + Math.sin(t * 0.6) * 0.025;
      const cameraRotationY = Math.sin(t * 0.25) * 0.15;
      const cameraRotationX = Math.cos(t * 0.18) * 0.08;

      // 3D Perspective Projection Function
      const fov = 420;
      const project3D = (x: number, y: number, z: number) => {
        // Apply camera rotation
        // Y-axis Rotation
        let x1 = x * Math.cos(cameraRotationY) - z * Math.sin(cameraRotationY);
        let z1 = x * Math.sin(cameraRotationY) + z * Math.cos(cameraRotationY);
        
        // X-axis Rotation
        let y2 = y * Math.cos(cameraRotationX) - z1 * Math.sin(cameraRotationX);
        let z2 = y * Math.sin(cameraRotationX) + z1 * Math.cos(cameraRotationX);

        // Perspective scaling
        const scale = fov / (fov + z2) * zoomPulse;
        const sx = cx + x1 * scale;
        const sy = cy + y2 * scale;
        return { sx, sy, sizeFactor: scale, visible: z2 > -fov };
      };

      // Decaying interactive web vibrations
      webVibrations.forEach(v => {
        v.amplitude *= v.decay;
        v.phase += v.frequency;
      });
      webVibrations = webVibrations.filter(v => v.amplitude > 0.1);

      // Determine visibility blending weights between visual layers
      const isBootState = fsmState === "BOOT";
      const isInitState = fsmState === "INITIALIZE";
      const isLatticeState = fsmState === "LOAD_ASSETS" || fsmState === "CONNECT_SERVICES";
      const isEarthState = fsmState === "CALIBRATE_AI" || fsmState === "VERIFY_SYSTEM";
      const isReadyState = fsmState === "READY";

      // ----------------------------------------------------
      // LAYER 1: AMBIENT CELLULAR AWAKENING (Phase 01)
      // ----------------------------------------------------
      if (isBootState || isInitState) {
        cells.forEach((cell, idx) => {
          // Cellular drift and organic orbit
          const cellAngle = t * 1.2 + idx * (Math.PI * 2 / maxCells);
          const rCell = 110 + Math.sin(t * 0.8 + idx) * 30;
          cell.x += ((cx + Math.cos(cellAngle) * rCell) - cell.x) * 0.05;
          cell.y += ((cy + Math.sin(cellAngle) * rCell) - cell.y) * 0.05;

          const size = cell.radius * (1.0 + Math.sin(t * 2.5 + cell.id) * 0.15);

          // Draw biological membrane glow
          const radialGlow = ctx.createRadialGradient(cell.x, cell.y, 2, cell.x, cell.y, size * 2.2);
          radialGlow.addColorStop(0, "rgba(193, 18, 31, 0.45)"); // Crimson
          radialGlow.addColorStop(0.5, "rgba(193, 18, 31, 0.12)");
          radialGlow.addColorStop(1, "rgba(193, 18, 31, 0)");

          ctx.fillStyle = radialGlow;
          ctx.beginPath();
          ctx.arc(cell.x, cell.y, size * 2.2, 0, Math.PI * 2);
          ctx.fill();

          // Interconnecting protein lines
          cells.forEach((otherCell, oIdx) => {
            if (oIdx > idx) {
              const dx = cell.x - otherCell.x;
              const dy = cell.y - otherCell.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < 160) {
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = `rgba(193, 18, 31, ${0.18 * (1 - dist/160)})`; // Crimson
                ctx.beginPath();
                ctx.moveTo(cell.x, cell.y);
                ctx.lineTo(otherCell.x, otherCell.y);
                ctx.stroke();
              }
            }
          });

          // Draw Nucleus core
          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          ctx.beginPath();
          ctx.arc(cell.x, cell.y, size * 0.3, 0, Math.PI * 2);
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(193, 18, 31, 0.85)"; // Crimson
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // ----------------------------------------------------
      // LAYER 2: GENETIC HELIX EVOLUTION (Phase 02)
      // ----------------------------------------------------
      if (isInitState || isLatticeState) {
        const dAlpha = isInitState ? 0.9 : 0.25;
        dnaPoints.forEach((p, idx) => {
          // Double helix rotates
          const rotAngle = p.angleOffset + t * 2.2;
          const rDna = 45 * (1 + Math.sin(t * 0.4) * 0.12);
          
          // Strand A
          const ax = Math.cos(rotAngle) * rDna;
          const az = Math.sin(rotAngle) * rDna;
          const projA = project3D(ax, p.yPos, az);

          // Strand B (offset by 180 deg)
          const bx = Math.cos(rotAngle + Math.PI) * rDna;
          const bz = Math.sin(rotAngle + Math.PI) * rDna;
          const projB = project3D(bx, p.yPos, bz);

          if (projA.visible && projB.visible) {
            // Draw connecting ladder silk line
            ctx.lineWidth = 0.6;
            ctx.strokeStyle = `rgba(193, 18, 31, ${0.28 * dAlpha})`; // Crimson
            ctx.beginPath();
            ctx.moveTo(projA.sx, projA.sy);
            ctx.lineTo(projB.sx, projB.sy);
            ctx.stroke();

            // Draw Strand A nodes
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(projA.sx, projA.sy, p.size * projA.sizeFactor, 0, Math.PI * 2);
            ctx.fill();

            // Draw Strand B nodes
            ctx.fillStyle = "rgba(230, 57, 70, 0.85)"; // Ruby Red
            ctx.beginPath();
            ctx.arc(projB.sx, projB.sy, p.size * projB.sizeFactor, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // ----------------------------------------------------
      // LAYER 3: SPIDER SILK NEURAL LATTICE (Phase 03)
      // ----------------------------------------------------
      if (isLatticeState || isEarthState || isReadyState) {
        const webAlpha = isLatticeState ? 1.0 : isEarthState ? 0.4 : 0.15;

        // Draw concentric spiral threads
        for (let ring = 1; ring <= ringsCount; ring++) {
          ctx.beginPath();
          ctx.lineWidth = ring === ringsCount ? 0.8 : 0.45;
          ctx.strokeStyle = `rgba(193, 18, 31, ${0.18 * webAlpha})`; // Crimson energy fibers

          for (let r = 0; r <= radialLinesCount; r++) {
            const radIdx = r % radialLinesCount;
            const nodeIdx = radIdx * (ringsCount + 1) + ring;
            const node = webNodes[nodeIdx];
            if (!node) continue;

            // Apply interactive vibration shift if active
            let vibOffset = 0;
            const activeVib = webVibrations.find(v => v.nodeIndex === nodeIdx);
            if (activeVib) {
              vibOffset = Math.sin(activeVib.phase) * activeVib.amplitude;
            }

            // Radial coordinates
            const angle = (radIdx / radialLinesCount) * Math.PI * 2;
            const px = node.x + Math.cos(angle) * vibOffset;
            const py = node.y + Math.sin(angle) * vibOffset;
            const proj = project3D(px, py, node.z);

            if (proj.visible) {
              if (r === 0) {
                ctx.moveTo(proj.sx, proj.sy);
              } else {
                ctx.lineTo(proj.sx, proj.sy);
              }
            }
          }
          ctx.closePath();
          ctx.stroke();
        }

        // Draw radial main threads extending from center
        for (let r = 0; r < radialLinesCount; r++) {
          ctx.beginPath();
          ctx.lineWidth = 0.55;
          ctx.strokeStyle = `rgba(230, 57, 70, ${0.22 * webAlpha})`; // Ruby energy fibers

          const centerProj = project3D(0, 0, 0);
          if (centerProj.visible) {
            ctx.moveTo(centerProj.sx, centerProj.sy);
          }

          const outerNodeIdx = r * (ringsCount + 1) + ringsCount;
          const outerNode = webNodes[outerNodeIdx];
          if (outerNode) {
            const projOuter = project3D(outerNode.x, outerNode.y, outerNode.z);
            if (projOuter.visible) {
              ctx.lineTo(projOuter.sx, projOuter.sy);
            }
          }
          ctx.stroke();
        }

        // Pulse energy through glowing intersections
        webNodes.forEach((node, idx) => {
          node.pulseTimer += 0.015;
          const pulseGlow = Math.sin(node.pulseTimer) * 0.4 + 0.6;
          
          if (node.concentricRingIndex > 0) {
            const proj = project3D(node.x, node.y, node.z);
            if (proj.visible && Math.random() < 0.2) {
              ctx.fillStyle = `rgba(193, 18, 31, ${pulseGlow * 0.7 * webAlpha})`; // Crimson
              ctx.beginPath();
              ctx.arc(proj.sx, proj.sy, 2.5 * proj.sizeFactor * node.integrity, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });

        // Mouse hover interaction sends radial vibrations propagating
        const distToCenter = Math.sqrt((mouse.x - cx)*(mouse.x - cx) + (mouse.y - cy)*(mouse.y - cy));
        if (distToCenter < 280 && Date.now() - mouse.lastMoveTime < 150) {
          // Find closest web node to cursor
          let minDist = 9999;
          let closestNodeIdx = -1;

          webNodes.forEach((node, idx) => {
            const proj = project3D(node.x, node.y, node.z);
            const d = Math.sqrt((mouse.x - proj.sx)*(mouse.x - proj.sx) + (mouse.y - proj.sy)*(mouse.y - proj.sy));
            if (d < minDist) {
              minDist = d;
              closestNodeIdx = idx;
            }
          });

          if (closestNodeIdx !== -1 && minDist < 35) {
            // Trigger physical wave ripple oscillation
            const alreadyVibrating = webVibrations.some(v => v.nodeIndex === closestNodeIdx);
            if (!alreadyVibrating) {
              webVibrations.push({
                nodeIndex: closestNodeIdx,
                amplitude: 15,
                frequency: 0.35,
                decay: 0.92,
                phase: 0
              });

              // Play a microscopic high-pitched digital chime for physical feedback
              playTickSound();
            }
          }
        }
      }

      // ----------------------------------------------------
      // LAYER 4: AUTONOMOUS MICRO-SPIDERS (Phase 04 Drones)
      // ----------------------------------------------------
      if (isLatticeState || isEarthState) {
        roboticSpiders.forEach((spider, sIdx) => {
          spider.legWalkCycle += 0.16;

          // Artificial Intelligence Brain: Crawl to damaged/low integrity web nodes to repair
          const currNode = webNodes[spider.currentWebNodeIndex];
          const destNode = webNodes[spider.targetWebNodeIndex];

          if (spider.currentWebNodeIndex === spider.targetWebNodeIndex) {
            // Find a random connected node that has low integrity
            const unbuiltNodes = webNodes.filter((n, i) => n.integrity < 1.0 && n.concentricRingIndex > 0);
            if (unbuiltNodes.length > 0) {
              const targetNode = unbuiltNodes[Math.floor(Math.random() * unbuiltNodes.length)];
              const targetIdx = webNodes.findIndex(n => n === targetNode);
              spider.targetWebNodeIndex = targetIdx;
              spider.isBoring = false;
            } else {
              // Bored, wander around radial lines
              const randNodeIdx = Math.floor(Math.random() * webNodes.length);
              spider.targetWebNodeIndex = randNodeIdx;
              spider.isBoring = true;
            }
          }

          // Crawl incrementally along 3D space with linear damping interpolation
          const travelSpeed = spider.isBoring ? 0.015 : 0.028;
          spider.x += (destNode.x - spider.x) * travelSpeed;
          spider.y += (destNode.y - spider.y) * travelSpeed;
          spider.z += (destNode.z - spider.z) * travelSpeed;

          // Lock when close
          const distToDest = Math.sqrt((destNode.x - spider.x)**2 + (destNode.y - spider.y)**2 + (destNode.z - spider.z)**2);
          if (distToDest < 6) {
            spider.currentWebNodeIndex = spider.targetWebNodeIndex;
            // Trigger laser repairing sparkles
            if (!spider.isBoring) {
              spider.repairAnimation = 1.0;
              destNode.integrity = Math.min(1.0, destNode.integrity + 0.28);
            }
          }

          // Render micro-spider trail
          spider.glowingSilkTrail.push({ x: spider.x, y: spider.y, z: spider.z, alpha: 1.0 });
          if (spider.glowingSilkTrail.length > 18) {
            spider.glowingSilkTrail.shift();
          }

          ctx.beginPath();
          ctx.lineWidth = 1.2;
          spider.glowingSilkTrail.forEach((trail, tIdx) => {
            const pTrail = project3D(trail.x, trail.y, trail.z);
            if (pTrail.visible) {
              ctx.strokeStyle = `rgba(230, 57, 70, ${0.4 * (tIdx / spider.glowingSilkTrail.length)})`; // Ruby trail
              if (tIdx === 0) ctx.moveTo(pTrail.sx, pTrail.sy);
              else ctx.lineTo(pTrail.sx, pTrail.sy);
            }
          });
          ctx.stroke();

          // Render procedural robotic legs
          const bodyProj = project3D(spider.x, spider.y, spider.z);
          if (bodyProj.visible) {
            const bRadius = 4.8 * bodyProj.sizeFactor;

            // Draw central head/ceramic core
            ctx.fillStyle = spider.bodyColor;
            ctx.shadowBlur = 8;
            ctx.shadowColor = "rgba(193, 18, 31, 0.4)"; // Crimson shadow
            ctx.beginPath();
            ctx.arc(bodyProj.sx, bodyProj.sy, bRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Cyan eye scanner
            ctx.fillStyle = spider.eyeColor;
            ctx.beginPath();
            ctx.arc(bodyProj.sx + Math.cos(t * 4) * 2, bodyProj.sy - 1.5, 1.4, 0, Math.PI * 2);
            ctx.fill();

            // Render 8 procedural legs with inverse knee offset calculation
            const legsCount = 8;
            for (let l = 0; l < legsCount; l++) {
              const legAngle = (l / legsCount) * Math.PI * 2 + Math.sin(spider.legWalkCycle + l) * 0.35;
              const footRadius = bRadius * 2.8;

              const footX = spider.x + Math.cos(legAngle) * footRadius;
              const footY = spider.y + Math.sin(legAngle) * footRadius;
              const footZ = spider.z + (Math.sin(spider.legWalkCycle + l * 2) * 4);

              const projFoot = project3D(footX, footY, footZ);
              if (projFoot.visible) {
                // Knee joint offset helper
                const midX = (bodyProj.sx + projFoot.sx) / 2;
                const midY = (bodyProj.sy + projFoot.sy) / 2;
                
                const px = -(projFoot.sy - bodyProj.sy);
                const py = projFoot.sx - bodyProj.sx;
                const len = Math.sqrt(px*px + py*py);
                
                const kneeBend = 8 * (l < 4 ? 1 : -1) * bodyProj.sizeFactor;
                const kneeX = midX + (px / len) * kneeBend;
                const kneeY = midY + (py / len) * kneeBend;

                ctx.strokeStyle = "rgba(113, 113, 122, 0.8)"; // Carbon fiber gray legs
                ctx.lineWidth = 1.0;
                ctx.beginPath();
                ctx.moveTo(bodyProj.sx, bodyProj.sy);
                ctx.lineTo(kneeX, kneeY);
                ctx.lineTo(projFoot.sx, projFoot.sy);
                ctx.stroke();
              }
            }

            // Repairing laser spark flashes
            if (spider.repairAnimation > 0) {
              spider.repairAnimation -= 0.05;
              ctx.strokeStyle = "rgba(230, 57, 70, 0.95)"; // Ruby sparks
              ctx.lineWidth = 1.8;
              ctx.beginPath();
              ctx.moveTo(bodyProj.sx, bodyProj.sy);
              const targetProj = project3D(destNode.x, destNode.y, destNode.z);
              if (targetProj.visible) {
                ctx.lineTo(targetProj.sx, targetProj.sy);
                ctx.stroke();

                // Spark sparks
                ctx.fillStyle = "rgba(255, 255, 255, 1)";
                ctx.beginPath();
                ctx.arc(targetProj.sx + (Math.random() - 0.5) * 8, targetProj.sy + (Math.random() - 0.5) * 8, 2, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        });
      }

      // ----------------------------------------------------
      // LAYER 5: PLANETARY EARTH HOLOGRAM (Phase 05)
      // ----------------------------------------------------
      if (isEarthState || isReadyState) {
        // Slow planetary rotation
        const earthAlpha = isEarthState ? 0.95 : 0.3;
        earthPoints.forEach((p, idx) => {
          const rotY = t * 0.15; // smooth orbit Y
          const xRot = p.baseX * Math.cos(rotY) - p.baseZ * Math.sin(rotY);
          const zRot = p.baseX * Math.sin(rotY) + p.baseZ * Math.cos(rotY);

          // project
          const proj = project3D(xRot, p.baseY, zRot);

          if (proj.visible) {
            ctx.fillStyle = p.color;
            // Introduce subtle atmospheric glow based on depth zRot
            const depthGlow = (zRot + 160) / 320; // 0 to 1
            ctx.globalAlpha = depthGlow * earthAlpha;
            ctx.beginPath();
            ctx.arc(proj.sx, proj.sy, p.size * proj.sizeFactor, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
        });

        // Render communication satellite trails wrapping Earth
        const satCount = 2;
        for (let s = 0; s < satCount; s++) {
          const orbitAngle = t * 0.35 + (s * Math.PI);
          const satRadius = 200;
          const satX = Math.cos(orbitAngle) * satRadius;
          const satY = Math.sin(orbitAngle * 0.5) * 60;
          const satZ = Math.sin(orbitAngle) * satRadius;

          const projSat = project3D(satX, satY, satZ);
          if (projSat.visible) {
            // Draw satellite communication beam to Earth core
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = "rgba(193, 18, 31, 0.12)"; // Crimson satellite beam
            ctx.beginPath();
            ctx.moveTo(projSat.sx, projSat.sy);
            ctx.lineTo(cx, cy);
            ctx.stroke();

            // Satellite dot
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(193, 18, 31, 1)"; // Crimson shadow
            ctx.beginPath();
            ctx.arc(projSat.sx, projSat.sy, 3 * projSat.sizeFactor, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // ----------------------------------------------------
      // LAYER 6: SENTINEL CORE (Floating AI energy sphere)
      // ----------------------------------------------------
      if (isReadyState) {
        // Draw zero-point energy core plasma ripples
        const coreRad = 60 + Math.sin(t * 8) * 4;
        const coreProj = project3D(0, 0, 0);

        if (coreProj.visible) {
          const glowGrad = ctx.createRadialGradient(coreProj.sx, coreProj.sy, 2, coreProj.sx, coreProj.sy, coreRad * 2);
          glowGrad.addColorStop(0, "rgba(230, 57, 70, 0.85)"); // Ruby
          glowGrad.addColorStop(0.4, "rgba(193, 18, 31, 0.3)"); // Crimson
          glowGrad.addColorStop(1, "rgba(139, 0, 0, 0)"); // Deep Scarlet

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(coreProj.sx, coreProj.sy, coreRad * 2, 0, Math.PI * 2);
          ctx.fill();

          // Electromagnetic orbital rings
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = "rgba(193, 18, 31, 0.75)"; // Crimson electromagnetic rings
          for (let r = 0; r < 3; r++) {
            ctx.beginPath();
            const rRadiusX = coreRad * (1.2 + r * 0.25);
            const rRadiusY = coreRad * 0.45;
            const rRot = t * 1.5 + (r * Math.PI / 3);
            ctx.ellipse(coreProj.sx, coreProj.sy, rRadiusX, rRadiusY, rRot, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Plasma energy electric discharge sparks inside Core
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
          ctx.beginPath();
          ctx.moveTo(coreProj.sx, coreProj.sy);
          let px = coreProj.sx;
          let py = coreProj.sy;
          for (let step = 0; step < 4; step++) {
            px += (Math.random() - 0.5) * 16;
            py += (Math.random() - 0.5) * 16;
            ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }

      // ----------------------------------------------------
      // LAYER 7: PARTICLE EXPLOSION (State transition)
      // ----------------------------------------------------
      if (fsmState === "ENTER_DASHBOARD" || fsmState === "READY") {
        if (fsmState === "ENTER_DASHBOARD" && explosionParticles.length === 0) {
          for (let i = 0; i < (performanceMode ? 90 : 160); i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 9;
            explosionParticles.push({
              x: cx,
              y: cy,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 1.2 + Math.random() * 3,
              color: Math.random() < 0.6 ? "rgba(193, 18, 31, 1)" : "rgba(230, 57, 70, 1)",
              alpha: 1.0,
              decay: 0.012 + Math.random() * 0.018
            });
          }
        }

        explosionParticles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.max(0, p.alpha - p.decay);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;
      }

    };

    animId = requestAnimationFrame(render);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.lastMoveTime = Date.now();
    };

    const onMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [fsmState, performanceMode, performanceProfile]);

  // Dev Trigger helper: Force Settle Stalled module
  const forceSettleModule = () => {
    logDebug(`[DEV] Settle all pending tasks for [${fsmState}]`);
    setTasks(prev => prev.map(t => t.module === fsmState ? { ...t, status: "SUCCESS" as const, progress: 100 } : t));
  };

  // Dev Trigger helper: Inject simulated flaking network error
  const injectNetworkFlake = () => {
    logDebug(`[DEV] Injecting sub-spatial packet collision flake!`);
    const activeTasks = tasks.filter(t => t.module === fsmState && t.status === "RUNNING");
    if (activeTasks.length > 0) {
      const target = activeTasks[Math.floor(Math.random() * activeTasks.length)];
      setTasks(prev => prev.map(t => t.id === target.id ? { ...t, status: "FAILED" as const, error: "Transient collision flake" } : t));
    } else {
      logDebug("No active tasks to fail in this state.");
    }
  };

  const activeFlowInfo = STATE_FLOW.find(s => s.name === fsmState) || STATE_FLOW[0];

  // Derive active tasks for the Left Panel (Previous, Current, Next)
  const currentRunningTask = tasks.find(t => t.module === fsmState && t.status === "RUNNING");
  const completedTasks = tasks.filter(t => t.status === "SUCCESS" || t.status === "SKIPPED");
  const previousTask = completedTasks[completedTasks.length - 1];
  
  // Find next task
  const nextTaskCandidate = tasks.find(t => t.status === "INITIALIZING");

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-zinc-100 flex flex-col justify-between overflow-hidden select-none">
      
      {/* Background Interactive Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 block w-full h-full pointer-events-auto" />

      {/* Cinematic Fog & Grid Overlay (Varying atmospheric depth) */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(5,5,5,0)_30%,rgba(5,5,5,0.85)_100%)] z-10"></div>
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-10 opacity-20"></div>

      {/* Header HUD Status Controls (Tighter, reduced background, sleek and subtle) */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-sm">
            <Cpu className="w-4.5 h-4.5 text-red-500 animate-pulse" />
          </div>
          <div>
            <span className="text-[8px] font-mono tracking-[0.3em] text-zinc-600 uppercase block">SENTINEL_AI_BIOMIMICRY</span>
            <span className="text-xs font-mono font-bold tracking-widest text-zinc-400">SAMMIUM SENTINEL SENSE™ AWAKENING</span>
          </div>
        </div>

        {/* Spacing increased, opacity reduced, very subtle and high contrast active items */}
        <div className="flex items-center gap-4 pointer-events-auto">
          {/* Diagnostic Console Button */}
          <button
            id="diagnostics-console-trigger"
            onClick={() => setShowDebug(!showDebug)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[9px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer ${
              showDebug 
                ? "bg-red-950/20 border-red-800 text-red-400 shadow-[0_0_15px_rgba(193,18,31,0.15)]"
                : "bg-zinc-950/10 border-zinc-900 text-zinc-500 hover:text-zinc-300 hover:border-zinc-800"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> {showDebug ? "Hide Tuning Lab" : "Tuning Lab"}
          </button>

          <button
            id="spatial-audio-toggle"
            onClick={toggleMute}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[9px] font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer ${
              isAudioMuted 
                ? "bg-zinc-950/10 border-zinc-900 text-zinc-600 hover:text-zinc-400"
                : "bg-red-950/10 border-red-900/50 text-red-400 shadow-[0_0_12px_rgba(193,18,31,0.1)]"
            }`}
          >
            {isAudioMuted ? "MUTED" : "SPATIAL ON"}
          </button>

          <button
            id="bypass-calibration-button"
            onClick={handleComplete}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/10 bg-red-950/5 hover:bg-red-950/20 text-red-500 hover:text-red-400 transition-all text-[9px] font-mono tracking-widest uppercase cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" /> BYPASS CALIBRATION
          </button>
        </div>
      </header>

      {/* Center content grid - Luxurious spacing, spacious columns */}
      <div className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-0">
        
        {/* Left Column: 35% Default Opacity macOS-style Task scheduler progress queue */}
        <motion.div 
          id="calibration-telemetry-queue" 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 0.35, x: 0 }}
          transition={{ delay: 2.0, duration: 1.0, ease: "easeOut" }}
          whileHover={{ opacity: 1.0 }}
          className="lg:col-span-3 h-[45vh] flex flex-col justify-between hidden lg:flex bg-zinc-950/35 hover:bg-zinc-950/70 backdrop-blur-sm hover:backdrop-blur-md border border-zinc-900/50 hover:border-red-950/25 rounded-3xl p-6 overflow-hidden transition-all duration-500 group cursor-pointer"
          title="Telemetry Console - Hover to expand details"
        >
          <div className="flex flex-col gap-1 shrink-0 border-b border-zinc-900/30 pb-3">
            <span className="text-[8px] font-mono tracking-[0.25em] text-zinc-500 group-hover:text-zinc-400 transition-colors">COGNITIVE SCHEDULER</span>
            <h3 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Biomimetic Task Pipeline</h3>
          </div>

          {/* Ultra Focused Tasks Feed: Shows only Previous, Current, Next. Rest are auto-collapsed */}
          <div className="flex-1 flex flex-col justify-center space-y-3.5 py-4 overflow-hidden">
            {/* Previous Task (Nominal complete) */}
            {previousTask ? (
              <div className="p-3 rounded-xl border border-zinc-900 bg-zinc-900/20 opacity-60">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-400 truncate w-36 flex items-center gap-1.5">
                    <span className="text-red-500">✓</span> {previousTask.name}
                  </span>
                  <span className="text-[8px] px-2 py-0.5 rounded-md bg-emerald-950/10 text-emerald-400 border border-emerald-500/10 uppercase">
                    COMPLETED
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-[9px] font-mono text-zinc-600 italic text-center py-2">
                No previous tasks resolved
              </div>
            )}

            {/* Current Active Task (High contrast red pulse) */}
            {currentRunningTask ? (
              <div className="p-3 rounded-xl border border-red-900/40 bg-red-950/5 shadow-[0_0_15px_rgba(193,18,31,0.04)] animate-pulse">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                  <span className="text-zinc-100 truncate w-36 flex items-center gap-1.5">
                    <span className="inline-block animate-spin text-[8px] text-red-500">⟳</span> {currentRunningTask.name}
                  </span>
                  <span className="text-[8px] px-2 py-0.5 rounded-md bg-red-950/20 text-red-400 border border-red-500/20 uppercase">
                    CALIBRATING
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="w-full h-[3px] bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-800 to-red-500 transition-all duration-300"
                      style={{ width: `${currentRunningTask.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500">
                    <span>{currentRunningTask.progress}% Complete</span>
                    {currentRunningTask.retries > 0 && (
                      <span className="text-orange-400 font-bold animate-pulse">
                        Retries: {currentRunningTask.retries}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[10px] font-mono text-zinc-500 italic text-center py-3">
                Seeking active network synapse...
              </div>
            )}

            {/* Next Task (Quietly sitting in queue) */}
            {nextTaskCandidate ? (
              <div className="p-3 rounded-xl border border-zinc-900/30 bg-zinc-950/20 opacity-30">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-zinc-500 truncate w-36">
                    {nextTaskCandidate.name}
                  </span>
                  <span className="text-[8px] px-2 py-0.5 rounded-md text-zinc-600 uppercase border border-zinc-900">
                    QUEUED
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-[9px] font-mono text-zinc-600 italic text-center py-2">
                All scheduled tasks dispatched
              </div>
            )}

            {/* Subtle collapse warning line */}
            <div className="text-[8px] font-mono text-zinc-600 tracking-wider text-center pt-2 select-none group-hover:text-zinc-500 transition-colors">
              [ 15+ PRECEDENT LOGS COLLAPSED ]
            </div>
          </div>

          <div className="border-t border-zinc-900/40 pt-3 shrink-0 flex items-center justify-between text-[8.5px] font-mono text-zinc-600 group-hover:text-zinc-500 transition-colors">
            <span>PIPELINE CAPACITY NOMINAL</span>
            <span>CRITICAL: {tasks.filter(t => t.required).length} / {tasks.length}</span>
          </div>
        </motion.div>

        {/* Center Column: Spacing Luxuries (Core Title & Centerpiece placement) */}
        <motion.main 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
          className="lg:col-span-6 flex flex-col items-center justify-center text-center py-6 h-full relative z-20"
        >
          <div className="mb-6">
            <span className="px-4 py-1.5 rounded-full border border-zinc-900 bg-zinc-950/40 text-[9px] font-mono tracking-[0.25em] text-zinc-500 uppercase">
              COGNITIVE FABRIC: {activeFlowInfo.phase}
            </span>
          </div>

          <div className="mb-8 flex justify-center items-center h-28 relative">
            {/* The Logo/Core animates on awakening */}
            <SentinelLogo size="lg" animateOnMount={true} />
            
            {/* Central energy flash points floating */}
            <span className="absolute w-2 h-2 rounded-full bg-red-500/80 animate-ping opacity-75"></span>
          </div>

          <h2 className="text-2xl md:text-3xl font-mono uppercase tracking-[0.3em] font-extrabold text-zinc-200 min-h-[40px] drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]">
            {activeFlowInfo.title}
          </h2>

          <p className="text-[11px] text-zinc-500 font-sans tracking-wide max-w-sm mt-3.5 min-h-[36px] leading-relaxed">
            {activeFlowInfo.subtitle}
          </p>

          <div className="mt-8 flex items-center gap-2.5 text-[9px] font-mono text-zinc-600 uppercase tracking-widest bg-zinc-950/20 px-4 py-2.5 rounded-2xl border border-zinc-900/40">
            <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>
              {progress < 100 ? "Reconstructing biomechanical neural lattice..." : "Sentinel Intelligence Core fully online."}
            </span>
          </div>
        </motion.main>

        {/* Right Column: Clean Minimalist Diagnostics Panel with beautiful Iconography (Issue 6) */}
        <motion.div 
          id="diagnostics-checklist-box" 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 0.35, x: 0 }}
          transition={{ delay: 2.5, duration: 1.0, ease: "easeOut" }}
          whileHover={{ opacity: 1.0 }}
          className="lg:col-span-3 h-[45vh] flex flex-col justify-between hidden lg:flex bg-zinc-950/35 hover:bg-zinc-950/70 backdrop-blur-sm hover:backdrop-blur-md border border-zinc-900/50 hover:border-red-950/25 rounded-3xl p-6 overflow-hidden transition-all duration-500 cursor-pointer"
        >
          <div className="flex flex-col gap-1 shrink-0 border-b border-zinc-900/30 pb-3">
            <span className="text-[8px] font-mono tracking-[0.25em] text-zinc-500">CALIBRATION AUDIT</span>
            <h3 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest mt-0.5">System Integrity</h3>
          </div>

          {/* Icon Based Status Checklist Replacing Verbose Texts */}
          <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
            
            {/* Item 1: Satellite Link */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/10 hover:bg-zinc-900/20 transition-all border border-transparent hover:border-zinc-900/40">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg border transition-colors ${
                  ["CONNECT_SERVICES", "CALIBRATE_AI", "VERIFY_SYSTEM", "READY", "ENTER_DASHBOARD"].includes(fsmState)
                    ? "bg-red-950/20 border-red-900/40 text-red-400"
                    : "bg-zinc-950 border-zinc-900 text-zinc-600"
                }`}>
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10.5px] font-mono tracking-wider text-zinc-300">🛰️ Satellite Links</span>
              </div>
              <span className={`text-[10px] font-mono font-bold ${
                ["CONNECT_SERVICES", "CALIBRATE_AI", "VERIFY_SYSTEM", "READY", "ENTER_DASHBOARD"].includes(fsmState)
                  ? "text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                  : "text-zinc-700"
              }`}>
                {["CONNECT_SERVICES", "CALIBRATE_AI", "VERIFY_SYSTEM", "READY", "ENTER_DASHBOARD"].includes(fsmState) ? "ONLINE" : "PENDING"}
              </span>
            </div>

            {/* Item 2: AI Brain Engine */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/10 hover:bg-zinc-900/20 transition-all border border-transparent hover:border-zinc-900/40">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg border transition-colors ${
                  ["CALIBRATE_AI", "VERIFY_SYSTEM", "READY", "ENTER_DASHBOARD"].includes(fsmState)
                    ? "bg-red-950/20 border-red-900/40 text-red-400"
                    : "bg-zinc-950 border-zinc-900 text-zinc-600"
                }`}>
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10.5px] font-mono tracking-wider text-zinc-300">🧠 AI Synapses</span>
              </div>
              <span className={`text-[10px] font-mono font-bold ${
                ["CALIBRATE_AI", "VERIFY_SYSTEM", "READY", "ENTER_DASHBOARD"].includes(fsmState)
                  ? "text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                  : "text-zinc-700"
              }`}>
                {["CALIBRATE_AI", "VERIFY_SYSTEM", "READY", "ENTER_DASHBOARD"].includes(fsmState) ? "NOMINAL" : "LOCKED"}
              </span>
            </div>

            {/* Item 3: Earth Hologram */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/10 hover:bg-zinc-900/20 transition-all border border-transparent hover:border-zinc-900/40">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg border transition-colors ${
                  ["CALIBRATE_AI", "VERIFY_SYSTEM", "READY", "ENTER_DASHBOARD"].includes(fsmState)
                    ? "bg-red-950/20 border-red-900/40 text-red-400"
                    : "bg-zinc-950 border-zinc-900 text-zinc-600"
                }`}>
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10.5px] font-mono tracking-wider text-zinc-300">🌍 Earth Hologram</span>
              </div>
              <span className={`text-[10px] font-mono font-bold ${
                ["CALIBRATE_AI", "VERIFY_SYSTEM", "READY", "ENTER_DASHBOARD"].includes(fsmState)
                  ? "text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                  : "text-zinc-700"
              }`}>
                {["CALIBRATE_AI", "VERIFY_SYSTEM", "READY", "ENTER_DASHBOARD"].includes(fsmState) ? "READY" : "LOCKED"}
              </span>
            </div>

            {/* Item 4: Sensors Fleet */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/10 hover:bg-zinc-900/20 transition-all border border-transparent hover:border-zinc-900/40">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg border transition-colors ${
                  ["VERIFY_SYSTEM", "READY", "ENTER_DASHBOARD"].includes(fsmState)
                    ? "bg-red-950/20 border-red-900/40 text-red-400"
                    : "bg-zinc-950 border-zinc-900 text-zinc-600"
                }`}>
                  <Sliders className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10.5px] font-mono tracking-wider text-zinc-300">📡 Sensor Array</span>
              </div>
              <span className={`text-[10px] font-mono font-bold ${
                ["VERIFY_SYSTEM", "READY", "ENTER_DASHBOARD"].includes(fsmState)
                  ? "text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                  : "text-zinc-700"
              }`}>
                {["VERIFY_SYSTEM", "READY", "ENTER_DASHBOARD"].includes(fsmState) ? "SYNCED" : "PENDING"}
              </span>
            </div>

            {/* Item 5: Energy Core */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/10 hover:bg-zinc-900/20 transition-all border border-transparent hover:border-zinc-900/40">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg border transition-colors ${
                  ["READY", "ENTER_DASHBOARD"].includes(fsmState)
                    ? "bg-red-950/20 border-red-900/40 text-red-400"
                    : "bg-zinc-950 border-zinc-900 text-zinc-600"
                }`}>
                  <Zap className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <span className="text-[10.5px] font-mono tracking-wider text-zinc-300">⚡ Energy Resonance</span>
              </div>
              <span className={`text-[10px] font-mono font-bold ${
                ["READY", "ENTER_DASHBOARD"].includes(fsmState)
                  ? "text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                  : "text-zinc-700"
              }`}>
                {["READY", "ENTER_DASHBOARD"].includes(fsmState) ? "ALIGNED" : "LOCKED"}
              </span>
            </div>

          </div>

          <div className="border-t border-zinc-900/40 pt-3 shrink-0 flex items-center justify-between text-[8.5px] font-mono text-zinc-600">
            <span>HARDWARE STATIONS SECURE</span>
            <span className="text-red-500 font-extrabold uppercase animate-pulse">ACTIVE VIGIL</span>
          </div>
        </motion.div>

      </div>

      {/* Floating/Docked Calibration Logs Panel */}
      <div id="diagnostics-system-logs" className="fixed bottom-28 right-8 z-30 select-none">
        {/* Mobile View: Hide detailed logs, show only current calibration status */}
        <div className="block md:hidden bg-zinc-950/85 backdrop-blur-md border border-red-950/80 rounded-full px-3.5 py-1.5 shadow-md flex items-center gap-2 text-[10px] font-mono text-zinc-300">
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
          </span>
          <span className="tracking-wide uppercase">
            {progress < 100 ? `CALIBRATING: ${Math.round(progress)}%` : "COMPLETE"}
          </span>
        </div>

        {/* Tablet View: Collapse into a floating diagnostics chip */}
        <div className="hidden md:flex lg:hidden bg-zinc-950/85 backdrop-blur-md border border-red-950/80 rounded-full px-4 py-2 shadow-md hover:bg-zinc-900/40 transition-all duration-300 items-center gap-2 text-[10px] font-mono text-zinc-300 cursor-pointer" onClick={() => setIsFullLogsOpen(true)}>
          <Terminal className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span className="tracking-wider uppercase">DIAGNOSTICS CHIP</span>
        </div>

        {/* Compact diagnostics float card - 35% opacity by default */}
        <div className="hidden lg:flex flex-col justify-between bg-zinc-950/50 hover:bg-zinc-950/90 backdrop-blur-sm hover:backdrop-blur-md border border-zinc-900 hover:border-red-950/40 rounded-2xl p-4 shadow-lg overflow-hidden transition-all duration-500 lg:w-[260px] lg:h-[130px] xl:w-[290px] xl:h-[140px] opacity-35 hover:opacity-100">
          <div className="flex items-center justify-between border-b border-zinc-900/60 pb-1 shrink-0">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <h4 className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                System Ledger
              </h4>
            </div>
            <div className="text-[8px] font-mono text-zinc-600">
              FPS: {fps}
            </div>
          </div>

          {/* Render 3 compact logs lines instead of heavy texts */}
          <div className="flex-1 my-1.5 overflow-hidden flex flex-col justify-end space-y-0.5">
            <AnimatePresence initial={false}>
              {debugLogs.slice(0, 3).reverse().map((log, index, arr) => {
                const { status, text } = parseRawLog(log);
                const opacity = getOpacity(index, arr.length);
                return (
                  <motion.div
                    key={log}
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                    style={{ opacity }}
                    className="flex items-center text-[9px] font-mono tracking-wide truncate text-zinc-400"
                  >
                    {renderLogIcon(status)}
                    <span className="truncate">{text}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="pt-1 border-t border-zinc-900/60 shrink-0 flex justify-between items-center">
            <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
              LEDGER
            </span>
            <button
              onClick={() => setIsFullLogsOpen(true)}
              className="text-[8.5px] font-mono text-red-500/60 hover:text-red-400 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Full diagnostics
            </button>
          </div>
        </div>
      </div>

      {/* Full Diagnostics Detailed Overlay Modal */}
      <AnimatePresence>
        {isFullLogsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm pointer-events-auto"
            onClick={() => setIsFullLogsOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg h-[440px] bg-zinc-950/95 border border-red-600/20 rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col justify-between"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-red-500 animate-pulse" />
                  <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-widest">
                    AI SYSTEM SENSOR LEDGER
                  </h3>
                </div>
                <button 
                  onClick={() => setIsFullLogsOpen(false)}
                  className="text-zinc-500 hover:text-zinc-300 text-xs font-mono hover:bg-zinc-900 px-2.5 py-1 rounded-xl transition-all cursor-pointer border border-zinc-800/40"
                >
                  [CLOSE]
                </button>
              </div>

              {/* Full Logs Scrollable Container */}
              <div className="flex-1 overflow-y-auto font-mono text-[11px] text-zinc-400 space-y-2 pr-1 scrollbar-thin select-text">
                {debugLogs.map((log, i) => {
                  const { status, text } = parseRawLog(log);
                  let colorClass = "text-zinc-400";
                  if (status === "SUCCESS") colorClass = "text-zinc-200";
                  else if (status === "WARNING") colorClass = "text-amber-400";
                  else if (status === "FAILED") colorClass = "text-red-400";
                  
                  return (
                    <div key={i} className={`flex items-start py-0.5 leading-relaxed pl-2 border-l border-zinc-800/60 ${colorClass}`}>
                      {renderLogIcon(status)}
                      <span className="font-mono tracking-wide">{text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Hardware compute telemetry integrated elegantly in full diagnostics view */}
              <div className="mt-4 pt-4 border-t border-zinc-900 space-y-2 shrink-0">
                <span className="text-[9px] font-mono tracking-wider text-zinc-500 block uppercase">
                  HARDWARE COMPUTE TELEMETRY
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-zinc-400 text-[10px] font-mono">
                  <div className="bg-black/30 p-2 rounded-xl border border-zinc-900">
                    <span className="block text-[8px] text-zinc-600">CPU CORE</span>
                    <span className="font-bold text-red-500 mt-0.5 block">{simulatedCpu}%</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-xl border border-zinc-900">
                    <span className="block text-[8px] text-zinc-600">GPU RASTER</span>
                    <span className="font-bold text-red-600 mt-0.5 block">{simulatedGpu}%</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-xl border border-zinc-900">
                    <span className="block text-[8px] text-zinc-600">NETWORK</span>
                    <span className="font-bold text-red-400 mt-0.5 block">{22 + Math.floor(Math.random() * 8)}ms</span>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-zinc-900 flex justify-between items-center text-[9px] font-mono text-zinc-500">
                <span>TOTAL LOGGED: {debugLogs.length} EVENTS</span>
                <span className="text-red-500 font-bold">SYSTEM COGNITION ON-LINE</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Diagnostics Settings Panel */}
      <AnimatePresence>
        {showDebug && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            id="diagnostics-lab-panel"
            className="fixed bottom-24 right-6 left-6 md:left-auto md:w-[480px] z-50 bg-zinc-950/95 border border-red-600/20 rounded-3xl p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-red-500 animate-spin-slow" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                  DEVELOPER TUNING LAB
                </h4>
              </div>
              <button 
                onClick={() => setShowDebug(false)}
                className="text-zinc-500 hover:text-zinc-300 text-xs font-mono"
              >
                [CLOSE]
              </button>
            </div>

            <div className="space-y-4 text-[11px] font-mono">
              <p className="text-zinc-400 leading-relaxed text-[10px]">
                Test AI fault tolerance and biomimetic spider web construction speeds. Manual triggers let you isolate individual components in real time.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  id="dev-settle-active-tasks"
                  onClick={forceSettleModule}
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-red-950/20 hover:bg-red-900/30 border border-red-600/40 hover:border-red-600/60 rounded-xl transition-all text-zinc-300 font-bold cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> SETTLE ACTIVE
                </button>
                <button
                  id="dev-inject-network-flake"
                  onClick={injectNetworkFlake}
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-red-900/15 hover:bg-red-900/25 border border-red-500/40 hover:border-red-500/60 rounded-xl transition-all text-zinc-300 font-bold cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> INJECT NET FLAKE
                </button>
                <button
                  id="dev-force-safe-mode"
                  onClick={() => setSystemIntegrity("SAFE_MODE")}
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-yellow-900/15 hover:bg-yellow-900/25 border border-yellow-500/30 rounded-xl transition-all text-zinc-300 font-bold col-span-2 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" /> FORCE SAFE MODE
                </button>
                <button
                  id="dev-skip-calibration-entirely"
                  onClick={handleComplete}
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-emerald-900/20 hover:bg-emerald-900/30 border border-emerald-500/40 rounded-xl transition-all text-zinc-200 font-bold col-span-2 cursor-pointer"
                >
                  <Power className="w-3.5 h-3.5" /> SKIP ENTIRE CALIBRATION
                </button>
              </div>

              <div className="border-t border-zinc-800 pt-3.5 mt-2 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-500">WATCHDOG TIMER:</span>
                  <span className="text-zinc-300 font-bold">1000ms TICK LEVEL</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-500">MEMORY UTILIZATION:</span>
                  <span className="text-zinc-300 font-bold">{simulatedMemory} MB / 1024 MB</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-zinc-500">SYSTEM INTEGRITY:</span>
                  <span className={`font-bold ${
                    systemIntegrity === "STABLE" ? "text-emerald-400" : "text-yellow-400"
                  }`}>
                    {systemIntegrity}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safe Mode Fallback Alert Box */}
      <AnimatePresence>
        {systemIntegrity === "SAFE_MODE" && (
          <div id="safemode-fallback-alert" className="absolute inset-x-4 top-24 md:left-auto md:right-6 md:w-96 z-50 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-yellow-950/95 border border-yellow-500/50 rounded-2xl p-5 shadow-2xl backdrop-blur-md"
            >
              <div className="flex gap-3">
                <div className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 h-fit">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-yellow-300 uppercase tracking-widest">
                    SAFE MODE AUTONOMOUS BYPASS
                  </h4>
                  <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                    Planetary Sentinel neural lattice fully structured. Optional sub-spatial datasets are still syncing. You may access the command centre immediately.
                  </p>
                  <button
                    onClick={handleComplete}
                    className="mt-3.5 w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl text-[10px] font-mono font-extrabold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-black" /> ENTER COMMAND CENTRE IMMEDIATELY
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Progress Stats HUD & Node-to-Node Progress bar (Issue 5) */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-6 flex flex-col items-center border-t border-zinc-900/60 pt-6 gap-6">
        
        {/* Spatial Node-to-Node Progress Bar replacing traditional simple loader bar */}
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="flex items-center justify-between w-full text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-3">
            <span>Grid Synchronization Flow</span>
            <span id="calibration-percentage" className="text-zinc-300 font-bold">{Math.round(progress)}% Complete</span>
          </div>

          <div className="w-full flex items-center justify-between relative px-2 py-4">
            
            {/* Background connective line */}
            <div className="absolute left-4 right-4 h-[1px] bg-zinc-900 z-0"></div>
            
            {/* Active pulsing glow connection path */}
            <div 
              className="absolute left-4 h-[1.5px] bg-gradient-to-r from-red-900 to-red-500 z-0 shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all duration-500"
              style={{ width: `calc(${progress}% - 2rem)` }}
            />

            {/* Neural nodes ○──○──○──○──○──○──○ representing the STATE_FLOW */}
            {STATE_FLOW.filter(s => s.name !== "ENTER_DASHBOARD").map((nodeItem, idx) => {
              const currentActiveIdx = STATE_FLOW.findIndex(s => s.name === fsmState);
              const isNodeCompleted = idx < currentActiveIdx;
              const isNodeActive = nodeItem.name === fsmState;
              
              return (
                <div 
                  key={nodeItem.name} 
                  className="flex flex-col items-center z-10 relative group/node cursor-help"
                  title={`${nodeItem.title} - ${nodeItem.subtitle}`}
                >
                  {/* Node Circle */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 border ${
                    isNodeCompleted 
                      ? "bg-[#050505] border-red-500/80 shadow-[0_0_12px_rgba(193,18,31,0.65)] text-red-500" 
                      : isNodeActive
                      ? "bg-red-950/40 border-red-500 animate-pulse text-zinc-100 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                      : "bg-[#050505] border-zinc-900 text-zinc-700"
                  }`}>
                    {isNodeCompleted ? (
                      <span className="text-[10px] font-bold">✓</span>
                    ) : (
                      <span className="text-[8px] font-mono">{idx + 1}</span>
                    )}
                  </div>

                  {/* Tiny label representing each awakening milestone */}
                  <span className={`text-[8px] font-mono uppercase mt-2 font-semibold tracking-wider transition-colors duration-300 ${
                    isNodeActive 
                      ? "text-red-400" 
                      : isNodeCompleted 
                      ? "text-zinc-500" 
                      : "text-zinc-700"
                  }`}>
                    {nodeItem.name}
                  </span>
                </div>
              );
            })}

          </div>
        </div>

        {/* Cinematic brand values */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-t border-zinc-900/30 pt-4">
          <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-zinc-600 uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>CONFIDENCE: 99.98% • INTEGRITY: {systemIntegrity}</span>
          </div>

          <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
            <div className="text-center md:text-right">
              <span className="text-zinc-400 font-bold block">SEE TOMORROW.</span>
              <span>PROTECT TODAY.</span>
            </div>
          </div>
        </div>

      </footer>

    </div>
  );
}
