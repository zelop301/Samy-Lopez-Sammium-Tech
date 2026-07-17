import { useState } from 'react';
import { Compass } from 'lucide-react';

interface ScaleNode {
  title: string;
  metric: string;
  dominantForce: string;
  description: string;
  iconText: string;
  illustration: string;
  color: string;
}

interface MassiveScaleProps {
  scaleIndex?: number;
  setScaleIndex?: (index: number) => void;
}

export default function MassiveScale({ scaleIndex: globalScaleIndex, setScaleIndex: setGlobalScaleIndex }: MassiveScaleProps = {}) {
  const [localScaleIndex, setLocalScaleIndex] = useState(3);

  const scaleIndex = globalScaleIndex !== undefined ? globalScaleIndex : localScaleIndex;
  const setScaleIndex = (idx: number) => {
    if (setGlobalScaleIndex) {
      setGlobalScaleIndex(idx);
    } else {
      setLocalScaleIndex(idx);
    }
  };

  const scales: ScaleNode[] = [
    {
      title: "Observable Universe",
      metric: "93 Billion Light Years (10^26 m)",
      dominantForce: "Gravitational Potential / Dark Energy expansion",
      description: "The entire sphere of cosmic matter observable from Earth. At this monumental scale, matter is organized in high-density web filaments separated by deep cosmic voids.",
      iconText: "🌌",
      illustration: "Cosmic web filament structures containing trillions of clusters.",
      color: "text-purple-400 border-purple-500/30 bg-purple-950/20"
    },
    {
      title: "Virgo Supercluster",
      metric: "110 Million Light Years (10^24 m)",
      dominantForce: "Baryonic Gravity",
      description: "A colossal mass structure enclosing our Local Group of galaxies. It binds hundreds of spiral and elliptical systems in a slow virialized orbital dance.",
      iconText: "✨",
      illustration: "Virgo cluster grouping of 2,000 galaxies centering elliptic giant M87.",
      color: "text-blue-400 border-blue-500/30 bg-blue-950/20"
    },
    {
      title: "Milky Way Galaxy",
      metric: "100,000 Light Years (10^21 m)",
      dominantForce: "Dark Matter Halo Core Stability",
      description: "A barred spiral galaxy hosting over 200 billion stars. Rotates dynamically with a flat velocity profile stabilized by diffuse halos of invisible dark matter.",
      iconText: "🌀",
      illustration: "Majestic spiral arms (Perseus, Sagittarius) with condensed golden core.",
      color: "text-[#00C8FF] border-[#00C8FF]/30 bg-cyan-950/20"
    },
    {
      title: "Solar System",
      metric: "12 Billion Kilometers (10^13 m)",
      dominantForce: "Keplerian Gravitational Resonance",
      description: "Our immediate solar neighborhood, where stable elliptical orbits follow Newton's gravitational mechanics around a middle-aged yellow G-type dwarf star.",
      iconText: "☀️",
      illustration: "Orbiting planets (Mercury to Neptune) inside the flat ecliptic disc.",
      color: "text-amber-400 border-amber-500/30 bg-amber-950/20"
    },
    {
      title: "Planet Earth",
      metric: "12,742 Kilometers (10^7 m)",
      dominantForce: "Geodynamo Magnetism & Atmospheric Friction",
      description: "A vibrant biosphere shielded from hostile cosmic rays by a molten silicon-iron geodynamo magnetic field. Support structure for organic life.",
      iconText: "🌍",
      illustration: "Continental structures, swirling clouds, and protective ozone shield.",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-950/20"
    },
    {
      title: "Mount Everest",
      metric: "8,848 Meters (10^4 m)",
      dominantForce: "Tectonic Crustal Compression",
      description: "The highest geological structure on Earth's crust. Formed by slow continental plate collisions that compress and uplift sedimentary rock formations.",
      iconText: "🏔️",
      illustration: "Crystalline snow peaks, high wind shear, low atmospheric column.",
      color: "text-slate-300 border-slate-500/20 bg-slate-900/40"
    },
    {
      title: "Human Body",
      metric: "1.8 Meters (10^0 m)",
      dominantForce: "Chemical / Electrostatic Bond Integration",
      description: "An intricate multi-cellular organism operating at the interface of macro-mechanics and quantum cellular chemistry. Built on carbon frameworks.",
      iconText: "🚶",
      illustration: "Complex neurological grids, thermal equilibrium system, oxygen cycle.",
      color: "text-pink-400 border-pink-500/20 bg-pink-950/10"
    },
    {
      title: "Biological Cell",
      metric: "10 Micrometers (10^-5 m)",
      dominantForce: "Lipid Hydrophobic Surface Tension",
      description: "The fundamental operational module of biological life. Governed by molecular diffusion gradients, organelle synthesis, and DNA instructions.",
      iconText: "🧫",
      illustration: "Lipid bilayer membrane, central chromosome nucleus, and mitochondria.",
      color: "text-teal-400 border-teal-500/20 bg-teal-950/10"
    },
    {
      title: "DNA Strand Helix",
      metric: "2.5 Nanometers (10^-9 m)",
      dominantForce: "Electrostatic Hydrogen Base Pairing",
      description: "A double-stranded macromolecule storing biological instructions. Nucleotide sequences are structurally held by localized hydrogen base interactions.",
      iconText: "🧬",
      illustration: "Double-helix genetic coil structured with phosphate-sugar rib rails.",
      color: "text-[#8B5CF6] border-[#8B5CF6]/20 bg-purple-950/10"
    },
    {
      title: "Silicon Atom",
      metric: "210 Picometers (10^-10 m)",
      dominantForce: "Electromagnetic Coulomb Potential",
      description: "A stable chemical element with 14 orbiting electrons surrounding a dense nuclear core. Positioned directly in the quantum realm of probability clouds.",
      iconText: "⚛️",
      illustration: "Quantum probability electron orbital clouds and a central proton nucleus.",
      color: "text-blue-300 border-blue-500/20 bg-blue-950/10"
    },
    {
      title: "Elementary Quark",
      metric: "10^-18 Meters (Planck limit scale)",
      dominantForce: "Strong Nuclear Interaction (Color Charge)",
      description: "A fundamental point-particle constituent of matter. Interacts by exchanging virtual gluons to assemble protons, neutrons, and other baryonic structures.",
      iconText: "🎯",
      illustration: "Trio fractional Quarks (Up, Down) bound by stringy virtual gluon loops.",
      color: "text-red-400 border-red-500/20 bg-red-950/10"
    }
  ];

  const currentScale = scales[scaleIndex];

  return (
    <div id="massive-scale-panel" className="bg-[#02030A]/85 border border-[#00C8FF]/30 rounded-xl p-5 backdrop-blur-md shadow-[0_0_25px_rgba(2,3,10,0.85)] max-w-lg w-full flex flex-col gap-4 font-sans text-[#F8FAFC]">
      <div className="flex items-center justify-between border-b border-[#00C8FF]/20 pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#00C8FF] animate-pulse" />
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#00C8FF]">
            Massive Scale Explorer
          </h2>
        </div>
        <span className="text-[9px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded font-bold uppercase">
          Universe Zoom
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Continuously slide to travel through the structural dimensions of the cosmos, ascending from subatomic quarks up to the boundary of the observable universe.
      </p>

      {/* Primary visual scale illustration frame */}
      <div className="relative h-44 bg-[#02030A] border border-[#00C8FF]/15 rounded-lg overflow-hidden p-4 flex flex-col justify-between">
        {/* Abstract vector frame decorative circles */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#00c8ff_1px,transparent_1px)] bg-[size:10px_10px]" />
        
        {/* Large Scale Icon */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2.5">
          <span className="text-5xl animate-bounce [animation-duration:3s]">{currentScale.iconText}</span>
          <span className="text-xs font-semibold text-slate-200 tracking-wide font-mono text-center">
            {currentScale.title}
          </span>
        </div>

        {/* Technical telemetry footer */}
        <div className="z-10 bg-[#061226]/60 border border-slate-900 rounded p-1.5 text-center text-[10px] font-mono text-slate-400">
          <strong>Illustrative Visual:</strong> {currentScale.illustration}
        </div>
      </div>

      {/* Slide timeline selector */}
      <div className="flex flex-col gap-1 bg-[#061226]/40 border border-[#00C8FF]/10 rounded-lg p-3">
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-1">
          <span>MACRO (Cosmology)</span>
          <span className="text-amber-400 font-bold">CURRENT LEVEL</span>
          <span>MICRO (Quantum)</span>
        </div>

        <input
          id="universe-scale-slider"
          type="range"
          min="0"
          max={scales.length - 1}
          step="1"
          value={scaleIndex}
          onChange={(e) => setScaleIndex(parseInt(e.target.value))}
          className="accent-[#00C8FF] h-2 bg-slate-900 rounded-full appearance-none cursor-pointer w-full"
        />

        <div className="flex justify-between text-[8px] font-mono text-slate-600 mt-1 uppercase">
          <span>10^26 m</span>
          <span>10^0 m</span>
          <span>10^-18 m</span>
        </div>
      </div>

      {/* Physics detailed readouts cards */}
      <div className={`border rounded-lg p-4 flex flex-col gap-2.5 transition-all duration-300 ${currentScale.color}`}>
        <div className="font-mono text-xs font-bold flex justify-between border-b border-slate-900/60 pb-1.5">
          <span className="text-slate-300">METRIC WIDTH:</span>
          <span className="text-white">{currentScale.metric}</span>
        </div>

        <div className="font-mono text-[10px] leading-relaxed">
          <span className="text-slate-400 font-semibold block uppercase">Dominant Force:</span>
          <span className="text-slate-200">{currentScale.dominantForce}</span>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed pt-1 border-t border-slate-900/40">
          {currentScale.description}
        </p>
      </div>

      <div className="bg-[#02030A]/90 border border-[#00C8FF]/10 rounded-lg p-3 font-mono text-[9px] text-slate-500 flex justify-between">
        <span>SCDS METRIC CALCULATOR ACTIVE</span>
        <span>ERROR COEFFICIENT: &lt;10^-21</span>
      </div>
    </div>
  );
}
