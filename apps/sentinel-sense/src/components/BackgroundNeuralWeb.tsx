// SAMMIUM SENTINEL SENSE™ - BIOMIMETIC INFINITE NEURAL WEB SYSTEM v2.0
// Next-Generation High-Fidelity Ambient Computational Environment
// Optimized for 144Hz Displays, featuring Procedural Dynamic Grid Spawning and Intelligent State Reaction

import React, { useEffect, useRef, useMemo } from "react";
import { audioEngine } from "../utils/AudioEngine";
import { getPerformanceProfile } from "../utils/performance";

interface BackgroundNeuralWebProps {
  isScanning: boolean;
  overallThreat: number;
  atmosphere?: "crimson" | "amber" | "cyan" | "emerald";
  isHighContrast?: boolean;
  isReducedMotion?: boolean;
}

// Coordinate grids and node parameters for our 4-layer depth system
const CELL_SIZES = [400, 300, 250, 180];      // Grid cell widths per layer (far -> near)
const BASE_SIZES = [0.8, 1.4, 2.4, 4.0];       // Base node sizes per layer
const SIZE_RANGES = [0.4, 0.8, 1.2, 1.8];      // Node random size variance per layer
const Z_VALUES = [0.2, 0.5, 0.8, 1.15];        // Depth z-values for depth-of-field focal blur
const MAX_CONN_DISTS = [550, 420, 320, 220];   // Maximum connection distance for webbing strands

