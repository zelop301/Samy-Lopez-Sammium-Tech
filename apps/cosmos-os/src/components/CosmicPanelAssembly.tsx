/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../sound';
import { Cpu, Terminal } from 'lucide-react';

interface CosmicPanelAssemblyProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  activeModule: string;
}

export default function CosmicPanelAssembly({
  children,
  title,
  onClose,
  activeModule
}: CosmicPanelAssemblyProps) {
  const [stage, setStage] = useState<number>(0); 
  // 0: Initial
  // 1: Energy Lines Traced
  // 2: Hexagonal Framework Growing
  // 3: Glass Surface Formed & Data Streams Filling
  // 4: Text Resolving & Content Visible
  // 5: Glow Stabilized

  const [scrambledTitle, setScrambledTitle] = useState('');

  // Play panel materialize sweep audio exactly as the panel begins assembly
  useEffect(() => {
    soundEngine.playPanelOpen();
    setStage(1);

    // Sequence timing (under 450ms total for satisfying responsiveness)
    const t1 = setTimeout(() => setStage(2), 80);
    const t2 = setTimeout(() => setStage(3), 160);
    const t3 = setTimeout(() => setStage(4), 280);
    const t4 = setTimeout(() => setStage(5), 420);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [activeModule]);

  // Scramble text effect for title resolution
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const chars = '01XYZΦΨΩΔΛΞΠΣΘΓ';
    let iteration = 0;
    
    interval = setInterval(() => {
      setScrambledTitle(
        title
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return title[index];
            }
            if (letter === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      
      if (iteration >= title.length) {
        clearInterval(interval);
      }
      
      iteration += 1.5;
    }, 25);

    return () => clearInterval(interval);
  }, [title]);

  // Procedural binary code/data streams for Step 4
  const [dataStreams] = useState(() => {
    const streams = [];
    for (let i = 0; i < 15; i++) {
      streams.push({
        id: i,
        left: `${5 + i * 6.5}%`,
        delay: Math.random() * 0.4,
        speed: 1.0 + Math.random() * 1.5,
        chars: Array.from({ length: 12 }, () => Math.random() > 0.5 ? '1' : '0').join(''),
      });
    }
    return streams;
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeModule}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-[#02030A]/60 backdrop-blur-[8px] z-30 flex items-center justify-center pointer-events-auto p-4 md:p-8"
      >
        <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden rounded-2xl">
          
          {/* ==========================================
              ⚡ STEP 1: GLOWING ENERGY BOUNDARY LINES (TRACING PATTERNS)
              ========================================== */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-40" xmlns="http://www.w3.org/2000/svg">
            {/* Main Outer glowing bounding lines */}
            <motion.rect
              x="1.5"
              y="1.5"
              width="calc(100% - 3px)"
              height="calc(100% - 3px)"
              rx="15"
              fill="none"
              stroke="url(#energyGrad)"
              strokeWidth="2.5"
              initial={{ pathLength: 0, opacity: 0.8 }}
              animate={{ pathLength: stage >= 1 ? 1 : 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            />
            {/* Laser energy target brackets */}
            <motion.path
              d="M 25 1.5 L 1.5 1.5 L 1.5 25"
              fill="none"
              stroke="#00C8FF"
              strokeWidth="3.5"
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: stage >= 2 ? 1 : 0 }}
              transition={{ duration: 0.2, type: 'spring', damping: 14 }}
            />
            <motion.path
              d="M calc(100% - 25px) 1.5 L calc(100% - 1.5px) 1.5 L calc(100% - 1.5px) 25"
              fill="none"
              stroke="#00C8FF"
              strokeWidth="3.5"
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: stage >= 2 ? 1 : 0 }}
              transition={{ duration: 0.2, type: 'spring', damping: 14 }}
            />
            <motion.path
              d="M 25 calc(100% - 1.5px) L 1.5 calc(100% - 1.5px) L 1.5 calc(100% - 25px)"
              fill="none"
              stroke="#00C8FF"
              strokeWidth="3.5"
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: stage >= 2 ? 1 : 0 }}
              transition={{ duration: 0.2, type: 'spring', damping: 14 }}
            />
            <motion.path
              d="M calc(100% - 25px) calc(100% - 1.5px) L calc(100% - 1.5px) calc(100% - 1.5px) L calc(100% - 1.5px) calc(100% - 25px)"
              fill="none"
              stroke="#00C8FF"
              strokeWidth="3.5"
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: stage >= 2 ? 1 : 0 }}
              transition={{ duration: 0.2, type: 'spring', damping: 14 }}
            />

            <defs>
              <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00C8FF" />
                <stop offset="40%" stopColor="#8B5CF6" />
                <stop offset="70%" stopColor="#00C8FF" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>

          {/* ==========================================
              ⚛️ STEP 2: HEXAGONAL WIREFRAME MATRIX OVERLAY
              ========================================== */}
          {stage >= 2 && (
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-[0.06] bg-hex-grid flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.0, opacity: 1 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 15 }}
                className="w-[120%] h-[120%] absolute"
                style={{
                  backgroundImage: `radial-gradient(circle, transparent 65%, #000 100%), 
                    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cpath fill='%2300C8FF' fill-opacity='0.6' d='M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z M14 49 L28 41 L28 25 L14 17 L0 25 L0 41 Z' stroke='%2300C8FF' stroke-width='1' fill-none='true'/%3E%3C/svg%3E")`,
                }}
              />
            </div>
          )}

          {/* ==========================================
              🌍 STEP 3: REFRACED GLASS SURFACE FORMING
              ========================================== */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ 
              scale: stage >= 3 ? 1.0 : 0.94, 
              opacity: stage >= 3 ? 1.0 : 0,
              y: stage >= 3 ? 0 : 15
            }}
            transition={{ 
              duration: 0.35, 
              type: 'spring', 
              stiffness: 140, 
              damping: 15, // critically damped settling
            }}
            className={`w-full h-full flex flex-col overflow-hidden bg-gradient-to-b from-[#02030A]/95 to-[#040816]/98 border border-[#00C8FF]/15 rounded-2xl shadow-[0_0_60px_rgba(0,200,255,0.08)] backdrop-blur-xl relative z-20 ${
              stage >= 5 ? 'shadow-[0_0_60px_rgba(0,200,255,0.18)] border-[#00C8FF]/25' : ''
            }`}
          >
            {/* Edge glow brightening element */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00C8FF]/70 to-transparent" />

            {/* ==========================================
                🌠 STEP 4: TELEMETRY DATA STREAMS (FALLING BINARY CORRIDORS)
                ========================================== */}
            {stage >= 3 && stage < 5 && (
              <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.25] overflow-hidden">
                {dataStreams.map((stream) => (
                  <motion.div
                    key={stream.id}
                    initial={{ y: -150, opacity: 0.8 }}
                    animate={{ y: '100vh', opacity: 0 }}
                    transition={{
                      duration: stream.speed,
                      delay: stream.delay,
                      ease: 'linear',
                      repeat: 0,
                    }}
                    className="absolute text-[8px] font-mono text-cyan-400 tracking-widest writing-mode-vertical"
                    style={{ left: stream.left }}
                  >
                    {stream.chars}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Window Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#00C8FF]/15 bg-gradient-to-r from-[#061226]/50 to-transparent z-10">
              <div className="flex items-center gap-2.5">
                <motion.div
                  animate={{
                    scale: [1, 1.25, 1],
                    boxShadow: [
                      '0 0 0 0px rgba(0,200,255,0.4)',
                      '0 0 0 6px rgba(0,200,255,0)',
                      '0 0 0 0px rgba(0,200,255,0.4)'
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="w-2.5 h-2.5 rounded-full bg-[#00C8FF]"
                />
                
                {/* Scrambled Title Resolves */}
                <h2 className="text-xs sm:text-sm font-bold font-mono text-white tracking-widest uppercase select-none min-w-[200px]">
                  {scrambledTitle}
                </h2>
              </div>
              
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="group p-1.5 rounded-md border border-[#00C8FF]/20 bg-[#061226]/50 text-slate-400 hover:text-white hover:border-[#00C8FF] hover:shadow-[0_0_12px_rgba(0,200,255,0.25)] transition-all font-mono text-[10px] sm:text-xs flex items-center gap-1.5 cursor-pointer"
                title="Return to Cosmic Observatory View"
              >
                <Terminal className="w-3.5 h-3.5 text-[#00C8FF] group-hover:rotate-12 transition-transform" />
                <span>CLOSE DESK</span>
              </button>
            </div>

            {/* ==========================================
                ✨ STEP 5: TEXT RESOLVES & CONTENT VISIBLE
                ========================================== */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 4 ? 1.0 : 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 overflow-y-auto p-6 flex justify-center items-center bg-radial-glowing relative z-10"
            >
              {children}
            </motion.div>
            
            {/* Window Footer Status */}
            <div className="px-6 py-3 border-t border-[#00C8FF]/15 bg-[#02030A] flex justify-between items-center text-[9px] sm:text-[10px] font-mono text-slate-500 z-10">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="tracking-wider">OBSERVATORY SECURE COGNITIVE DECK</span>
              </span>
              <span className="text-cyan-400/80 font-semibold flex items-center gap-1">
                <Cpu className="w-3 h-3 animate-spin-slow text-[#00C8FF]" />
                SYSTEM LOCK: ESTABLISHED
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
