import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Shield, Activity, Heart, Award, Eye, Compass, Info, Cpu, Zap, Cloud } from "lucide-react";
import { audioEngine } from "../utils/AudioEngine";

interface BrandPhilosophyProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BrandPhilosophy({ isOpen, onClose }: BrandPhilosophyProps) {
  const handleClose = () => {
    audioEngine.playTactileClick();
    onClose();
  };

  const values = [
    { title: "Patience", desc: "Great solutions are built carefully with steady commitment.", icon: <Info className="w-4.5 h-4.5 text-zinc-400" /> },
    { title: "Precision", desc: "Every single connection and detail matters for reliable outcomes.", icon: <Award className="w-4.5 h-4.5 text-red-500" /> },
    { title: "Connection", desc: "Strong systems depend on resilient, real-time relationships.", icon: <Activity className="w-4.5 h-4.5 text-zinc-400" /> },
    { title: "Adaptability", desc: "We evolve alongside changing environments and shifting demands.", icon: <Compass className="w-4.5 h-4.5 text-zinc-400" /> },
    { title: "Resilience", desc: "Engineered to withstand shock and rebuild efficiently after disruption.", icon: <Zap className="w-4.5 h-4.5 text-red-500" /> },
    { title: "Protection", desc: "Harnessing deep technological awareness to safeguard communities.", icon: <Shield className="w-4.5 h-4.5 text-zinc-400" /> },
  ];

  const mappings = [
    { source: "Web", arrow: "→", target: "Global sensor network", detail: "Spanning across oceans, forests, fields, and cities." },
    { source: "Silk", arrow: "→", target: "Secure data pathways", detail: "Lightweight, ultra-durable optic communication paths." },
    { source: "Vibration", arrow: "→", target: "Event detection", detail: "Translating live signals into pinpoint alert triggers." },
    { source: "Spider", arrow: "→", target: "AI orchestrator", detail: "Coordinating multi-source inputs at the center core." },
    { source: "Eyes", arrow: "→", target: "Multi-source perception", detail: "Aggregating radar, satellite feeds, and seismic telemetry." },
    { source: "Legs", arrow: "→", target: "Distributed autonomous agents", detail: "Deploying rapid response protocols to hazard locations." },
    { source: "Web repair", arrow: "→", target: "Self-healing systems", detail: "Rerouting connections automatically during failures." },
    { source: "Patience", arrow: "→", target: "Continuous monitoring", detail: "Constant 24/7 scanning and quiet environmental watch." },
    { source: "Precision", arrow: "→", target: "High-confidence decisions", detail: "Eliminating noise to deliver verified predictive warnings." },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto"
        >
          {/* Volumetric ambient background rays */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(193,18,31,0.06)_0%,rgba(0,0,0,0.95)_100%)]"></div>

          <motion.div
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="relative w-full max-w-4xl bg-zinc-950/90 border border-zinc-900 rounded-3xl p-6 md:p-10 shadow-2xl overflow-hidden my-8"
          >
            {/* Top Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all cursor-pointer z-30"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing background header accents */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>

            {/* Header / Brand Title */}
            <div className="relative z-10 flex flex-col items-center text-center mb-8">
              <span className="px-3 py-1 rounded-full border border-red-950/60 bg-red-950/20 text-[9px] font-mono tracking-[0.2em] text-red-400 uppercase mb-4 flex items-center gap-1.5 shadow-[0_0_15px_rgba(193,18,31,0.15)]">
                <Cpu className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                Sentinel Sense™ Philosophy
              </span>
              <h2 className="text-2xl md:text-4xl font-mono uppercase tracking-[0.15em] font-extrabold text-zinc-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]">
                BIOMIMICRY, NOT SUPERPOWERS
              </h2>
              <p className="mt-4 text-sm md:text-base font-sans italic text-zinc-400 max-w-xl">
                &ldquo;Nature perfected the web. We reimagined it as planetary intelligence.&rdquo;
              </p>
            </div>

            {/* Content grid */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* Left Column: Vision & Mappings */}
              <div className="flex flex-col gap-6 bg-black/40 border border-zinc-900/60 rounded-2xl p-6">
                <div>
                  <h3 className="text-xs font-mono tracking-widest text-zinc-500 uppercase mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-red-500" />
                    Global Sensor Network
                  </h3>
                  <p className="text-xs leading-relaxed text-zinc-400 font-sans">
                    A spider&apos;s web isn&apos;t just a mechanical architecture. It is an extraordinary distributed sensing system. A single vibration carries high-fidelity data, telling the spider precisely where movement occurred, its size, speed, and how to calibrate its response.
                  </p>
                </div>

                <div className="border-t border-zinc-900/60 pt-4">
                  <h4 className="text-[10px] font-mono tracking-wider text-red-400 uppercase mb-4">
                    The Biomimetic Map
                  </h4>
                  <div className="flex flex-col gap-3 font-mono text-[10.5px]">
                    {mappings.map((m, idx) => (
                      <div key={idx} className="flex flex-col border-b border-zinc-900/40 pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-200 font-extrabold">{m.source}</span>
                          <span className="text-red-500">{m.arrow}</span>
                          <span className="text-zinc-400">{m.target}</span>
                        </div>
                        <span className="text-[9.5px] text-zinc-600 mt-0.5">{m.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Values & Vision Statement */}
              <div className="flex flex-col gap-6 justify-between">
                {/* Values Panel */}
                <div className="bg-black/40 border border-zinc-900/60 rounded-2xl p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-mono tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Our Values & Meaning
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {values.map((v) => (
                        <div key={v.title} className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-950 flex flex-col gap-1.5 hover:border-red-900/40 transition-colors">
                          <div className="flex items-center gap-2">
                            {v.icon}
                            <span className="text-xs font-mono font-extrabold text-zinc-200">{v.title}</span>
                          </div>
                          <span className="text-[10px] font-sans text-zinc-500 leading-normal">{v.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Brand Mission & Vision Summary */}
                <div className="bg-gradient-to-b from-red-950/15 to-red-950/5 border border-red-950/60 rounded-2xl p-6">
                  <h3 className="text-xs font-mono tracking-widest text-red-400 uppercase mb-2">
                    Planetary Vision Statement
                  </h3>
                  <p className="text-xs leading-relaxed text-zinc-300 font-sans">
                    Sentinel Sense™ transforms billions of real-world signals into actionable awareness, helping communities anticipate floods, predict wildfires, stabilize power grids, and coordinate emergency responses before challenges escalate. 
                  </p>
                  <div className="border-t border-red-900/30 mt-4 pt-3 text-[9px] font-mono text-zinc-500 flex justify-between items-center">
                    <span>SAMMIUM RESEARCH LABS</span>
                    <span>EST. 2026</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Footer Actions */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between border-t border-zinc-900/80 mt-8 pt-6 gap-4">
              <div className="text-[10px] font-mono text-zinc-600 tracking-wider">
                SENTINEL SENSE™ • AWARENESS • CONNECTION • PROTECTION
              </div>
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-zinc-100 font-mono text-xs uppercase tracking-widest font-extrabold cursor-pointer transition-all shadow-[0_0_15px_rgba(193,18,31,0.3)] hover:shadow-[0_0_20px_rgba(193,18,31,0.5)]"
              >
                Acknowledge Protocol
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
