/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  RefreshCw,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Activity,
  Brain,
  Compass,
  Tv,
  Maximize2,
  Minimize2,
  Atom,
  Disc,
  Send,
  Binary
} from 'lucide-react';
import { Star, SimulationParams, SupernovaEvent } from './types';

// Import modular OS screen panels
import Academy from './components/Academy';
import CosmicPanelAssembly from './components/CosmicPanelAssembly';
import BlackHoleLab from './components/BlackHoleLab';
import EarthGuardian from './components/EarthGuardian';
import MassiveScale from './components/MassiveScale';
import QuantumVerse from './components/QuantumVerse';
import ResearchJournal from './components/ResearchJournal';
import SpaceMissions from './components/SpaceMissions';
import CosmicCursor from './components/CosmicCursor';
import CosmicWowIntro from './components/CosmicWowIntro';

// ==========================================
// 🎵 WEB AUDIO SYNTHESIZER (CosmicSoundSynth)
// ==========================================
class CosmicSoundSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientLFO: OscillatorNode | null = null;
  private gravityHum: OscillatorNode | null = null;
  private gravityGain: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Initialized lazily on first user interaction
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // 1. Deep Space Ambient Drone
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientOsc.type = 'sawtooth';
      this.ambientOsc.frequency.setValueAtTime(45, this.ctx.currentTime); // Low bass drone

      const ambientFilter = this.ctx.createBiquadFilter();
      ambientFilter.type = 'lowpass';
      ambientFilter.frequency.setValueAtTime(90, this.ctx.currentTime);
      ambientFilter.Q.setValueAtTime(4, this.ctx.currentTime);

      const ambientGain = this.ctx.createGain();
      ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

      // LFO to sweep filter frequency for sweeping celestial winds
      this.ambientLFO = this.ctx.createOscillator();
      this.ambientLFO.frequency.setValueAtTime(0.05, this.ctx.currentTime); // Very slow sweep (20s)
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(30, this.ctx.currentTime);

      this.ambientLFO.connect(lfoGain);
      lfoGain.connect(ambientFilter.frequency);

      this.ambientOsc.connect(ambientFilter);
      ambientFilter.connect(ambientGain);
      ambientGain.connect(this.masterGain);

      this.ambientOsc.start();
      this.ambientLFO.start();

      // 2. Gravitational Hum (Near Black Hole)
      this.gravityHum = this.ctx.createOscillator();
      this.gravityHum.type = 'sine';
      this.gravityHum.frequency.setValueAtTime(60, this.ctx.currentTime);

      this.gravityGain = this.ctx.createGain();
      this.gravityGain.gain.setValueAtTime(0, this.ctx.currentTime); // Muted by default

      const gravityFilter = this.ctx.createBiquadFilter();
      gravityFilter.type = 'lowpass';
      gravityFilter.frequency.setValueAtTime(120, this.ctx.currentTime);

      this.gravityHum.connect(gravityFilter);
      gravityFilter.connect(this.gravityGain);
      this.gravityGain.connect(this.masterGain);

      this.gravityHum.start();
    } catch (e) {
      console.error('Web Audio not supported or failed to init:', e);
    }
  }

  setVolume(vol: number) {
    if (!this.masterGain || !this.ctx) return;
    this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // Modulate sub-bass gravity hum as we approach black hole cores
  updateGravityHum(normalizedDistance: number) {
    if (!this.ctx || !this.gravityGain || !this.gravityHum || this.isMuted) return;
    
    // Closer distance (0) -> louder drone & deeper frequency
    // Farther distance (1) -> silent
    const t = Math.max(0, Math.min(1, normalizedDistance));
    const intensity = Math.pow(1 - t, 2.5); // Steep falloff
    
    const targetFreq = 40 + (1 - intensity) * 40; // Sweeps from 40Hz to 80Hz
    const targetGain = intensity * 0.4; // Max volume 0.4
    
    this.gravityHum.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
    this.gravityGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
  }

  // Sparkly sound for star births or ui clicks
  playStarBirth() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    // Pentatonic scale sparkles
    const freq = 600 + Math.random() * 800;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    // Vibrato effect
    const vibrato = this.ctx.createOscillator();
    vibrato.frequency.setValueAtTime(25, this.ctx.currentTime);
    const vibGain = this.ctx.createGain();
    vibGain.gain.setValueAtTime(15, this.ctx.currentTime);
    vibrato.connect(vibGain);
    vibGain.connect(osc.frequency);
    
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    vibrato.start();
    osc.start();
    
    vibrato.stop(this.ctx.currentTime + 1.2);
    osc.stop(this.ctx.currentTime + 1.2);
  }

  // Supernova explosion sound effect
  playSupernova() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    // Deep explosion rumble (filtered noise & low sine drop)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 2.5);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 2.5);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 2.5);

    // High shimmer flare
    const highOsc = this.ctx.createOscillator();
    const highGain = this.ctx.createGain();
    highOsc.type = 'sine';
    highOsc.frequency.setValueAtTime(2500, this.ctx.currentTime);
    highOsc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 1.8);

    highGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    highGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);

    highOsc.connect(highGain);
    highGain.connect(this.masterGain);

    highOsc.start();
    highOsc.stop(this.ctx.currentTime + 1.8);
  }
}

// Global synth instance
const synth = new CosmicSoundSynth();

// ==========================================
// 🌌 MATHEMATICAL STAR GENERATORS
// ==========================================
function generateSpiralStar(
  id: number,
  galaxyId: number,
  centerX: number,
  centerY: number,
  centerZ: number,
  galaxyRadius: number,
  spiralArms: number,
  tightness: number,
  rotationSpeed: number
): Star {
  // Distance from center following an exponential distribution for high core density
  const rFactor = Math.pow(Math.random(), 2.2);
  const dist = rFactor * galaxyRadius;

  // Determine which arm this star belongs to
  const armIndex = id % spiralArms;
  const armOffsetAngle = (armIndex / spiralArms) * Math.PI * 2;

  // Spiral spiral equation: angle = offset + tightness * distance
  const baseAngle = armOffsetAngle + dist * tightness;
  
  // Add noise (dispersion) to give the galaxy thickness and natural arms
  const scatterRadius = 0.12 * (1.0 - rFactor * 0.4) * galaxyRadius;
  const scatterAngle = Math.random() * Math.PI * 2;
  const scatterDist = Math.pow(Math.random(), 1.5) * scatterRadius;

  const x = centerX + Math.cos(baseAngle) * dist + Math.cos(scatterAngle) * scatterDist;
  const z = centerZ + Math.sin(baseAngle) * dist + Math.sin(scatterAngle) * scatterDist;
  // Flatter vertical distribution (bulge is thicker than disk)
  const bulgeHeight = 0.25 * (1.0 - rFactor) * galaxyRadius;
  const diskHeight = 0.04 * galaxyRadius;
  const zScatter = (Math.random() - 0.5) * (bulgeHeight + diskHeight);
  const y = centerY + zScatter;

  // Star orbital velocity based on Flat Rotation Curve (incorporating dark matter!)
  // In a real flat rotation curve, velocity v is constant over radius, v = sqrt(G*M / r_flat)
  // Let's set a flat speed, with Keplerian scaling near the absolute core
  const coreSoftening = 2.0;
  const orbitalSpeed = rotationSpeed * (1.0 - Math.exp(-dist / coreSoftening));
  
  // Velocity vector is perpendicular to the center vector in the XZ plane
  const dx = x - centerX;
  const dz = z - centerZ;
  const angleToCenter = Math.atan2(dz, dx);
  const vx = -Math.sin(angleToCenter) * orbitalSpeed;
  const vz = Math.cos(angleToCenter) * orbitalSpeed;
  const vy = (Math.random() - 0.5) * 0.1; // Tiny vertical dispersion

  // Beautiful astrophysics-inspired star color scheme (OBAFGKM stellar classification)
  // Stars in the core (bulge) are older, smaller, redder/golden.
  // Stars in the outer spiral arms (nursery) are younger, larger, and hot brilliant blue-white.
  let r = 1.0, g = 1.0, b = 1.0;
  let size = 0.15 + Math.random() * 0.45;

  if (rFactor < 0.18) {
    // Bulge: Warm gold/yellow/orange OBAFGKM older stars
    r = 0.98 + Math.random() * 0.02;
    g = 0.78 + Math.random() * 0.15;
    b = 0.45 + Math.random() * 0.15;
    size *= 1.3; // Bulge stars condensed
  } else {
    // Disk & Arms: Hot giant blue stars (high rFactor means outer arms)
    const starTypeProb = Math.random();
    if (starTypeProb < 0.25) {
      // Class O/B (Hot Blue Supergiant)
      r = 0.55 + Math.random() * 0.15;
      g = 0.80 + Math.random() * 0.15;
      b = 1.0;
      size *= 1.8;
    } else if (starTypeProb < 0.7) {
      // Class A/F (White/Teal young stars)
      r = 0.85;
      g = 0.95;
      b = 1.0;
    } else {
      // Class G/K (Yellow-orange solar analogs)
      r = 0.98;
      g = 0.92;
      b = 0.75;
    }
  }

  return {
    id,
    galaxyId,
    type: 'regular',
    x, y, z,
    vx, vy, vz,
    r, g, b,
    size,
    originalSize: size,
    age: 0,
    life: 0,
    active: true
  };
}

function generateEllipticalStar(
  id: number,
  galaxyId: number,
  centerX: number,
  centerY: number,
  centerZ: number,
  galaxyRadius: number,
  rotationSpeed: number
): Star {
  // Stars follow a triaxial Gaussian/ellipsoidal distribution
  const u = Math.random();
  const rFactor = -Math.log(1.0 - u * 0.99) * 0.25; // Hernquist-like radial profile approximation
  const dist = rFactor * galaxyRadius;

  // Spherical coordinate distribution
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos((Math.random() - 0.5) * 2);

  // Squashed ellipsoidal shapes (A, B, C semi-axes)
  const stretchX = 1.2;
  const stretchY = 0.8; // flatter vertical
  const stretchZ = 1.0;

  const dx = Math.sin(phi) * Math.cos(theta) * dist * stretchX;
  const dy = Math.cos(phi) * dist * stretchY;
  const dz = Math.sin(phi) * Math.sin(theta) * dist * stretchZ;

  const x = centerX + dx;
  const y = centerY + dy;
  const z = centerZ + dz;

  // Orbits in elliptical galaxies are highly eccentric, randomized, and support little coherent rotation.
  // We can combine a small global rotation component with a massive random velocity dispersion!
  const speed = rotationSpeed * (0.3 + Math.random() * 0.7);
  // Rotational velocity component
  const angleToCenter = Math.atan2(dz, dx);
  const rotVx = -Math.sin(angleToCenter) * speed * 0.25; // Small coherent rotation
  const rotVz = Math.cos(angleToCenter) * speed * 0.25;

  // Massive random 3D dispersion component (virialized velocity dispersion)
  const dispVx = (Math.random() - 0.5) * speed * 1.5;
  const dispVy = (Math.random() - 0.5) * speed * 1.5;
  const dispVz = (Math.random() - 0.5) * speed * 1.5;

  const vx = rotVx + dispVx;
  const vy = dispVy;
  const vz = rotVz + dispVz;

  // Elliptical galaxies contain mostly very old, low-mass stars ("red and dead")
  // Stellar palette is dominated by crimson red, pale copper, cosmic violet, and stellar gold.
  let r = 0.95 + Math.random() * 0.05;
  let g = 0.65 + Math.random() * 0.20;
  let b = 0.40 + Math.random() * 0.20;
  let size = 0.12 + Math.random() * 0.35;

  const colorDecider = Math.random();
  if (colorDecider < 0.15) {
    // Red Giant star
    r = 1.0;
    g = 0.35 + Math.random() * 0.15;
    b = 0.15;
    size *= 2.2;
  } else if (colorDecider < 0.4) {
    // Deep Galaxy Violet/Crimson population
    r = 0.85;
    g = 0.55;
    b = 0.95;
  }

  return {
    id,
    galaxyId,
    type: 'regular',
    x, y, z,
    vx, vy, vz,
    r, g, b,
    size,
    originalSize: size,
    age: 0,
    life: 0,
    active: true
  };
}

// Generate extra decorative dust/nebula clouds
function generateStellarDust(
  id: number,
  galaxyId: number,
  centerX: number,
  centerY: number,
  centerZ: number,
  galaxyRadius: number,
  spiralArms: number,
  tightness: number,
  rotationSpeed: number
): Star {
  const rFactor = Math.pow(Math.random(), 1.8);
  const dist = rFactor * galaxyRadius;
  const armIndex = id % spiralArms;
  const armOffsetAngle = (armIndex / spiralArms) * Math.PI * 2;
  const baseAngle = armOffsetAngle + dist * tightness + (Math.random() - 0.5) * 0.45;

  const scatterRadius = 0.18 * galaxyRadius;
  const scatterAngle = Math.random() * Math.PI * 2;
  const scatterDist = Math.random() * scatterRadius;

  const x = centerX + Math.cos(baseAngle) * dist + Math.cos(scatterAngle) * scatterDist;
  const z = centerZ + Math.sin(baseAngle) * dist + Math.sin(scatterAngle) * scatterDist;
  const y = centerY + (Math.random() - 0.5) * 0.12 * galaxyRadius * (1.0 - rFactor * 0.5);

  const orbitalSpeed = rotationSpeed * (1.0 - Math.exp(-dist / 3.0));
  const dx = x - centerX;
  const dz = z - centerZ;
  const angleToCenter = Math.atan2(dz, dx);
  const vx = -Math.sin(angleToCenter) * orbitalSpeed;
  const vz = Math.cos(angleToCenter) * orbitalSpeed;
  const vy = (Math.random() - 0.5) * 0.05;

  // Gas nebula cloud particles: large, highly transparent, glowing teals, purples, cyans, magentas
  let r = 0.0, g = 0.78, b = 1.0;
  const colorType = Math.random();
  if (colorType < 0.3) {
    // Cosmic Purple / Nebula Violet
    r = 0.85; g = 0.18; b = 0.95;
  } else if (colorType < 0.6) {
    // Hot Cyan/Teal
    r = 0.0; g = 0.85; b = 0.98;
  } else {
    // Supernova Orange dust
    r = 1.0; g = 0.45; b = 0.1;
  }

  return {
    id,
    galaxyId,
    type: 'accretion', // We reuse 'accretion' or render differently
    x, y, z,
    vx, vy, vz,
    r, g, b,
    size: 1.5 + Math.random() * 3.0, // gaseous volumetric appearance
    originalSize: 1.5 + Math.random() * 3.0,
    age: 0,
    life: 0,
    active: true
  };
}

