import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getPerformanceProfile } from "../utils/performance";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

interface TrailNode {
  x: number;
  y: number;
  time: number;
  thickness: number;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
  speed: number;
  color: string;
  isSecondary: boolean;
}

interface WebPulse {
  angle: number;
  progress: number;
  speed: number;
}

interface SentinelCursorProps {
  isScanning?: boolean;
  overallThreat?: number;
  isHighContrast?: boolean;
  isReducedMotion?: boolean;
}

// Procedural sound synthesizer using Web Audio API to play sleek click / hover ticks
class ProgrammaticSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false;

  constructor(enabled: boolean) {
    this.enabled = enabled;
  }

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  playTick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.012);

      filter.type = "highpass";
      filter.frequency.setValueAtTime(600, t);

      gain.gain.setValueAtTime(0.005, t); // Ultra-soft subtle micro-servo tick
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.015);
    } catch (e) {
      // Audio context may be suspended or blocked
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Primary Click: Precision mechanical switch (double click feel) + low-frequency confirmation pulse
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      const gain2 = this.ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1100, t);
      osc1.frequency.exponentialRampToValueAtTime(300, t + 0.015);
      gain1.gain.setValueAtTime(0.015, t);
      gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(85, t);
      osc2.frequency.exponentialRampToValueAtTime(30, t + 0.1);
      gain2.gain.setValueAtTime(0.035, t);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.015);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t);
      osc2.stop(t + 0.1);
    } catch (e) {
      // Ignored
    }
  }

  playSecondaryClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.03);
      
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.032);
    } catch (e) {
      // Ignored
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(440, t);
      osc1.frequency.setValueAtTime(554.37, t + 0.1);
      osc1.frequency.setValueAtTime(659.25, t + 0.2);
      
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(220, t);
      
      gain.gain.setValueAtTime(0.015, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.45);
      osc2.stop(t + 0.45);
    } catch (e) {
      // Ignored
    }
  }

  playAlert() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(100, t);
      osc.frequency.linearRampToValueAtTime(50, t + 0.35);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, t);
      
      gain.gain.setValueAtTime(0.035, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t);
      osc.stop(t + 0.45);
    } catch (e) {
      // Ignored
    }
  }
}

