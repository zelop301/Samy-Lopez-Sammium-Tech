/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GalaxyType = 'spiral' | 'elliptical';

export interface GalaxyCore {
  id: number;
  type: GalaxyType;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  mass: number;
  color: string;
  starCount: number;
  blackHoleMass: number;
  radius: number;
  rotationSpeed: number;
}

export type StarType = 'regular' | 'newborn' | 'supernova' | 'dark_matter' | 'accretion';

export interface Star {
  id: number;
  galaxyId: number;
  type: StarType;
  
  // Coordinates
  x: number;
  y: number;
  z: number;
  
  // Velocities
  vx: number;
  vy: number;
  vz: number;
  
  // Visuals
  r: number;
  g: number;
  b: number;
  size: number;
  originalSize: number;
  
  // Lifespans (primarily for newborn, supernova, or decaying particles)
  age: number;
  life: number;
  
  // Accretion or active properties
  active: boolean;
}

export interface SimulationParams {
  gConstant: number;
  timeStep: number;
  darkMatterEnabled: boolean;
  darkMatterInfluence: number; // Flat rotation curve strength
  softening: number;
  starSizeMultiplier: number;
  isPaused: boolean;
  supernovaRate: number; // 0 (none) to 100 (high)
  showDarkMatterParticles: boolean;
  showOrbits: boolean;
  camMode: 'free' | 'flythrough' | 'orbit' | 'follow-bh1' | 'follow-bh2';
}

export interface SupernovaEvent {
  id: number;
  x: number;
  y: number;
  z: number;
  color: { r: number; g: number; b: number };
  maxRadius: number;
  currentRadius: number;
  age: number;
  life: number;
}
