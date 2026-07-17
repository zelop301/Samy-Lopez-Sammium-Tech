import React, { useEffect, useRef, useState, useMemo } from "react";
import { 
  Atom, Shield, CloudRain, Cpu, Radio, Activity, Zap, 
  Database, Flame, Heart, Expand, Shrink, Sparkles, LayoutGrid, Wind, Thermometer, Droplet
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { audioEngine } from "../utils/AudioEngine";
import { getPerformanceProfile } from "../utils/performance";

interface HolographicSpiderCenterpieceProps {
  overallScore: number;
  isScanning: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  atmosphere?: "crimson" | "amber" | "cyan" | "emerald";
  isHighContrast?: boolean;
  isReducedMotion?: boolean;
  isFocusMode?: boolean;
}

interface SpatialNode {
  id: string;
  name: string;
  desc: string;
  status: string;
  color: string;
  icon: React.ReactNode;
  metric: string;
  x: number;
  y: number;
  angle: number;
}

export default function HolographicSpiderCenterpiece({ 
  overallScore, 
  isScanning, 
  isExpanded, 
  onToggleExpand,
  atmosphere = "crimson",
  isHighContrast = false,
  isReducedMotion = false,
  isFocusMode = false
}: HolographicSpiderCenterpieceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNodeIdx, setHoveredNodeIdx] = useState<number | null>(null);
  const hoveredNodeIdxRef = useRef<number | null>(null);
  const [activeWorkspace, setActiveWorkspace] = useState<string | null>(null);

  useEffect(() => {
    hoveredNodeIdxRef.current = hoveredNodeIdx;
  }, [hoveredNodeIdx]);
  const [spiderStatus, setSpiderStatus] = useState<string>("SYSTEM OBSERVING");
  const [clickWave, setClickWave] = useState(false);

  // Active theme color configurations
  const themeColors = useMemo(() => {
    const config = {
      crimson: { primary: "#E63946", secondary: "#C1121F", glow: "rgba(193, 18, 31, 0.6)", glowDim: "rgba(193, 18, 31, 0.15)", laser: "#FF3366" },
      amber: { primary: "#F59E0B", secondary: "#D97706", glow: "rgba(217, 119, 6, 0.6)", glowDim: "rgba(217, 119, 6, 0.15)", laser: "#FB923C" },
      cyan: { primary: "#06B6D4", secondary: "#0891B2", glow: "rgba(8, 145, 178, 0.6)", glowDim: "rgba(8, 145, 178, 0.15)", laser: "#22D3EE" },
      emerald: { primary: "#10B981", secondary: "#059669", glow: "rgba(5, 150, 105, 0.6)", glowDim: "rgba(5, 150, 105, 0.15)", laser: "#34D399" }
    };
    return config[atmosphere];
  }, [atmosphere]);

  // Spatial nodes representing the categories
  const spatialNodes = useMemo<SpatialNode[]>(() => [
    { id: "weather", name: "Weather Grid", desc: "Atmospheric sync", status: "STABLE", color: "text-emerald-400", metric: "31°C / 42%", icon: <CloudRain className="w-3.5 h-3.5" />, x: 0, y: 0, angle: 0 },
    { id: "infra", name: "Infrastructure", desc: "Structural stress", status: "OPTIMAL", color: "text-zinc-300", metric: "24.5 Hz Load", icon: <Database className="w-3.5 h-3.5" />, x: 0, y: 0, angle: 0 },
    { id: "traffic", name: "Transit Systems", desc: "Flow optimization", status: "94% VELOCITY", color: "text-emerald-400", metric: "Grid Clear", icon: <Activity className="w-3.5 h-3.5" />, x: 0, y: 0, angle: 0 },
    { id: "agri", name: "Agriculture", desc: "Soil bio-matrices", status: "STABLE", color: "text-emerald-400", metric: "62% Humidity", icon: <Flame className="w-3.5 h-3.5" />, x: 0, y: 0, angle: 0 },
    { id: "health", name: "Healthcare Load", desc: "Biometric streams", status: "NORMAL", color: "text-emerald-400", metric: "8.1k Active", icon: <Heart className="w-3.5 h-3.5" />, x: 0, y: 0, angle: 0 },
    { id: "energy", name: "Grid Network", desc: "Substation load", status: "88% OPTIMAL", color: "text-amber-400", metric: "4.2 GW Load", icon: <Zap className="w-3.5 h-3.5" />, x: 0, y: 0, angle: 0 },
    { id: "water", name: "Water Supply", desc: "Hydration streams", status: "PURE", color: "text-sky-400", metric: "pH 7.1 stable", icon: <Atom className="w-3.5 h-3.5" />, x: 0, y: 0, angle: 0 },
    { id: "earth", name: "Earth Radar", desc: "Seismic activity", status: "0.2M STANDBY", color: "text-emerald-400", metric: "No fault slip", icon: <Shield className="w-3.5 h-3.5" />, x: 0, y: 0, angle: 0 },
    { id: "emerg", name: "Emergency Dispatch", desc: "First response units", status: "STANDBY", color: "text-zinc-400", metric: "All systems live", icon: <Radio className="w-3.5 h-3.5" />, x: 0, y: 0, angle: 0 },
  ], []);

  // Set positions of spatial nodes in a circle
  useEffect(() => {
    const total = spatialNodes.length;
    spatialNodes.forEach((node, i) => {
      node.angle = (i / total) * Math.PI * 2;
    });
  }, [spatialNodes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const profile = getPerformanceProfile();
    const frameInterval = 1000 / (isReducedMotion ? profile.reducedTargetFps : profile.targetFps);
    let animId = 0;
    let lastRenderTime = 0;
    let pageVisible = !document.hidden;
    let time = 0;

    const handleVisibilityChange = () => {
      pageVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Responsive sizing
    const handleResize = () => {
      canvas.width = containerRef.current?.clientWidth || 600;
      canvas.height = isExpanded ? 580 : 390;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Dynamic state management inside the animation loop
    // Spider position state
    const spiderPos = { x: canvas.width / 2, y: canvas.height / 2, vx: 0, vy: 0 };
    let currentTargetNode: SpatialNode | null = null;
    let weaveProgress = 0; // progress of weaving the web (0 to 1)
    let workspaceGrowth = 0; // growth scale of the procedural architecture (0 to 1)

    // Lightning structures
    interface LightningArc {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      points: { x: number; y: number }[];
      duration: number;
      alpha: number;
    }
    let lightningArcs: LightningArc[] = [];

    // Particle structures
    interface ThoughtParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      speed: number;
      angle: number;
      orbitRad: number;
    }
    const particles: ThoughtParticle[] = [];
    const particleCount = isReducedMotion ? 18 : 55;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speed: 0.01 + Math.random() * 0.02,
        angle: Math.random() * Math.PI * 2,
        orbitRad: 80 + Math.random() * 160
      });
    }

    // Core expansion neural particles emitting outwards from center Core
    interface CoreParticle {
      x: number;
      y: number;
      angle: number;
      speed: number;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
      color: string;
    }
    const coreParticles: CoreParticle[] = [];

    // Floating AI glyphs representation
    interface AiGlyph {
      text: string;
      speed: number;
      angle: number;
      orbitRad: number;
      alpha: number;
      scale: number;
      pulseRate: number;
    }
    const aiGlyphs: AiGlyph[] = [];
    const glyphSymbols = ["Ψ", "Φ", "Ω", "Σ", "λ", "α", "β", "γ", "0", "1", "SYS", "CORE", "SENSE"];
    for (let i = 0; i < (isReducedMotion ? 5 : 9); i++) {
      aiGlyphs.push({
        text: glyphSymbols[i % glyphSymbols.length],
        speed: 0.003 + Math.random() * 0.005,
        angle: Math.random() * Math.PI * 2,
        orbitRad: 30 + Math.random() * 85,
        alpha: 0.2 + Math.random() * 0.5,
        scale: 0.75 + Math.random() * 0.4,
        pulseRate: 0.01 + Math.random() * 0.02
      });
    }

    // Three 3D procedurally animated robotic spider drones that patrol the periphery of the central web
    interface Drone3D {
      id: number;
      angle: number;
      speed: number;
      orbitRad: number;
      tiltX: number;
      tiltY: number;
      state: "patrol" | "scan" | "repair";
      stateTimer: number;
      scanAngle: number;
      laserActive: boolean;
      pulseSync: number;
      legPhase: number;
      color: string;
      size: number;
    }

    const drones3D: Drone3D[] = [
      {
        id: 1,
        angle: 0,
        speed: 0.0028,
        orbitRad: 230, // Patrolling the periphery of the central web
        tiltX: 0.38,
        tiltY: 0.3,
        state: "patrol",
        stateTimer: 160,
        scanAngle: 0,
        laserActive: false,
        pulseSync: 0,
        legPhase: 0,
        color: "#EF4444",
        size: 0.8
      },
      {
        id: 2,
        angle: Math.PI * 0.67,
        speed: -0.0022,
        orbitRad: 250,
        tiltX: -0.28,
        tiltY: 0.48,
        state: "patrol",
        stateTimer: 220,
        scanAngle: 0,
        laserActive: false,
        pulseSync: 0,
        legPhase: 1.5,
        color: "#F59E0B",
        size: 0.95
      },
      {
        id: 3,
        angle: Math.PI * 1.33,
        speed: 0.0025,
        orbitRad: 270,
        tiltX: 0.52,
        tiltY: -0.22,
        state: "patrol",
        stateTimer: 180,
        scanAngle: 0,
        laserActive: false,
        pulseSync: 0,
        legPhase: 3.0,
        color: "#10B981",
        size: 0.75
      }
    ];

    const rotatePoint = (x: number, y: number, z: number, tiltX: number, tiltY: number) => {
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);
      const yAfterX = y * cosX - z * sinX;
      const zAfterX = y * sinX + z * cosX;

      const cosY = Math.cos(tiltY);
      const sinY = Math.sin(tiltY);
      return {
        x: x * cosY + zAfterX * sinY,
        y: yAfterX,
        z: -x * sinY + zAfterX * cosY,
      };
    };

    const renderLoop = (frameTime: number) => {
      animId = requestAnimationFrame(renderLoop);
      if (!pageVisible || frameTime - lastRenderTime < frameInterval) return;
      lastRenderTime = frameTime - ((frameTime - lastRenderTime) % frameInterval);
      time += isReducedMotion ? 0.012 : 0.024;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      ctx.clearRect(0, 0, width, height);

      // Threat impacts:
      // High computation / emergency = chaotic wind, blazing core, red eyes
      const isExtreme = overallScore >= 60;
      const chaosMultiplier = isExtreme ? 4.0 : isScanning ? 2.5 : 1.0;
      const themeColor = themeColors.primary;
      const themeGlow = themeColors.glow;

      // ==========================================
      // 1. BACKGROUND ENVIRONMENT (Neural Wind & Gravity)
      // ==========================================
      // Draw background ambient spatial grids
      ctx.strokeStyle = "rgba(255, 255, 255, 0.01)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw faint volumetric flow field (Neural Wind)
      // Particles slow-orbit when calm, chaotic when high load/emergency
      particles.forEach((p, idx) => {
        if (isExtreme) {
          // Chaos wind: drift toward active risk areas (left and right or bottom)
          const targetDriftX = cx + Math.cos(time * 2 + idx) * 150;
          const targetDriftY = cy + Math.sin(time * 2 + idx) * 150;
          p.x += (targetDriftX - p.x) * 0.02;
          p.y += (targetDriftY - p.y) * 0.02;
          p.vx += (Math.random() - 0.5) * 0.5;
          p.vy += (Math.random() - 0.5) * 0.5;
          p.x += p.vx;
          p.y += p.vy;
        } else {
          // Standard slow orbital gravity
          p.angle += p.speed * (isScanning ? 2.0 : 0.6);
          const currentRad = p.orbitRad + Math.sin(time * 0.5 + idx) * 15;
          p.x = cx + Math.cos(p.angle) * currentRad;
          p.y = cy + Math.sin(p.angle) * currentRad;
        }

        // Boundary wrapping
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Render thought particle
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = p.alpha * (isExtreme ? 0.9 : 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (isExtreme ? 1.5 : 1.0), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // ==========================================
      // 2. THE SENTINEL CORE (Floating Living Object)
      // ==========================================
      // Constant Reconstruction of Geometry: Drawing morphing polygon core (Icosahedron projection)
      const coreRadius = (isExpanded ? 65 : 45) + Math.sin(time * 1.5) * 5;
      const coreX = cx;
      const coreY = cy;

      // 2a. Flowing Multi-Layered Plasma Lobe Orbs (Composite screen rendering)
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const plasmaLobeCount = 4;
      for (let l = 0; l < plasmaLobeCount; l++) {
        const lAngle = time * 0.8 + l * (Math.PI / 2);
        const lobeDist = 12 * Math.sin(time + l) * (isScanning ? 1.5 : 1.0);
        const lx = coreX + Math.cos(lAngle) * lobeDist;
        const ly = coreY + Math.sin(lAngle) * lobeDist;
        const lRad = coreRadius * (0.8 + Math.sin(time * 1.2 + l) * 0.15);

        const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, lRad * 1.6);
        grad.addColorStop(0, l % 2 === 0 ? themeColor : themeColors.secondary);
        grad.addColorStop(0.35, `rgba(${l % 2 === 0 ? "230, 57, 70" : "193, 18, 31"}, 0.22)`);
        grad.addColorStop(1, "rgba(9, 9, 11, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(lx, ly, lRad * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 2b. Accretion Magnetic Discs (Tilted, rotating dash lines)
      ctx.save();
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 1.0;
      ctx.translate(coreX, coreY);
      
      // Disc A
      ctx.save();
      ctx.rotate(0.35);
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.ellipse(0, 0, coreRadius * 1.6, coreRadius * 0.42, time * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Disc B
      ctx.save();
      ctx.rotate(-0.45);
      ctx.setLineDash([4, 16]);
      ctx.beginPath();
      ctx.ellipse(0, 0, coreRadius * 1.3, coreRadius * 0.35, -time * 1.6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      ctx.restore();

      // 2c. Procedural Crystal Projections (Expanding based on threat / computing)
      const crystalCount = 8;
      const confidenceHeight = coreRadius * (0.4 + (overallScore / 130)); // higher score = taller spikes
      ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
      ctx.lineWidth = 1.2;
      for (let c = 0; c < crystalCount; c++) {
        const cAngle = (c / crystalCount) * Math.PI * 2 + time * 0.2;
        const startRad = coreRadius * 0.3;
        const endRad = startRad + confidenceHeight;
        
        const sx = coreX + Math.cos(cAngle) * startRad;
        const sy = coreY + Math.sin(cAngle) * startRad;
        const ex = coreX + Math.cos(cAngle) * endRad;
        const ey = coreY + Math.sin(cAngle) * endRad;

        // Draw crystal shard polygon
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        const tAngle1 = cAngle + 0.14;
        const tAngle2 = cAngle - 0.14;
        ctx.lineTo(coreX + Math.cos(tAngle1) * (endRad - 8), coreY + Math.sin(tAngle1) * (endRad - 8));
        ctx.lineTo(coreX + Math.cos(tAngle2) * (endRad - 8), coreY + Math.sin(tAngle2) * (endRad - 8));
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }

      // 2d. Changing Procedural Mesh Shell (Morphing inner wireframe topology nodes)
      const vertCount = 12;
      const vertices: { x: number; y: number }[] = [];
      for (let v = 0; v < vertCount; v++) {
        const vAngle = (v / vertCount) * Math.PI * 2 + time * 0.5;
        const radiusNoise = 12 * Math.sin(time * 3.5 + v * 4.5) * (isExtreme ? 1.8 : 1.0);
        const rad = coreRadius * 0.7 + radiusNoise;
        vertices.push({
          x: coreX + Math.cos(vAngle) * rad,
          y: coreY + Math.sin(vAngle) * rad
        });
      }

      // Wireframe triangulation lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 0.5;
      for (let a = 0; a < vertCount; a++) {
        for (let b = a + 1; b < vertCount; b++) {
          const distSq = Math.pow(vertices[a].x - vertices[b].x, 2) + Math.pow(vertices[a].y - vertices[b].y, 2);
          if (distSq < Math.pow(coreRadius * 1.35, 2)) {
            ctx.beginPath();
            ctx.moveTo(vertices[a].x, vertices[a].y);
            ctx.lineTo(vertices[b].x, vertices[b].y);
            ctx.stroke();
          }
        }
      }

      // 2e. Concentric Outer Neural Capsule Shell (Complex morphing wireframe cage)
      const outerVertCount = 18;
      const outerVertices: { x: number; y: number }[] = [];
      for (let v = 0; v < outerVertCount; v++) {
        const vAngle = (v / outerVertCount) * Math.PI * 2 - (time * 0.3);
        const pulseNoise = 14 * Math.sin(time * 4.2 + v * 3.1) * (isScanning ? 1.6 : 1.0);
        const rad = coreRadius * 1.2 + pulseNoise;
        outerVertices.push({
          x: coreX + Math.cos(vAngle) * rad,
          y: coreY + Math.sin(vAngle) * rad
        });
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      for (let ov = 0; ov < outerVertCount; ov++) {
        if (ov === 0) ctx.moveTo(outerVertices[ov].x, outerVertices[ov].y);
        else ctx.lineTo(outerVertices[ov].x, outerVertices[ov].y);
      }
      ctx.closePath();
      ctx.stroke();

      // Cross-connect outer vertices with inner vertices for cage depth
      ctx.strokeStyle = `rgba(${atmosphere === "crimson" ? "230, 57, 70" : "217, 119, 6"}, 0.08)`;
      for (let ov = 0; ov < outerVertCount; ov++) {
        const nearestInner = vertices[ov % vertCount];
        ctx.beginPath();
        ctx.moveTo(outerVertices[ov].x, outerVertices[ov].y);
        ctx.lineTo(nearestInner.x, nearestInner.y);
        ctx.stroke();
      }

      // 2f. Emit and Update Core Neural Particles floating outward
      if (Math.random() < (isScanning ? 0.75 : 0.3) && !isReducedMotion) {
        coreParticles.push({
          x: coreX,
          y: coreY,
          angle: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.6,
          size: 0.8 + Math.random() * 1.8,
          alpha: 1.0,
          life: 0,
          maxLife: 50 + Math.random() * 60,
          color: themeColor
        });
      }

      coreParticles.forEach((cp, cpIdx) => {
        cp.life++;
        // Spiral expansion orbit
        cp.angle += 0.015 * chaosMultiplier;
        const dist = cp.speed * cp.life;
        const curX = coreX + Math.cos(cp.angle) * dist;
        const curY = coreY + Math.sin(cp.angle) * dist;
        cp.alpha = 1.0 - (cp.life / cp.maxLife);

        ctx.fillStyle = cp.color;
        ctx.globalAlpha = cp.alpha * 0.75;
        ctx.beginPath();
        ctx.arc(curX, curY, cp.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        if (cp.life >= cp.maxLife) {
          coreParticles.splice(cpIdx, 1);
        }
      });

      // 2f-2. Floating AI glyphs in slow independent orbit/ascent
      aiGlyphs.forEach((g) => {
        g.angle += g.speed * (isScanning ? 2.2 : 1.0);
        const radiusBreath = g.orbitRad + Math.sin(time * 0.8 + g.orbitRad) * 12;
        const gx = coreX + Math.cos(g.angle) * radiusBreath;
        const gy = coreY + Math.sin(g.angle) * radiusBreath;
        const alphaPulse = Math.max(0.1, Math.min(0.85, g.alpha + Math.sin(time * 2.0 + g.orbitRad) * 0.15));

        ctx.save();
        ctx.fillStyle = themeColor;
        ctx.globalAlpha = alphaPulse;
        ctx.font = `bold ${Math.floor(9 * g.scale)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(g.text, gx, gy);
        ctx.restore();
      });

      // 2g. Central blazing reactor nucleus
      ctx.shadowBlur = isHighContrast ? 0 : 25;
      ctx.shadowColor = themeColor;
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(coreX, coreY, coreRadius * 0.38, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // ==========================================
      // 3. SPIDER INTELLIGENCE (Holographic Spider Walks)
      // ==========================================
      // Position Node Coordinates around the canvas center
      const nodeOrbitRad = isExpanded ? 245 : 155;
      spatialNodes.forEach((node, idx) => {
        node.x = cx + Math.cos(node.angle + time * 0.08) * nodeOrbitRad;
        node.y = cy + Math.sin(node.angle + time * 0.08) * nodeOrbitRad;
      });

      // Check current hover or alert state for target positioning
      const hoverNodeIndex = hoveredNodeIdxRef.current;
      const hoverNode = hoverNodeIndex !== null ? spatialNodes[hoverNodeIndex] : null;
      const dangerActiveNode = isExtreme ? spatialNodes[idxOfExtremeNode(overallScore)] : null;
      const targetNode = hoverNode || dangerActiveNode;

      let targetX = cx;
      let targetY = cy;

      if (targetNode) {
        currentTargetNode = targetNode;
        targetX = targetNode.x;
        targetY = targetNode.y;
      } else {
        currentTargetNode = null;
        weaveProgress = 0;
        workspaceGrowth = 0;
      }

      // Spider dynamic velocity crawler steps
      const dx = targetX - spiderPos.x;
      const dy = targetY - spiderPos.y;
      const distToTarget = Math.sqrt(dx * dx + dy * dy);
      const isCrawling = distToTarget > 15;

      if (isCrawling) {
        // Crawling state
        const crawlSpeed = isReducedMotion ? 1.5 : 4.5 * chaosMultiplier;
        spiderPos.vx = (dx / distToTarget) * crawlSpeed;
        spiderPos.vy = (dy / distToTarget) * crawlSpeed;
        spiderPos.x += spiderPos.vx;
        spiderPos.y += spiderPos.vy;
        
        // Walk cycle dynamics
        setSpiderStatus(`CRAWLING TO ${targetNode?.name.toUpperCase()}`);
      } else {
        // Stationary / Weaving
        spiderPos.x = targetX;
        spiderPos.y = targetY;
        spiderPos.vx = 0;
        spiderPos.vy = 0;

        if (currentTargetNode) {
          // Weaving a holographic web
          weaveProgress = Math.min(weaveProgress + (isReducedMotion ? 0.015 : 0.035), 1.0);
          if (weaveProgress >= 0.9) {
            workspaceGrowth = Math.min(workspaceGrowth + 0.03, 1.0);
            setSpiderStatus(`WEB WEAVING COMPLETE - GROWTH INITIALIZED`);
          } else {
            setSpiderStatus(`WEAVING INFORMATION COGNITION WEB`);
          }
        } else {
          setSpiderStatus("SENTINEL CORE COGNITIVE BASELINE STATUS");
        }
      }

      // RENDER THE HOLOGRAPHIC SPIDER (Photon wireframe geometry)
      const spiderAngle = Math.atan2(dy, dx) + Math.PI / 2;
      const scale = 0.55;

      ctx.save();
      ctx.translate(spiderPos.x, spiderPos.y);
      ctx.rotate(isCrawling ? spiderAngle : Math.sin(time * 0.5) * 0.1);

      // Spider visual color based on risk levels and posture
      const spiderColor = isExtreme ? "#FF3366" : isScanning ? "#F59E0B" : themeColors.laser;
      ctx.shadowBlur = isHighContrast ? 0 : 12;
      ctx.shadowColor = spiderColor;
      ctx.strokeStyle = spiderColor;
      ctx.lineWidth = 1.5;

      // Body organic breathing animation
      const breathScale = 1.0 + Math.sin(time * 1.6) * 0.06;
      const abdScaleX = 12 * scale * breathScale;
      const abdScaleY = 20 * scale * (1.0 + Math.cos(time * 0.8) * 0.04);

      // Abdomen
      ctx.fillStyle = "rgba(10, 10, 10, 0.85)";
      ctx.beginPath();
      ctx.ellipse(0, 22 * scale, abdScaleX, abdScaleY, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();

      // Thorax (incorporates subtle breathing)
      ctx.beginPath();
      ctx.arc(0, 2 * scale, 7 * scale * (1.0 + Math.sin(time * 1.6) * 0.03), 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(0, -8 * scale, 4.5 * scale, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();

      // Neural Emitter Eyes (Pulsing sensor eyes)
      const eyeIntensity = isExtreme ? "#FF1E56" : "#FFFFFF";
      ctx.fillStyle = eyeIntensity;
      ctx.beginPath();
      ctx.arc(-2 * scale, -9 * scale, 1 * scale, 0, Math.PI * 2);
      ctx.arc(2 * scale, -9 * scale, 1 * scale, 0, Math.PI * 2);
      ctx.fill();

      // 3a. Interactive Laser Scanning Sweep running down abdomen
      const sweepY = (22 * scale) + Math.sin(time * 3.5) * (17 * scale);
      const sweepWidth = Math.sqrt(1 - Math.pow((sweepY - 22 * scale) / abdScaleY, 2)) * abdScaleX * 1.8;
      if (!isNaN(sweepWidth) && sweepWidth > 0) {
        ctx.save();
        ctx.strokeStyle = isExtreme ? "#FF1E56" : "#FFFFFF";
        ctx.lineWidth = 1.3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = isExtreme ? "#FF1E56" : themeColor;
        ctx.beginPath();
        ctx.moveTo(-sweepWidth / 2, sweepY);
        ctx.lineTo(sweepWidth / 2, sweepY);
        ctx.stroke();
        ctx.restore();
      }

      // 3b. Posterior Silk Thread anchors shooting backward from spinnerets to Center Core or anchors
      if (currentTargetNode) {
        ctx.save();
        ctx.strokeStyle = isExtreme ? "rgba(255, 30, 86, 0.45)" : `rgba(${atmosphere === "crimson" ? "230, 57, 70" : "217, 119, 6"}, 0.35)`;
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(0, 42 * scale); // back spinnerets
        // Quad curve for elegant web tension look
        ctx.quadraticCurveTo(-15, 52 * scale, cx - spiderPos.x, cy - spiderPos.y);
        ctx.stroke();
        ctx.restore();
      }

      // Segmented legs walk-cycle animation with independent probing/twitching wiggles
      const legs = 8;
      
      for (let l = 0; l < legs; l++) {
        const isLeft = l < 4;
        const sideFactor = isLeft ? -1 : 1;
        const indexInSide = l % 4;
        
        // Base leg angle mapping
        const legBaseAngle = (isLeft ? Math.PI : 0) + (indexInSide - 1.5) * 0.45;
        const cycleOffset = indexInSide * (Math.PI / 2);
        const stepFactor = isCrawling 
          ? Math.sin(time * 8.0 + cycleOffset) * 0.45 
          : Math.sin(time * 1.2 + cycleOffset) * 0.08;

        // Probing joint twitch wiggles when stationary
        const twitchOffset = !isCrawling 
          ? Math.sin(time * 12.0 + indexInSide * 4.0) * (0.04 + 0.08 * Math.random()) 
          : 0;

        const targetLegAngle = legBaseAngle + (stepFactor + twitchOffset) * sideFactor;
        
        // Procedural leg joint segmentation (Coxa, Femur, Tibia, Tarsus)
        const joint1_Len = 14 * scale;
        const joint2_Len = 22 * scale;
        const joint3_Len = 16 * scale;

        const joint1_X = Math.cos(targetLegAngle) * joint1_Len;
        const joint1_Y = (2 + indexInSide * 3.5) * scale + Math.sin(targetLegAngle) * joint1_Len;

        const joint2_X = joint1_X + Math.cos(targetLegAngle + 0.65 * sideFactor) * joint2_Len;
        const joint2_Y = joint1_Y + Math.sin(targetLegAngle + 0.65 * sideFactor) * joint2_Len;

        const footX = joint2_X + Math.cos(targetLegAngle - 0.4 * sideFactor) * joint3_Len;
        const footY = joint2_Y + Math.sin(targetLegAngle - 0.4 * sideFactor) * joint3_Len;

        // Draw leg photon ribbons
        ctx.beginPath();
        ctx.moveTo(0, (2 + indexInSide * 3) * scale);
        ctx.lineTo(joint1_X, joint1_Y);
        ctx.lineTo(joint2_X, joint2_Y);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        // Joint nodes
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(joint1_X, joint1_Y, 0.7, 0, Math.PI * 2);
        ctx.arc(joint2_X, joint2_Y, 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      ctx.shadowBlur = 0; // Reset shadow

      // ==========================================
      // 4. THE WEB IS THE OPERATING SYSTEM (Weaving Webs)
      // ==========================================
      // If spider has arrived at a category node, weave an impossible web that unfurls a growing workspace
      if (currentTargetNode && weaveProgress > 0) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
        ctx.lineWidth = 0.5;

        // Shoot dynamic anchor lasers connecting spider to center core
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 1.0;
        ctx.globalAlpha = weaveProgress * 0.8;
        
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(spiderPos.x, spiderPos.y);
        ctx.stroke();

        // Radial web rings connecting Core to target node workspace
        const webAnchors = 6;
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 0.6;
        for (let ring = 1; ring <= 4; ring++) {
          const rFactor = (ring / 4) * weaveProgress;
          const rx = cx + (currentTargetNode.x - cx) * rFactor;
          const ry = cy + (currentTargetNode.y - cy) * rFactor;
          
          // Draw geometric concentric octagons centered along the connection line
          ctx.beginPath();
          for (let side = 0; side <= webAnchors; side++) {
            const angleOfWeb = (side / webAnchors) * Math.PI * 2 + time * 0.1;
            const wRadius = 35 * rFactor;
            const wx = rx + Math.cos(angleOfWeb) * wRadius;
            const wy = ry + Math.sin(angleOfWeb) * wRadius;
            if (side === 0) ctx.moveTo(wx, wy);
            else ctx.lineTo(wx, wy);
          }
          ctx.closePath();
          ctx.stroke();
        }

        // Procedural Lightning (neural lightning arcing)
        if (Math.random() < 0.15 && !isReducedMotion) {
          const lPoints = [];
          let curX = cx;
          let curY = cy;
          lPoints.push({ x: curX, y: curY });
          for (let step = 1; step <= 5; step++) {
            const stepOfs = step / 5;
            const baseX = cx + (spiderPos.x - cx) * stepOfs;
            const baseY = cy + (spiderPos.y - cy) * stepOfs;
            curX = baseX + (Math.random() - 0.5) * 20;
            curY = baseY + (Math.random() - 0.5) * 20;
            lPoints.push({ x: curX, y: curY });
          }
          lPoints.push({ x: spiderPos.x, y: spiderPos.y });

          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1.2;
          ctx.shadowBlur = 10;
          ctx.shadowColor = themeColor;
          ctx.beginPath();
          ctx.moveTo(lPoints[0].x, lPoints[0].y);
          for (let lp = 1; lp < lPoints.length; lp++) {
            ctx.lineTo(lPoints[lp].x, lPoints[lp].y);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = 1.0;

        // ==========================================
        // 5. LIVING ARCHITECTURE (Procedural Growing Workspaces)
        // ==========================================
        if (workspaceGrowth > 0) {
          ctx.save();
          ctx.translate(currentTargetNode.x, currentTargetNode.y - 30);
          ctx.scale(workspaceGrowth, workspaceGrowth);
          ctx.shadowBlur = 15;
          ctx.shadowColor = themeColor;
          ctx.strokeStyle = themeColor;
          ctx.lineWidth = 1.2;

          // Build dynamic architecture representations based on active category
          switch (currentTargetNode.id) {
            case "agri": // Greenhouse grows
              ctx.strokeRect(-20, -20, 40, 40);
              // triangular roof
              ctx.beginPath();
              ctx.moveTo(-20, -20);
              ctx.lineTo(0, -38);
              ctx.lineTo(20, -20);
              ctx.stroke();
              // growing helix plant line
              ctx.strokeStyle = "#10B981";
              ctx.beginPath();
              for (let h = -15; h <= 15; h++) {
                const hx = Math.sin(time * 4 + h * 0.5) * 8;
                if (h === -15) ctx.moveTo(hx, -h);
                else ctx.lineTo(hx, -h);
              }
              ctx.stroke();
              break;

            case "health": // Medical hologram rotates
              // rotating DNA wireframe
              for (let d = -18; d <= 18; d += 6) {
                const dAngle = time * 3 + d * 0.2;
                const dX1 = Math.cos(dAngle) * 16;
                const dX2 = -Math.cos(dAngle) * 16;
                ctx.strokeStyle = "rgba(255,255,255,0.8)";
                ctx.beginPath();
                ctx.arc(dX1, d, 2, 0, Math.PI * 2);
                ctx.arc(dX2, d, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = themeColor;
                ctx.beginPath();
                ctx.moveTo(dX1, d);
                ctx.lineTo(dX2, d);
                ctx.stroke();
              }
              break;

            case "traffic": // Traffic road network builds
              ctx.beginPath();
              ctx.arc(0, 0, 18, 0, Math.PI * 2);
              ctx.stroke();
              ctx.strokeStyle = "rgba(255,255,255,0.4)";
              // crossing roads
              ctx.beginPath();
              ctx.moveTo(-25, 0); ctx.lineTo(25, 0);
              ctx.moveTo(0, -25); ctx.lineTo(0, 25);
              ctx.stroke();
              // flow pulses
              const pulseOfs = (time * 1.5) % 25;
              ctx.fillStyle = "#FFFFFF";
              ctx.beginPath();
              ctx.arc(pulseOfs - 12, 0, 2, 0, Math.PI * 2);
              ctx.arc(0, pulseOfs - 12, 2, 0, Math.PI * 2);
              ctx.fill();
              break;

            case "weather": // Clouds & rain float
              ctx.fillStyle = "rgba(255,255,255,0.15)";
              ctx.beginPath();
              ctx.arc(-10, -10, 10, 0, Math.PI * 2);
              ctx.arc(5, -12, 12, 0, Math.PI * 2);
              ctx.arc(15, -6, 9, 0, Math.PI * 2);
              ctx.closePath();
              ctx.stroke();
              ctx.fill();
              // rain drop lines
              ctx.strokeStyle = "#38BDF8";
              for (let r = 0; r < 4; r++) {
                const rx = -12 + r * 8;
                const ry = 2 + ((time * 15 + r * 10) % 20);
                ctx.beginPath();
                ctx.moveTo(rx, ry);
                ctx.lineTo(rx - 2, ry + 6);
                ctx.stroke();
              }
              break;

            case "water": // Floating wave streams
              ctx.strokeStyle = "#38BDF8";
              ctx.beginPath();
              for (let w = -25; w <= 25; w++) {
                const wy = Math.sin(time * 5 + w * 0.15) * 8;
                if (w === -25) ctx.moveTo(w, wy);
                else ctx.lineTo(w, wy);
              }
              ctx.stroke();
              // secondary ph wave
              ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
              ctx.beginPath();
              for (let w = -25; w <= 25; w++) {
                const wy = Math.cos(time * 3 + w * 0.2) * 6 + 6;
                if (w === -25) ctx.moveTo(w, wy);
                else ctx.lineTo(w, wy);
              }
              ctx.stroke();
              break;

            case "energy": // Plasma substation arcs
              ctx.strokeRect(-16, -16, 32, 32);
              // inner core generator
              ctx.fillStyle = "#F59E0B";
              ctx.beginPath();
              ctx.arc(0, 0, 5, 0, Math.PI * 2);
              ctx.fill();
              // crackling lightning arcs inside
              ctx.strokeStyle = "#FFFFFF";
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(Math.sin(time * 20) * 15, Math.cos(time * 15) * 15);
              ctx.stroke();
              break;

            case "infra": // Structural cubes
              ctx.save();
              ctx.rotate(time * 0.5);
              ctx.strokeRect(-14, -14, 28, 28);
              ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
              ctx.strokeRect(-8, -8, 16, 16);
              ctx.restore();
              break;

            case "earth": // Fault line shockwaves
              ctx.strokeStyle = "#F87171";
              ctx.beginPath();
              ctx.arc(0, 0, (time * 12) % 25, 0, Math.PI * 2);
              ctx.stroke();
              // flat grid line
              ctx.strokeStyle = "rgba(255,255,255,0.2)";
              ctx.beginPath();
              ctx.moveTo(-25, 5); ctx.lineTo(25, -5);
              ctx.stroke();
              break;

            case "emerg": // Satellite dish concentric arcs
              ctx.beginPath();
              ctx.arc(0, 10, 14, Math.PI, 0);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(0, 10); ctx.lineTo(0, -6);
              ctx.stroke();
              // flashing beacon
              ctx.fillStyle = "#EF4444";
              ctx.beginPath();
              ctx.arc(0, -6, 2.5, 0, Math.PI * 2);
              ctx.fill();
              // radio waves
              ctx.strokeStyle = "rgba(255,255,255,0.7)";
              ctx.beginPath();
              ctx.arc(0, -6, 8 + (time * 10) % 15, Math.PI * 1.2, Math.PI * 1.8);
              ctx.stroke();
              break;
          }

          ctx.restore();
          ctx.shadowBlur = 0;
        }
      }

      // ==========================================
      // 6. RENDER FLOATING SPATIAL CATEGORY LABELS
      // ==========================================
      spatialNodes.forEach((node, idx) => {
        const isHovered = hoveredNodeIdxRef.current === idx;
        const isEmergency = isExtreme && idx === idxOfExtremeNode(overallScore);
        const nodeScale = isHovered ? 1.25 : 1.0;

        ctx.save();
        ctx.translate(node.x, node.y);

        // Core line connectors connecting categories to Center Core
        ctx.strokeStyle = isHovered 
          ? themeColor 
          : isEmergency 
          ? "rgba(239, 68, 68, 0.35)" 
          : "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = isHovered ? 1.0 : 0.6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(cx - node.x, cy - node.y);
        ctx.stroke();

        // Node circle body
        ctx.shadowBlur = (isHovered || isEmergency) ? 14 : 0;
        ctx.shadowColor = isEmergency ? "#EF4444" : themeColor;
        
        ctx.fillStyle = isEmergency 
          ? "rgba(239, 68, 68, 0.95)" 
          : isHovered 
          ? themeColor 
          : "rgba(9, 9, 11, 0.85)";
        
        ctx.strokeStyle = isEmergency 
          ? "#EF4444" 
          : isHovered 
          ? "#FFFFFF" 
          : "rgba(63, 63, 70, 0.6)";
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.arc(0, 0, 11 * nodeScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Interactive visual indicators inside node
        ctx.fillStyle = isEmergency || isHovered ? "#FFFFFF" : "#A1A1AA";
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Render simple node icon characters if we are in direct Canvas space
        ctx.fillText(node.name[0], 0, 0.5);

        // Hover text panel label
        if (isHovered || isExpanded || isEmergency) {
          ctx.textAlign = node.x > cx ? "left" : "right";
          const offsetSign = node.x > cx ? 18 : -18;
          
          // Background box for textual info
          ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
          ctx.strokeStyle = isEmergency ? "#EF4444" : themeColor;
          ctx.lineWidth = 1;
          
          const textWidth = 90;
          const textHeight = 35;
          const boxX = node.x > cx ? offsetSign - 5 : offsetSign - textWidth + 5;
          const boxY = -18;

          ctx.fillRect(boxX, boxY, textWidth, textHeight);
          ctx.strokeRect(boxX, boxY, textWidth, textHeight);

          // Category name text
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 8.5px sans-serif";
          ctx.fillText(node.name, boxX + 6, boxY + 12);

          // Status & Metric
          ctx.fillStyle = isEmergency ? "#FCA5A5" : "#A1A1AA";
          ctx.font = "7.5px monospace";
          ctx.fillText(node.metric, boxX + 6, boxY + 22);

          ctx.fillStyle = isEmergency ? "#EF4444" : "#10B981";
          ctx.font = "bold 7px monospace";
          ctx.fillText(node.status, boxX + 6, boxY + 30);
        }

        ctx.restore();
      });

      // ==========================================
      // 5. THREE.JS PATROLLING ROBOTIC SPIDER DRONES
      // ==========================================
      drones3D.forEach((drone) => {
        // Core pulse synchronization phase (0 to 1)
        const corePulsePhase = Math.sin(time * 1.5);
        drone.pulseSync = (corePulsePhase + 1) / 2;

        // State behavior updates
        drone.stateTimer--;
        if (drone.stateTimer <= 0) {
          if (drone.state === "patrol") {
            drone.state = Math.random() > 0.5 ? "scan" : "repair";
            drone.stateTimer = 80 + Math.random() * 100;
          } else {
            drone.state = "patrol";
            drone.stateTimer = 150 + Math.random() * 150;
          }
        }

        // Movement kinematics
        if (drone.state === "patrol") {
          drone.angle += drone.speed * (isScanning ? 2.5 : 1.0) * chaosMultiplier;
          drone.legPhase += Math.abs(drone.speed) * (isScanning ? 14 : 7) * chaosMultiplier;
        } else if (drone.state === "scan" || drone.state === "repair") {
          drone.scanAngle = Math.sin(time * 3.5) * 0.4;
          drone.legPhase += 0.04; // subtle twitching breathing
        }

        // Lightweight 3D projection. The previous version allocated several
        // Three.js Vector3/Euler objects for every drone on every frame.
        const radius = drone.orbitRad * (isExpanded ? 1.45 : 1.0);
        const localPos = rotatePoint(
          Math.cos(drone.angle) * radius,
          Math.sin(drone.angle) * radius,
          Math.sin(drone.angle * 2.5) * 50,
          drone.tiltX,
          drone.tiltY
        );

        const nextAngle = drone.angle + 0.01;
        const nextLocalPos = rotatePoint(
          Math.cos(nextAngle) * radius,
          Math.sin(nextAngle) * radius,
          Math.sin(nextAngle * 2.5) * 50,
          drone.tiltX,
          drone.tiltY
        );

        let dirX = nextLocalPos.x - localPos.x;
        let dirY = nextLocalPos.y - localPos.y;
        let dirZ = nextLocalPos.z - localPos.z;
        if (drone.state === "scan" || drone.state === "repair") {
          dirX = -localPos.x;
          dirY = -localPos.y;
          dirZ = -localPos.z;
        }
        const directionLength = Math.hypot(dirX, dirY, dirZ) || 1;
        dirX /= directionLength;
        dirY /= directionLength;

        // Perspective 3D Projection Math
        const cameraZ = 500;
        const fov = 400; // perspective focal length
        // Add subtle floating offset to 3D Z coordinate
        const floatZ = Math.sin(time * 0.8 + drone.id) * 12;
        const finalZ = localPos.z + floatZ;

        // Perspective scaling factor (smaller in back, larger in front)
        const scaleFactor = fov / (cameraZ - finalZ);
        const screenX = cx + localPos.x * scaleFactor;
        const screenY = cy + localPos.y * scaleFactor;

        // Base drone angle on the 2D plane
        const faceAngle2D = Math.atan2(dirY, dirX);

        // Draw drone assembly
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(faceAngle2D);

        // Drone specific colors and glowing states
        const droneColor = themeColors.primary;
        const pulseGlow = `rgba(${atmosphere === "crimson" ? "230, 57, 70" : atmosphere === "amber" ? "245, 158, 11" : atmosphere === "cyan" ? "6, 182, 212" : "16, 185, 129"}, ${0.45 + drone.pulseSync * 0.55})`;

        // Scale by perspective factor and individual drone design size
        const dScale = scaleFactor * drone.size * 0.8;

        // 1. Scanning Cone or Repair Laser (Rendered behind body)
        if (drone.state === "scan") {
          ctx.save();
          // Scanning fan-shaped sweeping laser grid
          ctx.rotate(drone.scanAngle);
          const scanDist = 120 * dScale;
          const scanAngleWidth = 0.35;

          const scanGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, scanDist);
          scanGrad.addColorStop(0, pulseGlow);
          scanGrad.addColorStop(0.5, `rgba(${atmosphere === "crimson" ? "230, 57, 70" : "6, 182, 212"}, 0.1)`);
          scanGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = scanGrad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, scanDist, -scanAngleWidth, scanAngleWidth);
          ctx.closePath();
          ctx.fill();

          // Outer scanning fan line arc
          ctx.strokeStyle = pulseGlow;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, scanDist, -scanAngleWidth, scanAngleWidth);
          ctx.stroke();
          ctx.restore();
        } else if (drone.state === "repair") {
          // Flickering high-frequency repair laser to central core
          ctx.save();
          ctx.strokeStyle = Math.random() > 0.4 ? "#FFFFFF" : droneColor;
          ctx.lineWidth = (0.6 + Math.random() * 0.8) * dScale;
          ctx.shadowBlur = 10 * dScale;
          ctx.shadowColor = droneColor;

          // Rotate local system towards core
          ctx.beginPath();
          ctx.moveTo(0, 0);
          // Laser target coordinates mapped from central core space (cx - screenX, cy - screenY)
          const localCoreX = (cx - screenX);
          const localCoreY = (cy - screenY);
          // Rotate target to align with local rotated orientation
          const cosA = Math.cos(-faceAngle2D);
          const sinA = Math.sin(-faceAngle2D);
          const targetRotX = localCoreX * cosA - localCoreY * sinA;
          const targetRotY = localCoreX * sinA + localCoreY * cosA;

          ctx.lineTo(targetRotX, targetRotY);
          ctx.stroke();

          // Laser impact sparks at core target
          if (Math.random() > 0.5) {
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(targetRotX, targetRotY, (1 + Math.random() * 3) * dScale, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        // 2. Procedural robotic limbs (6-legged advanced titanium design)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 0.85 * dScale;
        const legCount = 6;
        for (let i = 0; i < legCount; i++) {
          const side = i % 2 === 0 ? 1 : -1;
          const row = Math.floor(i / 2);
          const legBaseAngle = (side * Math.PI) / 3 + (row * Math.PI) / 6;

          // Articulate swing walking phase
          const phaseShift = row * 1.8;
          const swing = Math.sin(drone.legPhase * 2.2 + phaseShift) * 0.32;
          const flexAngle = legBaseAngle + (drone.state === "patrol" ? swing : Math.sin(time * 5 + i) * 0.05);

          const joint1_Len = 4.5 * dScale;
          const joint2_Len = 7.5 * dScale;
          const joint3_Len = 5.5 * dScale;

          const joint1_X = Math.cos(flexAngle) * joint1_Len;
          const joint1_Y = Math.sin(flexAngle) * joint1_Len;

          const joint2_X = joint1_X + Math.cos(flexAngle + 0.55 * side) * joint2_Len;
          const joint2_Y = joint1_Y + Math.sin(flexAngle + 0.55 * side) * joint2_Len;

          const footX = joint2_X + Math.cos(flexAngle - 0.35 * side) * joint3_Len;
          const footY = joint2_Y + Math.sin(flexAngle - 0.35 * side) * joint3_Len;

          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(joint1_X, joint1_Y);
          ctx.lineTo(joint2_X, joint2_Y);
          ctx.lineTo(footX, footY);
          ctx.stroke();

          // Joint hinge
          ctx.fillStyle = droneColor;
          ctx.beginPath();
          ctx.arc(joint1_X, joint1_Y, 0.5 * dScale, 0, Math.PI * 2);
          ctx.arc(joint2_X, joint2_Y, 0.5 * dScale, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Central Titanium chassis and armor plating
        ctx.fillStyle = "#0D0D11";
        ctx.strokeStyle = droneColor;
        ctx.lineWidth = 1.0 * dScale;
        ctx.beginPath();
        ctx.arc(0, 0, 2.8 * dScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Hexagonal cockpit/reactor design
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.lineWidth = 0.5 * dScale;
        ctx.beginPath();
        for (let s = 0; s < 6; s++) {
          const sAngle = (s * Math.PI) / 3;
          const sx = Math.cos(sAngle) * 1.8 * dScale;
          const sy = Math.sin(sAngle) * 1.8 * dScale;
          if (s === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.stroke();

        // 4. Optical scanner lens (Front glowing red sensor)
        ctx.fillStyle = pulseGlow;
        ctx.shadowBlur = 8 * dScale;
        ctx.shadowColor = droneColor;
        ctx.beginPath();
        ctx.arc(1.8 * dScale, 0, 0.9 * dScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      });

    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [spatialNodes, isExpanded, isScanning, overallScore, themeColors, isReducedMotion, isHighContrast]);

  const handleCenterClick = () => {
    setClickWave(true);
    setTimeout(() => setClickWave(false), 900);
    audioEngine.playCorePulse();
  };

  // Helper to trigger extreme warning nodes in cinematic flow
  const idxOfExtremeNode = (score: number) => {
    if (score >= 80) return 7; // Earth monitoring
    if (score >= 60) return 0; // Weather grid
    return 3; // Agriculture default
  };

  return (
    <div
      ref={containerRef}
      id="sentinel-holographic-centerpiece"
      className={`relative flex flex-col bg-zinc-950/85 backdrop-blur-xl border rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 pointer-events-auto select-none ${
        isExpanded ? "col-span-1 md:col-span-2 lg:col-span-3 min-h-[640px]" : "h-full min-h-[390px]"
      } ${
        overallScore >= 60 ? "border-red-600/50 shadow-[0_0_40px_rgba(193,18,31,0.2)]" : "border-zinc-900"
      }`}
    >
      {/* 1. Header status */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 font-mono text-[9.5px]">
        <Atom className="w-3.5 h-3.5 animate-spin-slow" style={{ color: themeColors.primary }} />
        <span className="tracking-wider text-zinc-300 uppercase flex items-center gap-1">
          SPATIAL COGNITIVE ENVIRONMENT • <span style={{ color: themeColors.primary }}>{atmosphere.toUpperCase()} SPECTRUM</span>
        </span>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => {
            onToggleExpand();
            audioEngine.playTactileClick();
          }}
          className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all cursor-pointer"
          title={isExpanded ? "Minimize Canvas" : "Maximize Screen Stage"}
        >
          {isExpanded ? <Shrink className="w-3.5 h-3.5" /> : <Expand className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 2. Interactive tabs & Environment Mode Status */}
      <div className="absolute top-12 left-4 z-20 flex flex-col gap-1.5">
        <span className="px-2 py-0.5 rounded bg-black/60 border border-zinc-900 text-[8.5px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Spider Engine: {spiderStatus}</span>
        </span>
      </div>

      {/* 3. HTML Hover Nodes Layer for Mouse Pointer precision */}
      <div 
        className="relative flex-1 flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={handleCenterClick}
      >
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full pointer-events-none z-10" 
        />

        {/* Click wave scanner */}
        <AnimatePresence>
          {clickWave && (
            <motion.div
              initial={{ scale: 0.1, opacity: 0.8 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute w-48 h-48 rounded-full border pointer-events-none z-10 bg-black/5"
              style={{ borderColor: themeColors.primary }}
            />
          )}
        </AnimatePresence>

        {/* Spatial Floating Interactive Buttons mapped to Canvas position */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {spatialNodes.map((node, idx) => {
            // Estimate position inside HTML container
            const canvasWidth = canvasRef.current?.width || 600;
            const canvasHeight = canvasRef.current?.height || 390;
            
            // Generate simple responsive offset coordinate values
            const pctX = (node.x / canvasWidth) * 100;
            const pctY = (node.y / canvasHeight) * 100;

            if (isNaN(pctX) || isNaN(pctY)) return null;

            return (
              <button
                key={node.id}
                onMouseEnter={() => {
                  setHoveredNodeIdx(idx);
                  audioEngine.playTactileClick();
                }}
                onMouseLeave={() => setHoveredNodeIdx(null)}
                className="absolute w-7 h-7 rounded-full flex items-center justify-center pointer-events-auto cursor-pointer focus:outline-none transition-transform active:scale-95"
                style={{
                  left: `${pctX}%`,
                  top: `${pctY}%`,
                  transform: "translate(-50%, -50%)",
                  background: "transparent"
                }}
                title={node.name}
              />
            );
          })}
        </div>

        {/* Hover instructions overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-full border border-zinc-900 bg-black/90 text-[8.5px] font-mono tracking-widest text-zinc-400 uppercase flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" style={{ color: themeColors.primary }} />
            MOVE CURSOR TO ALIGN SPIDER WEBS
          </span>
        </div>
      </div>

      {/* 4. Lower telemetry readout bar */}
      <div className="w-full p-4 border-t border-zinc-900/80 bg-black/40 flex items-center justify-between text-[10px] font-mono">
        <div className="flex flex-col gap-0.5">
          <span className="text-zinc-500 uppercase">WEADING OPERATING SYSTEM STATE:</span>
          <span className="text-zinc-200 uppercase">
            {isScanning ? "RE-WEAVING LOCAL COGNITIVE THREADS..." : `COGNITIVE SPIDER WEBS ANCHORED STABLY`}
          </span>
        </div>
        <div className="text-right text-zinc-500 uppercase">
          SENTINEL CORE v8.12-LIVING
        </div>
      </div>
    </div>
  );
}
