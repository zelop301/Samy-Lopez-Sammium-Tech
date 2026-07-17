import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "motion/react";
import { getPerformanceProfile } from "../utils/performance";

interface SentinelLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "custom";
  className?: string;
  animateOnMount?: boolean;
  isScanning?: boolean;
  overallThreat?: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

interface WebPulse {
  pathIndex: number;
  progress: number; // 0 to 1
  speed: number;
  direction: 1 | -1;
  color: string;
}

interface Drone {
  id: number;
  orbitRadius: number;
  angle: number;
  speed: number;
  x: number;
  y: number;
  state: "patroll" | "pause" | "scan" | "repair" | "attention";
  stateTimer: number;
  targetX: number;
  targetY: number;
  baseAngle: number;
  repairTargetNode?: { x: number; y: number };
  scanProgress: number;
  legPhase: number;
}

export default function SentinelLogo({
  size = "md",
  className = "",
  animateOnMount = true,
  isScanning = false,
  overallThreat = 0,
}: SentinelLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAssembled, setIsAssembled] = useState(!animateOnMount);

  // Parse size sizes
  const sizeClasses = {
    xs: "w-8 h-8",
    sm: "w-12 h-12",
    md: "w-24 h-24",
    lg: "w-48 h-48",
    xl: "w-64 h-64",
    custom: "w-full h-full",
  };

  const pxSize = {
    xs: 32,
    sm: 48,
    md: 96,
    lg: 192,
    xl: 256,
    custom: 256,
  }[size];

  // Map theme colors based on threat level
  const themeColor = overallThreat >= 81 ? "#E63946" : isScanning ? "#E63946" : "#C1121F";
  const dimThemeColor = overallThreat >= 81 ? "rgba(230, 57, 70, 0.25)" : "rgba(193, 18, 31, 0.25)";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const profile = getPerformanceProfile();
    const targetFps = isScanning ? profile.targetFps : profile.reducedTargetFps;
    const frameInterval = 1000 / targetFps;

    // Crisp enough for a small logo without rendering a 2x/3x backing buffer.
    const dpr = Math.min(window.devicePixelRatio || 1, profile.maxDevicePixelRatio);
    canvas.width = pxSize * dpr;
    canvas.height = pxSize * dpr;
    canvas.style.width = `${pxSize}px`;
    canvas.style.height = `${pxSize}px`;

    // Timeline phases matching design specs:
    // 0 to 45: Dark & Crimson Pulse Expanding
    // 45 to 110: Web growing outward procedurally
    // 110 to 220: Fragment assembly with spring physics
    // 220+: Operational engine
    let frameCount = animateOnMount ? 0 : 220;
    let sparks: Spark[] = [];
    let webPulses: WebPulse[] = [];
    let clickRipples: { x: number; y: number; r: number; alpha: number; maxR: number }[] = [];

    // Define 100x100 design viewBox coordinates
    const coreX = 50;
    const coreY = 48;

    // Define the radial web system structure: 4 concentric rings, 8 spokes
    const webRings = [20, 42, 68, 92];
    const webSpokesCount = 8;
    const webSpokeAngles = Array.from({ length: webSpokesCount }, (_, i) => (i * Math.PI * 2) / webSpokesCount);

    // Assembly target nodes representing the perfect symmetric geometric spider emblem
    const rawTargets = [
      // Head Points
      { x: 50, y: 24, type: "head" }, { x: 55, y: 27, type: "head" }, { x: 55, y: 33, type: "head" },
      { x: 50, y: 36, type: "head" }, { x: 45, y: 33, type: "head" }, { x: 45, y: 27, type: "head" },
      // Abdomen Points
      { x: 50, y: 38, type: "abdomen" }, { x: 59, y: 41, type: "abdomen" }, { x: 61, y: 52, type: "abdomen" },
      { x: 50, y: 69, type: "abdomen" }, { x: 39, y: 52, type: "abdomen" }, { x: 41, y: 41, type: "abdomen" },
      // Leg 1 (Front Left)
      { x: 45, y: 36, type: "leg" }, { x: 32, y: 18, type: "leg" }, { x: 20, y: 24, type: "leg" }, { x: 12, y: 44, type: "leg" },
      // Leg 2 (Mid-High Left)
      { x: 44, y: 39, type: "leg" }, { x: 24, y: 28, type: "leg" }, { x: 12, y: 38, type: "leg" }, { x: 6, y: 56, type: "leg" },
      // Leg 3 (Mid-Low Left)
      { x: 43, y: 42, type: "leg" }, { x: 22, y: 46, type: "leg" }, { x: 14, y: 58, type: "leg" }, { x: 10, y: 72, type: "leg" },
      // Leg 4 (Back Left)
      { x: 42, y: 45, type: "leg" }, { x: 28, y: 56, type: "leg" }, { x: 22, y: 70, type: "leg" }, { x: 18, y: 84, type: "leg" },
      // Leg 5 (Front Right)
      { x: 55, y: 36, type: "leg" }, { x: 68, y: 18, type: "leg" }, { x: 80, y: 24, type: "leg" }, { x: 88, y: 44, type: "leg" },
      // Leg 6 (Mid-High Right)
      { x: 56, y: 39, type: "leg" }, { x: 76, y: 28, type: "leg" }, { x: 88, y: 38, type: "leg" }, { x: 94, y: 56, type: "leg" },
      // Leg 7 (Mid-Low Right)
      { x: 57, y: 42, type: "leg" }, { x: 78, y: 46, type: "leg" }, { x: 86, y: 58, type: "leg" }, { x: 90, y: 72, type: "leg" },
      // Leg 8 (Back Right)
      { x: 58, y: 45, type: "leg" }, { x: 72, y: 56, type: "leg" }, { x: 78, y: 70, type: "leg" }, { x: 82, y: 84, type: "leg" },
    ];

    // Fragments structure for the assembly phase (spring-loaded engineering fragments)
    interface Fragment {
      x: number;
      y: number;
      vx: number;
      vy: number;
      targetX: number;
      targetY: number;
      angle: number;
      targetAngle: number;
      scale: number;
      targetScale: number;
      type: string;
      size: number;
      docked: boolean;
    }

    const fragments: Fragment[] = rawTargets.map((t) => {
      // Disperse elements initially with high entropy
      const angle = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 80;
      return {
        x: coreX + Math.cos(angle) * dist,
        y: coreY + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        targetX: t.x,
        targetY: t.y,
        angle: Math.random() * Math.PI * 4,
        targetAngle: 0,
        scale: 0.1,
        targetScale: 1,
        type: t.type,
        size: 0.8 + Math.random() * 1.5,
        docked: false,
      };
    });

    // Three autonomous robotic spider drones patrolling the computational web
    const drones: Drone[] = [
      { id: 1, orbitRadius: 32, angle: 0, speed: 0.007, x: 0, y: 0, state: "patroll", stateTimer: 100, targetX: 0, targetY: 0, baseAngle: 0, scanProgress: 0, legPhase: 0 },
      { id: 2, orbitRadius: 58, angle: Math.PI * 0.7, speed: -0.005, x: 0, y: 0, state: "patroll", stateTimer: 200, targetX: 0, targetY: 0, baseAngle: 0, scanProgress: 0, legPhase: 0 },
      { id: 3, orbitRadius: 82, angle: Math.PI * 1.4, speed: 0.004, x: 0, y: 0, state: "patroll", stateTimer: 150, targetX: 0, targetY: 0, baseAngle: 0, scanProgress: 0, legPhase: 0 }
    ];

    // Spark emitter helper
    const createSparks = (x: number, y: number, count = 8, color = "#E63946") => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.8;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          size: 0.4 + Math.random() * 0.8,
          color,
        });
      }
    };

    // Capture click events globally and trigger visual responses
    const handleSentinelClick = (e: any) => {
      const { x: clientX, y: clientY, isRightClick } = e.detail;
      const rect = canvas.getBoundingClientRect();
      // Translate global screen coords to the canvas's 100x100 space
      const localX = ((clientX - rect.left) / rect.width) * 100;
      const localY = ((clientY - rect.top) / rect.height) * 100;

      // Only respond if coordinates are within bounds
      if (localX >= 0 && localX <= 100 && localY >= 0 && localY <= 100) {
        clickRipples.push({
          x: localX,
          y: localY,
          r: 2,
          alpha: 1.0,
          maxR: isRightClick ? 18 : 35,
        });
        createSparks(localX, localY, isRightClick ? 6 : 16, themeColor);
      }
    };
    window.addEventListener("sentinelClick", handleSentinelClick);

    let animationFrameId = 0;
    let lastRenderTime = 0;
    let pageVisible = !document.hidden;

    const handleVisibilityChange = () => {
      pageVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const renderLoop = (frameTime: number) => {
      animationFrameId = requestAnimationFrame(renderLoop);
      if (!pageVisible || frameTime - lastRenderTime < frameInterval) return;
      lastRenderTime = frameTime - ((frameTime - lastRenderTime) % frameInterval);
      frameCount++;

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Scale 100x100 coordinate grid to fit actual pixel area
      ctx.scale(dpr * (pxSize / 100), dpr * (pxSize / 100));

      // Global floating and breathing offsets for cinematic atmospheric depth
      const globalTime = frameCount * 0.025;
      const floatX = Math.sin(globalTime * 0.7) * 0.6;
      const floatY = Math.cos(globalTime * 0.5) * 0.8;
      const breatheScale = 1.0 + Math.sin(globalTime * 1.2) * 0.015;

      // ────────────────────────────────────────────────────────
      // LAYER 1: Crimson Base Pulse (Awakening Step)
      // ────────────────────────────────────────────────────────
      if (frameCount < 60) {
        const pulseRatio = frameCount / 60;
        const pulseRadius = pulseRatio * 65;
        const pulseAlpha = (1.0 - pulseRatio) * 0.4;

        ctx.strokeStyle = `rgba(193, 18, 31, ${pulseAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(coreX, coreY, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Soft internal core nebula
        const coreNebula = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, Math.max(1, pulseRadius));
        coreNebula.addColorStop(0, `rgba(230, 57, 70, ${pulseAlpha * 0.15})`);
        coreNebula.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = coreNebula;
        ctx.beginPath();
        ctx.arc(coreX, coreY, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // ────────────────────────────────────────────────────────
      // LAYER 2: Computational Radial Web System
      // ────────────────────────────────────────────────────────
      let webAlpha = 1.0;
      if (frameCount >= 35 && frameCount < 110) {
        // Growth phase
        webAlpha = (frameCount - 35) / 75;
      } else if (frameCount < 35) {
        webAlpha = 0;
      }

      if (webAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = webAlpha;
        ctx.strokeStyle = "rgba(193, 18, 31, 0.045)";
        ctx.lineWidth = 0.4;

        // Determine max visible radius based on growth timeline
        const maxAllowedRadius = frameCount >= 110 ? 100 : ((frameCount - 35) / 75) * 100;

        // Draw radial spokes radiating from core
        webSpokeAngles.forEach((angle) => {
          const targetRad = Math.min(95, maxAllowedRadius);
          const endX = coreX + Math.cos(angle) * targetRad;
          const endY = coreY + Math.sin(angle) * targetRad;

          ctx.beginPath();
          ctx.moveTo(coreX, coreY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        });

        // Draw concentric computational polygonal web rings
        webRings.forEach((radius) => {
          if (radius <= maxAllowedRadius) {
            ctx.beginPath();
            webSpokeAngles.forEach((angle, idx) => {
              const wx = coreX + Math.cos(angle) * radius;
              const wy = coreY + Math.sin(angle) * radius;
              if (idx === 0) ctx.moveTo(wx, wy);
              else ctx.lineTo(wx, wy);
            });
            ctx.closePath();
            ctx.stroke();
          }
        });

        // Draw glowing computational node intersections
        ctx.fillStyle = "rgba(193, 18, 31, 0.15)";
        webRings.forEach((radius) => {
          if (radius <= maxAllowedRadius) {
            webSpokeAngles.forEach((angle) => {
              const wx = coreX + Math.cos(angle) * radius;
              const wy = coreY + Math.sin(angle) * radius;
              ctx.beginPath();
              ctx.arc(wx, wy, 0.75, 0, Math.PI * 2);
              ctx.fill();
            });
          }
        });

        // Process and draw continuous running Web Energy Pulses
        if (frameCount >= 110 && Math.random() < 0.045 && webPulses.length < 12) {
          // Spawn new pulse running along a spoke or ring segment
          webPulses.push({
            pathIndex: Math.floor(Math.random() * webSpokesCount),
            progress: 0,
            speed: 0.01 + Math.random() * 0.02,
            direction: Math.random() > 0.5 ? 1 : -1,
            color: Math.random() > 0.3 ? "#E63946" : "#ffffff",
          });
        }

        webPulses = webPulses.filter((pulse) => {
          pulse.progress += pulse.speed;
          if (pulse.progress >= 1.0) return false;

          // Compute pulse coordinate along the spoke
          const angle = webSpokeAngles[pulse.pathIndex];
          const radiusRange = webRings[webRings.length - 1];
          const currentRadius = pulse.progress * radiusRange;
          const px = coreX + Math.cos(angle) * currentRadius;
          const py = coreY + Math.sin(angle) * currentRadius;

          ctx.fillStyle = pulse.color;
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Connective aura
          ctx.fillStyle = "rgba(230, 57, 70, 0.15)";
          ctx.beginPath();
          ctx.arc(px, py, 3.5, 0, Math.PI * 2);
          ctx.fill();

          return true;
        });

        ctx.restore();
      }

      // ────────────────────────────────────────────────────────
      // LAYER 3: Geometric Spider Emblem (Titanium & Carbon Fiber)
      // ────────────────────────────────────────────────────────
      let assemblyProgress = 0;
      if (frameCount >= 110) {
        assemblyProgress = Math.min(1.0, (frameCount - 110) / 90);
      }

      if (assemblyProgress > 0) {
        let allDocked = true;

        // Render each fragment with spring-guided magnetic kinematics
        fragments.forEach((f) => {
          const dx = f.targetX - f.x;
          const dy = f.targetY - f.y;

          // Spring physics equations
          const springForceX = dx * 0.12;
          const springForceY = dy * 0.12;

          f.vx += springForceX;
          f.vy += springForceY;

          // Heavy magnetic friction/damping for high tactile locked feeling
          f.vx *= 0.76;
          f.vy *= 0.76;

          f.x += f.vx;
          f.y += f.vy;

          // Rotational and scale interpolation
          f.angle += (f.targetAngle - f.angle) * 0.15;
          f.scale += (f.targetScale - f.scale) * 0.15;

          if (Math.hypot(dx, dy) < 0.25 && !f.docked) {
            f.docked = true;
            // Lock immediately
            f.x = f.targetX;
            f.y = f.targetY;
            f.angle = f.targetAngle;
            f.scale = f.targetScale;
            // Emit sparks on magnetic locking
            createSparks(f.x, f.y, 1, "#E63946");
          }

          if (!f.docked) allDocked = false;
        });

        // Fire once fully assembled
        if (allDocked && !isAssembled) {
          setIsAssembled(true);
          // Large physical shockwave ring on completed assembly
          clickRipples.push({
            x: coreX,
            y: coreY,
            r: 5,
            alpha: 1.0,
            maxR: 45,
          });
          createSparks(coreX, coreY, 24, "#ffffff");
        }

        // Draw structural paths
        ctx.save();
        // Shift context slightly according to float and breathe
        ctx.translate(floatX, floatY);

        // Group fragments by category for stylized batch vector drawing
        const headFrags = fragments.filter((f) => f.type === "head");
        const abdomenFrags = fragments.filter((f) => f.type === "abdomen");
        const legFrags = fragments.filter((f) => f.type === "leg");

        // 1. Draw Abdomen Shield with rich Carbon-Fiber styling
        if (abdomenFrags.length >= 6) {
          ctx.beginPath();
          ctx.moveTo(abdomenFrags[0].x, abdomenFrags[0].y);
          for (let i = 1; i < 6; i++) {
            ctx.lineTo(abdomenFrags[i].x, abdomenFrags[i].y);
          }
          ctx.closePath();

          // Matte carbon-fiber backing fill
          ctx.fillStyle = "#121212";
          ctx.fill();

          // Draw procedural carbon-fiber textures (precision angled hatch grid)
          ctx.save();
          ctx.clip();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
          ctx.lineWidth = 0.5;
          for (let l = -30; l < 130; l += 1.8) {
            ctx.beginPath();
            ctx.moveTo(l, 30);
            ctx.lineTo(l + 30, 80);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(l + 30, 30);
            ctx.lineTo(l, 80);
            ctx.stroke();
          }
          ctx.restore();

          // Outer titanium border stroke
          ctx.strokeStyle = themeColor;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }

        // 2. Draw Hexagonal head casing
        if (headFrags.length >= 6) {
          ctx.beginPath();
          ctx.moveTo(headFrags[0].x, headFrags[0].y);
          for (let i = 1; i < 6; i++) {
            ctx.lineTo(headFrags[i].x, headFrags[i].y);
          }
          ctx.closePath();
          ctx.fillStyle = "#0c0c0c";
          ctx.fill();

          ctx.strokeStyle = themeColor;
          ctx.lineWidth = 0.95;
          ctx.stroke();

          // Draw core glowing crimson eye in the center of the head
          const eyeX = (headFrags[0].x + headFrags[3].x) / 2;
          const eyeY = (headFrags[0].y + headFrags[3].y) / 2;
          const eyePulse = Math.abs(Math.sin(globalTime * 1.5));

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(eyeX, eyeY, 0.6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "rgba(230, 57, 70, 0.85)";
          ctx.beginPath();
          ctx.arc(eyeX, eyeY, 1.4 + eyePulse * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Draw spinal main carbon bus
        if (assemblyProgress >= 0.8) {
          ctx.save();
          ctx.strokeStyle = "#C1121F";
          ctx.lineWidth = 0.8;
          ctx.shadowBlur = 4;
          ctx.shadowColor = "#E63946";
          ctx.beginPath();
          ctx.moveTo(coreX, 38);
          ctx.lineTo(coreX, 65);
          ctx.stroke();
          ctx.restore();

          // Left/Right symmetric internal microcircuits
          ctx.strokeStyle = "rgba(230, 57, 70, 0.5)";
          ctx.lineWidth = 0.5;

          const circuits = [
            { sx: coreX, sy: 44, ex: 44, ey: 46 },
            { sx: coreX, sy: 44, ex: 56, ey: 46 },
            { sx: coreX, sy: 50, ex: 43, ey: 53 },
            { sx: coreX, sy: 50, ex: 57, ey: 53 },
            { sx: coreX, sy: 56, ex: 45, ey: 60 },
            { sx: coreX, sy: 56, ex: 55, ey: 60 },
          ];

          circuits.forEach((c) => {
            ctx.beginPath();
            ctx.moveTo(c.sx, c.sy);
            ctx.lineTo(c.ex, c.ey);
            ctx.stroke();

            // Circuit nodes
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(c.ex, c.ey, 0.5, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // 4. Draw Segmented Legs
        if (legFrags.length >= 32) {
          ctx.strokeStyle = themeColor;
          ctx.lineWidth = 1.0;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          // Symmetrical segmented legs (8 legs, 4 coordinates each)
          for (let legIdx = 0; legIdx < 8; legIdx++) {
            const startIdx = legIdx * 4;
            ctx.beginPath();
            ctx.moveTo(legFrags[startIdx].x, legFrags[startIdx].y);
            ctx.lineTo(legFrags[startIdx + 1].x, legFrags[startIdx + 1].y);
            ctx.lineTo(legFrags[startIdx + 2].x, legFrags[startIdx + 2].y);
            ctx.lineTo(legFrags[startIdx + 3].x, legFrags[startIdx + 3].y);
            ctx.stroke();

            // Draw micro metallic joint nodes at hinges
            ctx.fillStyle = "#090909";
            ctx.strokeStyle = "#E63946";
            ctx.lineWidth = 0.4;
            for (let j = 1; j < 3; j++) {
              ctx.beginPath();
              ctx.arc(legFrags[startIdx + j].x, legFrags[startIdx + j].y, 0.7, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
            }
          }
        }

        ctx.restore();
      }

      // ────────────────────────────────────────────────────────
      // LAYER 4: Three Autonomous Robotic Spider Drones (AI Agents)
      // ────────────────────────────────────────────────────────
      if (frameCount >= 180) {
        const mouseObj = (window as any).sentinelMouse;
        let localMouseX = -1000;
        let localMouseY = -1000;

        if (mouseObj) {
          const rect = canvas.getBoundingClientRect();
          localMouseX = ((mouseObj.x - rect.left) / rect.width) * 100;
          localMouseY = ((mouseObj.y - rect.top) / rect.height) * 100;
        }

        drones.forEach((drone) => {
          drone.stateTimer--;

          // Transition logic for autonomous behavior states
          if (drone.stateTimer <= 0) {
            const roll = Math.random();
            if (roll < 0.45) {
              drone.state = "patroll";
              drone.stateTimer = 100 + Math.random() * 120;
            } else if (roll < 0.7) {
              drone.state = "pause";
              drone.stateTimer = 40 + Math.random() * 40;
            } else if (roll < 0.85) {
              drone.state = "scan";
              drone.stateTimer = 60 + Math.random() * 50;
              drone.scanProgress = 0;
            } else {
              drone.state = "repair";
              drone.stateTimer = 50 + Math.random() * 40;
              // Pick a random intersection node of the radial web as target for repairs
              const randomAngle = webSpokeAngles[Math.floor(Math.random() * webSpokesCount)];
              const randomRing = webRings[Math.floor(Math.random() * webRings.length)];
              drone.repairTargetNode = {
                x: coreX + Math.cos(randomAngle) * randomRing,
                y: coreY + Math.sin(randomAngle) * randomRing,
              };
            }
          }

          // Rare Cursor Attraction state: Drone notices proximity of the high-precision cursor
          if (
            drone.state !== "attention" &&
            localMouseX >= 0 &&
            localMouseX <= 100 &&
            localMouseY >= 0 &&
            localMouseY <= 100 &&
            Math.hypot(drone.x - localMouseX, drone.y - localMouseY) < 22 &&
            Math.random() < 0.006
          ) {
            drone.state = "attention";
            drone.stateTimer = 90;
            drone.scanProgress = 0;
          }

          // Compute next position based on state behaviors
          if (drone.state === "patroll") {
            drone.angle += drone.speed;
            drone.targetX = coreX + Math.cos(drone.angle) * drone.orbitRadius;
            drone.targetY = coreY + Math.sin(drone.angle) * drone.orbitRadius;
            drone.legPhase += Math.abs(drone.speed) * 4;
          } else if (drone.state === "repair" && drone.repairTargetNode) {
            // Move slightly toward repair node
            const tx = drone.repairTargetNode.x;
            const ty = drone.repairTargetNode.y;
            drone.targetX = drone.x + (tx - drone.x) * 0.06;
            drone.targetY = drone.y + (ty - drone.y) * 0.06;
            drone.legPhase += 0.05;

            // Emit sparks procedurally during repairs
            if (frameCount % 4 === 0) {
              createSparks(tx, ty, 1, "#E63946");
            }
          } else if (drone.state === "attention") {
            // Crawl slowly closer to custom cursor, staying at safe 8px limit
            const distToMouse = Math.hypot(localMouseX - drone.x, localMouseY - drone.y);
            if (distToMouse > 8) {
              const dx = (localMouseX - drone.x) / distToMouse;
              const dy = (localMouseY - drone.y) / distToMouse;
              drone.targetX = drone.x + dx * 0.35;
              drone.targetY = drone.y + dy * 0.35;
              drone.legPhase += 0.12;
            } else {
              drone.targetX = drone.x;
              drone.targetY = drone.y;
            }
          } else {
            // Paused / scanning behavior
            drone.targetX = drone.x;
            drone.targetY = drone.y;
          }

          // Crawling interpolation with realistic dampening
          drone.x += (drone.targetX - drone.x) * 0.1;
          drone.y += (drone.targetY - drone.y) * 0.1;

          // Determine current drone body angle (facing direction)
          let faceAngle = drone.angle + Math.PI / 2;
          if (drone.state === "repair" && drone.repairTargetNode) {
            faceAngle = Math.atan2(drone.repairTargetNode.y - drone.y, drone.repairTargetNode.x - drone.x);
          } else if (drone.state === "attention") {
            faceAngle = Math.atan2(localMouseY - drone.y, localMouseX - drone.x);
          }

          // Draw the robotic spider drone
          ctx.save();
          ctx.translate(drone.x, drone.y);
          ctx.rotate(faceAngle);

          // 1. Procedural micro legs articulation (6-legged robot design)
          ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
          ctx.lineWidth = 0.45;
          const legCount = 6;
          for (let i = 0; i < legCount; i++) {
            const side = i % 2 === 0 ? 1 : -1;
            const row = Math.floor(i / 2);
            const legBaseAngle = (side * Math.PI) / 3 + (row * Math.PI) / 6;
            
            // Articulate legs forward/back based on step phase
            const phaseShift = row * 1.5;
            const swing = Math.sin(drone.legPhase * 2.0 + phaseShift) * 0.25;
            const flexAngle = legBaseAngle + (drone.state === "patroll" ? swing : 0);

            const kneeX = Math.cos(flexAngle) * 2.2;
            const kneeY = Math.sin(flexAngle) * 2.2;
            const footX = Math.cos(flexAngle + side * 0.4) * 3.8;
            const footY = Math.sin(flexAngle + side * 0.4) * 3.8;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(kneeX, kneeY);
            ctx.lineTo(footX, footY);
            ctx.stroke();

            // Joint hinge
            ctx.fillStyle = themeColor;
            ctx.beginPath();
            ctx.arc(kneeX, kneeY, 0.35, 0, Math.PI * 2);
            ctx.fill();
          }

          // 2. Precision-machined titanium central body
          ctx.fillStyle = "#121212";
          ctx.strokeStyle = themeColor;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(0, 0, 1.1, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // 3. Glowing optical sensor (Front center)
          ctx.fillStyle = "#E63946";
          ctx.beginPath();
          ctx.arc(0.7, 0, 0.4, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();

          // 4. Render scanning/attention light cones in parent space
          if (drone.state === "scan" || drone.state === "attention") {
            drone.scanProgress += 0.02;
            const sweep = Math.sin(drone.scanProgress * Math.PI * 2) * 0.25;
            const coneAngle = faceAngle + sweep;
            const coneDistance = drone.state === "attention" ? 14 : 9;
            const coneWidth = drone.state === "attention" ? 0.35 : 0.6;

            const scanGradient = ctx.createRadialGradient(drone.x, drone.y, 0, drone.x, drone.y, coneDistance);
            scanGradient.addColorStop(0, "rgba(230, 57, 70, 0.16)");
            scanGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.save();
            ctx.fillStyle = scanGradient;
            ctx.beginPath();
            ctx.moveTo(drone.x, drone.y);
            ctx.arc(
              drone.x,
              drone.y,
              coneDistance,
              coneAngle - coneWidth,
              coneAngle + coneWidth
            );
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }

          // 5. Render Repair Laser Beams
          if (drone.state === "repair" && drone.repairTargetNode) {
            ctx.save();
            ctx.strokeStyle = Math.random() > 0.5 ? "#E63946" : "#ffffff";
            ctx.lineWidth = 0.35 + Math.random() * 0.35;
            // Draw high-frequency flickering laser lines from sensor
            const droneFrontX = drone.x + Math.cos(faceAngle) * 0.7;
            const droneFrontY = drone.y + Math.sin(faceAngle) * 0.7;

            ctx.beginPath();
            ctx.moveTo(droneFrontX, droneFrontY);
            ctx.lineTo(drone.repairTargetNode.x, drone.repairTargetNode.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      }

      // ────────────────────────────────────────────────────────
      // LAYER 5: Interactive Click Ripples & Sparks
      // ────────────────────────────────────────────────────────
      // Update and draw decaying sparks
      sparks = sparks.filter((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 0.022;

        if (s.alpha <= 0) return false;

        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        return true;
      });

      // Update and draw expanding click ripples
      clickRipples = clickRipples.filter((r) => {
        r.r += 0.82;
        r.alpha -= 0.025;

        if (r.alpha <= 0 || r.r >= r.maxR) return false;

        ctx.strokeStyle = `rgba(230, 57, 70, ${r.alpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();

        return true;
      });

      ctx.restore();

    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("sentinelClick", handleSentinelClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pxSize, animateOnMount, isAssembled, themeColor, isScanning]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-auto"
      />
    </div>
  );
}
