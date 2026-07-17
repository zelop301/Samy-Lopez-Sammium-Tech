/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../sound';

interface CosmicCursorProps {
  activeModule: string;
  bhMass?: number;
}

interface CursorParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  type: 'spark' | 'smoke' | 'star' | 'circuit' | 'probability';
  angle?: number;
  spin?: number;
}

interface CursorRipple {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  thickness: number;
}

export default function CosmicCursor({ activeModule, bhMass = 4.0 }: CosmicCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Real cursor coordinates
  const mouseRef = useRef({ x: 0, y: 0 });
  const lerpMouseRef = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const mouseVelocity = useRef(0);
  
  // Spring-chain elastic trailing vertices
  const trailRef = useRef<Array<{ x: number; y: number }>>(
    Array.from({ length: 9 }, () => ({ x: 0, y: 0 }))
  );
  
  // Custom states
  const [cursorMode, setCursorMode] = useState<'default' | 'black_hole' | 'star' | 'planet' | 'quantum' | 'ai' | 'ui'>('default');
  const lastActiveModule = useRef(activeModule);
  
  // Hover target info for custom haptic feedback
  const [hoveredElementName, setHoveredElementName] = useState<string | null>(null);
  const hoveredElementRect = useRef<DOMRect | null>(null);
  const idleTimerRef = useRef<number>(Date.now());
  const [isIdle, setIsIdle] = useState(false);

  // Arrays for effects
  const particlesRef = useRef<CursorParticle[]>([]);
  const ripplesRef = useRef<CursorRipple[]>([]);
  const particleIdCounter = useRef(0);
  const rippleIdCounter = useRef(0);

  // Auto-detect module modes
  useEffect(() => {
    lastActiveModule.current = activeModule;
    if (activeModule === 'lab') {
      setCursorMode('black_hole');
    } else if (activeModule === 'quantum') {
      setCursorMode('quantum');
    } else if (activeModule === 'ai') {
      setCursorMode('ai');
    } else if (activeModule === 'scale') {
      setCursorMode('star');
    } else if (activeModule === 'missions' || activeModule === 'guardian') {
      setCursorMode('planet');
    } else {
      setCursorMode('default');
    }
  }, [activeModule]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Mouse movement track with high FPS interpolation (120-240Hz compliant)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      idleTimerRef.current = Date.now();
      setIsIdle(false);

      // Velocity calculation for high-speed motion blur trails
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      mouseVelocity.current = Math.min(65, Math.sqrt(dx * dx + dy * dy));
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      // Spawn stardust trails dynamically proportional to mouse speed
      const particleCount = Math.max(1, Math.min(6, Math.floor(mouseVelocity.current / 4)));
      for (let i = 0; i < particleCount; i++) {
        spawnTrailParticle(e.clientX, e.clientY);
      }
    };

    // Click handler for Photon Explosions & Ripples
    const handleMouseClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      // Detect if click on a big galaxy generation button
      const target = e.target as HTMLElement;
      const isSuperButton = target.innerText?.toLowerCase().includes('generate') || 
                            target.innerText?.toLowerCase().includes('collapse') || 
                            target.id === 'trigger-big-bang';

      // Play synthesized sounds
      if (isSuperButton) {
        soundEngine.playGenerateGalaxy();
        triggerSuperClickRipple(clickX, clickY);
      } else {
        soundEngine.playClick();
        triggerNormalClickRipple(clickX, clickY);
      }
    };

    // Automatic premium hover event delegation
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = target.tagName === 'BUTTON' || 
                            target.tagName === 'A' || 
                            target.tagName === 'SELECT' || 
                            target.classList.contains('cursor-pointer') ||
                            target.closest('button');

      if (isInteractive) {
        // Haptic feel - switch to UI mode
        setCursorMode('ui');
        hoveredElementRect.current = target.getBoundingClientRect();
        
        // Extract descriptive name
        const textContent = target.innerText || target.getAttribute('title') || target.tagName;
        setHoveredElementName(textContent.trim().substring(0, 18));
        
        // Play soft hover crystal sound
        soundEngine.playHover();

        // Spawn interactive micro sparks
        const rect = target.getBoundingClientRect();
        for (let i = 0; i < 4; i++) {
          spawnHoverSpark(
            rect.left + Math.random() * rect.width,
            rect.top + Math.random() * rect.height
          );
        }
      } else {
        // Revert back to module default
        const mod = lastActiveModule.current;
        if (mod === 'lab') setCursorMode('black_hole');
        else if (mod === 'quantum') setCursorMode('quantum');
        else if (mod === 'ai') setCursorMode('ai');
        else if (mod === 'scale') setCursorMode('star');
        else if (mod === 'missions' || mod === 'guardian') setCursorMode('planet');
        else setCursorMode('default');
        
        setHoveredElementName(null);
        hoveredElementRect.current = null;
      }
    };

    // Universal Resonance: Listen to cosmic engine events to spawn coordinated cursor particle bursts (Principle 15, URE)
    const handleCosmicResonance = (e: Event) => {
      const customEvent = e as CustomEvent<{ amount: number; type?: string }>;
      const amount = customEvent.detail?.amount || 5.0;
      const rType = customEvent.detail?.type || 'supernova';

      const cx = mouseRef.current.x;
      const cy = mouseRef.current.y;

      // Core concentric shockwave ripple at cursor
      ripplesRef.current.push({
        id: rippleIdCounter.current++,
        x: cx,
        y: cy,
        radius: 4,
        maxRadius: amount * 35,
        alpha: 1.0,
        color: rType === 'merger' ? '#8b5cf6' : rType === 'warp' ? '#22d3ee' : '#FF6B35',
        thickness: 2.2
      });

      // Synchronized stardust cloud eruption
      const sparkCount = Math.floor(amount * 12);
      for (let i = 0; i < sparkCount; i++) {
        const angle = (i / sparkCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
        const speed = Math.random() * amount * 1.8 + 2.5;
        let color = 'rgba(255, 107, 53, 0.85)'; // Amber orange for supernova
        if (rType === 'merger') {
          color = 'rgba(139, 92, 246, 0.85)'; // Violet purple for merger
        } else if (rType === 'warp') {
          color = 'rgba(34, 211, 238, 0.85)'; // Cyan blue for warp
        } else if (rType === 'quantum') {
          color = 'rgba(236, 72, 153, 0.85)'; // Pink magenta for quantum
        }

        particlesRef.current.push({
          id: particleIdCounter.current++,
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * amount * 0.7 + 1.2,
          alpha: 1.0,
          decay: Math.random() * 0.02 + 0.012,
          color,
          type: 'star'
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleMouseClick);
    document.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('triggerCosmicResonance', handleCosmicResonance);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleMouseClick);
      document.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('triggerCosmicResonance', handleCosmicResonance);
    };
  }, []);

  // Helper: Spawn stardust trails
  const spawnTrailParticle = (mx: number, my: number) => {
    let color = 'rgba(0, 200, 255, 0.6)';
    let type: CursorParticle['type'] = 'spark';
    
    // Customize particle colors based on active mode
    if (cursorMode === 'black_hole') {
      color = Math.random() > 0.4 ? 'rgba(139, 92, 246, 0.7)' : 'rgba(15, 23, 42, 0.8)';
      type = 'smoke';
    } else if (cursorMode === 'star') {
      color = Math.random() > 0.3 ? 'rgba(245, 158, 11, 0.7)' : 'rgba(239, 68, 68, 0.6)';
      type = 'star';
    } else if (cursorMode === 'planet') {
      color = Math.random() > 0.5 ? 'rgba(52, 211, 153, 0.65)' : 'rgba(0, 200, 255, 0.5)';
      type = 'spark';
    } else if (cursorMode === 'quantum') {
      color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
      type = 'probability';
    } else if (cursorMode === 'ai') {
      color = 'rgba(34, 211, 238, 0.7)';
      type = 'circuit';
    } else if (cursorMode === 'ui') {
      color = 'rgba(245, 158, 11, 0.75)';
      type = 'spark';
    }

    // Capture speed vectors for particle stretching
    const vx = (Math.random() - 0.5) * 1.5 - (mouseRef.current.x - lastMousePos.current.x) * 0.12;
    const vy = (Math.random() - 0.5) * 1.5 - (mouseRef.current.y - lastMousePos.current.y) * 0.12;

    // Add particle
    particlesRef.current.push({
      id: particleIdCounter.current++,
      x: mx,
      y: my,
      vx,
      vy,
      size: Math.random() * 3 + 1,
      alpha: 1.0,
      decay: Math.random() * 0.02 + 0.016,
      color,
      type
    });
  };

  const spawnHoverSpark = (x: number, y: number) => {
    particlesRef.current.push({
      id: particleIdCounter.current++,
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 2 + 0.8,
      alpha: 1.0,
      decay: 0.04,
      color: 'rgba(245, 158, 11, 0.8)',
      type: 'spark'
    });
  };

  // Normal Click: Photon Explosion
  const triggerNormalClickRipple = (cx: number, cy: number) => {
    // 1. Add Ripple
    ripplesRef.current.push({
      id: rippleIdCounter.current++,
      x: cx,
      y: cy,
      radius: 2,
      maxRadius: 75,
      alpha: 1.0,
      color: cursorMode === 'star' ? '#f59e0b' : cursorMode === 'black_hole' ? '#8b5cf6' : '#00C8FF',
      thickness: 1.5
    });

    // 2. Add explosion sparkles
    for (let i = 0; i < 22; i++) {
      const angle = (i / 22) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 3.5 + 2;
      particlesRef.current.push({
        id: particleIdCounter.current++,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 1.2,
        alpha: 1.0,
        decay: Math.random() * 0.03 + 0.02,
        color: cursorMode === 'star' ? '#FBBF24' : '#00C8FF',
        type: 'spark'
      });
    }
  };

  // Super Click: Nebula Expansion & Big Ripple
  const triggerSuperClickRipple = (cx: number, cy: number) => {
    // Double concentric ripples
    ripplesRef.current.push({
      id: rippleIdCounter.current++,
      x: cx,
      y: cy,
      radius: 4,
      maxRadius: 200,
      alpha: 1.0,
      color: '#f59e0b',
      thickness: 3.0
    });
    ripplesRef.current.push({
      id: rippleIdCounter.current++,
      x: cx,
      y: cy,
      radius: 1,
      maxRadius: 130,
      alpha: 0.8,
      color: '#e11d48',
      thickness: 1.5
    });

    // Spark shower
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 3;
      particlesRef.current.push({
        id: particleIdCounter.current++,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 5 + 1.5,
        alpha: 1.0,
        decay: Math.random() * 0.02 + 0.012,
        color: Math.random() > 0.5 ? '#f59e0b' : '#38bdf8',
        type: 'star'
      });
    }
  };

  // Core Animation Loop (Runs on RequestAnimationFrame)
  useEffect(() => {
    let animId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let targetX = mouseRef.current.x;
      let targetY = mouseRef.current.y;

      // ==========================================
      // 🧲 TACTILE MAGNETIC SNAP ATTRACTION
      // ==========================================
      if (cursorMode === 'ui' && hoveredElementRect.current) {
        const rect = hoveredElementRect.current;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = centerX - mouseRef.current.x;
        const dy = centerY - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 75) {
          // Attract smoothly as we hover near the button center
          const pull = (1.0 - dist / 75) * 0.32;
          targetX += dx * pull;
          targetY += dy * pull;
        }
      }

      // Smooth mouse coordinate interpolation with spring-damping
      lerpMouseRef.current.x += (targetX - lerpMouseRef.current.x) * 0.18;
      lerpMouseRef.current.y += (targetY - lerpMouseRef.current.y) * 0.18;

      const mx = lerpMouseRef.current.x;
      const my = lerpMouseRef.current.y;

      // ==========================================
      // 🎗️ SPRING-CHAIN ELASTIC TRAILING ENGINE
      // ==========================================
      const trail = trailRef.current;
      trail[0].x = mx;
      trail[0].y = my;
      for (let i = 1; i < trail.length; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.32;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.32;
      }

      // Draw elastic ribbon
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x, trail[i].y);
      }
      ctx.strokeStyle = cursorMode === 'ui' ? 'rgba(245, 158, 11, 0.16)' : 'rgba(0, 200, 255, 0.16)';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // ==========================================
      // 🛰️ IDLE STATE CHECK
      // ==========================================
      const timeSinceLastMove = Date.now() - idleTimerRef.current;
      if (timeSinceLastMove > 30000) {
        if (!isIdle) {
          setIsIdle(true);
          const logEvent = new CustomEvent('addCosmicJournalLog', {
            detail: "🛰️ [EASTER EGG] Cosmic satellite deployed. Orbiting local workspace to scan for extra-galactic signals."
          });
          window.dispatchEvent(logEvent);
        }
      }

      // Render Ripples
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += (ripple.maxRadius - ripple.radius) * 0.1;
        ripple.alpha -= 0.035;

        if (ripple.alpha <= 0) return false;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ripple.color;
        ctx.lineWidth = ripple.thickness;
        ctx.globalAlpha = Math.max(0, ripple.alpha);
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        return true;
      });

      // Render Particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

        if (p.type === 'spark' && speed > 2.5) {
          // ==========================================
          // 🚀 HIGH SPEED PHOTON STRETCH
          // ==========================================
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.5, p.y - p.vy * 1.5);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size;
          ctx.lineCap = 'round';
          ctx.stroke();
        } else if (p.type === 'star') {
          // Render cross star
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - p.size);
          ctx.lineTo(p.x, p.y + p.size);
          ctx.moveTo(p.x - p.size, p.y);
          ctx.lineTo(p.x + p.size, p.y);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (p.type === 'circuit') {
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1.0;
        return true;
      });

      // Orbiting Photons / Elements around Cursor
      const seconds = Date.now() / 1000;
      
      if (isIdle) {
        const orbitRadius = 45;
        const orbitX = mx + Math.cos(seconds * 1.5) * orbitRadius;
        const orbitY = my + Math.sin(seconds * 1.5) * orbitRadius;

        ctx.beginPath();
        ctx.moveTo(orbitX, orbitY);
        ctx.lineTo(orbitX - 60, orbitY + 120);
        ctx.lineTo(orbitX + 60, orbitY + 120);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(orbitX, orbitY, orbitX, orbitY + 120);
        gradient.addColorStop(0, 'rgba(0, 200, 255, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 200, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = '#00C8FF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(orbitX, orbitY + 120, 20 + Math.sin(seconds * 8) * 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(orbitX, orbitY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0284c7';
        ctx.fillRect(orbitX - 16, orbitY - 2, 8, 4);
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(orbitX - 16, orbitY - 2, 8, 4);

        ctx.fillRect(orbitX + 8, orbitY - 2, 8, 4);
        ctx.strokeRect(orbitX + 8, orbitY - 2, 8, 4);

        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(orbitX, orbitY);
        ctx.lineTo(orbitX + Math.cos(seconds * 5) * 10, orbitY + Math.sin(seconds * 5) * 10);
        ctx.stroke();

        ctx.fillStyle = 'rgba(2, 3, 10, 0.9)';
        ctx.strokeStyle = 'rgba(0, 200, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.fillRect(orbitX + 22, orbitY - 25, 150, 48);
        ctx.strokeRect(orbitX + 22, orbitY - 25, 150, 48);

        ctx.fillStyle = '#00c8ff';
        ctx.font = '7px monospace';
        ctx.fillText('📡 PROBE: SATELLITE-1', orbitX + 28, orbitY - 15);
        ctx.fillStyle = '#34d399';
        ctx.fillText('STATUS: SCANNING COSMOS...', orbitX + 28, orbitY - 6);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`DIST: 2.18M LIGHT YRS`, orbitX + 28, orbitY + 3);
        ctx.fillText(`TARGET: UNKNOWN NEBULA`, orbitX + 28, orbitY + 12);

      } else {
        // ==========================================
        // 🔮 VELOCITY-DRIVEN CORE STRETCH & SPEED-SENSITIVE GLOW
        // ==========================================
        const vel = mouseVelocity.current;
        const stretchFactor = 1.0 + Math.min(1.2, vel * 0.035);
        const squeezeFactor = 1.0 - Math.min(0.4, vel * 0.015);
        const rotAngle = Math.atan2(
          mouseRef.current.y - lastMousePos.current.y,
          mouseRef.current.x - lastMousePos.current.x
        );

        // Ambient glow that expands based on velocity
        const glowRadius = (cursorMode === 'star' ? 12 : 9) + (vel * 0.4);

        if (cursorMode === 'black_hole') {
          const coreSize = 6 + (bhMass * 0.45);
          
          ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.ellipse(mx, my, coreSize * 2.2, coreSize * 1.1, seconds * 3, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = '#02030a';
          ctx.beginPath();
          ctx.arc(mx, my, coreSize, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(mx, my, coreSize * 1.4, coreSize * 0.9, seconds * 0.5, 0, Math.PI * 2);
          ctx.stroke();

          if (Math.random() > 0.6) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * 20;
            particlesRef.current.push({
              id: particleIdCounter.current++,
              x: mx + Math.cos(angle) * dist,
              y: my + Math.sin(angle) * dist,
              vx: -Math.cos(angle) * 1.8,
              vy: -Math.sin(angle) * 1.8,
              size: Math.random() * 2 + 1,
              alpha: 0.9,
              decay: 0.03,
              color: 'rgba(167, 139, 250, 0.75)',
              type: 'smoke'
            });
          }

        } else if (cursorMode === 'star') {
          const gradient = ctx.createRadialGradient(mx, my, 2, mx, my, glowRadius * 2);
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(0.3, '#f59e0b');
          gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(mx, my, glowRadius * 2.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
          ctx.lineWidth = 1;
          for (let i = 0; i < 4; i++) {
            const angle = seconds * 2 + (i * Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(mx - Math.cos(angle) * 16, my - Math.sin(angle) * 16);
            ctx.lineTo(mx + Math.cos(angle) * 16, my + Math.sin(angle) * 16);
            ctx.stroke();
          }

        } else if (cursorMode === 'planet') {
          ctx.fillStyle = '#059669';
          ctx.beginPath();
          ctx.arc(mx, my, 5.5, 0, Math.PI * 2);
          ctx.fill();

          const atm = ctx.createRadialGradient(mx, my, 4, mx, my, 12 + vel * 0.2);
          atm.addColorStop(0, 'rgba(52, 211, 153, 0.45)');
          atm.addColorStop(1, 'rgba(52, 211, 153, 0)');
          ctx.fillStyle = atm;
          ctx.beginPath();
          ctx.arc(mx, my, 12 + vel * 0.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(mx, my, 14, 5, -0.25, 0, Math.PI * 2);
          ctx.stroke();

        } else if (cursorMode === 'quantum') {
          ctx.fillStyle = 'rgba(167, 139, 250, 0.8)';
          ctx.beginPath();
          ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = 'rgba(139, 92, 246, 0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(mx, my, 14 + Math.sin(seconds * 14) * 3 + vel * 0.2, 0, Math.PI * 2);
          ctx.stroke();

          for (let i = 0; i < 4; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = 4 + Math.random() * 12;
            ctx.fillStyle = Math.random() > 0.5 ? '#a78bfa' : '#60a5fa';
            ctx.beginPath();
            ctx.arc(mx + Math.cos(angle) * r, my + Math.sin(angle) * r, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }

        } else if (cursorMode === 'ai') {
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 1.5;
          
          ctx.beginPath();
          const side = 10 + vel * 0.1;
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3 + seconds;
            const hx = mx + Math.cos(angle) * side;
            const hy = my + Math.sin(angle) * side;
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
          ctx.fill();

        } else if (cursorMode === 'ui') {
          // UI INTERACTIVE MODE: Amber diamond, stretches on speed
          ctx.save();
          ctx.translate(mx, my);
          if (vel > 1.5) {
            ctx.rotate(rotAngle);
            ctx.scale(stretchFactor, squeezeFactor);
          }
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, -9);
          ctx.lineTo(9, 0);
          ctx.lineTo(0, 9);
          ctx.lineTo(-9, 0);
          ctx.closePath();
          ctx.stroke();

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Dynamic hover label tag
          if (hoveredElementName) {
            ctx.fillStyle = 'rgba(2, 3, 10, 0.92)';
            ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
            ctx.lineWidth = 1;
            ctx.fillRect(mx + 15, my - 11, 110, 21);
            ctx.strokeRect(mx + 15, my - 11, 110, 21);

            ctx.fillStyle = '#ffffff';
            ctx.font = '8px monospace';
            ctx.fillText(hoveredElementName.toUpperCase(), mx + 22, my + 2);
          }

        } else {
          // ==========================================
          // 🌠 DEFAULT COSMIC DECK MODE CORE WITH DRIFT & MASS STRETCH
          // ==========================================
          ctx.save();
          ctx.translate(mx, my);
          if (vel > 1.5) {
            ctx.rotate(rotAngle);
            ctx.scale(stretchFactor, squeezeFactor);
          }

          // Central glowing core (now compressed/stretched based on velocity vectors!)
          ctx.fillStyle = 'rgba(0, 200, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Soft blue halo (glow radius scales with velocity)
          const gradient = ctx.createRadialGradient(mx, my, 2, mx, my, glowRadius);
          gradient.addColorStop(0, 'rgba(0, 200, 255, 0.48)');
          gradient.addColorStop(1, 'rgba(0, 200, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(mx, my, glowRadius, 0, Math.PI * 2);
          ctx.fill();

          // 3 Orbiting sub-photons
          for (let i = 0; i < 3; i++) {
            const angle = seconds * 2.2 + (i * Math.PI * 2 / 3);
            const px = mx + Math.cos(angle) * 15;
            const py = my + Math.sin(angle) * 15;
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Continue animation frame loop
      animId = requestAnimationFrame(render);
    };

    // Spawn initial particles
    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [cursorMode, hoveredElementName, isIdle, bhMass]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[60] pointer-events-none w-full h-full block"
    />
  );
}