// ==========================================
// 🚀 MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  // UI Panels / Navigation State
  const [fullscreen, setFullscreen] = useState(false);

  // Custom OS Modules
  const [activeModule, setActiveModule] = useState<'observatory' | 'lab' | 'scale' | 'quantum' | 'journal' | 'ai' | 'academy' | 'missions' | 'guardian'>('observatory');
  const [orbitOpen, setOrbitOpen] = useState(true);

  // Cosmic Initializer loading states
  const [loading, setLoading] = useState(true);
  const [starsAppearanceFactor, setStarsAppearanceFactor] = useState(0); // Slowly animate stars on load

  // Scale levels state
  const SCALES = [
    { name: "Observable Universe", label: "10^26 m", desc: "Cosmic web of galaxy superclusters" },
    { name: "Galaxy Cluster", label: "10^22 m", desc: "Virgo Cluster / local galactic group" },
    { name: "Galaxy", label: "10^21 m", desc: "Milky Way spiral & elliptical companion" },
    { name: "Star System", label: "10^13 m", desc: "Kepler-186 stellar planetary body" },
    { name: "Planet", label: "10^7 m", desc: "Super-Earth Kepler-186f gas/water world" },
    { name: "Ocean", label: "10^4 m", desc: "Subsurface liquid methane oceans" },
    { name: "Human", label: "1.7 m", desc: "Organic sentient observer DNA lifeform" },
    { name: "Cell", label: "10^-5 m", desc: "Eukaryotic stellar adaptive organism" },
    { name: "DNA", label: "10^-9 m", desc: "Double-helix genetic instructions blueprint" },
    { name: "Atom", label: "10^-10 m", desc: "Hydrogen baryonic nucleosynthesis base" },
    { name: "Electron Cloud", label: "10^-15 m", desc: "Quantum orbital probability amplitude" },
    { name: "Quantum Waveform", label: "10^-35 m", desc: "Superstring gravity space-time foam" }
  ];
  const [scaleIndex, setScaleIndex] = useState(2); // Starts at Galaxy

  // Black Hole Laboratory parameters (Kerr-Newman educational sandbox)
  const [bhMass, setBhMass] = useState(4.3); // Million solar masses
  const [bhSpin, setBhSpin] = useState(0.92); // Kerr spin parameter 0..1
  const [bhCharge, setBhCharge] = useState(0.15); // Electric charge equivalent
  const [bhAccretion, setBhAccretion] = useState(12.5); // Accretion rate
  const [bhObserverDist, setBhObserverDist] = useState(35.0); // observer distance (Light years)

  // Discovery notebook / research journal logs
  const [journalLogs, setJournalLogs] = useState<string[]>([
    "⭐ Created a stable dual-spiral galaxy merger sequence",
    "💥 Observed a high-velocity core-collapse supernova",
    "⚫ Simulated Kerr-Newman event horizon accretion dynamics",
    "🌌 Measured flat rotation curves confirming dark matter presence",
    "🧬 Identified carbon-based precursors on ocean planet Kepler-186f",
  ]);

  // Warp camera state trigger
  const [warpActive, setWarpActive] = useState(false);

  const triggerWarpTransition = (targetModule: 'observatory' | 'lab' | 'scale' | 'quantum' | 'journal' | 'ai' | 'academy' | 'missions' | 'guardian') => {
    try {
      synth.playStarBirth();
    } catch (e) {}
    setWarpActive(true);
    setOrbitOpen(false);
    
    // Universal Resonance Warp dispatch (URE)
    window.dispatchEvent(new CustomEvent('triggerCosmicShake', { detail: { amount: 3.5 } }));
    window.dispatchEvent(new CustomEvent('triggerCosmicResonance', { detail: { amount: 4.5, type: 'warp' } }));

    setTimeout(() => {
      setWarpActive(false);
      setActiveModule(targetModule);
    }, 1100);
  };
  
  // Simulation Metrics
  const [fps, setFps] = useState(60);
  const [starsRenderedCount, setStarsRenderedCount] = useState(0);
  const [simulationTime, setSimulationTime] = useState(0); // in Millions of Years (Myr)
  const [activeColliders, setActiveColliders] = useState(0);
  const [isCoresMerged, setIsCoresMerged] = useState(false);
  const [bh1Mass, setBh1Mass] = useState(50000);
  const [bh2Mass, setBh2Mass] = useState(30000);

  // Holographic AI look-at-cursor tracking (Principle 15, URE)
  const [aiTilt, setAiTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMoveForAi = (e: MouseEvent) => {
      const container = document.getElementById('ai-avatar-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxTilt = 24; // maximum tilt in degrees
      const angle = Math.atan2(dy, dx);
      const tiltAmount = Math.min(maxTilt, dist * 0.05);
      setAiTilt({
        x: -Math.sin(angle) * tiltAmount,
        y: Math.cos(angle) * tiltAmount,
      });
    };
    window.addEventListener('mousemove', handleMouseMoveForAi);
    return () => window.removeEventListener('mousemove', handleMouseMoveForAi);
  }, []);

  // Scanner Details (Holographic Card)
  const [scannedObject, setScannedObject] = useState<{
    name: string;
    type: string;
    mass: string;
    velocity: string;
    distance: string;
    age: string;
    temperature: string;
    stars: string;
    status: string;
    coordinate: string;
    isBH: boolean;
  } | null>({
    name: "Sagittarius Alpha*",
    type: "Supermassive Black Hole",
    mass: "5.01 x 10^4 Solar Masses",
    velocity: "18.4 km/s (Galactic Apex)",
    distance: "0.00 Light Years (Core Center)",
    age: "13.4 Billion Years",
    temperature: "1.2 Billion Kelvin (Accretion)",
    stars: "N/A",
    status: "Stable / Eating Nearby Stars",
    coordinate: "X: 0.00, Y: 0.00, Z: 0.00",
    isBH: true,
  });
  const [isScanning, setIsScanning] = useState(false);

  // Timeline Slider (scrubs through billions of years)
  const [timelineVal, setTimelineVal] = useState(5.0); // 0 (Big Bang) to 13.8 (Today) to 20 (Future)

  // Audio state
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(15);

  // Custom Cosmic Observatory OS customizable modes (The 15 requested pillars)
  const [universeMode, setUniverseMode] = useState<'simulation' | 'real'>('simulation');
  const [scientificLevel, setScientificLevel] = useState<'explorer' | 'student' | 'advanced' | 'research'>('student');
  const [collaborativeRole, setCollaborativeRole] = useState<'gravity_overseer' | 'time_warden' | 'ai_professor' | 'chief_observer'>('gravity_overseer');
  const [achievements, setAchievements] = useState<string[]>(["Big Bang Originator"]);
  const [unlockedAchievement, setUnlockedAchievement] = useState<string | null>(null);
  const [activeUniverseConfig, setActiveUniverseConfig] = useState<string>("Standard Dual Galaxy Spiral");

  const triggerAchievement = (name: string) => {
    if (achievements.includes(name)) return;
    setAchievements((prev) => [...prev, name]);
    setUnlockedAchievement(name);
    // Automatically log this major achievement in the research log too!
    setJournalLogs((prev) => [
      `🏆 [ACHIEVEMENT UNLOCKED] Discovered: ${name}! Logged in the Galactic Archive.`,
      ...prev
    ]);
    setTimeout(() => {
      setUnlockedAchievement(null);
    }, 4500);
  };

  // AI Assistant Chat History & Sending State
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: `Greetings, Commander. I am Orion-9, your holographic Cosmos OS Intelligence system. 

The current quadrant simulates a dual-galactic system: a majestic spiral galaxy and a neighboring virialized elliptical galaxy, rendered with an adaptive particle budget for the current device.

You can monitor metrics live, analyze cosmic bodies with the scientific scanner, or scrub the timeline. Or simply type a command like "Engage a galaxy collision" or "Trigger a supernova!" and I will configure the gravity drives for you.`,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Simulation Parameters state (bound to controls)
  const [params, setParams] = useState<SimulationParams>({
    gConstant: 0.15,
    timeStep: 0.15,
    darkMatterEnabled: true,
    darkMatterInfluence: 0.8,
    softening: 1.8,
    starSizeMultiplier: 1.2,
    isPaused: false,
    supernovaRate: 15,
    showDarkMatterParticles: true,
    showOrbits: false,
    camMode: 'free',
  });

  // HTML Containers & Refs for Canvas/Three
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef<SimulationParams>(params);
  const probeRef = useRef<HTMLDivElement>(null);

  // We keep all physics data in fast linear Float32Arrays and refs to achieve 60 FPS with 100k+ particles.
  const starsRef = useRef<Star[]>([]);
  const coresRef = useRef<({
    id: number;
    x: number; y: number; z: number;
    vx: number; vy: number; vz: number;
    mass: number;
    radius: number;
    color: string;
    active: boolean;
  })[]>([
    { id: 1, x: -18, y: 0, z: 0, vx: 0.12, vy: 0, vz: 0.35, mass: 50000, radius: 1.2, color: '#00C8FF', active: true },
    { id: 2, x: 18, y: 2, z: -5, vx: -0.15, vy: -0.05, vz: -0.42, mass: 30000, radius: 0.8, color: '#8B5CF6', active: true }
  ]);

  const supernovasRef = useRef<SupernovaEvent[]>([]);
  const nextParticleIdRef = useRef(100000);

  const starsAppearanceFactorRef = useRef(0);
  const scaleIndexRef = useRef(2);
  const activeModuleRef = useRef('observatory');
  const bhLabRef = useRef({ mass: 4.3, spin: 0.92, charge: 0.15, accretion: 12.5, observerDist: 35.0 });
  const warpActiveRef = useRef(false);
  const fpsRef = useRef(60);
  const isCoresMergedRef = useRef(false);

  // Sync parameter refs instantly so they are available in the tight animation frame loop without closures
  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    starsAppearanceFactorRef.current = starsAppearanceFactor;
  }, [starsAppearanceFactor]);

  useEffect(() => {
    scaleIndexRef.current = scaleIndex;
  }, [scaleIndex]);

  useEffect(() => {
    activeModuleRef.current = activeModule;
  }, [activeModule]);

  useEffect(() => {
    bhLabRef.current = { mass: bhMass, spin: bhSpin, charge: bhCharge, accretion: bhAccretion, observerDist: bhObserverDist };
  }, [bhMass, bhSpin, bhCharge, bhAccretion, bhObserverDist]);

  useEffect(() => {
    warpActiveRef.current = warpActive;
  }, [warpActive]);

  useEffect(() => {
    fpsRef.current = fps;
  }, [fps]);

  useEffect(() => {
    isCoresMergedRef.current = isCoresMerged;
  }, [isCoresMerged]);

  // Gently fade in stars in Three.js over 2.5 seconds when loading completes
  useEffect(() => {
    if (!loading) {
      let appearances = 0;
      const interval = setInterval(() => {
        appearances += 0.04;
        if (appearances >= 1.0) {
          setStarsAppearanceFactor(1.0);
          clearInterval(interval);
        } else {
          setStarsAppearanceFactor(appearances);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // 🌌 1. LIVING UNIVERSE AI — CONTINUOUS BACKGROUND COSMIC EVOLUTION ENGINE
  useEffect(() => {
    if (loading) return;
    
    const universeTimer = setInterval(() => {
      if (paramsRef.current.isPaused) return;

      const events = ['supernova', 'star_birth', 'accretion_burst', 'magnetic_fluctuation'];
      const chosenEvent = events[Math.floor(Math.random() * events.length)];

      let message = "";
      if (chosenEvent === 'supernova') {
        triggerSupernova();
        message = "✨ [ORION-9 OBSERVATORY ALERT] Detectors recorded a rapid mass collapse leading to a core supernova explosion. Heavy elements are seeding nearby nebulae.";
        triggerAchievement("Supernova Witness");
      } else if (chosenEvent === 'star_birth') {
        triggerStarBirth();
        message = "🌠 [ORION-9 ASTROPHYSICS ALERT] Cold gas dust condensation triggered a star birth sequence inside the active spiral arm nursery. Multiple protostars are igniting.";
        triggerAchievement("Stellar Genesis");
      } else if (chosenEvent === 'accretion_burst') {
        // Boost Sagittarius A* Mass slightly
        setBhMass((prev) => {
          const nextVal = Math.min(15.0, prev + 0.35);
          triggerAchievement("Event Horizon Expansion");
          return nextVal;
        });
        message = "⚫ [ORION-9 SINGULARITY NOTICE] Sagittarius Alpha* has accreted a dense cluster of red giant stars. Event horizon expanded, releasing intense relativistic x-ray flares.";
      } else {
        message = "🛡️ [ORION-9 TELEMETRY] Quantum vacuum energy levels stabilized. Dual core co-rotation velocity is within nominal bounds.";
      }

      // Automatically append alert to chat history & journal log
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: message }
      ]);
      setJournalLogs((prev) => [
        `🌌 [EVENT] ${message.replace(/\[.*\]\s*/, "")}`,
        ...prev
      ]);
    }, 40000); // Trigger every 40 seconds of continuous active simulation

    return () => clearInterval(universeTimer);
  }, [loading]);

  // Handle initialization of standard sound drone
  const startAudioSynth = () => {
    synth.init();
    synth.setVolume(volume / 100);
    setMuted(false);
  };

  // 🛰️ Custom listener for haptic easter egg notifications from CosmicCursor
  useEffect(() => {
    const handleAddJournalLog = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setJournalLogs((prev) => [customEvent.detail, ...prev]);
      }
    };
    window.addEventListener('addCosmicJournalLog', handleAddJournalLog);
    return () => window.removeEventListener('addCosmicJournalLog', handleAddJournalLog);
  }, []);

  // Initialize and run the Three.js Galaxy Simulator Engine
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const containerEl = containerRef.current;
    const cpuCores = navigator.hardwareConcurrency || 4;
    const compactViewport = window.matchMedia('(max-width: 767px)').matches;
    const particleScale = compactViewport ? 0.32 : cpuCores <= 4 ? 0.55 : cpuCores <= 8 ? 0.8 : 1;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02030a, 0.005);

    // 1b. Probe Raycasting & Pointer Tracking Setup
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();
    const intersectionPoint = new THREE.Vector3();

    const mouseNDCRef = { current: new THREE.Vector2(-99.0, -99.0) };
    const mouseClientRef = { current: { x: 0, y: 0 } };
    const mouseActiveRef = { current: false };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseNDCRef.current.set(x, y);
      mouseClientRef.current = { x: e.clientX, y: e.clientY };
      mouseActiveRef.current = true;
    };

    const handlePointerLeave = () => {
      mouseActiveRef.current = false;
    };

    const handlePointerEnter = () => {
      mouseActiveRef.current = true;
    };

    // Spacecraft-like free flying camera state with inertial glide
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraTheta = 0.7; // horizontal angle
    let cameraPhi = 0.5; // vertical angle
    let targetCameraTheta = 0.7;
    let targetCameraPhi = 0.5;
    let cameraRadius = 75.0;

    // Universal Resonance: Camera Shake State with exponential decay (Principle 11, URE)
    let cameraShake = 0.0;
    const handleCosmicShake = (e: Event) => {
      const customEvent = e as CustomEvent<{ amount: number }>;
      const amount = customEvent.detail?.amount || 1.0;
      cameraShake = Math.min(18.0, cameraShake + amount); // clamp maximum cumulative shake intensity
    };
    window.addEventListener('triggerCosmicShake', handleCosmicShake);
    let targetCameraRadius = 75.0;

    const handleWheel = (e: WheelEvent) => {
      // Scrolling becomes flight!
      e.preventDefault();
      targetCameraRadius += e.deltaY * 0.12;
      // Clamp to reasonable distances so we can't fly through the Event Horizon or escape completely
      targetCameraRadius = Math.max(12, Math.min(200, targetCameraRadius));
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Only drag with left click to rotate camera
      if (e.button !== 0) return;
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMoveDrag = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      targetCameraTheta -= deltaX * 0.004;
      targetCameraPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.02, targetCameraPhi - deltaY * 0.003));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const canvasEl = canvasRef.current;
    if (canvasEl) {
      canvasEl.addEventListener('pointermove', handlePointerMove);
      canvasEl.addEventListener('pointerleave', handlePointerLeave);
      canvasEl.addEventListener('pointerenter', handlePointerEnter);
      canvasEl.addEventListener('pointerdown', handlePointerDown);
      window.addEventListener('pointermove', handlePointerMoveDrag);
      window.addEventListener('pointerup', handlePointerUp);
      canvasEl.addEventListener('wheel', handleWheel, { passive: false });
    }

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 45, 65);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(containerEl.clientWidth, containerEl.clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compactViewport ? 1.5 : 2));
    renderer.setClearColor(0x02030a, 1.0);

    const resizeRenderer = () => {
      const width = Math.max(1, containerEl.clientWidth);
      const height = Math.max(1, containerEl.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
    };
    const rendererResizeObserver = new ResizeObserver(resizeRenderer);
    rendererResizeObserver.observe(containerEl);
    window.addEventListener('resize', resizeRenderer);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x0c0f24, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x8B5CF6, 0.8);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    // Dynamic light point at the center of each core (for beautiful glowing core aesthetics)
    const core1Light = new THREE.PointLight(0x00c8ff, 3, 40);
    scene.add(core1Light);
    const core2Light = new THREE.PointLight(0xff6b35, 2, 30);
    scene.add(core2Light);

    // Custom Einstein Spacetime bending grid (PlaneGeometry wireframe)
    const gridGeo = new THREE.PlaneGeometry(160, 160, 42, 42);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x00c8ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });
    const spacetimeGrid = new THREE.Mesh(gridGeo, gridMat);
    spacetimeGrid.rotation.x = -Math.PI / 2;
    spacetimeGrid.position.y = -6.0; // Place slightly below central cores
    scene.add(spacetimeGrid);

    // 5. Build Star and Gas Dust arrays. Lower-power devices start with fewer
    // CPU-simulated particles while preserving the same visual composition.
    const galaxy1StarsCount = Math.round(60000 * particleScale);
    const galaxy2StarsCount = Math.round(40000 * particleScale);
    const gasDustCount = Math.round(8000 * particleScale);
    const MAX_STARS = galaxy1StarsCount + galaxy2StarsCount + gasDustCount + 2000;
    const initialStars: Star[] = [];

    // Galaxy 1 spiral population
    for (let i = 0; i < galaxy1StarsCount; i++) {
      initialStars.push(
        generateSpiralStar(i, 1, coresRef.current[0].x, coresRef.current[0].y, coresRef.current[0].z, 22, 4, 0.35, 1.4)
      );
    }

    // Galaxy 2 elliptical population
    for (let i = 0; i < galaxy2StarsCount; i++) {
      initialStars.push(
        generateEllipticalStar(galaxy1StarsCount + i, 2, coresRef.current[1].x, coresRef.current[1].y, coresRef.current[1].z, 15, 1.1)
      );
    }

    // Volumetric gas and dust population
    for (let i = 0; i < gasDustCount; i++) {
      initialStars.push(
        generateStellarDust(
          galaxy1StarsCount + galaxy2StarsCount + i,
          1,
          coresRef.current[0].x,
          coresRef.current[0].y,
          coresRef.current[0].z,
          22,
          4,
          0.35,
          1.4
        )
      );
    }

    // Pre-populate stars ref
    starsRef.current = initialStars;

    // 6. Build THREE points geometry for rendering
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_STARS * 3);
    const colors = new Float32Array(MAX_STARS * 3);
    const sizes = new Float32Array(MAX_STARS);

    // Write initial positions and colors
    for (let i = 0; i < MAX_STARS; i++) {
      const star = starsRef.current[i];
      if (star && star.active) {
        positions[i * 3] = star.x;
        positions[i * 3 + 1] = star.y;
        positions[i * 3 + 2] = star.z;

        colors[i * 3] = star.r;
        colors[i * 3 + 1] = star.g;
        colors[i * 3 + 2] = star.b;

        sizes[i] = star.size;
      } else {
        // Unused slots positioned infinitely far away
        positions[i * 3] = 99999;
        positions[i * 3 + 1] = 99999;
        positions[i * 3 + 2] = 99999;
        sizes[i] = 0;
      }
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    pointsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom Canvas Texture for beautiful soft volumetric circular stars instead of square pixels
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d')!;
    const radGradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    radGradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    radGradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    radGradient.addColorStop(0.5, 'rgba(240, 248, 255, 0.25)');
    radGradient.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = radGradient;
    ctx.fillRect(0, 0, 16, 16);
    const starTexture = new THREE.CanvasTexture(canvas);

    // Custom shader material to perform high-performance, GPU-bound gravitational lensing
    const starsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: starTexture },
        uMouse: { value: new THREE.Vector2(-99.0, -99.0) },
        uMouseStrength: { value: 0.0 },
        uMouseRadius: { value: 0.22 },
        uStarSizeMultiplier: { value: 1.0 },
        uStarsAppearance: { value: 0.0 },
      },
      vertexShader: `
        uniform vec2 uMouse;
        uniform float uMouseStrength;
        uniform float uMouseRadius;
        uniform float uStarSizeMultiplier;
        uniform float uStarsAppearance;

        attribute float size;
        
        varying vec3 vColor;

        void main() {
          #ifdef USE_COLOR
            vColor = color;
          #else
            vColor = vec3(1.0);
          #endif

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vec4 projectedPosition = projectionMatrix * mvPosition;

          // Perform screen-space gravitational lensing distortion around mouse NDC coords
          vec2 ndcPosition = projectedPosition.xy / projectedPosition.w;
          float dist = distance(ndcPosition, uMouse);

          if (uMouseStrength > 0.0 && dist < uMouseRadius) {
            vec2 dir = normalize(ndcPosition - uMouse);
            // Bends light outward, recreating Einstein ring magnification effect
            float falloff = smoothstep(uMouseRadius, 0.0, dist);
            float bend = (uMouseStrength * 0.024) / (dist + 0.035) * falloff;
            ndcPosition += dir * bend;
            projectedPosition.xy = ndcPosition * projectedPosition.w;
          }

          gl_Position = projectedPosition;
          gl_PointSize = size * uStarSizeMultiplier * uStarsAppearance * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;

        void main() {
          vec4 texColor = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor * texColor.rgb, texColor.a);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const starParticles = new THREE.Points(pointsGeometry, starsMaterial);
    scene.add(starParticles);

    // 7. Visual meshes for Black Holes
    const bh1Geom = new THREE.SphereGeometry(1.2, 32, 32);
    const bh1Mat = new THREE.MeshBasicMaterial({ color: 0x010103 });
    const bh1Mesh = new THREE.Mesh(bh1Geom, bh1Mat);
    scene.add(bh1Mesh);

    const bh2Geom = new THREE.SphereGeometry(0.8, 32, 32);
    const bh2Mat = new THREE.MeshBasicMaterial({ color: 0x010103 });
    const bh2Mesh = new THREE.Mesh(bh2Geom, bh2Mat);
    scene.add(bh2Mesh);

    // Black Hole Event Horizon Accretion Disk Ring
    const ring1Geom = new THREE.RingGeometry(1.4, 2.5, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xffd166, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const ring1Mesh = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 2;
    scene.add(ring1Mesh);

    const ring2Geom = new THREE.RingGeometry(0.9, 1.8, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xff6b35, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const ring2Mesh = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2Mesh.rotation.x = Math.PI / 2;
    scene.add(ring2Mesh);

    // Orbits indicator vectors (Lines)
    const orbit1Geom = new THREE.BufferGeometry();
    const orbit1Points = new Float32Array(100 * 3);
    orbit1Geom.setAttribute('position', new THREE.BufferAttribute(orbit1Points, 3));
    const orbit1Mat = new THREE.LineBasicMaterial({ color: 0x00c8ff, transparent: true, opacity: 0.15 });
    const orbit1Line = new THREE.LineLoop(orbit1Geom, orbit1Mat);
    scene.add(orbit1Line);

    const orbit2Geom = new THREE.BufferGeometry();
    const orbit2Points = new Float32Array(100 * 3);
    orbit2Geom.setAttribute('position', new THREE.BufferAttribute(orbit2Points, 3));
    const orbit2Mat = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.15 });
    const orbit2Line = new THREE.LineLoop(orbit2Geom, orbit2Mat);
    scene.add(orbit2Line);

    // 8. Performance telemetry
    let lastTime = performance.now();
    let lastUiTelemetryUpdate = 0;
    let frameCount = 0;
    let simAge = 0.0;

    // Camera animation flythrough splines
    let flythroughTimer = 0;
    const flythroughCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-40, 25, 45),
      new THREE.Vector3(-15, 8, 12),
      new THREE.Vector3(0, 2, 5),
      new THREE.Vector3(15, 6, -15),
      new THREE.Vector3(30, 18, -35),
      new THREE.Vector3(10, 30, -50),
      new THREE.Vector3(-25, 35, -20),
      new THREE.Vector3(-40, 25, 45),
    ]);

    // ==========================================
    // 🌀 CORE RUNTIME ANIMATION LOOP
    // ==========================================
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Throttling frames and telemetry FPS updates
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        const measuredFps = Math.round((frameCount * 1000) / (now - lastTime));
        fpsRef.current = measuredFps;
        setFps(measuredFps);
        frameCount = 0;
        lastTime = now;
      }

      const activeParams = paramsRef.current;

      // Interpolate fly-free camera states with critically damped springs
      cameraTheta += (targetCameraTheta - cameraTheta) * 0.09;
      cameraPhi += (targetCameraPhi - cameraPhi) * 0.09;
      cameraRadius += (targetCameraRadius - cameraRadius) * 0.09;

      // Handle custom camera flythrough / tracking modes
      if (activeModuleRef.current === 'lab') {
        // Black Hole Lab tracking mode - respects custom observer distance slider!
        const dist = bhLabRef.current.observerDist;
        camera.position.set(coresRef.current[0].x - dist * 0.7, coresRef.current[0].y + dist * 0.35, coresRef.current[0].z + dist * 0.7);
        camera.lookAt(coresRef.current[0].x, coresRef.current[0].y, coresRef.current[0].z);
      } else if (activeModuleRef.current === 'scale') {
        // Continuous scale explorer camera zoom! Zoom factor relies on scaleIndex Ref
        const targetZoom = Math.max(5, 75 - (scaleIndexRef.current * 6.2));
        camera.position.set(coresRef.current[0].x - targetZoom * 0.6, coresRef.current[0].y + targetZoom * 0.3, coresRef.current[0].z + targetZoom * 0.6);
        camera.lookAt(coresRef.current[0].x, coresRef.current[0].y, coresRef.current[0].z);
      } else if (activeParams.camMode === 'flythrough') {
        flythroughTimer += 0.001;
        if (flythroughTimer > 1.0) flythroughTimer = 0;
        const camPos = flythroughCurve.getPointAt(flythroughTimer);
        const lookAtTarget = new THREE.Vector3(
          (coresRef.current[0].x + coresRef.current[1].x) / 2,
          (coresRef.current[0].y + coresRef.current[1].y) / 2,
          (coresRef.current[0].z + coresRef.current[1].z) / 2
        );
        camera.position.copy(camPos);
        camera.lookAt(lookAtTarget);
      } else if (activeParams.camMode === 'orbit') {
        const time = now * 0.0001;
        camera.position.x = Math.sin(time) * 65;
        camera.position.z = Math.cos(time) * 65;
        camera.position.y = 35 + Math.sin(time * 0.5) * 10;
        camera.lookAt(0, 0, 0);
      } else if (activeParams.camMode === 'follow-bh1') {
        camera.position.set(coresRef.current[0].x - 12, coresRef.current[0].y + 6, coresRef.current[0].z + 12);
        camera.lookAt(coresRef.current[0].x, coresRef.current[0].y, coresRef.current[0].z);
      } else if (activeParams.camMode === 'follow-bh2') {
        camera.position.set(coresRef.current[1].x - 10, coresRef.current[1].y + 5, coresRef.current[1].z + 10);
        camera.lookAt(coresRef.current[1].x, coresRef.current[1].y, coresRef.current[1].z);
      } else if (activeParams.camMode === 'free') {
        // Spacecraft spacecraft stabilized flying camera
        const cx = Math.sin(cameraTheta) * Math.cos(cameraPhi) * cameraRadius;
        const cz = Math.cos(cameraTheta) * Math.cos(cameraPhi) * cameraRadius;
        const cy = Math.sin(cameraPhi) * cameraRadius;

        // Continuous spacecraft idle hover drift (subtle noise)
        const driftX = Math.sin(now * 0.0006) * 1.2;
        const driftY = Math.cos(now * 0.0008) * 0.6;
        const driftZ = Math.sin(now * 0.0004) * 1.2;

        camera.position.set(cx + driftX, cy + driftY, cz + driftZ);
        camera.lookAt(0, 0, 0);
      }

      // Universal Resonance: Add high-frequency camera rumble shake with decay (Principle 11, URE)
      if (cameraShake > 0.04) {
        const rShake = cameraShake * (1.0 + Math.sin(now * 0.08) * 0.15);
        camera.position.x += (Math.random() - 0.5) * rShake;
        camera.position.y += (Math.random() - 0.5) * rShake;
        camera.position.z += (Math.random() - 0.5) * rShake;
        cameraShake *= 0.93; // decay exponentially
      } else {
        cameraShake = 0.0;
      }

      // Dynamic Speed-based Motion Blur via GPU CSS filters on canvas
      if (canvasRef.current) {
        const speedVal = Math.abs(targetCameraRadius - cameraRadius) + (warpActiveRef.current ? 40 : 0);
        if (speedVal > 1.2) {
          const blurAmount = Math.min(3.5, (speedVal - 1.2) * 0.16);
          const scaleAmount = 1 + Math.min(0.04, (speedVal - 1.2) * 0.001);
          canvasRef.current.style.filter = `blur(${blurAmount.toFixed(2)}px)`;
          canvasRef.current.style.transform = `scale(${scaleAmount.toFixed(3)})`;
        } else {
          canvasRef.current.style.filter = 'none';
          canvasRef.current.style.transform = 'none';
        }
      }

      // Warp FOV adjustment
      if (warpActiveRef.current) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, 125, 0.12);
      } else {
        camera.fov = THREE.MathUtils.lerp(camera.fov, 60, 0.08);
      }
      camera.updateProjectionMatrix();

      // 9. Sound Synth Dynamic Modulation based on camera distance to nearest black hole core
      let minBhDist = 99999;
      for (const core of coresRef.current) {
        if (core.active) {
          const dx = camera.position.x - core.x;
          const dy = camera.position.y - core.y;
          const dz = camera.position.z - core.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < minBhDist) minBhDist = dist;
        }
      }
      // Normalize hum sweep between 8 and 35 Light Years/units
      const normalizedSynthDist = Math.max(0, Math.min(1, (minBhDist - 8) / 27));
      synth.updateGravityHum(normalizedSynthDist);

      // Core simulation steps
      if (!activeParams.isPaused) {
        simAge += activeParams.timeStep;

        const dt = activeParams.timeStep;
        const G = activeParams.gConstant;
        const softSq = activeParams.softening * activeParams.softening;

        // -----------------
        // CORES G-GRAVITY MATH (N-Body Core interaction)
        // -----------------
        const core1 = coresRef.current[0];
        const core2 = coresRef.current[1];

        if (core1.active && core2.active) {
          const dx = core2.x - core1.x;
          const dy = core2.y - core1.y;
          const dz = core2.z - core1.z;
          const distSq = dx * dx + dy * dy + dz * dz + softSq;
          const dist = Math.sqrt(distSq);

          // Force between cores: F = G * m1 * m2 / r^2
          const forceFactor = (G * dt) / (distSq * dist);

          // Core 1 acceleration and velocity update
          core1.vx += dx * core2.mass * forceFactor;
          core1.vy += dy * core2.mass * forceFactor;
          core1.vz += dz * core2.mass * forceFactor;

          // Core 2 acceleration and velocity update (equal and opposite)
          core2.vx -= dx * core1.mass * forceFactor;
          core2.vy -= dy * core1.mass * forceFactor;
          core2.vz -= dz * core1.mass * forceFactor;

          // Update positions
          core1.x += core1.vx * dt;
          core1.y += core1.vy * dt;
          core1.z += core1.vz * dt;

          core2.x += core2.vx * dt;
          core2.y += core2.vy * dt;
          core2.z += core2.vz * dt;

          // Cores fusion check (If within 2.2 units, cores merge!)
          if (dist < 2.5) {
            // Merged supermassive black hole is created at the center of momentum
            const totalMass = core1.mass + core2.mass;
            core1.x = (core1.x * core1.mass + core2.x * core2.mass) / totalMass;
            core1.y = (core1.y * core1.mass + core2.y * core2.mass) / totalMass;
            core1.z = (core1.z * core1.mass + core2.z * core2.mass) / totalMass;
            
            core1.vx = (core1.vx * core1.mass + core2.vx * core2.mass) / totalMass;
            core1.vy = (core1.vy * core1.mass + core2.vy * core2.mass) / totalMass;
            core1.vz = (core1.vz * core1.mass + core2.vz * core2.mass) / totalMass;
            
            core1.mass = totalMass;
            core1.radius = 2.0; // Event horizon swells
            core2.active = false;
            setIsCoresMerged(true);
            synth.playSupernova(); // Heavy rumble on merge
            
            // Universal Resonance Merger dispatch (URE)
            window.dispatchEvent(new CustomEvent('triggerCosmicShake', { detail: { amount: 14.0 } }));
            window.dispatchEvent(new CustomEvent('triggerCosmicResonance', { detail: { amount: 10.0, type: 'merger' } }));
            
            setBh1Mass(totalMass);
            setBh2Mass(0);
          }
          setActiveColliders(2);
        } else if (core1.active) {
          // Single merged core slides in its momentum
          core1.x += core1.vx * dt;
          core1.y += core1.vy * dt;
          core1.z += core1.vz * dt;
          setActiveColliders(1);
        }

        // Sync Black Hole visual meshes
        if (core1.active) {
          // Adjust Core 1 Mass based on Active Module
          const currentMass = (activeModuleRef.current === 'lab') ? bhLabRef.current.mass * 12000 : core1.mass;
          core1.radius = (currentMass / 50000) * 1.2 * starsAppearanceFactorRef.current;

          bh1Mesh.position.set(core1.x, core1.y, core1.z);
          ring1Mesh.position.set(core1.x, core1.y, core1.z);
          core1Light.position.set(core1.x, core1.y, core1.z);
          bh1Mesh.scale.setScalar(Math.max(0.1, core1.radius));

          // Connect spin speed of Kerr-Newman accretion disk
          const spinSpeed = 0.01 + (activeModuleRef.current === 'lab' ? bhLabRef.current.spin * 0.15 : 0.04);
          ring1Mesh.rotation.z += spinSpeed * starsAppearanceFactorRef.current;

          // Connect accretion density scale and opacity
          const scaleAcc = 1.0 + (activeModuleRef.current === 'lab' ? bhLabRef.current.accretion * 0.04 : 0.4);
          ring1Mesh.scale.setScalar(scaleAcc * starsAppearanceFactorRef.current);
          ring1Mat.opacity = (activeModuleRef.current === 'lab' ? 0.3 + bhLabRef.current.accretion * 0.05 : 0.8) * starsAppearanceFactorRef.current;
        } else {
          bh1Mesh.position.set(99999, 99999, 99999);
          ring1Mesh.position.set(99999, 99999, 99999);
        }

        if (core2.active) {
          bh2Mesh.position.set(core2.x, core2.y, core2.z);
          ring2Mesh.position.set(core2.x, core2.y, core2.z);
          core2Light.position.set(core2.x, core2.y, core2.z);
          bh2Mesh.scale.setScalar(core2.radius * starsAppearanceFactorRef.current);
          ring2Mesh.rotation.z -= 0.04 * starsAppearanceFactorRef.current;
          ring2Mat.opacity = 0.7 * starsAppearanceFactorRef.current;
        } else {
          bh2Mesh.position.set(99999, 99999, 99999);
          ring2Mesh.position.set(99999, 99999, 99999);
        }

        // Dynamic Einstein Space-time Grid Warping (Relativistic gravity distortion)
        if (spacetimeGrid && gridGeo) {
          const posAttr = gridGeo.attributes.position as THREE.BufferAttribute;
          const vTemp = new THREE.Vector3();
          for (let i = 0; i < posAttr.count; i++) {
            vTemp.fromBufferAttribute(posAttr, i);
            const worldX = vTemp.x;
            const worldZ = vTemp.y;

            let gravityPotential = 0;
            for (const core of coresRef.current) {
              if (core.active) {
                const dx = worldX - core.x;
                const dz = worldZ - core.z;
                const distSq = dx * dx + dz * dz + 12.0;
                const dist = Math.sqrt(distSq);
                
                const currentMass = (core.id === 1 && activeModuleRef.current === 'lab') 
                  ? bhLabRef.current.mass * 12000 
                  : core.mass;
                
                gravityPotential += (0.0035 * currentMass) / dist;
              }
            }
            
            const bend = Math.min(18.0, gravityPotential);
            posAttr.setZ(i, -bend * starsAppearanceFactorRef.current);
          }
          posAttr.needsUpdate = true;
        }

        // Raycast cursor coordinate in 3D galactic space before looping stars (Principle 15, URE)
        if (mouseActiveRef.current) {
          raycaster.setFromCamera(mouseNDCRef.current, camera);
          raycaster.ray.intersectPlane(plane, intersectionPoint);
        }

        // -----------------
        // STARS GRAVITATIONAL INFLUENCE MATH
        // -----------------
        const starGeomPosition = pointsGeometry.attributes.position as THREE.BufferAttribute;
        const starGeomColor = pointsGeometry.attributes.color as THREE.BufferAttribute;
        const starGeomSize = pointsGeometry.attributes.size as THREE.BufferAttribute;

        const posArr = starGeomPosition.array as Float32Array;
        const colorArr = starGeomColor.array as Float32Array;
        const sizeArr = starGeomSize.array as Float32Array;

        const showDM = activeParams.showDarkMatterParticles;
        const dmInfluence = activeParams.darkMatterInfluence;

        let starsRenderedCount = 0;

        // Adaptive Performance Scaling: simulate fewer stars if frame rate is low or on mobile
        const activeStarLimit = window.innerWidth < 768
          ? Math.min(35000, starsRef.current.length)
          : fpsRef.current < 42
            ? Math.min(65000, starsRef.current.length)
            : starsRef.current.length;

        for (let i = 0; i < activeStarLimit; i++) {
          const star = starsRef.current[i];
          if (!star || !star.active) continue;

          starsRenderedCount++;

          // Universal Cursor Field: Mouse exerts a beautiful tangential vortex swirl on nearby stars (Principle 15, URE)
          if (mouseActiveRef.current && intersectionPoint) {
            const dx = star.x - intersectionPoint.x;
            const dy = star.y - intersectionPoint.y;
            const dz = star.z - intersectionPoint.z;
            const distSq = dx * dx + dy * dy + dz * dz;
            if (distSq < 100.0) { // Within 10 Light Years of 3D cursor position
              const dist = Math.sqrt(distSq) + 0.1;
              const force = (1.0 - dist / 10.0) * 0.14 * Math.max(0.25, activeParams.timeStep / 0.15); // strongest closer to center
              // Swirl stardust around the cursor: cross product of [0, 1, 0] with direction vector
              const sx = -dz / dist;
              const sz = dx / dist;
              star.vx += sx * force;
              star.vz += sz * force;
              // Add energy stardust brightening (Energy Conservation Principle)
              star.r = Math.min(1.0, star.r + force * 0.85);
              star.g = Math.min(1.0, star.g + force * 0.55);
              star.b = Math.min(1.0, star.b + force * 0.25);
            }
          }

          // Stars calculate gravity from BOTH galactic cores
          let ax = 0, ay = 0, az = 0;

          // Core 1 gravitational pull
          if (core1.active) {
            const dx = core1.x - star.x;
            const dy = core1.y - star.y;
            const dz = core1.z - star.z;
            const distSq = dx * dx + dy * dy + dz * dz + softSq;
            const dist = Math.sqrt(distSq);

            // G * Mass potential calculation
            let effectiveMass = core1.mass;
            if (activeParams.darkMatterEnabled) {
              // Dark Matter halo introduces a flat speed curve
              // Visually represented by adding virtual halo mass as a function of distance r
              effectiveMass += core1.mass * (dist * dmInfluence * 0.12);
            }

            const pull = (G * effectiveMass) / (distSq * dist);
            ax += dx * pull;
            ay += dy * pull;
            az += dz * pull;

            // Accretion/Eating Star inside Core 1
            if (dist < core1.radius * 1.5) {
              // Star is consumed by Black Hole!
              star.active = false;
              // Trigger slight energy sparkle
              continue;
            }
          }

          // Core 2 gravitational pull
          if (core2.active) {
            const dx = core2.x - star.x;
            const dy = core2.y - star.y;
            const dz = core2.z - star.z;
            const distSq = dx * dx + dy * dy + dz * dz + softSq;
            const dist = Math.sqrt(distSq);

            let effectiveMass = core2.mass;
            if (activeParams.darkMatterEnabled) {
              effectiveMass += core2.mass * (dist * dmInfluence * 0.12);
            }

            const pull = (G * effectiveMass) / (distSq * dist);
            ax += dx * pull;
            ay += dy * pull;
            az += dz * pull;

            // Accretion/Eating Star inside Core 2
            if (dist < core2.radius * 1.5) {
              star.active = false;
              continue;
            }
          }

          // Supernova Shockwave Push: supernova blast pushes stars dynamically
          for (const sn of supernovasRef.current) {
            const dx = star.x - sn.x;
            const dy = star.y - sn.y;
            const dz = star.z - sn.z;
            const dSq = dx * dx + dy * dy + dz * dz + 1.0;
            const d = Math.sqrt(dSq);

            // If within shockwave threshold, blow the star outward
            const shockRadius = sn.currentRadius;
            if (d < shockRadius && d > shockRadius - 2.0) {
              const pushFactor = 4.5 / (dSq * (sn.age / sn.life + 0.1));
              ax += (dx / d) * pushFactor;
              ay += (dy / d) * pushFactor;
              az += (dz / d) * pushFactor;
            }
          }

          // Apply accelerations to velocity
          star.vx += ax * dt;
          star.vy += ay * dt;
          star.vz += az * dt;

          // Drag friction during violent collision orbits prevents stars from flying to infinity
          if (!isCoresMergedRef.current) {
            star.vx *= 0.9995;
            star.vy *= 0.9995;
            star.vz *= 0.9995;
          }

          // Apply velocities to positions
          star.x += star.vx * dt;
          star.y += star.vy * dt;
          star.z += star.vz * dt;

          // Dynamic Star Birth / Newborn Age-Up logic
          if (star.type === 'newborn') {
            star.age += dt;
            if (star.age > star.life) {
              // Convert newborn to regular blue-white disk star
              star.type = 'regular';
              star.r = 0.85;
              star.g = 0.95;
              star.b = 1.0;
              star.size = star.originalSize;
            } else {
              // Pulse/shrink animation
              const pulse = Math.sin((star.age / star.life) * Math.PI);
              star.size = star.originalSize * (1.0 + pulse * 1.5);
              star.r = 0.0;
              star.g = 0.78 + pulse * 0.22;
              star.b = 1.0;
            }
          }

          // Write updated properties to Point Geometry Float32Arrays
          posArr[i * 3] = star.x;
          posArr[i * 3 + 1] = star.y;
          posArr[i * 3 + 2] = star.z;

          // Dark Matter Visualizer approximation: If enabled, show a magenta aura
          if (showDM && activeParams.darkMatterEnabled && i % 15 === 0) {
            colorArr[i * 3] = 0.85;       // Vibrant purple-magenta
            colorArr[i * 3 + 1] = 0.11;
            colorArr[i * 3 + 2] = 0.96;
            sizeArr[i] = star.size * 1.6 * starsAppearanceFactorRef.current;
          } else {
            colorArr[i * 3] = star.r;
            colorArr[i * 3 + 1] = star.g;
            colorArr[i * 3 + 2] = star.b;
            sizeArr[i] = star.size * activeParams.starSizeMultiplier * starsAppearanceFactorRef.current;
          }
        }

        // -----------------
        // SUPERNOVAS SHOCKWAVES UPDATES
        // -----------------
        for (let k = supernovasRef.current.length - 1; k >= 0; k--) {
          const sn = supernovasRef.current[k];
          sn.age += dt;
          // Expanding shockwave shell
          sn.currentRadius += 1.2 * dt;

          if (sn.age >= sn.life) {
            // Remove supernova
            supernovasRef.current.splice(k, 1);
          }
        }

        // Flag points as needing GPU upload
        starGeomPosition.needsUpdate = true;
        starGeomColor.needsUpdate = true;
        starGeomSize.needsUpdate = true;

        if (now - lastUiTelemetryUpdate >= 250) {
          setStarsRenderedCount(starsRenderedCount);
          setSimulationTime(Math.round(simAge));
          lastUiTelemetryUpdate = now;
        }
      }

      // Rotate entire galaxy system coordinates slowly for aesthetic beauty
      starParticles.rotation.y = now * 0.00003;

      // 11. Mouse Gravitational Probe & Uniform Updates
      starsMaterial.uniforms.uMouse.value.copy(mouseNDCRef.current);
      starsMaterial.uniforms.uMouseStrength.value = THREE.MathUtils.lerp(
        starsMaterial.uniforms.uMouseStrength.value,
        mouseActiveRef.current ? 1.0 : 0.0,
        0.1
      );
      starsMaterial.uniforms.uStarSizeMultiplier.value = activeParams.starSizeMultiplier;
      starsMaterial.uniforms.uStarsAppearance.value = starsAppearanceFactorRef.current;

      if (probeRef.current) {
        if (mouseActiveRef.current && mouseClientRef.current) {
          probeRef.current.style.display = 'block';
          probeRef.current.style.left = `${mouseClientRef.current.x}px`;
          probeRef.current.style.top = `${mouseClientRef.current.y}px`;

          // Calculate 3D Raycast to galactic plane (y = 0)
          raycaster.setFromCamera(mouseNDCRef.current, camera);
          raycaster.ray.intersectPlane(plane, intersectionPoint);

          // Calculate gravity potential
          let gPotential = 0;
          for (const core of coresRef.current) {
            if (core.active) {
              const dx = intersectionPoint.x - core.x;
              const dy = intersectionPoint.y - core.y;
              const dz = intersectionPoint.z - core.z;
              const distSq = dx * dx + dy * dy + dz * dz + 1.0;
              gPotential += (activeParams.gConstant * core.mass) / distSq;
            }
          }

          // Format coordinates and value
          const gpEl = document.getElementById('probe-gpotential');
          const pxEl = document.getElementById('probe-x');
          const pzEl = document.getElementById('probe-z');
          
          if (gpEl) gpEl.textContent = `${(gPotential * 10).toFixed(1)} mG`;
          if (pxEl) pxEl.textContent = `X: ${intersectionPoint.x.toFixed(1)} LY`;
          if (pzEl) pzEl.textContent = `Z: ${intersectionPoint.z.toFixed(1)} LY`;
        } else {
          probeRef.current.style.display = 'none';
        }
      }

      // Theme Emotional Resonance: Smoothly interpolate background color and fog density based on active module (Principle 13, URE)
      let targetClearColor = 0x02030a; // Default deep void blue
      let targetFogDensity = 0.005;

      const currentMod = activeModuleRef.current;
      if (currentMod === 'lab') {
        targetClearColor = 0x010103; // Cold compressing black for lab
        targetFogDensity = 0.008;
      } else if (currentMod === 'quantum') {
        targetClearColor = 0x050110; // Probability indigo/violet for quantum
        targetFogDensity = 0.006;
      } else if (currentMod === 'scale') {
        targetClearColor = 0x070301; // Warm stellar dust dark amber for scale
        targetFogDensity = 0.0045;
      } else if (currentMod === 'missions' || currentMod === 'guardian') {
        targetClearColor = 0x010306; // Voyager sleek dark teal for missions
        targetFogDensity = 0.0052;
      }

      // Smoothly interpolate fog & clear colors
      const currentClear = renderer.getClearColor(new THREE.Color());
      const interpolatedClear = currentClear.lerp(new THREE.Color(targetClearColor), 0.04);
      renderer.setClearColor(interpolatedClear, 1.0);
      
      if (scene.fog) {
        scene.fog.color.copy(interpolatedClear);
        if (scene.fog instanceof THREE.FogExp2) {
          scene.fog.density += (targetFogDensity - scene.fog.density) * 0.04;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('triggerCosmicShake', handleCosmicShake);
      if (canvasEl) {
        canvasEl.removeEventListener('pointermove', handlePointerMove);
        canvasEl.removeEventListener('pointerleave', handlePointerLeave);
        canvasEl.removeEventListener('pointerenter', handlePointerEnter);
        canvasEl.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointermove', handlePointerMoveDrag);
        window.removeEventListener('pointerup', handlePointerUp);
        canvasEl.removeEventListener('wheel', handleWheel);
      }
      rendererResizeObserver.disconnect();
      window.removeEventListener('resize', resizeRenderer);
      renderer.dispose();
      starTexture.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      bh1Geom.dispose();
      bh1Mat.dispose();
      bh2Geom.dispose();
      bh2Mat.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();
      orbit1Geom.dispose();
      orbit1Mat.dispose();
      orbit2Geom.dispose();
      orbit2Mat.dispose();
      starsMaterial.dispose();
      pointsGeometry.dispose();
    };
  }, []);

  // ==========================================
  // 🔬 USER ACTIONS & CONTROLLER HANDLERS
  // ==========================================
  
  // Trigger a Galaxy Collision manually
  const triggerGalaxyCollision = () => {
    synth.playSupernova(); // Play rumble sound
    const core1 = coresRef.current[0];
    const core2 = coresRef.current[1];

    if (!core1.active || !core2.active) {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Commander, the cores are already merged into a single supermassive singularity. A second collision is mathematically impossible in this system.' }
      ]);
      return;
    }

    // Direct their velocities directly at each other to guarantee a gorgeous intersect path!
    const dx = core2.x - core1.x;
    const dy = core2.y - core1.y;
    const dz = core2.z - core1.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // Vector pointing from 1 to 2
    const nx = dx / dist;
    const ny = dy / dist;
    const nz = dz / dist;

    // Give them high colliding velocities
    core1.vx = nx * 1.5;
    core1.vy = ny * 1.5;
    core1.vz = nz * 1.5;

    core2.vx = -nx * 1.5;
    core2.vy = -ny * 1.5;
    core2.vz = -nz * 1.5;

    setParams((prev) => ({ ...prev, isPaused: false }));

    // Flash screen effect
    const flash = document.getElementById('obs-flash');
    if (flash) {
      flash.classList.add('opacity-40');
      setTimeout(() => flash.classList.remove('opacity-40'), 800);
    }
  };

  // Trigger a Supernova explosion manually in a random high-mass quadrant
  const triggerSupernova = () => {
    synth.playSupernova();

    // Universal Resonance dispatch (URE)
    window.dispatchEvent(new CustomEvent('triggerCosmicShake', { detail: { amount: 5.5 } }));
    window.dispatchEvent(new CustomEvent('triggerCosmicResonance', { detail: { amount: 6.0, type: 'supernova' } }));
    
    // Select a random star from the spiral arms
    const count = starsRef.current.length;
    let randomIndex = Math.floor(Math.random() * count * 0.8); // pick standard stars, not gas dust
    const parentStar = starsRef.current[randomIndex];

    if (parentStar && parentStar.active) {
      // Explode! Create a supernova shockwave event
      const newSN: SupernovaEvent = {
        id: Date.now(),
        x: parentStar.x,
        y: parentStar.y,
        z: parentStar.z,
        color: { r: 1.0, g: 0.45, b: 0.1 },
        maxRadius: 15.0,
        currentRadius: 1.0,
        age: 0,
        life: 50.0,
      };

      supernovasRef.current.push(newSN);

      // Mutate parent star into supernova visual state (glowing orange-white flash)
      parentStar.type = 'supernova';
      parentStar.r = 1.0;
      parentStar.g = 0.9;
      parentStar.b = 0.5;
      parentStar.size = parentStar.originalSize * 15.0; // Enormous size

      // Push neighboring 1000 stars velocities outward slightly
      for (const star of starsRef.current) {
        if (!star || !star.active) continue;
        const dx = star.x - newSN.x;
        const dy = star.y - newSN.y;
        const dz = star.z - newSN.z;
        const distSq = dx * dx + dy * dy + dz * dz + 0.1;
        const dist = Math.sqrt(distSq);

        if (dist < 10.0) {
          const pushSpeed = 1.8 / distSq;
          star.vx += (dx / dist) * pushSpeed;
          star.vy += (dy / dist) * pushSpeed;
          star.vz += (dz / dist) * pushSpeed;
        }
      }

      // Configure temporary scanner update to focus on Supernova
      setScannedObject({
        name: `Supernova SN-${Math.floor(1000 + Math.random() * 9000)}B`,
        type: "Core-Collapse Hypergiant (Type II)",
        mass: "18.4 Solar Masses (Collapsing)",
        velocity: `${Math.round(parentStar.vx * 300)} km/s (Shockwave Front)`,
        distance: `${Math.round(Math.sqrt(parentStar.x*parentStar.x + parentStar.y*parentStar.y + parentStar.z*parentStar.z) * 1000)} Light Years`,
        age: "8.5 Million Years (At Death)",
        temperature: "100 Billion Kelvin (Core Ignition)",
        stars: "N/A",
        status: "Active Shockwave / Distributing Iron & Gold",
        coordinate: `X: ${parentStar.x.toFixed(2)}, Y: ${parentStar.y.toFixed(2)}, Z: ${parentStar.z.toFixed(2)}`,
        isBH: false,
      });

      // UI Screen flash
      const flash = document.getElementById('obs-flash');
      if (flash) {
        flash.classList.add('bg-orange-500', 'opacity-65');
        setTimeout(() => flash.classList.remove('bg-orange-500', 'opacity-65'), 400);
      }
    }
  };

  // Star Birth Nursery Spawn Trigger
  const triggerStarBirth = () => {
    synth.playStarBirth();

    // Spawn 150 bright newborn blue stellar objects inside a new nebula cloud
    const count = starsRef.current.length;
    const core1 = coresRef.current[0];
    
    // Spawn nebulas near the spiral galaxy gas disk
    const angle = Math.random() * Math.PI * 2;
    const rad = 10.0 + Math.random() * 10.0;
    const nebX = core1.x + Math.cos(angle) * rad;
    const nebY = core1.y + (Math.random() - 0.5) * 2;
    const nebZ = core1.z + Math.sin(angle) * rad;

    for (let k = 0; k < 120; k++) {
      const slot = (nextParticleIdRef.current++) % count;
      
      const birthTheta = Math.random() * Math.PI * 2;
      const birthRad = Math.random() * 3.5;
      const px = nebX + Math.cos(birthTheta) * birthRad;
      const py = nebY + (Math.random() - 0.5) * 1.5;
      const pz = nebZ + Math.sin(birthTheta) * birthRad;

      // Orbit velocity matching general core rotation
      const dx = px - core1.x;
      const dz = pz - core1.z;
      const angleToCenter = Math.atan2(dz, dx);
      const speed = 1.4;
      const pvx = -Math.sin(angleToCenter) * speed + (Math.random() - 0.5) * 0.15;
      const pvy = (Math.random() - 0.5) * 0.1;
      const pvz = Math.cos(angleToCenter) * speed + (Math.random() - 0.5) * 0.15;

      const size = 0.45 + Math.random() * 0.55;

      starsRef.current[slot] = {
        id: slot,
        galaxyId: 1,
        type: 'newborn',
        x: px, y: py, z: pz,
        vx: pvx, vy: pvy, vz: pvz,
        r: 0.0, g: 0.78, b: 1.0, // Neon blue star nursery
        size,
        originalSize: size,
        age: 0,
        life: 15.0 + Math.random() * 25.0, // Active lifespan
        active: true,
      };
    }

    setScannedObject({
      name: `Nebula Nursery NGC-${Math.floor(4000 + Math.random() * 3000)}`,
      type: "Diffuse Active Star Nursery",
      mass: "4,200 Solar Masses (Baryonic Hydrogen)",
      velocity: "12.5 km/s (Disk Co-rotation)",
      distance: `${Math.round(rad * 1200)} Light Years`,
      age: "2.4 Million Years",
      temperature: "10 Kelvin to 15,000 Kelvin (Protostars)",
      stars: "120 Protostars Igniting",
      status: "Condensing / Active Star Formation",
      coordinate: `X: ${nebX.toFixed(2)}, Y: ${nebY.toFixed(2)}, Z: ${nebZ.toFixed(2)}`,
      isBH: false,
    });
  };

  // Toggle Orbits
  const toggleOrbits = () => {
    setParams((prev) => ({ ...prev, showOrbits: !prev.showOrbits }));
  };

  // Toggle Dark Matter
  const toggleDarkMatter = () => {
    setParams((prev) => ({ 
      ...prev, 
      darkMatterEnabled: !prev.darkMatterEnabled,
      showDarkMatterParticles: !prev.showDarkMatterParticles 
    }));
  };

  // Sound Synth adjustments
  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value);
    setVolume(vol);
    synth.setVolume(vol / 100);
  };

  const handleMuteToggle = () => {
    const isMuted = synth.toggleMute();
    setMuted(isMuted);
  };

  // Trigger Scientific Scan on click of celestial cores or random bodies
  const runScientificScan = (target: 'bh1' | 'bh2' | 'random') => {
    setIsScanning(true);
    synth.playStarBirth();

    setTimeout(() => {
      setIsScanning(false);
      if (target === 'bh1') {
        setScannedObject({
          name: "Sagittarius Alpha*",
          type: "Supermassive Black Hole",
          mass: `${isCoresMerged ? '8.00 x 10^4' : '5.00 x 10^4'} Solar Masses`,
          velocity: `${isCoresMerged ? '12.4' : '18.4'} km/s (Galactic Apex)`,
          distance: "0.00 Light Years (Core Center)",
          age: "13.4 Billion Years",
          temperature: "1.2 Billion Kelvin (Accretion)",
          stars: "N/A",
          status: isCoresMerged ? "Extremely Stable Singularity" : "Stable / Consuming Nearby Stars",
          coordinate: `X: ${coresRef.current[0].x.toFixed(2)}, Y: ${coresRef.current[0].y.toFixed(2)}, Z: ${coresRef.current[0].z.toFixed(2)}`,
          isBH: true,
        });
      } else if (target === 'bh2') {
        if (!coresRef.current[1].active) {
          setScannedObject({
            name: "Defunct Singularity",
            type: "Eaten Core",
            mass: "0.00 Solar Masses",
            velocity: "N/A",
            distance: "N/A",
            age: "Merged / Collapsed",
            temperature: "N/A",
            stars: "0",
            status: "Fused into Sagittarius Alpha*",
            coordinate: "N/A",
            isBH: true,
          });
          return;
        }
        setScannedObject({
          name: "M31 Andromeda Core",
          type: "Intermediate Supermassive Black Hole",
          mass: "3.00 x 10^4 Solar Masses",
          velocity: "25.2 km/s (Approach Vector)",
          distance: `${Math.sqrt(
            Math.pow(coresRef.current[1].x - coresRef.current[0].x, 2) +
            Math.pow(coresRef.current[1].y - coresRef.current[0].y, 2) +
            Math.pow(coresRef.current[1].z - coresRef.current[0].z, 2)
          ).toFixed(1)} Light Years from Core 1`,
          age: "12.8 Billion Years",
          temperature: "950 Million Kelvin",
          stars: "N/A",
          status: "Experiencing Gravitational Tidal Forces",
          coordinate: `X: ${coresRef.current[1].x.toFixed(2)}, Y: ${coresRef.current[1].y.toFixed(2)}, Z: ${coresRef.current[1].z.toFixed(2)}`,
          isBH: true,
        });
      } else {
        // Random star scanning
        const randId = Math.floor(Math.random() * 100000);
        const star = starsRef.current[randId];
        if (star) {
          setScannedObject({
            name: `Star Ke-100${randId}`,
            type: star.r > 0.9 ? "Red Giant (OBAFGKM M-Class)" : star.b > 0.9 ? "Hypergiant Blue Star (O-Class)" : "Main Sequence Dwarf (G-Class)",
            mass: `${(star.size * 12.4).toFixed(2)} Solar Masses`,
            velocity: `${(Math.sqrt(star.vx*star.vx + star.vy*star.vy + star.vz*star.vz) * 220).toFixed(1)} km/s`,
            distance: `${(Math.sqrt(star.x*star.x + star.y*star.y + star.z*star.z) * 1150).toFixed(0)} Light Years`,
            age: star.r > 0.9 ? "8.4 Billion Years" : "120 Million Years",
            temperature: star.b > 0.9 ? "32,000 Kelvin" : "5,800 Kelvin (Solar Standard)",
            stars: "N/A",
            status: "Orbiting Stable Galactic Potential",
            coordinate: `X: ${star.x.toFixed(2)}, Y: ${star.y.toFixed(2)}, Z: ${star.z.toFixed(2)}`,
            isBH: false,
          });
        }
      }
    }, 1200);
  };

  // Timeline scrub changes simulation conditions
  const handleTimelineChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setTimelineVal(val);

    // Timeline actions:
    // 0 -> Big Bang, dense compact core
    // 5.0 -> Early galaxies, high star birth
    // 13.8 -> Today, beautiful stable spiral
    // 20.0 -> Future, violent collisions!
    if (val < 2.0) {
      // Compress galaxies into absolute core (Big Bang dense state)
      coresRef.current[0].x = -4;
      coresRef.current[1].x = 4;
      setParams((prev) => ({ ...prev, starSizeMultiplier: 2.2, darkMatterInfluence: 0.2 }));
    } else if (val >= 2.0 && val < 10.0) {
      // Early expansion
      coresRef.current[0].x = -15;
      coresRef.current[1].x = 15;
      setParams((prev) => ({ ...prev, starSizeMultiplier: 1.4, darkMatterInfluence: 0.5 }));
    } else if (val >= 10.0 && val < 15.0) {
      // Stable era
      coresRef.current[0].x = -18;
      coresRef.current[1].x = 18;
      setParams((prev) => ({ ...prev, starSizeMultiplier: 1.0, darkMatterInfluence: 0.8 }));
    } else {
      // Colliding future!
      triggerGalaxyCollision();
    }
  };

  // ==========================================
  // 🧠 HOLOGRAPHIC AI ASSISTANT CHAT HANDLERS
  // ==========================================
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue;
    if (!textToSend.trim()) return;

    // Add user message to chat history
    const userMsg = { role: 'user' as const, content: textToSend };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Init sound synth if not done already (on first chat interaction)
      startAudioSynth();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: chatMessages.slice(-8), // send last 8 turns of context
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "Connection anomaly detected in the quantum array.";

      // Parse response for DIRECT ACTION TRIGGERS to command the simulator!
      if (replyText.includes('[ACTION: COLLIDE]')) {
        triggerGalaxyCollision();
      } else if (replyText.includes('[ACTION: SUPERNOVA]')) {
        triggerSupernova();
      } else if (replyText.includes('[ACTION: STAR_BIRTH]')) {
        triggerStarBirth();
      } else if (replyText.includes('[ACTION: DARK_MATTER]')) {
        if (!params.darkMatterEnabled) toggleDarkMatter();
      } else if (replyText.includes('[ACTION: CAMERA_FLY]')) {
        setParams((prev) => ({ ...prev, camMode: 'flythrough' }));
      } else if (replyText.includes('[ACTION: TOGGLE_ORBITS]')) {
        toggleOrbits();
      }

      // Add assistant response to chat history
      setChatMessages((prev) => [...prev, { role: 'assistant', content: replyText }]);
    } catch (e) {
      console.error('Chat error:', e);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: "Holographic link severed. Utilizing local offline cognitive circuits: [ACTION: COLLIDE] Initiating emergency collision orbits." }]);
      triggerGalaxyCollision();
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#02030A] text-[#F8FAFC] font-sans select-none">
      {/* Dynamic Screen Flash Overlay for Supernovas & Collisions */}
      <div
        id="obs-flash"
        className="absolute inset-0 z-50 pointer-events-none transition-all duration-700 opacity-0 bg-white"
      />

      {/* 3D WebGL Canvas Backdrop */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-0">
        <canvas ref={canvasRef} className="w-full h-full block cursor-none" />
      </div>

      {/* Floating Gravitational Probe Cursor HUD (highly performance optimized via direct DOM manipulation) */}
      <div
        ref={probeRef}
        className="absolute pointer-events-none z-40 font-mono text-[10px] text-[#00C8FF] select-none hidden"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        {/* Outer rotating dashed ring */}
        <div className="absolute inset-0 w-16 h-16 -m-8 rounded-full border border-dashed border-[#00C8FF]/40 animate-spin-slow" />
        
        {/* Inner focus crosshair */}
        <div className="absolute inset-0 w-8 h-8 -m-4 rounded-full border border-[#8B5CF6]/40 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        </div>

        {/* Floating Data Readout panels */}
        <div className="absolute left-10 -top-12 bg-[#02030A]/95 border border-[#00C8FF]/30 px-2.5 py-2 rounded-md min-w-[140px] flex flex-col gap-0.5 backdrop-blur-sm shadow-lg leading-tight">
          <div className="text-[9px] text-[#00C8FF]/60 uppercase tracking-widest flex justify-between items-center">
            <span>Probe Status</span>
            <span className="text-emerald-400 animate-pulse">● Active</span>
          </div>
          <div className="text-[11px] text-white font-bold tracking-tight">GRAV POTENTIAL</div>
          <div id="probe-gpotential" className="text-emerald-400 font-semibold text-xs">0.0 mG</div>
          <div className="text-[8px] text-slate-400 mt-1 flex justify-between gap-2 border-t border-slate-900 pt-1">
            <span id="probe-x">X: 0.00 LY</span>
            <span id="probe-z">Z: 0.00 LY</span>
          </div>
        </div>
      </div>

      {/* Ambient Cosmic Observatory Grid Lines */}
      <div className="absolute inset-0 pointer-events-none border border-[#00C8FF]/10 bg-[linear-gradient(rgba(0,200,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] z-0" />

      {/* ==========================================
          🌌 MAIN OBSERVATORY HUD TOP HEADER
          ========================================== */}
      <header className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#02030A]/95 to-[#02030A]/0 border-b border-[#00C8FF]/10 flex items-center justify-between px-6 z-30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full border border-[#00C8FF]/40 flex items-center justify-center animate-spin-slow bg-[#061226]/80">
            <Atom className="w-4 h-4 text-[#00C8FF]" />
            <div className="absolute inset-0 rounded-full border border-[#8B5CF6]/20 scale-125" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono tracking-widest text-[#00C8FF] text-xs font-semibold">COSMOS OS</span>
              <span className="text-[10px] bg-[#372C68]/80 text-[#8B5CF6] px-1.5 py-0.5 rounded border border-[#8B5CF6]/20 font-mono">v3.9.1</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-sm font-bold tracking-tight text-white uppercase flex items-center gap-1.5">
                <span>Cosmos OS Simulator</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              </h1>
              <button
                onClick={() => setOrbitOpen(!orbitOpen)}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-mono transition-all uppercase ${
                  orbitOpen
                    ? "bg-[#8B5CF6]/40 border-[#8B5CF6] text-white"
                    : "bg-[#061226]/80 border-[#00C8FF]/30 text-[#00C8FF] hover:border-[#00C8FF]"
                }`}
                title="Toggle Concentric Orbit Navigation"
              >
                <Compass className="w-3 h-3 animate-spin-slow" />
                <span>Orbits Menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* HUD Subtitle & Live Status indicator */}
        <div className="hidden md:flex items-center gap-6 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Activity className="w-3.5 h-3.5 text-[#00C8FF]" />
            <span>GRAV CALCULATIONS: <strong className="text-[#00C8FF] font-semibold">O(N) GALACTIC HALO</strong></span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-1.5 text-slate-400">
            <Disc className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>BH CORE INTEGRITY: <strong className={isCoresMerged ? "text-amber-400 font-semibold" : "text-emerald-400 font-semibold"}>{isCoresMerged ? "MERGED (80k Sol)" : "STABLE SYNC"}</strong></span>
          </div>
        </div>

        {/* Header Right Sound & Fullscreen controls */}
        <div className="flex items-center gap-4">
          {/* Quick Sound Controller Panel */}
          <div className="flex items-center gap-2 bg-[#061226]/60 border border-[#00C8FF]/10 rounded-full px-3 py-1 backdrop-blur-md">
            <button
              onClick={handleMuteToggle}
              className="text-[#00C8FF] hover:text-white transition-colors"
              title={muted ? "Unmute" : "Mute Space Ambience"}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              onClick={startAudioSynth}
              className="w-16 accent-[#00C8FF] h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-2 rounded border border-[#00C8FF]/10 bg-[#061226]/50 text-slate-400 hover:text-white transition-all backdrop-blur-md hover:border-[#00C8FF]/30"
          >
            {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ==========================================
          📊 REAL-TIME CORE OBSERVATORY METRICS RAIL (LEFT)
          ========================================== */}
      <section className="absolute left-6 top-24 bottom-24 w-72 flex flex-col gap-4 z-20 pointer-events-auto">
        
        {/* Holographic Panel 1: Live Physics Stats */}
        <div className="flex-1 bg-[#02030A]/75 border border-[#00C8FF]/20 rounded-xl p-4 backdrop-blur-md flex flex-col shadow-[0_0_20px_rgba(2,3,10,0.8)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-32 h-[1px] bg-gradient-to-r from-[#00C8FF] to-transparent" />
          
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-mono tracking-wider text-[#00C8FF]/80 font-bold uppercase flex items-center gap-1.5">
              <Binary className="w-3.5 h-3.5 text-[#00C8FF] animate-pulse" />
              <span>Observable Metrics</span>
            </h2>
            <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-1.5 py-0.5 rounded">REALTIME</span>
          </div>

          <div className="flex-1 flex flex-col justify-between gap-2.5 font-mono text-xs">
            <div className="flex justify-between border-b border-slate-900 pb-1.5">
              <span className="text-slate-400">FPS / Refresh Rate</span>
              <span className={`font-semibold ${fps >= 50 ? "text-emerald-400" : "text-amber-400"}`}>{fps} Hz</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1.5">
              <span className="text-slate-400">Total Rendered Stars</span>
              <span className="text-[#8B5CF6] font-semibold">{starsRenderedCount.toLocaleString()} Stars</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1.5">
              <span className="text-slate-400">Active Massive Cores</span>
              <span className="text-white font-semibold">{activeColliders} Singularity</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1.5">
              <span className="text-slate-400">Simulation Age</span>
              <span className="text-amber-400 font-semibold">{simulationTime} Myr (Million Yrs)</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1.5">
              <span className="text-slate-400">BH1 Core Mass</span>
              <span className="text-[#00C8FF] font-semibold">{bh1Mass.toLocaleString()} Sol</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1.5">
              <span className="text-slate-400">BH2 Core Mass</span>
              <span className="text-[#8B5CF6] font-semibold">{bh2Mass.toLocaleString()} Sol</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1.5">
              <span className="text-slate-400">Est. Dark Matter Halo</span>
              <span className="text-pink-400 font-semibold">{params.darkMatterEnabled ? "82.4% Halo Density" : "Disabled (Keplerian)"}</span>
            </div>
            <div className="flex justify-between pb-1.5">
              <span className="text-slate-400">Orbital Velocity Law</span>
              <span className="text-emerald-400 font-semibold">{params.darkMatterEnabled ? "Flat Curve (Stable)" : "Lagging (High Wind)"}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#00C8FF]/10 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>SCDS ARCHITECTURE</span>
            <span className="text-slate-400">STABLE FEED</span>
          </div>
        </div>

        {/* Holographic Panel 2: Scientific Scanner View */}
        <div className="flex-1 bg-[#02030A]/75 border border-[#00C8FF]/20 rounded-xl p-4 backdrop-blur-md flex flex-col shadow-[0_0_20px_rgba(2,3,10,0.8)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-l from-[#8B5CF6] to-transparent" />

          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs font-mono tracking-wider text-[#8B5CF6] font-bold uppercase flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#8B5CF6] animate-pulse" />
              <span>Scientific Scanner</span>
            </h2>
            <button
              onClick={() => runScientificScan('random')}
              className="text-[10px] text-[#00C8FF] hover:underline font-mono"
            >
              SCAN NEAREST
            </button>
          </div>

          {/* Holographic Scanning telemetry visualizer card */}
          {scannedObject ? (
            <div className="flex-1 flex flex-col justify-between font-mono text-[11px] relative">
              {isScanning ? (
                <div className="absolute inset-0 bg-[#02030A]/90 flex flex-col items-center justify-center gap-3 border border-[#00C8FF]/20 rounded-lg">
                  <div className="w-12 h-12 border-2 border-t-transparent border-[#00C8FF] rounded-full animate-spin" />
                  <span className="text-[#00C8FF] text-xs font-bold uppercase tracking-wider animate-pulse">Scanning Quantum Vectors...</span>
                </div>
              ) : null}

              <div>
                <div className="text-white font-bold border-b border-slate-900 pb-1 text-xs text-[#00C8FF] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#00C8FF] rounded-full" />
                  {scannedObject.name}
                </div>
                <div className="text-[10px] text-slate-500 mb-2">{scannedObject.type}</div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-1.5 mt-2 text-slate-400">
                  <div>Mass: <span className="text-[#FFD166]">{scannedObject.mass}</span></div>
                  <div>Age: <span className="text-slate-300">{scannedObject.age}</span></div>
                  <div>Vel: <span className="text-emerald-400">{scannedObject.velocity}</span></div>
                  <div>Temp: <span className="text-[#FF6B35]">{scannedObject.temperature}</span></div>
                  <div className="col-span-2 text-slate-500 text-[10px] pt-1">
                    Coord: <span className="text-slate-400">{scannedObject.coordinate}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic 2D Miniature Canvas Plot representing orbital velocity curve (Education) */}
              <div className="mt-3 bg-slate-950/90 border border-slate-900 rounded p-1.5 h-16 flex flex-col justify-between relative overflow-hidden">
                <span className="text-[9px] text-slate-600 absolute top-1 right-1">ROTATION CURVE</span>
                <div className="flex-1 flex items-end gap-[1px] h-full w-full pt-2">
                  {[...Array(20)].map((_, i) => {
                    // With Dark Matter: flat curve (height remains constant)
                    // Without Dark Matter: Keplerian drop (height drops off rapidly)
                    const x = i / 19;
                    const height = params.darkMatterEnabled 
                      ? 50 + Math.sin(x * 1.5) * 5 // Flat curve with slight rise
                      : 80 * (1 / (1 + x * 4)); // Keplerian steep drop-off
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-[#00C8FF]/20 to-[#00C8FF]"
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between text-[8px] text-slate-600 border-t border-slate-900 pt-0.5">
                  <span>CORE (0LY)</span>
                  <span>EDGE (40kLY)</span>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => runScientificScan('bh1')}
                  className="flex-1 text-center py-1 rounded border border-[#00C8FF]/20 hover:border-[#00C8FF]/50 bg-[#061226]/40 text-[#00C8FF] text-[10px] transition-all"
                >
                  CORE 1
                </button>
                <button
                  onClick={() => runScientificScan('bh2')}
                  className="flex-1 text-center py-1 rounded border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 bg-[#061226]/40 text-[#8B5CF6] text-[10px] transition-all"
                >
                  CORE 2
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500 font-mono text-center">
              Click Core or run scan to retrieve celestial telemetry.
            </div>
          )}
        </div>

        {/* Holographic Panel 3: Customizable Science Config (The 15 pillars config) */}
        <div className="bg-[#02030A]/85 border border-[#00C8FF]/20 rounded-xl p-4 backdrop-blur-md flex flex-col gap-2 relative overflow-hidden text-xs font-mono">
          <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-amber-500 to-transparent" />
          
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-[10px] font-mono tracking-wider text-amber-400 font-bold uppercase flex items-center gap-1.5">
              <span>Scientific Config</span>
            </h2>
            <span className="text-[9px] bg-amber-950/40 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">OS ADVANCED</span>
          </div>

          <div className="flex flex-col gap-2.5 mt-1">
            {/* Universe Mode Toggle */}
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-[9px] uppercase">Simulation Environment</span>
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-0.5 rounded border border-slate-900">
                <button
                  onClick={() => {
                    setUniverseMode('simulation');
                    triggerAchievement("Cosmic Sandbox Origin");
                    setJournalLogs((prev) => ["🌌 [MODE SHIFT] Active observatory environment set to Simulated Dual Galaxy Model.", ...prev]);
                  }}
                  className={`py-1 text-[9px] font-bold rounded transition-all cursor-pointer ${universeMode === 'simulation' ? 'bg-[#00C8FF]/20 text-[#00C8FF] border border-[#00C8FF]/30' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  SIM MODEL
                </button>
                <button
                  onClick={() => {
                    setUniverseMode('real');
                    triggerAchievement("NASA Data Explorer");
                    setJournalLogs((prev) => ["🌍 [NASA MODE] Active environment set to Real NASA Observation Catalogue. Betelgeuse, Sirius, and TRAPPIST-1 target orbits loaded.", ...prev]);
                  }}
                  className={`py-1 text-[9px] font-bold rounded transition-all cursor-pointer ${universeMode === 'real' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  NASA REAL
                </button>
              </div>
            </div>

            {/* Scientific Accuracy Level */}
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-[9px] uppercase">Scientific Accuracy Level</span>
              <select
                value={scientificLevel}
                onChange={(e) => {
                  const level = e.target.value as any;
                  setScientificLevel(level);
                  triggerAchievement("Academic Scholar");
                  setJournalLogs((prev) => [`🎓 [ACCURACY SHIFT] Telemetry depth adjusted to: ${level.toUpperCase()}.`, ...prev]);
                }}
                className="bg-slate-950 border border-slate-900 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-[#00C8FF] cursor-pointer"
              >
                <option value="explorer">Explorer (Visual Mechanics)</option>
                <option value="student">Student (Formulas & Laws)</option>
                <option value="advanced">Advanced (Astrophysics Charts)</option>
                <option value="research">Research (Numerical Matrices)</option>
              </select>
            </div>

            {/* Collaborative User Role */}
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-[9px] uppercase">Observatory Security Role</span>
              <select
                value={collaborativeRole}
                onChange={(e) => {
                  const role = e.target.value as any;
                  setCollaborativeRole(role);
                  triggerAchievement("Role Specialization");
                  setJournalLogs((prev) => [`🤝 [ROLE CHANGE] Assigned Command privilege token to: ${role.replace("_", " ").toUpperCase()}.`, ...prev]);
                }}
                className="bg-slate-950 border border-slate-900 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-[#00C8FF] cursor-pointer"
              >
                <option value="gravity_overseer">Gravity Overseer (Mass & Constants)</option>
                <option value="time_warden">Time Warden (Temporal scrubbing)</option>
                <option value="ai_professor">AI Professor (Dialogue Intelligence)</option>
                <option value="chief_observer">Chief Observer (Telemetry Scanner)</option>
              </select>
            </div>

            {/* Cosmic Archive Preset universes */}
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 text-[9px] uppercase">The Cosmic Archive presets</span>
              <select
                value={activeUniverseConfig}
                onChange={(e) => {
                  const presetName = e.target.value;
                  setActiveUniverseConfig(presetName);
                  triggerAchievement("Cosmic Archivist");
                  
                  if (presetName === "Standard Spiral Merger") {
                    coresRef.current[0].active = true;
                    coresRef.current[1].active = true;
                    setParams((prev) => ({ ...prev, gConstant: 0.15, darkMatterEnabled: true }));
                  } else if (presetName === "Giant Elliptical Singularity") {
                    coresRef.current[1].active = false;
                    setParams((prev) => ({ ...prev, gConstant: 0.25, darkMatterEnabled: false }));
                  } else if (presetName === "Dark Matter Halo Dominance") {
                    coresRef.current[0].active = true;
                    coresRef.current[1].active = true;
                    setParams((prev) => ({ ...prev, gConstant: 0.08, darkMatterEnabled: true, darkMatterInfluence: 1.5 }));
                  } else {
                    setParams((prev) => ({ ...prev, gConstant: 0.35, darkMatterEnabled: false }));
                  }
                  
                  setJournalLogs((prev) => [`🗃️ [ARCHIVE LOADED] preset config: ${presetName}. Re-assembling baryonic coordinates.`, ...prev]);
                }}
                className="bg-slate-950 border border-slate-900 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-[#00C8FF] cursor-pointer"
              >
                <option value="Standard Spiral Merger">Standard Spiral Merger</option>
                <option value="Giant Elliptical Singularity">Giant Elliptical Singularity</option>
                <option value="Dark Matter Halo Dominance">Dark Matter Halo Dominance</option>
                <option value="Keplerian Decaying Void">Keplerian Decaying Void</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          🧠 HOLOGRAPHIC AI ASSISTANT CHAT ("ORION-9") RAIL (RIGHT)
          ========================================== */}
      <section className="absolute right-6 top-24 bottom-24 w-80 flex flex-col gap-4 z-20 pointer-events-auto">
        <div className="flex-1 bg-[#02030A]/75 border border-[#00C8FF]/20 rounded-xl p-4 backdrop-blur-md flex flex-col shadow-[0_0_20px_rgba(2,3,10,0.8)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-[1px] bg-gradient-to-l from-[#00C8FF] to-transparent" />
          
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded border border-[#00C8FF]/40 flex items-center justify-center bg-[#061226]/80 animate-pulse">
              <Brain className="w-3 h-3 text-[#00C8FF]" />
            </div>
            <h2 className="text-xs font-mono tracking-wider text-[#00C8FF] font-bold uppercase">
              Orion-9 Singularity Assistant
            </h2>
          </div>

          {/* Floating animated holographic geometry representing the AI */}
          <div id="ai-avatar-container" className="h-28 bg-[#061226]/40 border border-[#00C8FF]/10 rounded-lg flex items-center justify-center relative overflow-hidden mb-3">
            {/* Pulsing rings */}
            <div className="absolute w-20 h-20 rounded-full border border-[#00C8FF]/10 animate-ping" />
            <div className="absolute w-14 h-14 rounded-full border border-[#8B5CF6]/20 animate-spin-slow" />
            
            {/* Spinning vector geometry */}
            <div 
              className="relative w-10 h-10 flex items-center justify-center"
              style={{
                transform: `perspective(350px) rotateX(${aiTilt.x}deg) rotateY(${aiTilt.y}deg)`,
                transition: 'transform 0.12s cubic-bezier(0.25, 0.8, 0.25, 1.0)'
              }}
            >
              <div className="absolute inset-0 border border-[#00C8FF] rounded-md rotate-45 animate-spin" />
              <div className="absolute inset-2 border border-[#8B5CF6] rounded-md -rotate-45 animate-pulse" />
              <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_#fff]" />
            </div>

            <div className="absolute bottom-2 inset-x-0 text-center text-[9px] font-mono text-[#00C8FF]/60 uppercase tracking-widest animate-pulse">
              Quantum Matrix Linked
            </div>
          </div>

          {/* Chat message threads */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 font-mono text-xs max-h-[calc(100vh-420px)] scrollbar-thin">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`text-[10px] text-slate-500 mb-0.5`}>
                  {msg.role === 'user' ? 'COMMANDER' : 'ORION-9'}
                </div>
                <div
                  className={`p-2.5 rounded-lg border leading-relaxed whitespace-pre-wrap max-w-[90%] break-words ${
                    msg.role === 'user'
                      ? 'bg-[#372C68]/30 border-[#8B5CF6]/40 text-[#F8FAFC]'
                      : 'bg-[#061226]/50 border-[#00C8FF]/20 text-[#00C8FF]/95'
                  }`}
                >
                  {/* Clean trigger code action markers visually */}
                  {msg.content.replace(/\[ACTION: [A-Z_]+\]/g, '')}
                  
                  {/* Show action trigger chips in assistant text */}
                  {msg.role === 'assistant' && msg.content.includes('[ACTION:') && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.content.includes('[ACTION: COLLIDE]') && (
                        <span className="text-[9px] bg-red-950/60 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded uppercase font-bold flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5" /> Collision Engaged
                        </span>
                      )}
                      {msg.content.includes('[ACTION: SUPERNOVA]') && (
                        <span className="text-[9px] bg-orange-950/60 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded uppercase font-bold flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Supernova Blasted
                        </span>
                      )}
                      {msg.content.includes('[ACTION: STAR_BIRTH]') && (
                        <span className="text-[9px] bg-sky-950/60 text-sky-400 border border-sky-500/30 px-1.5 py-0.5 rounded uppercase font-bold flex items-center gap-1">
                          <Disc className="w-2.5 h-2.5" /> Nebula Nursery Spawned
                        </span>
                      )}
                      {msg.content.includes('[ACTION: DARK_MATTER]') && (
                        <span className="text-[9px] bg-purple-950/60 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded uppercase font-bold flex items-center gap-1">
                          <Atom className="w-2.5 h-2.5" /> Dark Matter Rendered
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-slate-500">ORION-9</span>
                <div className="p-2 bg-[#061226]/30 border border-[#00C8FF]/10 rounded-lg flex items-center gap-1.5 text-[#00C8FF]">
                  <span className="w-1.5 h-1.5 bg-[#00C8FF] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#00C8FF] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#00C8FF] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Quick command buttons chips */}
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-900 pt-3">
            <button
              onClick={() => handleSendMessage("Trigger a galaxy collision")}
              className="text-[10px] bg-[#372C68]/20 hover:bg-[#372C68]/50 border border-[#8B5CF6]/30 text-[#8B5CF6] px-2 py-1 rounded transition-all"
            >
              Collide Galaxies 💥
            </button>
            <button
              onClick={() => handleSendMessage("Show me a supernova star explosion")}
              className="text-[10px] bg-[#061226]/40 hover:bg-[#061226]/80 border border-[#FF6B35]/30 text-[#FF6B35] px-2 py-1 rounded transition-all"
            >
              Spawn Supernova 💥
            </button>
            <button
              onClick={() => handleSendMessage("Visualize dark matter in the simulator")}
              className="text-[10px] bg-[#061226]/40 hover:bg-[#061226]/80 border border-[#00C8FF]/30 text-[#00C8FF] px-2 py-1 rounded transition-all"
            >
              Show Dark Matter 🌌
            </button>
            <button
              onClick={() => handleSendMessage("Create a star birth nursery nebula")}
              className="text-[10px] bg-[#061226]/40 hover:bg-[#061226]/80 border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded transition-all"
            >
              Stellar Nursery ✨
            </button>
          </div>

          {/* Input Panel */}
          <div className="mt-3 flex items-center gap-1.5 border-t border-slate-900 pt-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Query celestial mechanics..."
              className="flex-1 bg-slate-950 border border-[#00C8FF]/20 rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00C8FF]/50 font-mono"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-1.5 rounded bg-[#00C8FF] text-slate-950 hover:bg-[#00C8FF]/80 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ==========================================
          🛠️ CONTROL DECK / SIMULATION CONTROLS (BOTTOM HUD PANEL)
          ========================================== */}
      <footer className="absolute bottom-6 inset-x-6 h-18 bg-[#02030A]/85 border border-[#00C8FF]/20 rounded-xl px-6 flex items-center justify-between gap-6 backdrop-blur-md z-20 shadow-[0_0_25px_rgba(2,3,10,0.9)]">
        
        {/* Core Control actions: Play/Pause/Reload */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setParams((p) => ({ ...p, isPaused: !p.isPaused }))}
            className={`p-2.5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
              params.isPaused
                ? "bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400"
                : "bg-[#061226]/80 text-[#00C8FF] border-[#00C8FF]/20 hover:border-[#00C8FF]/50"
            }`}
            title={params.isPaused ? "Resume Simulation" : "Pause Simulation"}
          >
            {params.isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          </button>

          <button
            onClick={() => {
              // Reload simulation
              window.location.reload();
            }}
            className="p-2.5 rounded-lg bg-[#061226]/80 text-slate-300 border border-slate-800 hover:border-slate-600 hover:text-white transition-all cursor-pointer"
            title="Reset Simulation Coordinates"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Parameter Sliders */}
        <div className="flex-1 hidden lg:flex items-center justify-around gap-6">
          
          {/* Gravitational Constant (G) Slider */}
          <div className="flex flex-col gap-1 w-32 font-mono text-[10px]">
            <span className="text-slate-400 flex justify-between">
              <span>Gravity Force (G)</span>
              <span className="text-[#00C8FF]">{params.gConstant.toFixed(2)}</span>
            </span>
            <input
              type="range"
              min="0.02"
              max="0.5"
              step="0.01"
              value={params.gConstant}
              onChange={(e) => setParams((p) => ({ ...p, gConstant: parseFloat(e.target.value) }))}
              className="accent-[#00C8FF] h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
            />
          </div>

          {/* Simulation Timestep (dt) Slider */}
          <div className="flex flex-col gap-1 w-32 font-mono text-[10px]">
            <span className="text-slate-400 flex justify-between">
              <span>Simulation Speed</span>
              <span className="text-[#00C8FF]">{params.timeStep.toFixed(2)}x</span>
            </span>
            <input
              type="range"
              min="0.02"
              max="0.5"
              step="0.01"
              value={params.timeStep}
              onChange={(e) => setParams((p) => ({ ...p, timeStep: parseFloat(e.target.value) }))}
              className="accent-[#00C8FF] h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
            />
          </div>

          {/* Dark matter flat rotation influence strength */}
          <div className="flex flex-col gap-1 w-36 font-mono text-[10px]">
            <span className="text-slate-400 flex justify-between">
              <span>Dark Matter Pull</span>
              <span className="text-[#8B5CF6]">{params.darkMatterInfluence.toFixed(1)}x</span>
            </span>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.1"
              value={params.darkMatterInfluence}
              disabled={!params.darkMatterEnabled}
              onChange={(e) => setParams((p) => ({ ...p, darkMatterInfluence: parseFloat(e.target.value) }))}
              className="accent-[#8B5CF6] h-1 bg-slate-800 rounded-full appearance-none cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* Particle Star Size Multiplier */}
          <div className="flex flex-col gap-1 w-28 font-mono text-[10px]">
            <span className="text-slate-400 flex justify-between">
              <span>Stellar Size</span>
              <span className="text-amber-400">{params.starSizeMultiplier.toFixed(1)}x</span>
            </span>
            <input
              type="range"
              min="0.4"
              max="3.0"
              step="0.1"
              value={params.starSizeMultiplier}
              onChange={(e) => setParams((p) => ({ ...p, starSizeMultiplier: parseFloat(e.target.value) }))}
              className="accent-amber-400 h-1 bg-slate-800 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Toggle Switches (Orbits, Dark matter, Camera Modes) */}
        <div className="flex items-center gap-3">
          
          {/* Toggle Orbits */}
          <button
            onClick={toggleOrbits}
            className={`px-3 py-1.5 rounded border text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              params.showOrbits
                ? "bg-[#00C8FF]/10 text-[#00C8FF] border-[#00C8FF]/40"
                : "bg-[#061226]/50 text-slate-400 border-slate-800 hover:border-slate-600"
            }`}
            title="Display Gravity Wave Orbit Path Loops"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Orbits</span>
          </button>

          {/* Toggle Dark Matter Halo rendering */}
          <button
            onClick={toggleDarkMatter}
            className={`px-3 py-1.5 rounded border text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              params.darkMatterEnabled
                ? "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/40"
                : "bg-[#061226]/50 text-slate-400 border-slate-800 hover:border-slate-600"
            }`}
            title="Inject Diffuse Dark Matter halo cloud"
          >
            <Atom className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dark Matter</span>
          </button>

          {/* Camera Modes selector dropdown */}
          <div className="flex items-center gap-1.5 bg-[#061226]/60 border border-slate-800 rounded px-2 py-1">
            <Tv className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={params.camMode}
              onChange={(e) => setParams((p) => ({ ...p, camMode: e.target.value as any }))}
              className="bg-transparent text-slate-300 font-mono text-xs focus:outline-none border-none cursor-pointer"
            >
              <option value="free" className="bg-[#02030A]">Free Camera</option>
              <option value="flythrough" className="bg-[#02030A]">Fly-Through</option>
              <option value="orbit" className="bg-[#02030A]">Orbit Mode</option>
              <option value="follow-bh1" className="bg-[#02030A]">Track Core 1</option>
              <option value="follow-bh2" className="bg-[#02030A]">Track Core 2</option>
            </select>
          </div>
        </div>
      </footer>

      {/* ==========================================
          🌠 THE DRAGGABLE UNIVERSAL COSMIC TIMELINE
          ========================================== */}
      <section className="absolute bottom-28 inset-x-6 h-10 bg-[#02030A]/60 border border-[#00C8FF]/10 rounded-lg flex items-center justify-between px-4 backdrop-blur-md z-10">
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400 w-28">
          <Activity className="w-3 h-3 text-[#00C8FF]" />
          <span>Timeline Scrub</span>
        </div>

        {/* Drag scrub scale slider */}
        <div className="flex-1 mx-4 relative flex items-center">
          <input
            type="range"
            min="0"
            max="20"
            step="0.5"
            value={timelineVal}
            onChange={handleTimelineChange}
            className="w-full accent-[#00C8FF] h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer"
          />
          {/* Dynamic tick indicators on scale */}
          <div className="absolute inset-x-0 -bottom-3.5 flex justify-between text-[8px] font-mono text-slate-600 pointer-events-none">
            <span>BIG BANG (0 Myr)</span>
            <span>EARLY STARS (5 Myr)</span>
            <span>TODAY (13.8 Myr)</span>
            <span>GALAXY COLLIDE (20 Myr)</span>
          </div>
        </div>

        <div className="font-mono text-[10px] text-right text-slate-400 w-24">
          <span className="text-[#00C8FF] font-semibold">{timelineVal} Gyr</span> Ago
        </div>
      </section>

      {/* 🏆 DISCOVERY / ACHIEVEMENT NEON SYSTEM NOTICE */}
      {unlockedAchievement && (
        <div className="absolute top-20 right-6 z-50 bg-[#02030A]/95 border-2 border-amber-400 p-4 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.45)] max-w-sm flex items-start gap-3.5 backdrop-blur-md animate-bounce pointer-events-auto">
          <div className="relative w-10 h-10 rounded-full border border-amber-400 flex items-center justify-center bg-amber-950/40 animate-pulse text-amber-400 text-lg">
            🏆
          </div>
          <div className="flex-1 font-sans">
            <div className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold">New Cosmic Discovery!</div>
            <h3 className="text-sm font-bold text-white mt-0.5">{unlockedAchievement}</h3>
            <p className="text-[10px] text-slate-300 mt-1">Successfully logged inside the Chief Observer Research Notebook and synchronized with the Galactic Archive.</p>
          </div>
        </div>
      )}

      {/* Concentric Orbit Navigation Overlay */}
      {orbitOpen && (
        <div className="absolute inset-0 bg-[#02030A]/75 backdrop-blur-sm z-30 flex items-center justify-center pointer-events-auto">
          <div className="relative w-[340px] h-[340px] sm:w-[500px] sm:h-[500px] rounded-full border border-[#00C8FF]/15 flex items-center justify-center animate-spin-slow">
            {/* Outer Ring - Missions & Academy */}
            <div className="absolute w-[300px] h-[300px] sm:w-[440px] sm:h-[440px] rounded-full border border-dashed border-[#8B5CF6]/20 flex items-center justify-center">
              <button
                onClick={() => triggerWarpTransition('missions')}
                className="absolute top-0 bg-[#02030A]/90 border border-[#8B5CF6]/40 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono hover:border-[#8B5CF6] hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center gap-2 pointer-events-auto -translate-y-1/2 text-white"
              >
                <span>🚀 Orbit 4: Satellite Launch</span>
              </button>
              <button
                onClick={() => triggerWarpTransition('guardian')}
                className="absolute bottom-0 bg-[#02030A]/90 border border-[#8B5CF6]/40 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono hover:border-[#8B5CF6] hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center gap-2 pointer-events-auto translate-y-1/2 text-white"
              >
                <span>🛡️ Orbit 4: Earth Deflector</span>
              </button>
            </div>

            {/* Mid-Outer Ring - Quantum & Scale */}
            <div className="absolute w-[220px] h-[220px] sm:w-[340px] sm:h-[340px] rounded-full border border-[#00C8FF]/30 flex items-center justify-center animate-reverse-spin">
              <button
                onClick={() => triggerWarpTransition('quantum')}
                className="absolute left-0 bg-[#02030A]/90 border border-[#00C8FF]/50 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono hover:border-[#00C8FF] hover:shadow-[0_0_15px_rgba(0,200,255,0.3)] transition-all flex items-center gap-2 pointer-events-auto -translate-x-1/2 text-white"
              >
                <span>⚛️ Orbit 3: Quantum Wave</span>
              </button>
              <button
                onClick={() => triggerWarpTransition('scale')}
                className="absolute right-0 bg-[#02030A]/90 border border-[#00C8FF]/50 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono hover:border-[#00C8FF] hover:shadow-[0_0_15px_rgba(0,200,255,0.3)] transition-all flex items-center gap-2 pointer-events-auto translate-x-1/2 text-white"
              >
                <span>🌌 Orbit 3: Scale Zoom</span>
              </button>
            </div>

            {/* Mid Ring - Lab & Academy */}
            <div className="absolute w-[150px] h-[150px] sm:w-[240px] sm:h-[240px] rounded-full border border-amber-500/30 flex items-center justify-center">
              <button
                onClick={() => triggerWarpTransition('lab')}
                className="absolute top-0 bg-[#02030A]/90 border border-amber-500/50 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2 pointer-events-auto -translate-y-1/2 text-white"
              >
                <span>⚫ Orbit 2: Singularity Lab</span>
              </button>
              <button
                onClick={() => triggerWarpTransition('academy')}
                className="absolute bottom-0 bg-[#02030A]/90 border border-amber-500/50 px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center gap-2 pointer-events-auto translate-y-1/2 text-white"
              >
                <span>📚 Orbit 2: Lectures</span>
              </button>
            </div>

            {/* Inner Core - Observatory */}
            <div className="absolute w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] rounded-full bg-gradient-to-tr from-[#372C68] to-[#061226] border border-[#00C8FF]/40 flex flex-col items-center justify-center p-2 text-center">
              <span className="text-[8px] sm:text-[9px] text-[#00C8FF]/60 uppercase tracking-wider font-mono">Core</span>
              <button
                onClick={() => { setOrbitOpen(false); setActiveModule('observatory'); }}
                className="text-[10px] sm:text-xs font-bold font-mono hover:text-[#00C8FF] text-white transition-colors"
              >
                Observatory
              </button>
            </div>
          </div>

          {/* Background Close Instruction */}
          <div className="absolute bottom-16 flex flex-col items-center gap-2">
            <button
              onClick={() => setOrbitOpen(false)}
              className="px-6 py-2.5 rounded-lg border border-[#00C8FF]/30 bg-[#061226]/80 text-[#00C8FF] hover:text-white hover:border-[#00C8FF] transition-all font-mono uppercase text-[10px] sm:text-xs tracking-wider"
            >
              Close Navigation
            </button>
          </div>
        </div>
      )}

      {/* ==========================================
          🛰️ CENTRAL HOLOGRAPHIC WORKSPACE WINDOW
          ========================================== */}
      {activeModule !== 'observatory' && (
        <CosmicPanelAssembly
          activeModule={activeModule}
          title={
            activeModule === 'lab' ? "⚫ Singularity Dynamics Laboratory" :
            activeModule === 'scale' ? "🌌 Cosmic Scale Zoom Voyage" :
            activeModule === 'quantum' ? "⚛️ Subatomic Quantum Wave Simulator" :
            activeModule === 'journal' ? "📖 Chief Observer Research Notebook" :
            activeModule === 'academy' ? "📚 Cosmos OS Science Academy" :
            activeModule === 'missions' ? "🚀 Keplerian Orbit Insertion Deck" :
            activeModule === 'guardian' ? "🛡️ Earth Planetary Deflector Control" : "Cosmos Module"
          }
          onClose={() => {
            setActiveModule('observatory');
            try { synth.playStarBirth(); } catch(e){}
          }}
        >
          {activeModule === 'lab' && (
            <BlackHoleLab
              mass={bhMass} setMass={(val) => { setBhMass(val); triggerAchievement("Event Horizon Expansion"); }}
              spin={bhSpin} setSpin={setBhSpin}
              charge={bhCharge} setCharge={setBhCharge}
              accretion={bhAccretion} setAccretion={setBhAccretion}
              distance={bhObserverDist} setDistance={setBhObserverDist}
              onAddJournalLog={(msg) => setJournalLogs((prev) => [msg, ...prev])}
            />
          )}
          {activeModule === 'scale' && (
            <MassiveScale
              scaleIndex={scaleIndex}
              setScaleIndex={(idx) => {
                setScaleIndex(idx);
                triggerAchievement("Cosmic Scale Walker");
                setJournalLogs((prev) => [
                  `🌌 [SCALE SHIFT] Shifted coordinates to ${SCALES[idx]?.name || "unknown"} (${SCALES[idx]?.label || ""}).`,
                  ...prev
                ]);
              }}
            />
          )}
          {activeModule === 'quantum' && (
            <QuantumVerse
              onAddJournalLog={(msg) => {
                setJournalLogs((prev) => [msg, ...prev]);
                triggerAchievement("Quantum Entangler");
              }}
            />
          )}
          {activeModule === 'journal' && (
            <ResearchJournal
              logs={journalLogs}
              onAddLog={(txt) => {
                setJournalLogs((prev) => [txt, ...prev]);
                triggerAchievement("Archivist Discovery");
              }}
              onClearLogs={() => setJournalLogs([])}
              onSnapTelemetry={() => {
                const now = new Date();
                const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
                const snap = `📸 [TELEMETRY SNAP @ ${timeStr}] Sagittarius A* mass: ${bhMass.toFixed(2)}M Sol | Dynamic Zoom: ${scaleIndex} (${SCALES[scaleIndex]?.name}) | Active Colliders: ${activeColliders} | Spacetime Grid Distortion: ACTIVE.`;
                setJournalLogs((prev) => [snap, ...prev]);
                triggerAchievement("Telemetry Analyst");
              }}
            />
          )}
          {activeModule === 'academy' && <Academy />}
          {activeModule === 'missions' && (
            <SpaceMissions
              onAddJournalLog={(msg) => {
                setJournalLogs((prev) => [msg, ...prev]);
                triggerAchievement("Orbital Mechanic");
              }}
            />
          )}
          {activeModule === 'guardian' && (
            <EarthGuardian
              onAddJournalLog={(msg) => {
                setJournalLogs((prev) => [msg, ...prev]);
                triggerAchievement("Sentinel Defender");
              }}
            />
          )}
        </CosmicPanelAssembly>
      )}

      {/* Premium Dynamic Custom Cursor with Trail and Haptic Feedback */}
      <CosmicCursor activeModule={activeModule} bhMass={bhMass} />

      {/* State-of-the-art Interactive Cinematic Intro (Wow Moment) */}
      {loading && (
        <CosmicWowIntro onComplete={() => setLoading(false)} />
      )}
    </main>
  );
}
