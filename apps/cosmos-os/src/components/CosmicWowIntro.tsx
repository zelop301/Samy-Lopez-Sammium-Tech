/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../sound';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ShieldAlert, ArrowRight, Compass, SkipForward, Cpu, Orbit, Atom, Globe } from 'lucide-react';

interface CosmicWowIntroProps {
  onComplete: () => void;
}

export default function CosmicWowIntro({ onComplete }: CosmicWowIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<number>(0); 
  // 0: Web Audio authorization
  // 1: 🚀 Stage 1 — Quantum Link (Black, central photon, energy ring scans)
  // 2: ⚡ Stage 2 — Neural Synchronization (Neural lattice, particle assembly, system connections)
  // 3: 🌌 Stage 3 — Hyperdrive Ignition (Spacetime folding, constellations, speed acceleration)
  // 4: 🌠 Stage 4 — Time Warp Corridor & Signature (Equations, trajectory streams, collapse to single point, flash)
  // 5: 🌍 Stage 5 — Universe Construction (Procedural cosmic assembly timeline)
  // 6: ⚛ Stage 6 — Observatory Boot (Hexagonal HUD widgets calibration)
  // 7: 🌌 Stage 7 — Black Hole Gateway (Approaching rotating black hole, slowing, entering horizon)
  // 8: ✨ Stage 8 — Holographic Observatory (Floating in spacetime grids, weightless environment)
  // 9: 🤖 Stage 9 — AI Materialization (AI compiles from spiral stardust)
  // 10: 🌠 Stage 10 — Final Reveal (Milky Way background, stardust assembled logo, AI greeting)

  const [calibrations] = useState<Array<{ name: string; value: string }>>([
    { name: 'Physics Engine', value: 'OK' },
    { name: 'Particle Simulation', value: 'OK' },
    { name: 'Gravity Solver', value: 'OK' },
    { name: 'Neural AI', value: 'OK' },
  ]);

  const [constructionStep, setConstructionStep] = useState<string>('Matter');
  const [typedGreeting, setTypedGreeting] = useState<string>('');
  const [signatureCollapsed, setSignatureCollapsed] = useState<boolean>(false);
  const [signatureFlash, setSignatureFlash] = useState<boolean>(false);

  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Particle systems
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    z: number;
    ox?: number;
    oy?: number;
    size: number;
    color: string;
    speed: number;
    angle?: number;
    text?: string;
  }>>([]);

  const textParticlesRef = useRef<Array<{
    x: number;
    y: number;
    tx: number;
    ty: number;
    vx: number;
    vy: number;
    char: string;
    alpha: number;
  }>>([]);

  // Initialize background starfield particles
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 500; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 1200,
        y: (Math.random() - 0.5) * 1200,
        z: Math.random() * 1000 + 10,
        size: Math.random() * 2 + 0.5,
        color: i % 4 === 0 ? 'rgba(0, 200, 255, 0.85)' : i % 4 === 1 ? 'rgba(139, 92, 246, 0.8)' : i % 4 === 2 ? 'rgba(245, 158, 11, 0.85)' : 'rgba(255, 255, 255, 0.9)',
        speed: Math.random() * 0.03 + 0.01,
      });
    }
    particlesRef.current = stars;
  }, []);

  // Chronological Stage Controller
  useEffect(() => {
    if (phase === 0) return;

    const runTimeline = async () => {
      // Stage 1: Quantum Link (3.0s)
      if (phase === 1) {
        soundEngine.playHolographicBeep(880, 0.25, 'sine');
        phaseTimerRef.current = setTimeout(() => {
          setPhase(2);
        }, 3000);
      }

      // Stage 2: Neural Synchronization (3.5s)
      if (phase === 2) {
        soundEngine.playHolographicBeep(1100, 0.15, 'triangle');
        const timeoutA = setTimeout(() => {
          soundEngine.playHolographicBeep(1320, 0.15, 'sine');
        }, 1200);

        phaseTimerRef.current = setTimeout(() => {
          clearTimeout(timeoutA);
          setPhase(3);
        }, 3500);
      }

      // Stage 3: Hyperdrive Ignition (3.5s)
      if (phase === 3) {
        soundEngine.playCosmicIgnition();
        phaseTimerRef.current = setTimeout(() => {
          setPhase(4);
        }, 3500);
      }

      // Stage 4: Time Warp Corridor & Signature Animation (5.0s)
      if (phase === 4) {
        soundEngine.playHyperdriveEngine(4.0);
        
        // Trigger signature transition collapse & flash at 3.5s
        const collapseTimeout = setTimeout(() => {
          setSignatureCollapsed(true);
          soundEngine.playWormholeWhoosh();
        }, 3200);

        const flashTimeout = setTimeout(() => {
          setSignatureFlash(true);
          soundEngine.playResonantRing(440);
        }, 3900);

        phaseTimerRef.current = setTimeout(() => {
          clearTimeout(collapseTimeout);
          clearTimeout(flashTimeout);
          setPhase(5);
        }, 5000);
      }

      // Stage 5: Universe Construction Timeline (4.0s)
      if (phase === 5) {
        soundEngine.playHolographicBeep(980, 0.1, 'sine');
        
        const timeline = ['Matter', 'Atoms', 'Gas Clouds', 'Stars', 'Galaxies', 'Clusters', 'Universe'];
        let idx = 0;
        const interval = setInterval(() => {
          if (idx < timeline.length) {
            setConstructionStep(timeline[idx]);
            soundEngine.playHolographicBeep(800 + idx * 80, 0.08, 'sine');
            idx++;
          } else {
            clearInterval(interval);
          }
        }, 500);

        phaseTimerRef.current = setTimeout(() => {
          clearInterval(interval);
          setPhase(6);
        }, 4000);
      }

      // Stage 6: Observatory Boot (3.5s)
      if (phase === 6) {
        soundEngine.playHolographicBeep(1200, 0.12, 'triangle');
        phaseTimerRef.current = setTimeout(() => {
          setPhase(7);
        }, 3500);
      }

      // Stage 7: Black Hole Gateway (4.0s)
      if (phase === 7) {
        soundEngine.playGravityHumTransition();
        phaseTimerRef.current = setTimeout(() => {
          setPhase(8);
        }, 4000);
      }

      // Stage 8: Holographic Observatory (3.5s)
      if (phase === 8) {
        soundEngine.playResonantRing(330);
        phaseTimerRef.current = setTimeout(() => {
          setPhase(9);
        }, 3500);
      }

      // Stage 9: AI Materialization (4.0s)
      if (phase === 9) {
        soundEngine.playHolographicBeep(1100, 0.4, 'sine');
        phaseTimerRef.current = setTimeout(() => {
          setPhase(10);
        }, 4000);
      }

      // Stage 10: Final Reveal & Dialogue
      if (phase === 10) {
        compileLogoParticles();
        soundEngine.playResonantRing(220);

        const fullMessage = "Connection established. Welcome, Explorer. The universe is ready.";
        let charIdx = 0;
        const dialogTimer = setInterval(() => {
          if (charIdx < fullMessage.length) {
            setTypedGreeting((prev) => prev + fullMessage.charAt(charIdx));
            charIdx++;
          } else {
            clearInterval(dialogTimer);
          }
        }, 50);

        return () => clearInterval(dialogTimer);
      }
    };

    runTimeline();

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [phase]);

  // logo stardust particle alignment builder
  const compileLogoParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Measure and render SAMMIUM COSMOS to gather coordinates
    ctx.fillText('SAMMIUM COSMOS', width / 2, height / 2 - 40);
    const imgData = ctx.getImageData(0, 0, width, height);
    const step = 6;

    const textParticles = [];
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        if (imgData.data[idx + 3] > 120) {
          const angle = Math.random() * Math.PI * 2;
          const dist = 400 + Math.random() * 200;
          textParticles.push({
            x: width / 2 + Math.cos(angle) * dist,
            y: height / 2 + Math.sin(angle) * dist,
            tx: x,
            ty: y,
            vx: 0,
            vy: 0,
            char: Math.random() > 0.6 ? '*' : Math.random() > 0.4 ? '·' : '+',
            alpha: 0,
          });
        }
      }
    }
    textParticlesRef.current = textParticles;
  };

  // Main Canvas Rendering Loops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let rotationAngle = 0;
    let waveOffset = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      // Spacetime background styles
      if (phase === 1) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);
      } else if (signatureCollapsed && !signatureFlash && phase === 4) {
        ctx.fillStyle = '#010206';
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = 'rgba(2, 3, 12, 0.18)'; // cosmic tracer residue
        ctx.fillRect(0, 0, w, h);
      }

      rotationAngle += 0.003;
      waveOffset += 0.05;

      // 🚀 Stage 1 — Quantum Link (Ring transition ◌ -> ◎ -> ◉)
      if (phase === 1) {
        const time = Date.now() / 250;
        
        // Central core photon
        const rCore = 6 + Math.sin(time) * 2;
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rCore * 6);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.3, 'rgba(0, 200, 255, 0.85)');
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, rCore * 6, 0, Math.PI * 2);
        ctx.fill();

        // Sequential growing quantum ring orbits
        const ringProgression = (Date.now() % 3000) / 3000;
        ctx.lineWidth = 1.5;

        // Ring 1 (◌)
        ctx.strokeStyle = `rgba(0, 200, 255, ${1 - ringProgression})`;
        ctx.beginPath();
        ctx.arc(cx, cy, ringProgression * 180, 0, Math.PI * 2);
        ctx.stroke();

        // Ring 2 (◎)
        if (ringProgression > 0.3) {
          ctx.strokeStyle = `rgba(139, 92, 246, ${1.2 - ringProgression})`;
          ctx.beginPath();
          ctx.arc(cx, cy, (ringProgression - 0.3) * 240, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Ring 3 (◉)
        if (ringProgression > 0.6) {
          ctx.strokeStyle = `rgba(245, 158, 11, ${1.5 - ringProgression})`;
          ctx.beginPath();
          ctx.arc(cx, cy, (ringProgression - 0.6) * 300, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // ⚡ Stage 2 — Neural Synchronization (Neural lattice, particle assembly)
      if (phase === 2) {
        const nodeCount = 65;
        const nodes: Array<{ x: number; y: number; size: number; color: string }> = [];
        
        // Generate coordinates procedurally
        for (let i = 0; i < nodeCount; i++) {
          const t = (i / nodeCount) * Math.PI * 2 + rotationAngle;
          const r = 120 + Math.sin(i * 1.5) * 50 + Math.cos(rotationAngle) * 20;
          nodes.push({
            x: cx + Math.cos(t) * r,
            y: cy + Math.sin(t) * r,
            size: 2 + Math.sin(i) * 1.5,
            color: i % 2 === 0 ? '#00c8ff' : '#8b5cf6',
          });
        }

        // Draw connecting lattices
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.08)';
        ctx.lineWidth = 1.0;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }

        // Draw nodes
        nodes.forEach((node) => {
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 🌌 Stage 3 & 4 — Hyperdrive & Warp Corridor (with equations & trajectory lines)
      if (phase >= 3 && phase <= 4) {
        // Star acceleration vector drawing
        particlesRef.current.forEach((star) => {
          if (phase === 3) {
            star.z -= 14; // Acceleration speed
          } else {
            star.z -= 35; // Warp speed
          }

          if (star.z <= 0) star.z = 1000;

          const sx = cx + (star.x / star.z) * 450;
          const sy = cy + (star.y / star.z) * 450;

          if (sx >= 0 && sx <= w && sy >= 0 && sy <= h) {
            const size = star.size * (1 - star.z / 1000);
            const length = phase === 4 ? 120 : 40;
            const angle = Math.atan2(sy - cy, sx - cx);

            const ex = sx + Math.cos(angle) * length;
            const ey = sy + Math.sin(angle) * length;

            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
            ctx.strokeStyle = star.color;
            ctx.lineWidth = size * 1.6;
            ctx.stroke();

            // Signature Feature: stars transform into equations, lines and data streams
            if (phase === 4 && Math.random() > 0.94) {
              ctx.fillStyle = 'rgba(0, 200, 255, 0.85)';
              ctx.font = '8px monospace';
              const languages = [
                'G_μν = 8πT_μν',
                'E=mc²',
                'Ψ_t = ĤΨ',
                'ds² = -c²dt² + a²dx²',
                'ΔxΔp ⩾ ℏ/2',
                'H_0 = 70 km/s/Mpc',
                'f(R) Gravity',
                'r_s = 2GM/c²',
              ];
              ctx.fillText(languages[Math.floor(Math.random() * languages.length)], sx + 8, sy);
            }
          }
        });

        // Spacetime Einstein bending mesh lens
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.lineWidth = 1.0;
        for (let i = 1; i <= 8; i++) {
          ctx.beginPath();
          ctx.arc(cx, cy, i * 60 + Math.sin(waveOffset + i) * 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Signature Animation Peak: collapse to central singularity
        if (signatureCollapsed) {
          const collSize = 10 + Math.sin(Date.now() / 100) * 5;
          const collGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, collSize * 3);
          collGrad.addColorStop(0, '#ffffff');
          collGrad.addColorStop(0.5, '#00c8ff');
          collGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = collGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, collSize * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Singularity blast flash
        if (signatureFlash) {
          const flashGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, w * 0.9);
          flashGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
          flashGrad.addColorStop(0.2, 'rgba(0, 200, 255, 0.8)');
          flashGrad.addColorStop(0.6, 'rgba(139, 92, 246, 0.3)');
          flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = flashGrad;
          ctx.beginPath();
          ctx.arc(cx, cy, w, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 🌍 Stage 5 — Universe Construction (Aesthetic chemical structures or spiral nebula)
      if (phase === 5) {
        // Render expanding colorful spiral dust nebulae
        const pulseRatio = (Date.now() % 3000) / 3000;
        const nebulaRadius = pulseRatio * w * 0.45;
        const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, nebulaRadius);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        grad.addColorStop(0.25, 'rgba(245, 158, 11, 0.45)');
        grad.addColorStop(0.55, 'rgba(139, 92, 246, 0.25)');
        grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, nebulaRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // ⚛ Stage 6 — Observatory Boot (Hexagonal calibration HUD)
      if (phase === 6) {
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.15)';
        ctx.lineWidth = 1.0;
        
        // Draw decorative hexagonal matrix patterns
        const hexSize = 50;
        const xSpacing = hexSize * 1.5;
        const ySpacing = hexSize * Math.sqrt(3);

        for (let x = cx - 300; x <= cx + 300; x += xSpacing) {
          for (let y = cy - 200; y <= cy + 200; y += ySpacing) {
            ctx.beginPath();
            for (let side = 0; side < 6; side++) {
              const angle = (side * Math.PI) / 3;
              ctx.lineTo(x + hexSize * Math.cos(angle), y + hexSize * Math.sin(angle));
            }
            ctx.closePath();
            ctx.stroke();
          }
        }
      }

      // 🌌 Stage 7 & 8 — Black Hole Gateway & Spacetime Curved Observatory
      if (phase >= 7 && phase <= 9) {
        const bhRadius = 70 + Math.sin(Date.now() / 350) * 2;
        const diskRadiusX = bhRadius * 4.4;
        const diskRadiusY = bhRadius * 1.5;

        // 1. Einstein rings lens distortion halos
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(cx, cy, bhRadius * 1.25, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0, 200, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, bhRadius * 1.75, 0, Math.PI * 2);
        ctx.stroke();

        // 2. Beautiful accretion disk
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.15);
        
        const diskGrad = ctx.createRadialGradient(0, 0, bhRadius * 1.1, 0, 0, diskRadiusX);
        diskGrad.addColorStop(0, '#ffffff');
        diskGrad.addColorStop(0.15, '#f59e0b');
        diskGrad.addColorStop(0.4, '#ea580c');
        diskGrad.addColorStop(0.8, '#b91c1c');
        diskGrad.addColorStop(1.0, 'rgba(185, 28, 28, 0)');

        ctx.fillStyle = diskGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, diskRadiusX, diskRadiusY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 3. Absolute Void Singularity
        ctx.fillStyle = '#010205';
        ctx.beginPath();
        ctx.arc(cx, cy, bhRadius, 0, Math.PI * 2);
        ctx.fill();

        // 4. Stylized Curved Spacetime Orbits for Stage 8/9
        if (phase === 8 || phase === 9) {
          ctx.strokeStyle = 'rgba(0, 200, 255, 0.15)';
          ctx.lineWidth = 1.0;
          for (let i = 1; i <= 6; i++) {
            ctx.beginPath();
            ctx.ellipse(cx, cy, bhRadius * 2.2 * i * 0.5, bhRadius * 1.1 * i * 0.5, 0.2, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      // 🤖 Stage 9 — AI Materialization (Photon neural assemble sphere)
      if (phase === 9) {
        const pCount = 100;
        ctx.fillStyle = '#22d3ee';
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.12)';
        ctx.lineWidth = 0.8;

        const sphereRadius = 130 + Math.sin(Date.now() / 200) * 5;
        const calculatedNodes: Array<{ x: number; y: number }> = [];

        for (let i = 0; i < pCount; i++) {
          const theta = (i / pCount) * Math.PI * 2 + rotationAngle * 3;
          const phi = Math.acos((i / pCount) * 2 - 1);
          
          const nx = cx + sphereRadius * Math.sin(phi) * Math.cos(theta);
          const ny = cy + sphereRadius * Math.cos(phi);

          calculatedNodes.push({ x: nx, y: ny });

          ctx.beginPath();
          ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw node grid links
        for (let j = 0; j < calculatedNodes.length; j += 6) {
          const n1 = calculatedNodes[j];
          const n2 = calculatedNodes[(j + 2) % calculatedNodes.length];
          const n3 = calculatedNodes[(j + 4) % calculatedNodes.length];

          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.lineTo(n3.x, n3.y);
          ctx.closePath();
          ctx.stroke();
        }
      }

      // 🌠 Stage 10 — Final Reveal (Stardust logo assembly)
      if (phase === 10) {
        textParticlesRef.current.forEach((tp) => {
          tp.vx = (tp.tx - tp.x) * 0.08;
          tp.vy = (tp.ty - tp.y) * 0.08;
          tp.x += tp.vx;
          tp.y += tp.vy;
          tp.alpha = Math.min(1.0, tp.alpha + 0.04);

          ctx.fillStyle = `rgba(255, 255, 255, ${tp.alpha})`;
          ctx.font = 'bold 8px monospace';
          ctx.fillText(tp.char, tp.x, tp.y);
        });
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [phase, signatureCollapsed, signatureFlash]);

  const handleSkip = () => {
    soundEngine.playAchievement();
    onComplete();
  };

  const handleBeginDiscovery = () => {
    soundEngine.playAchievement();
    onComplete();
  };

  return (
    <AnimatePresence>
      <div id="cosmos-os-intro" className="fixed inset-0 z-[9999] flex flex-col justify-between overflow-hidden bg-[#02030A]">
        {/* Render Canvas Backdrop */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />

        {/* Phase 0: Web Audio Authorization Guard */}
        {phase === 0 && (
          <motion.div
            key="auth-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-radial-at-c from-[#08152e]/95 to-[#02030a]/98 p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="max-w-md w-full text-center flex flex-col items-center gap-6"
            >
              <div className="w-24 h-24 rounded-full border border-[#00C8FF]/30 flex items-center justify-center bg-[#061226]/80 relative shadow-[0_0_40px_rgba(0,200,255,0.25)]">
                <Compass className="w-12 h-12 text-[#00C8FF] animate-spin-slow" />
                <div className="absolute inset-0 rounded-full border border-dashed border-[#8B5CF6]/30 scale-125 animate-pulse" />
              </div>

              <div>
                <h1 className="text-3xl font-extrabold tracking-[0.25em] text-white font-sans uppercase bg-gradient-to-r from-white via-[#00C8FF] to-[#8B5CF6] bg-clip-text text-transparent">
                  SAMMIUM COSMOS
                </h1>
                <p className="text-[#00C8FF]/90 text-[10px] font-mono tracking-[0.4em] uppercase mt-2">
                  Quantum Link Connection
                </p>
              </div>

              <div className="bg-[#0b132b]/85 border border-[#00C8FF]/20 px-5 py-4 rounded-xl text-slate-300 text-xs font-mono leading-relaxed text-left flex gap-3.5 items-start">
                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-semibold">Soundscape Activation:</span> This premium simulation employs a sophisticated procedural synthesizer mapping gravitational waves, orbit friction, and particle impacts to authentic sound. Press below to authorize audio and ignite core.
                </div>
              </div>

              <button
                id="ignite-auth-btn"
                onClick={() => {
                  soundEngine.setMute(false);
                  setPhase(1); // Jump to Stage 1 Quantum Link
                }}
                className="group relative flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#00C8FF]/40 to-[#8B5CF6]/40 border border-[#00C8FF]/50 text-white font-mono text-xs tracking-widest uppercase hover:border-[#00C8FF] transition-all hover:shadow-[0_0_25px_rgba(0,200,255,0.35)] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                <span>Establish Quantum Link</span>
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Global Skip button */}
        {phase > 0 && phase < 10 && (
          <button
            onClick={handleSkip}
            className="absolute bottom-6 right-6 z-[100] flex items-center gap-2 px-4 py-2 border border-[#00C8FF]/30 bg-[#061226]/60 rounded-full hover:border-[#00C8FF]/70 text-slate-400 hover:text-[#00C8FF] text-[10px] font-mono tracking-widest uppercase transition-all duration-300 backdrop-blur-md cursor-pointer"
          >
            <span>Skip Link Sequence</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Stage HUD text labels */}
        {phase >= 1 && phase <= 9 && (
          <div className="absolute top-8 inset-x-0 text-center z-10 pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              transition={{ duration: 1 }}
              className="text-[10px] font-mono tracking-[0.4em] text-[#00C8FF] uppercase"
            >
              {phase === 1 && "🚀 STAGE 1 — Quantum Link Initialization"}
              {phase === 2 && "⚡ STAGE 2 — Neural Synchronization Active"}
              {phase === 3 && "🌌 STAGE 3 — Spacetime Hyperdrive Ignition"}
              {phase === 4 && "🌠 STAGE 4 — Time Warp Relativistic Corridor"}
              {phase === 5 && "🌍 STAGE 5 — Procedural Universe Construction"}
              {phase === 6 && "⚛ STAGE 6 — Observatory Hardware Calibration"}
              {phase === 7 && "🌌 STAGE 7 — Black Hole Event Horizon Approaching"}
              {phase === 8 && "✨ STAGE 8 — Curved Spacetime Observatory Ready"}
              {phase === 9 && "🤖 STAGE 9 — AI Consciousness Assembly"}
            </motion.div>
          </div>
        )}

        {/* Stage 2 Display panel */}
        {phase === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center p-4"
          >
            <div className="bg-[#030712]/80 border border-[#00c8ff]/25 p-6 rounded-2xl max-w-sm w-full font-mono text-center backdrop-blur-xl">
              <Cpu className="w-6 h-6 text-cyan-400 mx-auto mb-3 animate-pulse" />
              <p className="text-xs text-cyan-400 tracking-wider uppercase font-semibold mb-3">SYNCHRONIZATION METRICS</p>
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-[10px] bg-cyan-950/20 border border-cyan-900/40 p-2 rounded">
                  <span className="text-slate-400">NEURAL INTERFACE</span>
                  <span className="text-cyan-400 font-bold">98%</span>
                </div>
                <div className="flex justify-between text-[10px] bg-cyan-950/20 border border-cyan-900/40 p-2 rounded">
                  <span className="text-slate-400">QUANTUM NETWORK</span>
                  <span className="text-emerald-400 font-bold">CONNECTED</span>
                </div>
                <div className="flex justify-between text-[10px] bg-cyan-950/20 border border-cyan-900/40 p-2 rounded">
                  <span className="text-slate-400">SPATIAL CALIBRATION</span>
                  <span className="text-amber-400 font-bold">COMPLETE</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stage 5 Timeline display */}
        {phase === 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-x-6 top-1/4 z-10 flex flex-col items-center justify-center font-mono"
          >
            <div className="border border-[#f59e0b]/30 bg-black/60 p-6 rounded-2xl max-w-md w-full text-center backdrop-blur-xl">
              <Orbit className="w-8 h-8 text-amber-500 mx-auto mb-3 animate-spin-slow" />
              <p className="text-[10px] text-amber-500 uppercase tracking-widest mb-4 font-bold">COSMIC TIMELINE ASSEMBLY</p>
              <div className="text-xl font-bold text-white uppercase tracking-wider h-10 flex items-center justify-center">
                {constructionStep}...
              </div>
              <div className="w-full bg-[#1e1503] h-1.5 rounded-full overflow-hidden mt-3 border border-[#f59e0b]/20">
                <div 
                  className="bg-amber-500 h-full transition-all duration-300" 
                  style={{ 
                    width: constructionStep === 'Matter' ? '15%' :
                           constructionStep === 'Atoms' ? '30%' :
                           constructionStep === 'Gas Clouds' ? '45%' :
                           constructionStep === 'Stars' ? '60%' :
                           constructionStep === 'Galaxies' ? '75%' :
                           constructionStep === 'Clusters' ? '90%' : '100%'
                  }} 
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Stage 6 Observatory HUD widgets */}
        {phase === 6 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center p-4 z-10"
          >
            <div className="w-full max-w-md border border-[#00C8FF]/20 bg-[#061226]/80 backdrop-blur-xl p-6 rounded-2xl font-mono text-xs shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-[#00C8FF]/20 pb-3 mb-4">
                <span className="text-[#00C8FF] tracking-widest font-bold uppercase">OBSERVATORY HUD CALIBRATION</span>
                <span className="text-emerald-400 animate-pulse text-[10px]">BOOTING COGNITIVE MODULES...</span>
              </div>
              <div className="space-y-2.5">
                {calibrations.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[#030812]/90 border border-[#00C8FF]/10 px-3 py-2 rounded-lg">
                    <span className="text-slate-400 text-[10px] uppercase">{item.name}</span>
                    <span className="text-emerald-400 font-semibold text-[10px] tracking-wide">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stage 9 Neural Brain Materialize indicator */}
        {phase === 9 && (
          <div className="absolute bottom-16 inset-x-0 z-10 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#030712]/95 border border-cyan-500/30 px-6 py-4 rounded-xl max-w-sm w-full text-center font-mono backdrop-blur-xl"
            >
              <Atom className="w-5 h-5 text-cyan-400 mx-auto mb-2 animate-spin-slow" />
              <p className="text-[10px] tracking-widest text-cyan-400 uppercase font-bold">AI CONSCIOUSNESS ONLINE</p>
              <p className="text-[9px] text-slate-400 uppercase mt-1">Materializing Cognitive Geometry</p>
            </motion.div>
          </div>
        )}

        {/* Stage 10 final dialogue & greeting display */}
        {phase === 10 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 bg-black/45 backdrop-blur-md"
          >
            <div className="relative w-full max-w-2xl border border-[#00C8FF]/20 bg-[#061226]/40 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(2,3,10,0.85)] flex flex-col items-center text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00C8FF]/40 rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00C8FF]/40 rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00C8FF]/40 rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00C8FF]/40 rounded-br-xl" />

              <div className="flex items-center gap-2 text-[10px] font-mono text-[#00C8FF] uppercase tracking-widest bg-[#00C8FF]/15 px-3.5 py-1 rounded-full mb-6 border border-[#00C8FF]/30">
                <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                <span>Cosmos OS Connected</span>
              </div>

              {/* Glowing core representing AI intelligence */}
              <div className="w-20 h-20 rounded-full border border-[#8B5CF6]/30 flex items-center justify-center bg-[#030712]/90 relative mb-8 shadow-[0_0_30px_rgba(139,92,246,0.3)] animate-pulse">
                <Globe className="w-10 h-10 text-[#8B5CF6] animate-spin-slow" />
                <div className="absolute inset-2 rounded-full border border-dashed border-[#00C8FF]/30 animate-spin" />
              </div>

              {/* Main Dialog script */}
              <div className="min-h-[64px] max-w-md">
                <p className="text-xl md:text-2xl font-bold tracking-tight text-white leading-relaxed font-sans select-none">
                  {typedGreeting}
                  <span className="w-1.5 h-4 bg-[#00C8FF] inline-block animate-pulse ml-1" />
                </p>
              </div>

              {/* Button CTA to unlock simulation */}
              {typedGreeting.length >= 30 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="mt-8 flex justify-center w-full"
                >
                  <button
                    id="ignite-discovery-cta"
                    onClick={handleBeginDiscovery}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00C8FF] to-[#8B5CF6] text-white font-mono text-xs tracking-widest uppercase font-bold hover:shadow-[0_0_30px_rgba(0,200,255,0.45)] transition-all hover:scale-105 cursor-pointer border border-[#00C8FF]/30"
                  >
                    <span>Begin Discovery Drive</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Bottom tracker message */}
        {phase > 0 && phase < 10 && (
          <div className="absolute bottom-8 inset-x-0 flex justify-center items-center z-10 text-slate-500 text-[10px] font-mono tracking-widest uppercase pointer-events-none">
            <span>SAMMIUM COSMOS — INITIALIZING QUANTUM OBSERVATORY LINK</span>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