export default function SentinelCursor({
  isScanning = false,
  overallThreat = 0,
  isHighContrast = false,
  isReducedMotion = false,
}: SentinelCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorContainerRef = useRef<HTMLDivElement | null>(null);

  // Position coordinates state
  const cursorRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const lastCursorRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const smoothCoordsRef = useRef<{ x: number; y: number; vx: number; vy: number }>({
    x: -100,
    y: -100,
    vx: 0,
    vy: 0,
  });

  const [isHovering, setIsHovering] = useState(false);
  const [clickScale, setClickScale] = useState(1);
  const [isClicking, setIsClicking] = useState(false);
  const isHoveringRef = useRef(false);
  const clickScaleRef = useRef(1);

  useEffect(() => {
    isHoveringRef.current = isHovering;
  }, [isHovering]);

  useEffect(() => {
    clickScaleRef.current = clickScale;
  }, [clickScale]);

  // Accessibility and customizable states
  const [sizeFactor, setSizeFactor] = useState(() => {
    const val = localStorage.getItem("sentinel_cursor_size");
    return val ? parseFloat(val) : 1.0;
  });
  const [glowIntensity, setGlowIntensity] = useState(() => {
    const val = localStorage.getItem("sentinel_cursor_glow");
    return val ? parseFloat(val) : 1.0;
  });
  const [trailsEnabled, setTrailsEnabled] = useState(() => {
    const val = localStorage.getItem("sentinel_cursor_trails");
    return val ? val === "true" : false;
  });
  const [soundsEnabled, setSoundsEnabled] = useState(() => {
    const val = localStorage.getItem("sentinel_cursor_sounds");
    return val ? val === "true" : false;
  });

  // Sound Synth reference
  const synthRef = useRef<ProgrammaticSynth | null>(null);
  useEffect(() => {
    synthRef.current = new ProgrammaticSynth(soundsEnabled);
  }, [soundsEnabled]);

  // Dynamic feedback HUD state
  const [hudMessage, setHudMessage] = useState<string | null>(null);
  const hudTimeoutRef = useRef<any>(null);

  const triggerHud = (message: string) => {
    setHudMessage(message);
    if (hudTimeoutRef.current) clearTimeout(hudTimeoutRef.current);
    hudTimeoutRef.current = setTimeout(() => {
      setHudMessage(null);
    }, 2200);
  };

  // Active elements reference lists
  const particlesRef = useRef<Particle[]>([]);
  const trailRef = useRef<TrailNode[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const webPulsesRef = useRef<WebPulse[]>([]);
  const lastMoveTimeRef = useRef<number>(Date.now());

  // Dynamic calculation of glow opacity based on state
  const getGlowOpacity = () => {
    let baseOpacity = 0.08; // Idle 8% (understated glow)
    if (isScanning || overallThreat >= 81) {
      baseOpacity = 0.55; // Emergency Mode 55%
    } else if (isClicking) {
      baseOpacity = 0.35; // Click 35%
    } else if (isHovering) {
      baseOpacity = 0.22; // Hover 22%
    }
    return baseOpacity * glowIntensity;
  };

  // Color Gradient helper for Ribbon trail
  // Graphite grey (#1C1C1E) -> Deep Crimson (#8B0000) -> Transparent
  const getTrailColor = (ageRatio: number, alphaMultiplier: number) => {
    let r = 28, g = 28, b = 30; // Graphite Grey base
    const a = (1 - ageRatio) * alphaMultiplier;

    if (ageRatio < 0.4) {
      // Transition from Graphite Gray (28, 28, 30) to Deep Crimson (139, 0, 0)
      const t = ageRatio / 0.4;
      r = Math.round(28 + (139 - 28) * t);
      g = Math.round(28 + (0 - 28) * t);
      b = Math.round(30 + (0 - 30) * t);
    } else {
      // Deep Crimson (139, 0, 0) fading to transparent
      r = 139;
      g = 0;
      b = 0;
    }

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  useEffect(() => {
    // Hide standard cursor globally
    document.body.classList.add("custom-cursor-active");
    const style = document.createElement("style");
    style.id = "sentinel-cursor-style";
    style.innerHTML = `
      * {
        cursor: none !important;
      }
      a, button, [role="button"], input, select, textarea, .interactive-hover {
        cursor: none !important;
      }
      
      /* Premium Interactive Hover Custom Styles */
      a:hover, button:hover, [role="button"]:hover, .interactive-hover:hover {
        transform: scale(1.015) !important;
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease !important;
        box-shadow: 0 0 12px rgba(139, 0, 0, 0.18) !important;
      }
    `;
    document.head.appendChild(style);

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      lastCursorRef.current = { ...cursorRef.current };
      cursorRef.current = { x: clientX, y: clientY };

      // Share coordinates globally for secondary widgets
      (window as any).sentinelMouse = { x: clientX, y: clientY };

      // Check if hovering over interactive elements
      const target = e.target as Element | null;
      const isInteractive = Boolean(
        target?.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer, .interactive-hover')
      );

      if (isInteractive !== isHoveringRef.current) {
        isHoveringRef.current = isInteractive;
        setIsHovering(isInteractive);
        if (isInteractive) synthRef.current?.playTick();
      }

      // Trail & Motion Parameters
      const now = Date.now();
      const dt = now - lastMoveTimeRef.current;
      lastMoveTimeRef.current = now;

      const dx = clientX - lastCursorRef.current.x;
      const dy = clientY - lastCursorRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 1 && lastCursorRef.current.x > 0) {
        const speed = distance / Math.max(1, dt);
        
        // Particle limit according to fast motion/emergency modes
        if (!isReducedMotion) {
          const isEmergency = isScanning || overallThreat >= 81;
          const maxMotionParticles = isEmergency ? 16 : 10;
          
          if (particlesRef.current.length < maxMotionParticles) {
            const particleCount = isEmergency ? Math.min(2, Math.floor(speed * 0.7)) : Math.min(1, Math.floor(speed * 0.3));
            for (let i = 0; i < particleCount; i++) {
              const angle = Math.random() * Math.PI * 2;
              const pSpeed = 0.3 + Math.random() * 0.8;
              
              const roll = Math.random();
              let pColor = "#8B0000"; // Deep Crimson
              if (roll < 0.35) pColor = "#111111"; // Graphite Grey
              else if (roll < 0.65) pColor = "#E5E5EA"; // Soft Silver
              else if (roll < 0.72) pColor = "#FFFFFF"; // Ice White

              particlesRef.current.push({
                x: clientX,
                y: clientY,
                vx: -dx * 0.08 + Math.cos(angle) * pSpeed,
                vy: -dy * 0.08 + Math.sin(angle) * pSpeed,
                size: 0.5 + Math.random() * 0.9,
                color: pColor,
                alpha: 0.45 + Math.random() * 0.4,
                decay: 0.012 + Math.random() * 0.015
              });
            }
          }
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      clickScaleRef.current = 0.85;
      setClickScale(0.85); // Natural compress scale

      const isRightClick = e.button === 2 || e.ctrlKey;

      if (synthRef.current) {
        if (!isRightClick) {
          synthRef.current.playClick();
        } else {
          synthRef.current.playSecondaryClick();
        }
      }

      const activeX = cursorRef.current.x;
      const activeY = cursorRef.current.y;

      if (!isRightClick) {
        // Primary Click: Understated crimson ripple + fast silver flash
        ripplesRef.current.push({
          x: activeX,
          y: activeY,
          r: 2,
          maxR: 35 * sizeFactor,
          alpha: 0.9,
          speed: isReducedMotion ? 1.5 : 2.5,
          color: "rgba(139, 0, 0, 0.75)", // Deep Crimson
          isSecondary: false
        });

        ripplesRef.current.push({
          x: activeX,
          y: activeY,
          r: 1,
          maxR: 15 * sizeFactor,
          alpha: 0.85,
          speed: isReducedMotion ? 2.0 : 4.0,
          color: "rgba(229, 229, 234, 0.7)", // Silver Metallic Flash
          isSecondary: false
        });

        // Click Burst (6-10 particles)
        if (!isReducedMotion) {
          const particleCount = 8;
          for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.2 + Math.random() * 2.2;
            const roll = Math.random();
            const pColor = roll < 0.5 ? "#8B0000" : (roll < 0.8 ? "#E5E5EA" : "#111111");

            particlesRef.current.push({
              x: activeX,
              y: activeY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 0.6 + Math.random() * 1.2,
              color: pColor,
              alpha: 0.9,
              decay: 0.015 + Math.random() * 0.018
            });
          }
        }
      } else {
        // Secondary Click: Minimal ripple
        ripplesRef.current.push({
          x: activeX,
          y: activeY,
          r: 1,
          maxR: 18 * sizeFactor,
          alpha: 0.8,
          speed: isReducedMotion ? 1.0 : 1.6,
          color: "rgba(28, 28, 30, 0.75)", // Graphite
          isSecondary: true
        });

        if (!isReducedMotion) {
          const particleCount = 4;
          for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.8 + Math.random() * 1.2;
            particlesRef.current.push({
              x: activeX,
              y: activeY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 0.5 + Math.random() * 0.7,
              color: "#1C1C1E",
              alpha: 0.7,
              decay: 0.02 + Math.random() * 0.01
            });
          }
        }
      }

      // Dispatch custom click event
      const clickEvent = new CustomEvent("sentinelClick", {
        detail: { x: activeX, y: activeY, isRightClick }
      });
      window.dispatchEvent(clickEvent);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      clickScaleRef.current = 1.0;
      setClickScale(1.0); // Rebound mechanical snap back
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside forms
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.getAttribute("contenteditable") === "true")) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === "[") {
        setSizeFactor((prev) => {
          const next = Math.max(0.6, prev - 0.1);
          localStorage.setItem("sentinel_cursor_size", next.toFixed(1));
          triggerHud(`Cursor Scale: ${Math.round(next * 100)}%`);
          return next;
        });
      } else if (key === "]") {
        setSizeFactor((prev) => {
          const next = Math.min(2.0, prev + 0.1);
          localStorage.setItem("sentinel_cursor_size", next.toFixed(1));
          triggerHud(`Cursor Scale: ${Math.round(next * 100)}%`);
          return next;
        });
      } else if (key === "-") {
        setGlowIntensity((prev) => {
          const next = Math.max(0.2, prev - 0.2);
          localStorage.setItem("sentinel_cursor_glow", next.toFixed(1));
          triggerHud(`Glow Intensity: ${Math.round(next * 100)}%`);
          return next;
        });
      } else if (key === "=" || key === "+") {
        setGlowIntensity((prev) => {
          const next = Math.min(3.0, prev + 0.2);
          localStorage.setItem("sentinel_cursor_glow", next.toFixed(1));
          triggerHud(`Glow Intensity: ${Math.round(next * 100)}%`);
          return next;
        });
      } else if (key === "t") {
        setTrailsEnabled((prev) => {
          const next = !prev;
          localStorage.setItem("sentinel_cursor_trails", next.toString());
          triggerHud(`Cursor Trails: ${next ? "ENABLED" : "DISABLED"}`);
          return next;
        });
      } else if (key === "s") {
        setSoundsEnabled((prev) => {
          const next = !prev;
          localStorage.setItem("sentinel_cursor_sounds", next.toString());
          triggerHud(`Interaction Sounds: ${next ? "ENABLED" : "DISABLED"}`);
          return next;
        });
      }
    };

    // Custom window signal listeners to play alerts or success procedurally
    const handleSuccessEvent = () => {
      if (synthRef.current) synthRef.current.playSuccess();
    };
    const handleAlertEvent = () => {
      if (synthRef.current) synthRef.current.playAlert();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("sentinelSuccess", handleSuccessEvent);
    window.addEventListener("sentinelAlert", handleAlertEvent);

    // Canvas setup
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Setup 3 beautifully simulated white spider drones rotating/orbiting coordinates
    const cursorSpiders = [
      { orbitRadius: 18, angle: 0, speed: 0.025, legPhase: 0 },
      { orbitRadius: 28, angle: Math.PI * 0.67, speed: -0.018, legPhase: 1.5 },
      { orbitRadius: 38, angle: Math.PI * 1.33, speed: 0.012, legPhase: 3.0 }
    ];

    const profile = getPerformanceProfile();
    const frameInterval = 1000 / profile.targetFps;
    let animFrame = 0;
    let lastRenderTime = 0;
    let pageVisible = !document.hidden;

    const handleVisibilityChange = () => {
      pageVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const render = (frameTime: number) => {
      animFrame = requestAnimationFrame(render);
      if (!pageVisible || frameTime - lastRenderTime < frameInterval || !canvas || !ctx) return;
      lastRenderTime = frameTime - ((frameTime - lastRenderTime) % frameInterval);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      const cx = cursorRef.current.x;
      const cy = cursorRef.current.y;

      // 1. Physically believable movement: Smooth spring interpolation calculations
      const smooth = smoothCoordsRef.current;
      if (cx > 0 && cy > 0) {
        if (smooth.x === -100 && smooth.y === -100) {
          smooth.x = cx;
          smooth.y = cy;
        }

        const stiffness = isReducedMotion ? 1.0 : 0.15; // instantaneous catch up if reduced motion
        const damping = isReducedMotion ? 0.0 : 0.74; // inertia, weight and damping

        const dx = cx - smooth.x;
        const dy = cy - smooth.y;

        smooth.vx = (smooth.vx + dx * stiffness) * damping;
        smooth.vy = (smooth.vy + dy * stiffness) * damping;

        smooth.x += smooth.vx;
        smooth.y += smooth.vy;

        // Position the fixed div element directly via ref for sub-pixel latency and 144Hz fluidity
        if (cursorContainerRef.current) {
          cursorContainerRef.current.style.opacity = "1";
          cursorContainerRef.current.style.left = `${smooth.x}px`;
          cursorContainerRef.current.style.top = `${smooth.y}px`;
          cursorContainerRef.current.style.transform = `translate(-50%, -50%) scale(${clickScaleRef.current * sizeFactor})`;
        }

        // Draw precision concentric web lines around smooth coordinate index
        ctx.save();
        const rings = [10 * sizeFactor, 22 * sizeFactor, 34 * sizeFactor];
        const webOpacity = isHighContrast ? 0.55 : 0.18; // minimal visual noise

        rings.forEach((r) => {
          ctx.strokeStyle = `rgba(139, 0, 0, ${webOpacity})`; // deep crimson
          ctx.lineWidth = isHighContrast ? 1.0 : 0.5;
          ctx.beginPath();
          ctx.arc(smooth.x, smooth.y, r, 0, Math.PI * 2);
          ctx.stroke();

          // Subtle titanium silver micro outline highlight
          if (!isHighContrast) {
            ctx.strokeStyle = "rgba(229, 229, 234, 0.06)";
            ctx.lineWidth = 0.3;
            ctx.beginPath();
            ctx.arc(smooth.x, smooth.y, r + 0.5, 0, Math.PI * 2);
            ctx.stroke();
          }
        });

        // 6 precision radial spoke lines
        const spokeAngles = [0, Math.PI / 3, Math.PI * 2 / 3, Math.PI, Math.PI * 4 / 3, Math.PI * 5 / 3];
        spokeAngles.forEach((a) => {
          ctx.strokeStyle = `rgba(139, 0, 0, ${webOpacity})`;
          ctx.lineWidth = isHighContrast ? 1.0 : 0.5;
          ctx.beginPath();
          ctx.moveTo(smooth.x, smooth.y);
          ctx.lineTo(smooth.x + Math.cos(a) * 36 * sizeFactor, smooth.y + Math.sin(a) * 36 * sizeFactor);
          ctx.stroke();
        });

        // Spoke intersection nodes
        ctx.fillStyle = `rgba(229, 229, 234, ${webOpacity * 0.7})`;
        rings.forEach((r) => {
          spokeAngles.forEach((a) => {
            ctx.beginPath();
            ctx.arc(smooth.x + Math.cos(a) * r, smooth.y + Math.sin(a) * r, 0.6 * sizeFactor, 0, Math.PI * 2);
            ctx.fill();
          });
        });

        // Interactive Web Strands energy pulses
        if (!isReducedMotion && Math.random() < 0.06 && webPulsesRef.current.length < 4) {
          webPulsesRef.current.push({
            angle: spokeAngles[Math.floor(Math.random() * spokeAngles.length)],
            progress: 0,
            speed: 0.02
          });
        }

        webPulsesRef.current = webPulsesRef.current.filter((pulse) => {
          pulse.progress += pulse.speed;
          if (pulse.progress >= 1.0) return false;

          const px = smooth.x + Math.cos(pulse.angle) * (pulse.progress * 36 * sizeFactor);
          const py = smooth.y + Math.sin(pulse.angle) * (pulse.progress * 36 * sizeFactor);

          ctx.fillStyle = "#8B0000"; // Deep Crimson node
          ctx.beginPath();
          ctx.arc(px, py, 1.1 * sizeFactor, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#E5E5EA"; // Silver core
          ctx.beginPath();
          ctx.arc(px, py, 0.4 * sizeFactor, 0, Math.PI * 2);
          ctx.fill();

          return true;
        });

        // 3 Procedural White Spider Drones (Articulated walking micro-joint design)
        cursorSpiders.forEach((spider) => {
          spider.angle += spider.speed * (isReducedMotion ? 0.3 : 1.0);
          spider.legPhase += Math.abs(spider.speed) * (isReducedMotion ? 1.4 : 4.0);

          const sx = smooth.x + Math.cos(spider.angle) * spider.orbitRadius * sizeFactor;
          const sy = smooth.y + Math.sin(spider.angle) * spider.orbitRadius * sizeFactor;

          // Gentle white star-dot path particles
          if (!isReducedMotion && Math.random() < 0.15 && particlesRef.current.length < 25) {
            particlesRef.current.push({
              x: sx,
              y: sy,
              vx: (Math.random() - 0.5) * 0.15,
              vy: (Math.random() - 0.5) * 0.15,
              size: 0.35 + Math.random() * 0.5,
              color: "#FFFFFF",
              alpha: 0.65,
              decay: 0.022 + Math.random() * 0.01
            });
          }

          // Face the center of the cursor
          const faceAngle = spider.angle + Math.PI;

          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(faceAngle);

          // Draw spider legs (6 articulated pure white jointed micro legs)
          ctx.strokeStyle = "rgba(255, 255, 255, 0.88)";
          ctx.lineWidth = 0.5 * sizeFactor;
          const legCount = 6;
          for (let i = 0; i < legCount; i++) {
            const side = i % 2 === 0 ? 1 : -1;
            const legIndex = Math.floor(i / 2);
            const baseAngle = (legIndex - 1) * 0.5;

            const phase = spider.legPhase + i * Math.PI / 3;
            const reach = 2.4 * sizeFactor + Math.sin(phase) * 0.9 * sizeFactor;
            
            const kneeX = Math.cos(baseAngle) * 1.4 * side * sizeFactor;
            const kneeY = (Math.sin(baseAngle) * 1.4 - 0.4) * sizeFactor;
            const footX = Math.cos(baseAngle) * (1.4 + reach) * side * sizeFactor;
            const footY = (Math.sin(baseAngle) * 1.4 - 1.1 + Math.cos(phase) * 0.7) * sizeFactor;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(kneeX, kneeY);
            ctx.lineTo(footX, footY);
            ctx.stroke();

            // Leg joint highlights
            ctx.fillStyle = "#FFFFFF";
            ctx.beginPath();
            ctx.arc(kneeX, kneeY, 0.28 * sizeFactor, 0, Math.PI * 2);
            ctx.fill();
          }

          // Abdomen (White premium secondary shell)
          ctx.fillStyle = "rgba(242, 242, 247, 0.9)";
          ctx.beginPath();
          ctx.arc(-0.8 * sizeFactor, 0, 0.8 * sizeFactor, 0, Math.PI * 2);
          ctx.fill();

          // Titanium-White armor primary chassis
          ctx.fillStyle = "#FFFFFF";
          ctx.strokeStyle = "rgba(229, 229, 234, 0.95)";
          ctx.lineWidth = 0.45 * sizeFactor;

          if (!isHighContrast) {
            ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
            ctx.shadowBlur = 4 * sizeFactor;
          }

          ctx.beginPath();
          ctx.arc(0, 0, 1.1 * sizeFactor, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          if (!isHighContrast) {
            ctx.shadowBlur = 0; // reset
          }

          // Glowing Ice-White optical eye
          ctx.fillStyle = "#FFFFFF";
          ctx.beginPath();
          ctx.arc(0.6 * sizeFactor, 0, 0.3 * sizeFactor, 0, Math.PI * 2);
          ctx.fill();

          // Subtle lens border
          ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
          ctx.lineWidth = 0.18 * sizeFactor;
          ctx.beginPath();
          ctx.arc(0.6 * sizeFactor, 0, 0.45 * sizeFactor, 0, Math.PI * 2);
          ctx.stroke();

          ctx.restore();
        });

        ctx.restore();

        // 2. Add subtle hover state particles dynamically if static
        if (!isReducedMotion && isHoveringRef.current && Math.random() < 0.12 && particlesRef.current.length < 6) {
          particlesRef.current.push({
            x: smooth.x + (Math.random() - 0.5) * 14,
            y: smooth.y + (Math.random() - 0.5) * 14,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            size: 0.5 + Math.random() * 0.7,
            color: "#E5E5EA", // Soft Silver
            alpha: 0.65,
            decay: 0.012 + Math.random() * 0.012
          });
        }
      }

      // Draw premium neural ribbons trail (thin, fluid, graphite -> deep crimson -> transparent)
      if (trailsEnabled && trailRef.current.length > 1) {
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        trailRef.current = trailRef.current.filter((node) => {
          const age = now - node.time;
          return age < (isReducedMotion ? 350 : 650);
        });

        for (let i = 1; i < trailRef.current.length; i++) {
          const p1 = trailRef.current[i - 1];
          const p2 = trailRef.current[i];
          const ageRatio = (now - p2.time) / (isReducedMotion ? 350 : 650);
          
          const alphaMultiplier = isHighContrast ? 0.9 : 0.65;
          const color = getTrailColor(ageRatio, alphaMultiplier);

          ctx.strokeStyle = color;
          ctx.lineWidth = p2.thickness * (1 - ageRatio) * sizeFactor;
          
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Continuously sample trails on coordinate glide
      if (trailsEnabled && cx > 0 && cy > 0 && smooth.x > 0) {
        const dx = smooth.vx;
        const dy = smooth.vy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Add trail node based on physical coordinate rather than raw mouse
        if (distance > 0.4) {
          const thickness = Math.max(0.5, Math.min(2.5, distance * 0.8));
          trailRef.current.push({
            x: smooth.x,
            y: smooth.y,
            time: now,
            thickness
          });
        }
      }

      // Draw Click Ripples
      ripplesRef.current = ripplesRef.current.filter((r) => {
        r.r += r.speed;
        r.alpha -= isReducedMotion ? 0.05 : 0.025;

        if (r.alpha <= 0 || r.r >= r.maxR) return false;

        ctx.save();
        if (r.isSecondary) {
          ctx.strokeStyle = `rgba(28, 28, 30, ${r.alpha})`; // Graphite grey ripple
          ctx.lineWidth = 1.8 * sizeFactor;
        } else {
          ctx.strokeStyle = r.color;
          ctx.lineWidth = 0.7 * sizeFactor;
          
          if (!isHighContrast) {
            ctx.shadowColor = r.color;
            ctx.shadowBlur = 5 * sizeFactor;
          }
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        return true;
      });

      // Update and draw active particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        
        if (p.alpha <= 0) return false;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * sizeFactor, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

    };
    animFrame = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      const savedStyle = document.getElementById("sentinel-cursor-style");
      if (savedStyle) savedStyle.remove();

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("sentinelSuccess", handleSuccessEvent);
      window.removeEventListener("sentinelAlert", handleAlertEvent);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animFrame);
    };
  }, [sizeFactor, isHighContrast, isReducedMotion, isScanning, overallThreat, trailsEnabled]);

  return (
    <>
      {/* Background canvas for high-performance fluid ribbons, web lines and spider walks */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[9998] pointer-events-none"
      />

      {/* Premium Machined Pointer Container */}
      <div
        ref={cursorContainerRef}
        style={{
          position: "fixed",
          left: "-100px",
          top: "-100px",
          transform: "translate(-50%, -50%) scale(0)",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
        }}
        className="w-12 h-12 flex items-center justify-center transition-opacity duration-300"
      >
        {/* Soft Graphite/Crimson Ambient Glow Shadow */}
        {!isHighContrast && (
          <div 
            className="absolute rounded-full"
            style={{
              width: "44px",
              height: "44px",
              backgroundColor: "#8B0000",
              filter: "blur(11px)",
              opacity: getGlowOpacity(),
              transition: "opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        )}

        {/* Dynamic subtle interactive hover halo ring */}
        {isHovering && !isHighContrast && (
          <div className="absolute w-11 h-11 border border-red-900/15 rounded-full animate-ping opacity-20" />
        )}

        {/* Outer Titanium-Brushed Shell */}
        <div 
          className="absolute rounded-full flex items-center justify-center shadow-2xl overflow-hidden"
          style={{
            width: "28px",
            height: "28px",
            backgroundColor: "#111111", // Matte Graphite Metallic
            border: "1px solid #3A3A3C", // Brushed Titanium Border
            boxShadow: "0 4px 12px rgba(10, 10, 10, 0.75)", // Soft Graphite Shadow
          }}
        >
          {/* Machine Brushed Reflection Line (Slight glass refraction) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/12 pointer-events-none" />
          <div className="absolute -top-3.5 -left-3.5 w-6 h-6 rounded-full bg-white/5 filter blur-xs pointer-events-none" />

          {/* Thin Understated Crimson Energy Ring */}
          <motion.div
            animate={{ 
              rotate: isHovering ? 360 : 0,
              scale: isHovering ? 1.12 : 1.0,
            }}
            transition={
              isHovering 
                ? { rotate: { repeat: Infinity, duration: 3.0, ease: "linear" }, scale: { type: "spring", stiffness: 350, damping: 15 } } 
                : { scale: { type: "spring", stiffness: 350, damping: 15 } }
            }
            className="w-4 h-4 rounded-full border flex items-center justify-center"
            style={{
              borderColor: isScanning || overallThreat >= 81 ? "#B11226" : "rgba(139, 0, 0, 0.35)",
              boxShadow: isScanning || overallThreat >= 81 ? "inset 0 0 2px #B11226" : "none"
            }}
          >
            {/* Precision notch overlay on hover */}
            {isHovering && (
              <div 
                className="absolute w-full h-full rounded-full border-t border-red-700/60"
                style={{ borderWidth: "1.2px" }}
              />
            )}
          </motion.div>
        </div>

        {/* Inner Nucleus: Matte Black Center */}
        <div 
          className="absolute flex items-center justify-center rounded-full"
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: "#0A0A0A", // Matte Black body
            border: "0.5px solid #242424", // Outline
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.8)"
          }}
        >
          {/* Lens specular flare */}
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/5 to-white/18 rounded-full pointer-events-none" />
          
          {/* Subtle Crimson LED Core */}
          <div 
            className={`w-1.5 h-1.5 rounded-full ${isScanning ? "animate-pulse" : ""}`}
            style={{ 
              backgroundColor: isScanning || overallThreat >= 81 ? "#E63946" : "#8B0000",
              boxShadow: "0 0 2px #8B0000"
            }}
          />
        </div>
      </div>

      {/* Accessible Parameter Adjustment HUD */}
      <AnimatePresence>
        {hudMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="fixed bottom-6 right-6 z-[9999] bg-[#0A0A0A]/95 border border-zinc-800/80 backdrop-blur-md px-3.5 py-2.5 rounded-xl text-zinc-300 font-mono text-[9px] uppercase tracking-wider shadow-2xl flex items-center gap-2.5 border-t-red-900/40"
          >
            <div className="w-1.5 h-1.5 bg-[#8B0000] rounded-full animate-ping" />
            <span className="font-semibold text-zinc-200">{hudMessage}</span>
            <span className="text-zinc-500 text-[8px] opacity-75">([ ] / - + / T / S)</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