export default function BackgroundNeuralWeb({
  isScanning,
  overallThreat,
  atmosphere = "crimson",
  isHighContrast = false,
  isReducedMotion = false
}: BackgroundNeuralWebProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Virtual Camera coordinates (starts offset to avoid coordinate edge artifacts)
  const camVirtualX = useRef<number>(10000);
  const camVirtualY = useRef<number>(10000);
  const camDriftAngle = useRef<number>(Math.random() * Math.PI * 2);
  const cameraShake = useRef<number>(0); // Screen shake intensity (used in Emergency mode)

  // Interactive mouse spring coordinates
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    isOver: false
  });

  // Audio Context reference for local ambient hum and clicks
  const audioContextRef = useRef<AudioContext | null>(null);
  const droneHumNode = useRef<OscillatorNode | null>(null);
  const droneHumFilter = useRef<BiquadFilterNode | null>(null);
  const droneHumGain = useRef<GainNode | null>(null);

  // Theme-aware palette mappings
  const colors = useMemo(() => {
    const maps = {
      crimson: {
        fog: "155, 17, 30",       // Matte deep crimson #9B111E
        energyPulse: "#EF233C",    // Bright alert red
        nodeActive: "#EF233C",
        nodeStable: "63, 63, 70",
        droneGuardian: "#EF233C",
        droneEngineer: "#F59E0B",
        droneScout: "#06B6D4",
        lightBeam: "rgba(155, 17, 30, 0.05)"
      },
      amber: {
        fog: "217, 119, 6",        // Warm security amber
        energyPulse: "#F59E0B",
        nodeActive: "#F59E0B",
        nodeStable: "63, 63, 70",
        droneGuardian: "#EF233C",
        droneEngineer: "#F59E0B",
        droneScout: "#0D9488",
        lightBeam: "rgba(217, 119, 6, 0.05)"
      },
      cyan: {
        fog: "8, 145, 178",        // Scientific lab cyan
        energyPulse: "#06B6D4",
        nodeActive: "#06B6D4",
        nodeStable: "63, 63, 70",
        droneGuardian: "#0284C7",
        droneEngineer: "#EAB308",
        droneScout: "#06B6D4",
        lightBeam: "rgba(8, 145, 178, 0.05)"
      },
      emerald: {
        fog: "5, 150, 105",        // Protected shield green
        energyPulse: "#10B981",
        nodeActive: "#10B981",
        nodeStable: "63, 63, 70",
        droneGuardian: "#EF4444",
        droneEngineer: "#F59E0B",
        droneScout: "#10B981",
        lightBeam: "rgba(5, 150, 105, 0.05)"
      }
    };
    return maps[atmosphere];
  }, [atmosphere]);

  // Deterministic pseudo-random noise generator to sustain a consistent infinite universe
  const pseudoRandom = (gx: number, gy: number, seed: number): number => {
    const x = Math.sin(gx * 12.9898 + gy * 78.233 + seed * 43758.5453) * 43758.5453123;
    return x - Math.floor(x);
  };

  // Setup ambient lab audio hum & triggers
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (isReducedMotion || audioEngine.getMuted()) return;

      try {
        if (!audioContextRef.current) {
          const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
          audioContextRef.current = new AudioCtxClass();
        }

        const ctx = audioContextRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        if (!droneHumNode.current) {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(55, ctx.currentTime); // Low 55Hz laboratory hum

          filter.type = "lowpass";
          filter.frequency.setValueAtTime(120, ctx.currentTime);

          gain.gain.setValueAtTime(0.005, ctx.currentTime);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start();

          droneHumNode.current = osc;
          droneHumFilter.current = filter;
          droneHumGain.current = gain;
        }
      } catch (err) {
        console.warn("Lab ambient background synthesizer failed to initialize:", err);
      }
    };

    const interactionOptions: AddEventListenerOptions = { once: true, passive: true };
    window.addEventListener("pointerdown", handleFirstInteraction, interactionOptions);
    window.addEventListener("keydown", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);

      if (droneHumNode.current) {
        try {
          droneHumNode.current.stop();
          droneHumNode.current.disconnect();
        } catch (e) {}
        droneHumNode.current = null;
      }
      if (droneHumGain.current) {
        try {
          droneHumGain.current.disconnect();
        } catch (e) {}
        droneHumGain.current = null;
      }
    };
  }, [isReducedMotion]);

  // Adjust volume of drone ambient core relative to overall application threat levels
  useEffect(() => {
    const ctx = audioContextRef.current;
    const gainNode = droneHumGain.current;

    if (ctx && gainNode) {
      const isMuted = audioEngine.getMuted();
      const targetVolume = isMuted ? 0 : 0.003 + (overallThreat / 100) * 0.009;
      gainNode.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 0.6);
    }
  }, [overallThreat]);

  // Cybernetic feedback sound triggers
  const playAmbientServo = (pitchStart: number, pitchEnd: number, duration: number) => {
    if (audioEngine.getMuted() || isReducedMotion) return;
    const ctx = audioContextRef.current || (audioEngine as any).ctx;
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(pitchStart, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitchEnd, ctx.currentTime + duration);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(600, ctx.currentTime);

      gain.gain.setValueAtTime(0.008, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const playAmbientSpark = (pitch: number) => {
    if (audioEngine.getMuted() || isReducedMotion) return;
    const ctx = audioContextRef.current || (audioEngine as any).ctx;
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.setValueAtTime(pitch * 1.5, ctx.currentTime + 0.02);

      gain.gain.setValueAtTime(0.009, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (e) {}
  };

  const playCrystallineChime = () => {
    if (audioEngine.getMuted() || isReducedMotion) return;
    const ctx = audioContextRef.current || (audioEngine as any).ctx;
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const frequencies = [880, 1046, 1318, 1568, 1760];
      const freq = frequencies[Math.floor(Math.random() * frequencies.length)];

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.0012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.1);
    } catch (e) {}
  };

  // Main high-fidelity animation and simulation loops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const profile = getPerformanceProfile();
    const targetFps = isReducedMotion ? profile.reducedTargetFps : profile.targetFps;
    const frameInterval = 1000 / targetFps;
    const layerCount = isReducedMotion ? 2 : 3;

    // Cap the backing-buffer resolution. Rendering a full-screen canvas at 2x or
    // 3x DPR multiplies the pixel workload and is the biggest source of laptop lag.
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, profile.maxDevicePixelRatio);
      const width = Math.max(1, window.innerWidth);
      const height = Math.max(1, window.innerHeight);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.isOver = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isOver = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // =========================================================================
    // SPATIAL PROCEDURAL ENTITIES (Infinite Web Definition)
    // =========================================================================

    // Procedural Neural Node model
    interface NeuralNode {
      id: string; // gx_gy_layer format
      gx: number;
      gy: number;
      layer: number;
      x: number; // Virtual X coordinate
      y: number; // Virtual Y coordinate
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      health: number; // 0.0 to 1.0. Lower values trigger red warnings & repairs
      pulseOffset: number;
      size: number;
      brightness: number;
      z: number;
      vibrateTime: number;
      opacity: number; // For smooth fade-ins and fade-outs
      isClusterMember: boolean;
      clusterPulseIntensity: number;
      sparkCooldown: number;
    }

    // Energy Pulse packet
    interface EnergyPulse {
      id: number;
      fromId: string;
      toId: string;
      progress: number; // 0.0 to 1.0
      speed: number;
      size: number;
      color: string;
      type: "monitoring" | "prediction" | "emergency" | "synchronization" | "external_data" | "successful_validation";
      splitCount: number;
    }

    // Floating Dust particle (Atmospheric depth)
    interface DustParticle {
      id: number;
      x: number; // Relative screen-aligned
      y: number;
      size: number;
      speed: number;
      swaySpeed: number;
      swayWidth: number;
      phase: number;
      opacity: number;
      z: number;
    }

    // Shifting Volumetric Lighting ray
    interface VolumetricBeam {
      x: number;
      angle: number;
      width: number;
      length: number;
      speed: number;
      intensity: number;
    }

    // Electrostatic repair spark
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
    }

    // Temporary active intelligence cluster
    interface ComputationalCluster {
      id: string;
      x: number; // Virtual X
      y: number; // Virtual Y
      radius: number;
      life: number; // 0.0 to 1.0 (decays)
      maxLife: number; // in seconds
      intensity: number;
      calculations: {
        text: string;
        xOffset: number;
        yOffset: number;
        speedY: number;
        opacity: number;
        progress: number;
      }[];
    }

    // Robotic Jointed limbs for autonomous drones
    interface SpiderLeg {
      side: "left" | "right";
      index: number;
      footX: number;
      footY: number;
      stepStartX: number;
      stepStartY: number;
      stepTargetX: number;
      stepTargetY: number;
      stepProgress: number;
      isStepping: boolean;
    }

    // Drone definition
    interface SpiderDrone {
      type: "guardian" | "engineer" | "scout";
      x: number; // Virtual X
      y: number; // Virtual Y
      vx: number;
      vy: number;
      angle: number;
      targetX: number;
      targetY: number;
      state: string;
      previousState: string;
      stateTimer: number;
      speed: number;
      bodyRadius: number;
      color: string;
      legs: SpiderLeg[];
      scanAngle: number;
      repairTargetNodeId: string | null;
      scoutCurrentNodeId: string | null;
      scoutNextNodeId: string | null;
      scoutProgress: number;
      sparkCooldown: number;
      isAcknowledging: boolean;
    }

    // Persistent entities map (Object pools)
    const activeNodes = new Map<string, NeuralNode>();
    const energyPulses: EnergyPulse[] = [];
    const dustParticles: DustParticle[] = [];
    const beams: VolumetricBeam[] = [];
    const sparks: Spark[] = [];
    const clusters: ComputationalCluster[] = [];
    
    let pulseIdCounter = 0;
    let sparkIdCounter = 0;

    // --- Atmospheric Beams Init ---
    const beamCount = isHighContrast || isReducedMotion ? 0 : 2;
    for (let i = 0; i < beamCount; i++) {
      beams.push({
        x: Math.random() * window.innerWidth,
        angle: Math.PI * 0.25 + (Math.random() - 0.5) * 0.15,
        width: 150 + Math.random() * 250,
        length: window.innerHeight * 1.8,
        speed: 0.01 + Math.random() * 0.02,
        intensity: 0.008 + Math.random() * 0.012
      });
    }

    // --- Floating Ambient Dust Init ---
    const dustCount = isReducedMotion ? 8 : 20;
    for (let i = 0; i < dustCount; i++) {
      dustParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 0.6 + Math.random() * 1.6,
        speed: 0.08 + Math.random() * 0.12,
        swaySpeed: 0.2 + Math.random() * 0.4,
        swayWidth: 15 + Math.random() * 25,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.05 + Math.random() * 0.25,
        z: 0.1 + Math.random() * 0.9
      });
    }

    // Spark generation helper
    const generateSparks = (vx: number, vy: number, color: string, count: number) => {
      if (isReducedMotion) return;
      for (let i = 0; i < count; i++) {
        const speed = 0.8 + Math.random() * 2.2;
        const angle = Math.random() * Math.PI * 2;
        sparks.push({
          x: vx,
          y: vy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 15 + Math.floor(Math.random() * 20),
          size: 0.6 + Math.random() * 0.8,
          color
        });
      }
    };

    // Inverse Kinematics Leg Setup Helper for Drones
    const initDroneLegs = (bx: number, by: number, ang: number, br: number): SpiderLeg[] => {
      const legs: SpiderLeg[] = [];
      const offsets = [-0.65, -0.22, 0.22, 0.65];
      for (let l = 0; l < 8; l++) {
        const isLeft = l < 4;
        const sideIdx = l % 4;
        const legAngle = ang + (isLeft ? -Math.PI / 2 : Math.PI / 2) + offsets[sideIdx];
        const reach = br * 2.8;

        const footX = bx + Math.cos(legAngle) * reach;
        const footY = by + Math.sin(legAngle) * reach;

        legs.push({
          side: isLeft ? "left" : "right",
          index: sideIdx,
          footX,
          footY,
          stepStartX: footX,
          stepStartY: footY,
          stepTargetX: footX,
          stepTargetY: footY,
          stepProgress: 1.0,
          isStepping: false
        });
      }
      return legs;
    };

    // --- Instantiate Autonomous Maintenance Drones ---
    const drones: SpiderDrone[] = [
      {
        type: "guardian", // Red patrol unit, sweeps laser sensors, guards active clusters
        x: camVirtualX.current + window.innerWidth * 0.3,
        y: camVirtualY.current + window.innerHeight * 0.35,
        vx: 0,
        vy: 0,
        angle: 0,
        targetX: camVirtualX.current + window.innerWidth * 0.3,
        targetY: camVirtualY.current + window.innerHeight * 0.35,
        state: "patrol",
        previousState: "patrol",
        stateTimer: 6.0,
        speed: 0.65,
        bodyRadius: 10.5,
        color: colors.droneGuardian,
        legs: [],
        scanAngle: 0,
        repairTargetNodeId: null,
        scoutCurrentNodeId: null,
        scoutNextNodeId: null,
        scoutProgress: 0,
        sparkCooldown: 0,
        isAcknowledging: false
      },
      {
        type: "engineer", // Amber maintenance unit, seeks out and repairs unstable nodes
        x: camVirtualX.current + window.innerWidth * 0.7,
        y: camVirtualY.current + window.innerHeight * 0.65,
        vx: 0,
        vy: 0,
        angle: Math.PI,
        targetX: camVirtualX.current + window.innerWidth * 0.7,
        targetY: camVirtualY.current + window.innerHeight * 0.65,
        state: "idle",
        previousState: "idle",
        stateTimer: 3.0,
        speed: 0.8,
        bodyRadius: 9.0,
        color: colors.droneEngineer,
        legs: [],
        scanAngle: 0,
        repairTargetNodeId: null,
        scoutCurrentNodeId: null,
        scoutNextNodeId: null,
        scoutProgress: 0,
        sparkCooldown: 0,
        isAcknowledging: false
      },
      {
        type: "scout", // Cyan explorer unit, crawls quickly along connections mapping traffic
        x: camVirtualX.current + window.innerWidth * 0.5,
        y: camVirtualY.current + window.innerHeight * 0.25,
        vx: 0,
        vy: 0,
        angle: Math.PI * 0.5,
        targetX: camVirtualX.current + window.innerWidth * 0.5,
        targetY: camVirtualY.current + window.innerHeight * 0.25,
        state: "crawl_seeking",
        previousState: "crawl_seeking",
        stateTimer: 1.0,
        speed: 1.35,
        bodyRadius: 7.5,
        color: colors.droneScout,
        legs: [],
        scanAngle: 0,
        repairTargetNodeId: null,
        scoutCurrentNodeId: null,
        scoutNextNodeId: null,
        scoutProgress: 0,
        sparkCooldown: 0,
        isAcknowledging: false
      }
    ];

    // Initialize legs
    drones.forEach((dr) => {
      dr.legs = initDroneLegs(dr.x, dr.y, dr.angle, dr.bodyRadius);
    });

    let animationId = 0;
    let lastTime = Date.now();
    let lastRenderTime = 0;
    let frameCount = 0;
    let pageVisible = !document.hidden;

    const handleVisibilityChange = () => {
      pageVisible = !document.hidden;
      lastTime = Date.now();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Dynamic cinematic camera lens depth variables
    const focalPlane = { current: 0.65, target: 0.65, speed: 0.05 };
    const baseW = window.innerWidth;
    const baseH = window.innerHeight;

    // Camera drift vectors
    let camVx = 0.12;
    let camVy = -0.08;

    // Dynamic focus plane shift routine
    const adjustFocalDepth = (dt: number) => {
      if (isScanning) {
        focalPlane.target = 0.85; // Focus middle layers
      } else if (overallThreat >= 61) {
        focalPlane.target = 1.15; // Shift sharp focus to near foreground
      } else {
        // Ambient breathing focal drift
        focalPlane.target = 0.65 + Math.sin(Date.now() * 0.0002) * 0.35;
      }
      focalPlane.current += (focalPlane.target - focalPlane.current) * focalPlane.speed * 60 * dt;
    };

    // Apply focal depth volumetric blur (Depth of Field)
    const applyDepthOfFieldBlur = (z: number) => {
      if (isReducedMotion || isHighContrast) return;
      const deviation = Math.abs(z - focalPlane.current);
      if (deviation > 0.15) {
        const blurAmount = Math.min(4.2, (deviation - 0.15) * 11);
        ctx.filter = `blur(${blurAmount.toFixed(1)}px)`;
      } else {
        ctx.filter = "none";
      }
    };

    const resetFilter = () => {
      if (isReducedMotion || isHighContrast) return;
      ctx.filter = "none";
    };

    // Core Animation Engine. Schedule first, then skip frames to enforce the
    // target refresh rate without blocking input or scrolling.
    const animate = (frameTime: number) => {
      animationId = requestAnimationFrame(animate);
      if (!pageVisible || frameTime - lastRenderTime < frameInterval) return;

      lastRenderTime = frameTime - ((frameTime - lastRenderTime) % frameInterval);
      const now = Date.now();
      const dt = Math.min((now - lastTime) / 1000, 0.06);
      lastTime = now;
      frameCount++;

      // Clear stage
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // --- 1. COORDINATE DRIFT & CAMERA SYSTEM ---
      const isEmergency = overallThreat >= 61;
      const speedMult = isScanning ? 1.7 : isEmergency ? 2.5 : 1.0;

      // Handle continuous slow directional panning of the infinite space
      if (!isReducedMotion) {
        // Change drift direction wanderingly
        camDriftAngle.current += (pseudoRandom(Math.floor(now / 4000), 17, 3.5) - 0.5) * 0.15;
        const targetVx = Math.cos(camDriftAngle.current) * 0.18 * speedMult;
        const targetVy = Math.sin(camDriftAngle.current) * 0.18 * speedMult;

        camVx += (targetVx - camVx) * 0.05;
        camVy += (targetVy - camVy) * 0.05;

        camVirtualX.current += camVx * 60 * dt;
        camVirtualY.current += camVy * 60 * dt;

        // Camera breathing zoom oscillation
        const zoomOsc = 1.0 + Math.sin(now * 0.0004) * 0.015;
        cameraShake.current = isEmergency ? 1.5 + Math.sin(now * 0.05) * 1.5 : 0;

        ctx.save();
        ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
        ctx.scale(zoomOsc, zoomOsc);
        ctx.translate(
          -window.innerWidth / 2 + (Math.random() - 0.5) * cameraShake.current,
          -window.innerHeight / 2 + (Math.random() - 0.5) * cameraShake.current
        );
      } else {
        ctx.save();
      }

      // Smooth interactive mouse springs
      const mouse = mouseRef.current;
      const activeMouseX = mouse.x === -1000 ? window.innerWidth / 2 : mouse.x;
      const activeMouseY = mouse.y === -1000 ? window.innerHeight / 2 : mouse.y;

      if (mouse.isOver) {
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;
      } else {
        mouse.x += (window.innerWidth / 2 - mouse.x) * 0.02;
        mouse.y += (window.innerHeight / 2 - mouse.y) * 0.02;
      }

      adjustFocalDepth(dt);

      // --- 2. PROCEDURAL INFINITE GRID SPAWNER & PRUNER ---
      const W = window.innerWidth;
      const H = window.innerHeight;
      const buffer = 280; // Boundary buffer around screen for offscreen generation

      // Define visible boundaries in the virtual coordinate universe
      const vBounds = {
        minX: camVirtualX.current - buffer,
        maxX: camVirtualX.current + W + buffer,
        minY: camVirtualY.current - buffer,
        maxY: camVirtualY.current + H + buffer
      };

      const visibleKeys = new Set<string>();

      // Loop through all 4 depth layers and determine active cells
      for (let layer = 0; layer < layerCount; layer++) {
        const cSize = CELL_SIZES[layer];
        const minGx = Math.floor(vBounds.minX / cSize);
        const maxGx = Math.ceil(vBounds.maxX / cSize);
        const minGy = Math.floor(vBounds.minY / cSize);
        const maxGy = Math.ceil(vBounds.maxY / cSize);

        for (let gx = minGx; gx <= maxGx; gx++) {
          for (let gy = minGy; gy <= maxGy; gy++) {
            const nodeKey = `${gx}_${gy}_${layer}`;
            visibleKeys.add(nodeKey);

            if (!activeNodes.has(nodeKey)) {
              // Deterministically spawn node
              const nRandX = pseudoRandom(gx, gy, layer * 11 + 1);
              const nRandY = pseudoRandom(gx, gy, layer * 11 + 2);
              const nBaseX = gx * cSize + nRandX * cSize;
              const nBaseY = gy * cSize + nRandY * cSize;

              const nSize = BASE_SIZES[layer] + pseudoRandom(gx, gy, layer * 11 + 3) * SIZE_RANGES[layer];
              const nBrightness = 0.35 + pseudoRandom(gx, gy, layer * 11 + 4) * 0.55;
              const nHealth = 0.7 + pseudoRandom(gx, gy, layer * 11 + 5) * 0.3;

              activeNodes.set(nodeKey, {
                id: nodeKey,
                gx,
                gy,
                layer,
                x: nBaseX,
                y: nBaseY,
                baseX: nBaseX,
                baseY: nBaseY,
                vx: 0,
                vy: 0,
                health: nHealth,
                pulseOffset: pseudoRandom(gx, gy, layer * 11 + 6) * Math.PI * 2,
                size: nSize,
                brightness: nBrightness,
                z: Z_VALUES[layer] + (pseudoRandom(gx, gy, layer * 11 + 7) - 0.5) * 0.08,
                vibrateTime: 0,
                opacity: 0, // Starts completely transparent to fade-in elegantly
                isClusterMember: false,
                clusterPulseIntensity: 0,
                sparkCooldown: 0
              });
            }
          }
        }
      }

      // Pruning / Fading out of elements leaving viewport
      activeNodes.forEach((node, key) => {
        if (!visibleKeys.has(key)) {
          // Slowly dissolve nodes fading out of bounds
          node.opacity -= dt * 1.8;
          if (node.opacity <= 0) {
            activeNodes.delete(key);
          }
        } else {
          // Seamless fade-in of newly spawned procedural geometry
          node.opacity = Math.min(1.0, node.opacity + dt * 1.5);
        }
      });

      // --- 3. COMPUTATIONAL CLUSTERS (Dynamic Brain Thinking Regions) ---
      // Periodically allocate a thinking cluster near the current camera coordinates
      if (frameCount % 360 === 0 && clusters.length < (isScanning ? 3 : isEmergency ? 2 : 1) && !isReducedMotion) {
        const clX = camVirtualX.current + 180 + Math.random() * (W - 360);
        const clY = camVirtualY.current + 180 + Math.random() * (H - 360);
        const clRadius = 160 + Math.random() * 120;
        const clMaxLife = 4.5 + Math.random() * 3.5;

        // Custom calculations calculations pool
        const calculationsTexts = [
          "SEC_CORE_SYNC: 99.8%", "0x5E8A >> 3", "PRED_ANOM_LOCK", "TENSOR_REFL_OK",
          "IPS_SHIELD: STABLE", "SYS_INTEG_OK", "VAL_CORRELATION: 0.993", "MATRIX_REORG: BUSY"
        ];
        
        const calcCount = 3 + Math.floor(Math.random() * 4);
        const calculations = [];
        for (let c = 0; c < calcCount; c++) {
          calculations.push({
            text: calculationsTexts[Math.floor(Math.random() * calculationsTexts.length)],
            xOffset: (Math.random() - 0.5) * 70,
            yOffset: (Math.random() - 0.5) * 70,
            speedY: 15 + Math.random() * 20,
            opacity: 0,
            progress: 0
          });
        }

        clusters.push({
          id: `cluster_${now}`,
          x: clX,
          y: clY,
          radius: clRadius,
          life: 0,
          maxLife: clMaxLife,
          intensity: 0,
          calculations
        });

        // Trigger chime cue
        playCrystallineChime();
      }

      // Update active clusters
      clusters.forEach((cluster, idx) => {
        cluster.life += dt / cluster.maxLife;
        cluster.intensity = Math.sin(cluster.life * Math.PI); // Parabolic fade in/out intensity

        // Update calculations inside cluster
        cluster.calculations.forEach((calc) => {
          calc.progress += dt;
          calc.yOffset -= calc.speedY * dt;
          calc.opacity = Math.sin((calc.progress / cluster.maxLife) * Math.PI) * cluster.intensity * 0.85;
        });

        if (cluster.life >= 1.0) {
          clusters.splice(idx, 1);
        }
      });

      // Map cluster memberships and boost brightness/pulses
      activeNodes.forEach((node) => {
        node.isClusterMember = false;
        node.clusterPulseIntensity = 0;

        clusters.forEach((cluster) => {
          const dx = node.x - cluster.x;
          const dy = node.y - cluster.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < cluster.radius) {
            node.isClusterMember = true;
            node.clusterPulseIntensity = Math.max(node.clusterPulseIntensity, cluster.intensity);
            // Boost node brightness
            node.brightness = Math.min(1.5, node.brightness + cluster.intensity * 0.05);
          }
        });
      });

      // Node local decay and structural tension wiggles
      activeNodes.forEach((node) => {
        if (!isReducedMotion) {
          // Slow degradation over time to trigger Engineer repairs
          if (frameCount % 45 === 0 && pseudoRandom(node.gx, node.gy, 44) < 0.08) {
            node.health = Math.max(0.18, node.health - 0.12);
          }

          if (node.vibrateTime > 0) {
            node.vibrateTime -= dt;
            node.x += Math.sin(now * 0.15) * 1.6;
            node.y += Math.cos(now * 0.15) * 1.6;
          }
        }
      });


      // =========================================================================
      // RENDERING BACKGROUND LAYERS (Parallax and depth adjusted)
      // =========================================================================

      // --- LAYER 02: GRID SYSTEM (Dotted cybernetic engineering coordinate plane) ---
      ctx.lineWidth = 0.55;
      ctx.strokeStyle = isHighContrast ? "rgba(255, 255, 255, 0.045)" : "rgba(120, 120, 130, 0.015)";
      ctx.save();
      // Moving coordinate grid offsets at deep parallax scale
      ctx.translate((camVirtualX.current * -0.3) % 90, (camVirtualY.current * -0.3) % 90);
      ctx.setLineDash([2, 12]);
      for (let x = -100; x < W + 100; x += 90) {
        ctx.beginPath();
        ctx.moveTo(x, -100);
        ctx.lineTo(x, H + 100);
        ctx.stroke();
      }
      for (let y = -100; y < H + 100; y += 90) {
        ctx.beginPath();
        ctx.moveTo(-100, y);
        ctx.lineTo(W + 100, y);
        ctx.stroke();
      }
      ctx.restore();

      // --- LAYER 03: VOLUMETRIC ATMOSPHERIC CORED FOG (Gaseous Nebulae) ---
      if (!isHighContrast && !isReducedMotion) {
        ctx.save();
        for (let f = 0; f < 3; f++) {
          const fogTime = now * 0.00012 + f * Math.PI * 0.6;
          // Float volumetric cores inside viewable coordinate window
          const fx = W / 2 + Math.sin(fogTime * 0.7) * (W * 0.25);
          const fy = H / 2 + Math.cos(fogTime) * (H * 0.22);
          const fogRad = 280 + Math.sin(fogTime * 1.6) * 70;

          const fogGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, fogRad);
          const activeOpacity = isScanning ? 0.038 : isEmergency ? 0.055 : 0.015;

          fogGrad.addColorStop(0, `rgba(${colors.fog}, ${activeOpacity})`);
          fogGrad.addColorStop(0.5, `rgba(${colors.fog}, ${activeOpacity * 0.35})`);
          fogGrad.addColorStop(1, "rgba(9, 9, 9, 0)");

          ctx.fillStyle = fogGrad;
          ctx.beginPath();
          ctx.arc(fx, fy, fogRad, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // --- LAYER 04: SHIFTING VOLUMETRIC LIGHTING BEAMS ---
      if (!isHighContrast && !isReducedMotion) {
        ctx.save();
        beams.forEach((b) => {
          b.angle += b.speed * dt * speedMult;
          // Soft bounce swing limits
          if (b.angle > Math.PI * 0.45 || b.angle < Math.PI * 0.06) {
            b.speed *= -1;
          }

          // Render light ray using gradient
          const endX = b.x + Math.cos(b.angle) * b.length;
          const endY = Math.sin(b.angle) * b.length;

          const beamGrad = ctx.createLinearGradient(b.x, -50, endX, endY);
          beamGrad.addColorStop(0, colors.lightBeam);
          beamGrad.addColorStop(0.4, `rgba(${colors.fog}, ${b.intensity * 0.3 * (isEmergency ? 2.0 : 1.0)})`);
          beamGrad.addColorStop(1, "rgba(9, 9, 9, 0)");

          ctx.fillStyle = beamGrad;
          ctx.beginPath();
          ctx.moveTo(b.x - b.width / 2, -50);
          ctx.lineTo(b.x + b.width / 2, -50);
          ctx.lineTo(endX + b.width * 1.5, endY);
          ctx.lineTo(endX - b.width * 1.5, endY);
          ctx.closePath();
          ctx.fill();
        });
        ctx.restore();
      }

      // --- LAYER 05 & 06: DYNAMIC PROCEDURAL WEBBING (Rendered Layer by Layer) ---
      for (let layer = 0; layer < layerCount; layer++) {
        ctx.save();
        
        // Render Webbing connections first
        activeNodes.forEach((node) => {
          if (node.layer !== layer) return;

          // Spatial local position on screen
          const screenX = node.x - camVirtualX.current;
          const screenY = node.y - camVirtualY.current;

          // Search adjacent grid cells for neighboring active nodes
          const cSize = CELL_SIZES[layer];
          const maxDist = MAX_CONN_DISTS[layer];

          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              // Unilateral connection search checks to completely omit duplicate drawing
              if (dx < 0 || (dx === 0 && dy <= 0)) continue;

              const targetGx = node.gx + dx;
              const targetGy = node.gy + dy;
              const targetKey = `${targetGx}_${targetGy}_${layer}`;

              const target = activeNodes.get(targetKey);
              if (target && target.opacity > 0.05) {
                const targetX = target.x - camVirtualX.current;
                const targetY = target.y - camVirtualY.current;

                const distance = Math.sqrt((screenX - targetX) ** 2 + (screenY - targetY) ** 2);
                if (distance < maxDist) {
                  const avgHealth = (node.health + target.health) / 2;
                  const avgOpacity = (node.opacity + target.opacity) / 2;
                  const distanceFactor = 1.0 - distance / maxDist;

                  // Connection strand thickness & alpha scales with average nodes strength
                  let strandAlpha = avgOpacity * distanceFactor * (0.05 + (node.brightness + target.brightness) * 0.12);
                  if (isScanning) strandAlpha *= 1.6;
                  if (isEmergency) strandAlpha *= 2.2;

                  ctx.strokeStyle = isHighContrast
                    ? `rgba(255, 255, 255, ${Math.min(0.8, strandAlpha)})`
                    : node.health < 0.45 || target.health < 0.45
                      ? `rgba(239, 68, 68, ${Math.min(0.65, strandAlpha * 2.5)})` // Glowing warning threat links
                      : `rgba(${colors.fog}, ${Math.min(0.55, strandAlpha)})`;

                  ctx.lineWidth = (0.55 + (1.0 - avgHealth) * 0.95) * (0.5 + layer * 0.5);

                  // Elastic strand flex dynamics
                  let controlX = (screenX + targetX) / 2;
                  let controlY = (screenY + targetY) / 2;
                  let isFlexed = false;

                  if (mouse.isOver && !isReducedMotion && layer >= 2) {
                    const mDist = Math.sqrt((controlX - mouse.x) ** 2 + (controlY - mouse.y) ** 2);
                    if (mDist < 120) {
                      const flexStrength = (120 - mDist) * 0.32;
                      const pullX = (mouse.x - controlX) / mDist;
                      const pullY = (mouse.y - controlY) / mDist;

                      controlX += pullX * flexStrength;
                      controlY += pullY * flexStrength;
                      isFlexed = true;
                    }
                  }

                  applyDepthOfFieldBlur(node.z);
                  ctx.beginPath();
                  ctx.moveTo(screenX, screenY);
                  if (isFlexed) {
                    ctx.quadraticCurveTo(controlX, controlY, targetX, targetY);
                  } else {
                    ctx.lineTo(targetX, targetY);
                  }
                  ctx.stroke();

                  // Procedurally spawn micro pulses along links
                  if (frameCount % 45 === 0 && Math.random() < (isScanning ? 0.14 : isEmergency ? 0.22 : 0.035) && !isReducedMotion) {
                    pulseIdCounter++;
                    energyPulses.push({
                      id: pulseIdCounter,
                      fromId: node.id,
                      toId: target.id,
                      progress: 0,
                      speed: (1.1 + Math.random() * 1.4) * speedMult,
                      size: isEmergency ? 3.2 : 2.0,
                      color: node.health < 0.45 ? "#EF233C" : colors.energyPulse,
                      type: isEmergency ? "emergency" : isScanning ? "prediction" : "monitoring",
                      splitCount: 0
                    });
                  }
                }
              }
            }
          }
        });

        // Render Web Nodes
        activeNodes.forEach((node) => {
          if (node.layer !== layer) return;

          const screenX = node.x - camVirtualX.current;
          const screenY = node.y - camVirtualY.current;

          // Handle node brightness decay breathing
          if (node.brightness > 0.4) {
            node.brightness -= dt * 0.32;
          } else {
            node.brightness = 0.35 + Math.sin(now * 0.0025 + node.pulseOffset) * 0.15;
          }

          if (node.isClusterMember) {
            // Unison flash lock with cluster timing
            node.brightness = Math.max(node.brightness, 0.4 + node.clusterPulseIntensity * 0.85);
          }

          const baseAlpha = node.opacity * (0.16 + node.brightness * 0.45);
          applyDepthOfFieldBlur(node.z);

          // Customize visual outline matching health integrity states
          if (node.health < 0.48) {
            // Warn active emergency crimson
            ctx.fillStyle = `rgba(239, 68, 68, ${baseAlpha * 1.8})`;
          } else if (node.isClusterMember) {
            // Bright white synchronizing plasma overlay
            ctx.fillStyle = `rgba(255, 255, 255, ${baseAlpha * 1.5})`;
          } else {
            ctx.fillStyle = isHighContrast ? `rgba(255, 255, 255, ${baseAlpha * 1.5})` : `rgba(${colors.fog}, ${baseAlpha})`;
          }

          const visualSize = node.size * (0.5 + node.z * 0.5);

          ctx.beginPath();
          ctx.arc(screenX, screenY, visualSize, 0, Math.PI * 2);
          ctx.fill();

          // High Threat alert rings around unstable nodes
          if (node.health < 0.48 && frameCount % 50 < 20 && !isReducedMotion) {
            ctx.strokeStyle = "rgba(239, 68, 68, 0.6)";
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.arc(screenX, screenY, visualSize * 2.5, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Shimmering micro reflections
          if (layer >= 2 && Math.random() < 0.0005 && !isReducedMotion) {
            generateSparks(screenX, screenY, "#FFFFFF", 2);
            playAmbientSpark(1200);
          }
        });

        ctx.restore();
      }
      resetFilter();

      // --- LAYER 07: PROCEDURAL LIVING DATA PULSES ---
      ctx.save();
      energyPulses.forEach((pulse, pIdx) => {
        pulse.progress += pulse.speed * dt;

        const from = activeNodes.get(pulse.fromId);
        const to = activeNodes.get(pulse.toId);

        if (!from || !to || pulse.progress >= 1.0) {
          // Arrived! Flash destination node brightness
          if (to) {
            to.brightness = Math.min(1.6, to.brightness + 0.32);

            // Cascade split behavior at pathways junctions
            if (pulse.splitCount < 2 && Math.random() < 0.28 && !isReducedMotion) {
              const cSize = CELL_SIZES[to.layer];
              let count = 0;
              // Seek adjacent connections
              for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                  if (dx === 0 && dy === 0) continue;
                  const key = `${to.gx + dx}_${to.gy + dy}_${to.layer}`;
                  const neighbor = activeNodes.get(key);
                  if (neighbor && neighbor.id !== pulse.fromId && count < 2) {
                    pulseIdCounter++;
                    energyPulses.push({
                      id: pulseIdCounter,
                      fromId: to.id,
                      toId: neighbor.id,
                      progress: 0,
                      speed: pulse.speed * (0.8 + Math.random() * 0.4),
                      size: pulse.size,
                      color: pulse.color,
                      type: pulse.type,
                      splitCount: pulse.splitCount + 1
                    });
                    count++;
                  }
                }
              }
            }
          }
          energyPulses.splice(pIdx, 1);
          return;
        }

        const fromX = from.x - camVirtualX.current;
        const fromY = from.y - camVirtualY.current;
        const toX = to.x - camVirtualX.current;
        const toY = to.y - camVirtualY.current;

        const px = fromX + (toX - fromX) * pulse.progress;
        const py = fromY + (toY - fromY) * pulse.progress;

        applyDepthOfFieldBlur(from.z);
        
        ctx.fillStyle = pulse.color;
        if (!isHighContrast) {
          ctx.shadowBlur = pulse.type === "emergency" ? 14 : pulse.type === "successful_validation" ? 10 : 6;
          ctx.shadowColor = pulse.color;
        }

        ctx.beginPath();
        ctx.arc(px, py, pulse.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.restore();
      resetFilter();

      // --- LAYER 08: Spark Entities ---
      ctx.save();
      sparks.forEach((spark, sIdx) => {
        spark.life++;
        spark.x += spark.vx;
        spark.y += spark.vy;

        const fade = 1.0 - spark.life / spark.maxLife;
        ctx.fillStyle = spark.color;
        ctx.globalAlpha = fade;
        ctx.fillRect(spark.x, spark.y, spark.size, spark.size);

        if (spark.life >= spark.maxLife) {
          sparks.splice(sIdx, 1);
        }
      });
      ctx.globalAlpha = 1.0;
      ctx.restore();

      // --- LAYER 09: CLUSTERS HOLOGRAPHIC CALCULATIONS ---
      ctx.save();
      clusters.forEach((cluster) => {
        cluster.calculations.forEach((calc) => {
          if (calc.opacity <= 0.05) return;

          const screenX = cluster.x + calc.xOffset - camVirtualX.current;
          const screenY = cluster.y + calc.yOffset - camVirtualY.current;

          ctx.font = "600 9px monospace";
          ctx.fillStyle = isHighContrast ? `rgba(255, 255, 255, ${calc.opacity})` : `rgba(${colors.fog}, ${calc.opacity})`;
          ctx.fillText(calc.text, screenX, screenY);
        });
      });
      ctx.restore();

      // --- LAYER 10: AI DRONES (Constrained to camera bounds so they remain visible) ---
      drones.forEach((drone) => {
        if (isReducedMotion) {
          const droneScreenX = drone.x - camVirtualX.current;
          const droneScreenY = drone.y - camVirtualY.current;
          const idealAngle = Math.atan2(H / 2 - droneScreenY, W / 2 - droneScreenX);
          drone.angle += (idealAngle - drone.angle) * 0.1;
          return;
        }

        // --- Viewport coordinate constraint engine ---
        // Gently redirect drones towards viewport bounds if drifting too far off
        const margin = 120;
        const vLeft = camVirtualX.current + margin;
        const vRight = camVirtualX.current + W - margin;
        const vTop = camVirtualY.current + margin;
        const vBottom = camVirtualY.current + H - margin;

        let outOfBounds = false;
        if (drone.x < vLeft) { drone.targetX = vLeft + 150; outOfBounds = true; }
        else if (drone.x > vRight) { drone.targetX = vRight - 150; outOfBounds = true; }

        if (drone.y < vTop) { drone.targetY = vTop + 150; outOfBounds = true; }
        else if (drone.y > vBottom) { drone.targetY = vBottom - 150; outOfBounds = true; }

        if (outOfBounds && drone.state !== "out_of_bounds_recovery") {
          drone.state = "out_of_bounds_recovery";
          drone.stateTimer = 3.5;
        }

        // --- Interactive Cursor Reaction Acknowledgment ---
        const distToCursor = Math.sqrt((drone.x - camVirtualX.current - mouse.x) ** 2 + (drone.y - camVirtualY.current - mouse.y) ** 2);
        if (distToCursor < 140 && !drone.isAcknowledging) {
          drone.isAcknowledging = true;
          drone.previousState = drone.state;
          drone.state = "acknowledge_cursor";
          drone.stateTimer = 1.8;
          drone.vx = 0;
          drone.vy = 0;
          playAmbientServo(440, 780, 0.28);
        }

        drone.stateTimer -= dt;

        if (drone.state === "acknowledge_cursor") {
          // Lock optic sensors & chassis direction directly on user cursor
          const angleToCursor = Math.atan2(camVirtualY.current + mouse.y - drone.y, camVirtualX.current + mouse.x - drone.x);
          let diff = angleToCursor - drone.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          drone.angle += diff * 0.12;

          if (Math.random() < 0.06) {
            generateSparks(drone.x - camVirtualX.current, drone.y - camVirtualY.current, "#00FFFF", 2);
            playAmbientSpark(850);
          }

          if (drone.stateTimer <= 0 || distToCursor > 180) {
            drone.isAcknowledging = false;
            drone.state = drone.previousState;
            drone.stateTimer = 2.0;
            playAmbientServo(650, 350, 0.2);
          }
        } else {
          // --- STANDARD PROCEDURAL AI STATE ROUTINES ---

          // 1. GUARDIAN BEHAVIOR (Crimson Laser Sweeper)
          if (drone.type === "guardian") {
            // Seek active cluster if any exists
            const activeCluster = clusters[0];
            if (activeCluster && drone.state !== "guarding_cluster") {
              drone.state = "guarding_cluster";
              drone.targetX = activeCluster.x + (Math.random() - 0.5) * 80;
              drone.targetY = activeCluster.y + (Math.random() - 0.5) * 80;
              drone.stateTimer = activeCluster.maxLife;
            }

            if (drone.state === "patrol" || drone.state === "out_of_bounds_recovery") {
              const dx = drone.targetX - drone.x;
              const dy = drone.targetY - drone.y;
              const d = Math.sqrt(dx * dx + dy * dy);

              if (d > 15) {
                drone.vx = (dx / d) * drone.speed * 60 * dt * speedMult;
                drone.vy = (dy / d) * drone.speed * 60 * dt * speedMult;
                drone.angle = Math.atan2(dy, dx);
              } else {
                // Arrived: swap patrol target coordinates
                drone.vx = 0;
                drone.vy = 0;
                drone.state = "radar_sweep";
                drone.stateTimer = 2.4;
                playAmbientServo(480, 220, 0.45);
              }

              if (drone.stateTimer <= 0 && drone.state === "patrol") {
                // Change location
                drone.targetX = camVirtualX.current + 150 + Math.random() * (W - 300);
                drone.targetY = camVirtualY.current + 150 + Math.random() * (H - 300);
                drone.stateTimer = 7.0 + Math.random() * 4.0;
              }
            } else if (drone.state === "radar_sweep") {
              // Oscillate wide laser sensor
              drone.scanAngle = Math.sin(now * 0.004) * (Math.PI * 0.28);
              if (frameCount % 24 === 0) playAmbientSpark(340);

              if (drone.stateTimer <= 0) {
                drone.state = "patrol";
                drone.targetX = camVirtualX.current + 150 + Math.random() * (W - 300);
                drone.targetY = camVirtualY.current + 150 + Math.random() * (H - 300);
                drone.stateTimer = 5.0 + Math.random() * 5.0;
                playAmbientServo(200, 420, 0.25);
              }
            } else if (drone.state === "guarding_cluster") {
              // Orbit cluster center
              const cl = clusters[0];
              if (!cl) {
                drone.state = "patrol";
                drone.stateTimer = 1.0;
                return;
              }

              const orbitAngle = (now * 0.0003) % (Math.PI * 2);
              drone.targetX = cl.x + Math.cos(orbitAngle) * 90;
              drone.targetY = cl.y + Math.sin(orbitAngle) * 90;

              const dx = drone.targetX - drone.x;
              const dy = drone.targetY - drone.y;
              const d = Math.sqrt(dx * dx + dy * dy);

              if (d > 15) {
                drone.vx = (dx / d) * drone.speed * 60 * dt * speedMult;
                drone.vy = (dy / d) * drone.speed * 60 * dt * speedMult;
                drone.angle = Math.atan2(dy, dx);
              } else {
                drone.vx = 0;
                drone.vy = 0;
                drone.angle = Math.atan2(cl.y - drone.y, cl.x - drone.x);
              }
            }
          }

          // 2. ENGINEER BEHAVIOR (Amber Shield Welder)
          if (drone.type === "engineer") {
            drone.sparkCooldown = Math.max(0, drone.sparkCooldown - dt);

            if (drone.state === "idle" || drone.state === "out_of_bounds_recovery") {
              drone.vx = 0;
              drone.vy = 0;

              if (drone.stateTimer <= 0) {
                // Seek out poorly nodes with lowest health
                let poorNodeKey: string | null = null;
                let lowestHealth = 0.95;

                activeNodes.forEach((node, key) => {
                  // Only repair layers 2 and 3 so the repair action stays visibly sharp and clear
                  if (node.layer >= 2 && node.health < lowestHealth) {
                    lowestHealth = node.health;
                    poorNodeKey = key;
                  }
                });

                if (poorNodeKey) {
                  drone.repairTargetNodeId = poorNodeKey;
                  drone.state = "routing_to_repair";
                  drone.stateTimer = 9.0;
                  playAmbientServo(300, 680, 0.45);
                } else {
                  drone.stateTimer = 2.0 + Math.random() * 3.0;
                }
              }
            } else if (drone.state === "routing_to_repair") {
              const rNode = activeNodes.get(drone.repairTargetNodeId || "");
              if (!rNode || rNode.health >= 0.98) {
                drone.state = "idle";
                drone.stateTimer = 1.0;
                drone.repairTargetNodeId = null;
                return;
              }

              drone.targetX = rNode.x;
              drone.targetY = rNode.y;

              const dx = drone.targetX - drone.x;
              const dy = drone.targetY - drone.y;
              const d = Math.sqrt(dx * dx + dy * dy);

              if (d > 20) {
                drone.vx = (dx / d) * drone.speed * 60 * dt * speedMult;
                drone.vy = (dy / d) * drone.speed * 60 * dt * speedMult;
                drone.angle = Math.atan2(dy, dx);
              } else {
                // Arrived: start crackling welder sparks onto node
                drone.vx = 0;
                drone.vy = 0;
                drone.state = "welding";
                drone.stateTimer = 3.0;
              }
            } else if (drone.state === "welding") {
              const rNode = activeNodes.get(drone.repairTargetNodeId || "");
              if (!rNode) {
                drone.state = "idle";
                drone.stateTimer = 1.0;
                return;
              }

              if (drone.sparkCooldown <= 0) {
                generateSparks(drone.x - camVirtualX.current, drone.y - camVirtualY.current, colors.energyPulse, 4);
                playAmbientSpark(520 + Math.random() * 450);
                drone.sparkCooldown = 0.08 + Math.random() * 0.12;
              }

              // Crackle back health integrity
              rNode.health = Math.min(1.0, rNode.health + dt * 0.35);

              if (drone.stateTimer <= 0 || rNode.health >= 1.0) {
                rNode.health = 1.0;
                generateSparks(rNode.x - camVirtualX.current, rNode.y - camVirtualY.current, "#FFFFFF", 8);
                drone.state = "idle";
                drone.stateTimer = 2.0 + Math.random() * 2.0;
                drone.repairTargetNodeId = null;
              }
            }
          }

          // 3. SCOUT BEHAVIOR (Cyan High-Speed Pathway Crawler)
          if (drone.type === "scout") {
            if (drone.state === "crawl_seeking" || drone.state === "out_of_bounds_recovery") {
              drone.vx = 0;
              drone.vy = 0;

              // Find closest active node in layer 2 (Middle) to attach to
              let nearestKey: string | null = null;
              let minDist = 350;

              activeNodes.forEach((node, key) => {
                if (node.layer === 2) {
                  const dist = Math.sqrt((node.x - drone.x) ** 2 + (node.y - drone.y) ** 2);
                  if (dist < minDist) {
                    minDist = dist;
                    nearestKey = key;
                  }
                }
              });

              if (nearestKey) {
                drone.scoutCurrentNodeId = nearestKey;
                const nodeObj = activeNodes.get(nearestKey);
                if (nodeObj) {
                  drone.targetX = nodeObj.x;
                  drone.targetY = nodeObj.y;
                  drone.state = "crawling_to_anchor";
                  drone.stateTimer = 5.0;
                }
              } else {
                // Wander
                drone.targetX = camVirtualX.current + W / 2;
                drone.targetY = camVirtualY.current + H / 2;
                drone.stateTimer = 1.0;
              }
            } else if (drone.state === "crawling_to_anchor") {
              const anchor = activeNodes.get(drone.scoutCurrentNodeId || "");
              if (!anchor) {
                drone.state = "crawl_seeking";
                return;
              }

              const dx = anchor.x - drone.x;
              const dy = anchor.y - drone.y;
              const d = Math.sqrt(dx * dx + dy * dy);

              if (d > 10) {
                drone.vx = (dx / d) * drone.speed * 60 * dt * speedMult;
                drone.vy = (dy / d) * drone.speed * 60 * dt * speedMult;
                drone.angle = Math.atan2(dy, dx);
              } else {
                // Attached! Seek connected strand neighbor
                drone.vx = 0;
                drone.vy = 0;
                drone.state = "crawling_strand";
                drone.scoutProgress = 0;

                // Pick adjacent connected cell deterministically
                let nextKey: string | null = null;
                const cSize = CELL_SIZES[anchor.layer];

                // Check 8-neighborhood for active connections
                const candidates: string[] = [];
                for (let idxX = -1; idxX <= 1; idxX++) {
                  for (let idxY = -1; idxY <= 1; idxY++) {
                    if (idxX === 0 && idxY === 0) continue;
                    const keyStr = `${anchor.gx + idxX}_${anchor.gy + idxY}_${anchor.layer}`;
                    if (activeNodes.has(keyStr)) candidates.push(keyStr);
                  }
                }

                if (candidates.length > 0) {
                  nextKey = candidates[Math.floor(Math.random() * candidates.length)];
                  drone.scoutNextNodeId = nextKey;
                } else {
                  drone.state = "crawl_seeking";
                }
              }
            } else if (drone.state === "crawling_strand") {
              const startNode = activeNodes.get(drone.scoutCurrentNodeId || "");
              const endNode = activeNodes.get(drone.scoutNextNodeId || "");

              if (!startNode || !endNode) {
                drone.state = "crawl_seeking";
                return;
              }

              // Advance along link coordinate path
              drone.scoutProgress += drone.speed * 0.05 * 60 * dt * speedMult;

              if (drone.scoutProgress >= 1.0) {
                drone.x = endNode.x;
                drone.y = endNode.y;
                drone.scoutCurrentNodeId = drone.scoutNextNodeId;
                drone.scoutNextNodeId = null;
                drone.state = "scout_diagnostic_ping";
                drone.stateTimer = 0.8;
                playAmbientServo(500, 850, 0.2);
              } else {
                const prog = drone.scoutProgress;
                drone.x = startNode.x + (endNode.x - startNode.x) * prog;
                drone.y = startNode.y + (endNode.y - startNode.y) * prog;
                drone.angle = Math.atan2(endNode.y - startNode.y, endNode.x - startNode.x);
              }
            } else if (drone.state === "scout_diagnostic_ping") {
              // Diagnostic flash ping: fires telemetry pulses
              if (frameCount % 15 === 0) {
                const nodeObj = activeNodes.get(drone.scoutCurrentNodeId || "");
                if (nodeObj) {
                  // Fire rapid pulses along connections
                  const cSize = CELL_SIZES[nodeObj.layer];
                  for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                      if (dx === 0 && dy === 0) continue;
                      const neighborKey = `${nodeObj.gx + dx}_${nodeObj.gy + dy}_${nodeObj.layer}`;
                      if (activeNodes.has(neighborKey)) {
                        pulseIdCounter++;
                        energyPulses.push({
                          id: pulseIdCounter,
                          fromId: nodeObj.id,
                          toId: neighborKey,
                          progress: 0,
                          speed: 2.2 * speedMult,
                          size: 2.0,
                          color: colors.droneScout,
                          type: "successful_validation",
                          splitCount: 1
                        });
                      }
                    }
                  }
                  playAmbientSpark(950);
                }
              }

              if (drone.stateTimer <= 0) {
                // Resume crawl loop
                drone.state = "crawl_seeking";
              }
            }
          }
        }

        // Apply physics moves to coordinate variables
        drone.x += drone.vx;
        drone.y += drone.vy;

        // Inverse Kinematics Gait Cycle solver for 8 jointed legs
        const walkSpeed = Math.sqrt(drone.vx * drone.vx + drone.vy * drone.vy);
        const isMoving = walkSpeed > 0.05 || drone.state === "crawling_strand";
        const stepRate = drone.type === "scout" ? 0.22 : 0.16;

        drone.legs.forEach((leg, idx) => {
          const lateralAngles = [-0.6, -0.22, 0.22, 0.6];
          const isLeft = leg.side === "left";
          const sideOffset = isLeft ? -Math.PI / 2 : Math.PI / 2;

          // Idealrest footprint positions
          const stepAngle = drone.angle + sideOffset + lateralAngles[leg.index];
          const idealReach = drone.bodyRadius * 2.75;

          const restX = drone.x + Math.cos(stepAngle) * idealReach;
          const restY = drone.y + Math.sin(stepAngle) * idealReach;

          if (leg.isStepping) {
            leg.stepProgress += stepRate * 60 * dt * speedMult;
            if (leg.stepProgress >= 1.0) {
              leg.footX = leg.stepTargetX;
              leg.footY = leg.stepTargetY;
              leg.isStepping = false;
            } else {
              const t = leg.stepProgress;
              // Parabolic step lift height trajectory
              const lift = Math.sin(t * Math.PI) * (drone.bodyRadius * 0.95);
              leg.footX = leg.stepStartX + (leg.stepTargetX - leg.stepStartX) * t;
              leg.footY = leg.stepStartY + (leg.stepTargetY - leg.stepStartY) * t - lift;
            }
          } else {
            const distFromTarget = Math.sqrt((restX - leg.footX) ** 2 + (restY - leg.footY) ** 2);
            const steppedCount = drone.legs.filter((l) => l.isStepping).length;
            const groupPair = idx % 2 === 0;

            if (isMoving && distFromTarget > drone.bodyRadius * 1.35 && steppedCount < 3) {
              const groupTrigger = Math.sin(now * 0.015) > 0;
              if (groupTrigger === groupPair) {
                leg.isStepping = true;
                leg.stepProgress = 0;
                leg.stepStartX = leg.footX;
                leg.stepStartY = leg.footY;
                // Step ahead of movement path
                const speedScale = drone.type === "scout" ? 4.0 : 3.0;
                leg.stepTargetX = restX + drone.vx * speedScale;
                leg.stepTargetY = restY + drone.vy * speedScale;
              }
            } else if (!isMoving) {
              // Micro twitching to imply awareness/life
              if (Math.random() < 0.001) {
                leg.isStepping = true;
                leg.stepProgress = 0;
                leg.stepStartX = leg.footX;
                leg.stepStartY = leg.footY;
                leg.stepTargetX = restX + (Math.random() - 0.5) * 5;
                leg.stepTargetY = restY + (Math.random() - 0.5) * 5;
              }
            }
          }
        });
      });

      // --- RENDERING DRONES IN THE PORT ---
      drones.forEach((drone) => {
        // Map screen coordinates
        const screenX = drone.x - camVirtualX.current;
        const screenY = drone.y - camVirtualY.current;

        // Skip rendering if completely off-screen bounds
        if (screenX < -100 || screenX > W + 100 || screenY < -100 || screenY > H + 100) return;

        ctx.save();
        ctx.strokeStyle = drone.color;
        ctx.fillStyle = "rgba(10, 10, 12, 0.96)";
        ctx.lineWidth = 1.3;

        if (!isHighContrast) {
          ctx.shadowBlur = 9;
          ctx.shadowColor = drone.color;
        }

        // --- Render jointed legs with 2D Inverse Kinematics solver ---
        drone.legs.forEach((leg) => {
          const offsets = [-0.65, -0.22, 0.22, 0.65];
          const isLeft = leg.side === "left";
          const sideOffset = isLeft ? -Math.PI / 2 : Math.PI / 2;
          const connAngle = drone.angle + sideOffset + offsets[leg.index];

          // Socket connect point on chassis body
          const connX = screenX + Math.cos(connAngle) * (drone.bodyRadius * 0.65);
          const connY = screenY + Math.sin(connAngle) * (drone.bodyRadius * 0.65);

          // Render foot local coordinates
          const footX = leg.footX - camVirtualX.current;
          const footY = leg.footY - camVirtualY.current;

          // Leg midpoint socket joint hinge (2D Inverse Kinematics)
          const midX = (connX + footX) / 2;
          const midY = (connY + footY) / 2;

          const dx = footX - connX;
          const dy = footY - connY;
          const dLeg = Math.sqrt(dx * dx + dy * dy) || 1.0;

          const perpX = -dy / dLeg;
          const perpY = dx / dLeg;
          const bendDirection = isLeft ? -1 : 1;
          const bendH = drone.bodyRadius * 1.3;

          const kneeX = midX + perpX * bendH * bendDirection;
          const kneeY = midY + perpY * bendH * bendDirection;

          // Draw segments
          ctx.beginPath();
          ctx.moveTo(connX, connY);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(footX, footY);
          ctx.stroke();

          // Joint node pin highlights
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(kneeX, kneeY, 0.8, 0, Math.PI * 2);
          ctx.fill();
        });

        // --- Draw Chassis Shell ---
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(drone.angle + Math.PI / 2);

        ctx.fillStyle = "rgba(10, 10, 12, 0.98)";
        ctx.strokeStyle = drone.color;

        // Abdomen
        ctx.beginPath();
        ctx.ellipse(0, drone.bodyRadius * 1.1, drone.bodyRadius * 0.65, drone.bodyRadius * 0.95, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Technical cyber lines
        ctx.strokeStyle = isHighContrast ? "rgba(255, 255, 255, 0.4)" : `rgba(${colors.fog}, 0.55)`;
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(0, drone.bodyRadius * 1.85);
        ctx.lineTo(0, drone.bodyRadius * 0.25);
        ctx.stroke();

        // Thorax core
        ctx.strokeStyle = drone.color;
        ctx.beginPath();
        ctx.arc(0, drone.bodyRadius * 0.05, drone.bodyRadius * 0.42, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Sensor head panel
        ctx.beginPath();
        ctx.arc(0, -drone.bodyRadius * 0.35, drone.bodyRadius * 0.28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Glowing Ocular optics
        ctx.fillStyle = "#FFFFFF";
        if (drone.isAcknowledging) {
          ctx.fillStyle = "#00FFFF"; // Interactive cyan eye lock
        } else if (drone.type === "guardian" && drone.state === "radar_sweep") {
          ctx.fillStyle = "#EF233C"; // Warning scanning red eye
        } else if (drone.type === "engineer" && drone.state === "welding") {
          ctx.fillStyle = "#F59E0B"; // Flare welding amber eye
        } else if (drone.type === "scout" && drone.state === "scout_diagnostic_ping") {
          ctx.fillStyle = "#06B6D4"; // Pinging cyan eyes
        }

        ctx.beginPath();
        ctx.arc(-drone.bodyRadius * 0.14, -drone.bodyRadius * 0.42, 0.8, 0, Math.PI * 2);
        ctx.arc(drone.bodyRadius * 0.14, -drone.bodyRadius * 0.42, 0.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore(); // Restore local chassis

        // --- Draw Drone State Label (Architectural Detail Overlay) ---
        if (!isReducedMotion) {
          ctx.save();
          ctx.font = "600 7.5px monospace";
          ctx.fillStyle = isHighContrast ? "rgba(255,255,255,0.7)" : `rgba(${colors.fog}, 0.65)`;
          let droneLabelText = "";

          if (drone.type === "guardian") {
            droneLabelText = drone.state === "guarding_cluster" ? "● SEC_GUARD" : drone.state === "radar_sweep" ? "● RAD_SCAN" : "● PATROL";
          } else if (drone.type === "engineer") {
            droneLabelText = drone.state === "welding" ? "⚡ SHIELD_HEAL" : drone.state === "routing_to_repair" ? "✈ ROUTE" : "● IDLE";
          } else if (drone.type === "scout") {
            droneLabelText = drone.state === "scout_diagnostic_ping" ? "⚛ TRAC_PING" : "● NET_MAP";
          }

          if (drone.isAcknowledging) droneLabelText = "◈ CURS_ACK";

          ctx.fillText(droneLabelText, screenX - 25, screenY - drone.bodyRadius * 2.1);
          ctx.restore();
        }

        // --- Render Scanning Laser sweep cone for Guardian ---
        if (drone.type === "guardian" && drone.state === "radar_sweep") {
          ctx.save();
          ctx.translate(screenX, screenY);
          ctx.rotate(drone.angle);

          const radarRange = 170;
          const scanW = Math.PI * 0.22;
          const laserGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, radarRange);
          laserGrad.addColorStop(0, "rgba(239, 35, 60, 0.22)");
          laserGrad.addColorStop(0.5, "rgba(239, 35, 60, 0.08)");
          laserGrad.addColorStop(1, "rgba(9, 9, 12, 0)");

          ctx.fillStyle = laserGrad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, radarRange, -scanW + drone.scanAngle, scanW + drone.scanAngle);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = "rgba(239, 35, 60, 0.35)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(0, 0, radarRange * 0.82, -scanW + drone.scanAngle, scanW + drone.scanAngle);
          ctx.stroke();

          ctx.restore();
        }

        ctx.restore(); // Restore drone global camera translation matrix
        ctx.shadowBlur = 0;
      });

      // --- LAYER 11: PROCEDURAL FOREGROUND DUST SHIMMER ---
      ctx.save();
      ctx.fillStyle = isHighContrast ? "rgba(255, 255, 255, 0.16)" : `rgba(${colors.fog}, 0.25)`;

      dustParticles.forEach((p) => {
        applyDepthOfFieldBlur(p.z);
        p.phase += p.swaySpeed * dt;
        p.y -= p.speed * 60 * dt * speedMult;

        const screenDustX = (p.x + Math.sin(p.phase) * p.swayWidth);

        // Recycles off-screen dust
        if (p.y < -30) {
          p.y = H + 30;
          p.x = Math.random() * W;
        }

        const sizeFactor = p.size * (0.6 + p.z * 1.3);
        ctx.globalAlpha = p.opacity * (speedMult > 1.0 ? 1.6 : 1.0);
        ctx.beginPath();
        ctx.arc(screenDustX, p.y, sizeFactor, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
      resetFilter();
      ctx.restore();

      // --- RENDER DISSOLVING PLASMA REACTOR (Static background core focus) ---
      // Position center node on screen
      const cNodeScreenX = W / 2 + Math.sin(now * 0.0003) * 12;
      const cNodeScreenY = H / 2 + Math.cos(now * 0.0003) * 8;

      ctx.save();
      const reactorRad = 65 * (1.0 + Math.sin(now * 0.0016) * 0.035);

      // Cybernetic shields
      ctx.strokeStyle = isHighContrast ? "rgba(255, 255, 255, 0.05)" : `rgba(${colors.fog}, 0.08)`;
      ctx.lineWidth = 0.75;

      ctx.save();
      ctx.translate(cNodeScreenX, cNodeScreenY);
      ctx.rotate(now * 0.0001);
      ctx.beginPath();
      ctx.arc(0, 0, reactorRad * 1.8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([6, 14]);
      ctx.beginPath();
      ctx.arc(0, 0, reactorRad * 1.45, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Dual counter rotating ring
      ctx.save();
      ctx.translate(cNodeScreenX, cNodeScreenY);
      ctx.rotate(-now * 0.00018);
      ctx.setLineDash([4, 18]);
      ctx.beginPath();
      ctx.arc(0, 0, reactorRad * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Core overlay plasma
      if (!isHighContrast && !isReducedMotion) {
        ctx.save();
        ctx.translate(cNodeScreenX, cNodeScreenY);
        ctx.globalCompositeOperation = "screen";

        const countLobes = 3;
        for (let l = 0; l < countLobes; l++) {
          const lAngle = now * 0.00075 + l * ((Math.PI * 2) / countLobes);
          const lx = Math.cos(lAngle) * 8;
          const ly = Math.sin(lAngle) * 8;
          const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, reactorRad * 1.15);

          grad.addColorStop(0, `rgba(${colors.fog}, 0.085)`);
          grad.addColorStop(0.5, `rgba(${colors.fog}, 0.02)`);
          grad.addColorStop(1, "rgba(9, 9, 12, 0)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(lx, ly, reactorRad * 1.15, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.restore();

      // Restore camera scale translation matrix
      ctx.restore();

    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isScanning, overallThreat, colors, isHighContrast, isReducedMotion]);

  return (
    <canvas
      id="sentinel-ambient-live-wallpaper"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 select-none overflow-hidden"
      style={{ mixBlendMode: isReducedMotion ? "normal" : "screen", opacity: isReducedMotion ? 0.7 : 1 }}
    />
  );
}
