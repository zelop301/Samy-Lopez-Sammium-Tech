import React, { useState } from "react";
import { motion } from "motion/react";
import { Clock, Eye, Calendar, Sparkles, TrendingUp, History } from "lucide-react";
import { audioEngine } from "../utils/AudioEngine";

export interface TimelinePoint {
  id: string;
  label: string;
  timeOffset: string;
  type: "past" | "present" | "future";
  description: string;
  integrityScore: number;
}

const TIMELINE_POINTS: TimelinePoint[] = [
  { id: "past_12h", label: "T -12H", timeOffset: "-12 hours", type: "past", description: "Archived Sensor Fusion Snapshot (Static)", integrityScore: 98 },
  { id: "past_6h", label: "T -6H", timeOffset: "-6 hours", type: "past", description: "L-Band Orbit Satellite Baseline", integrityScore: 99 },
  { id: "now", label: "PRESENT", timeOffset: "Real-time stream", type: "present", description: "Active Telemetry & Decision Matrix (Live)", integrityScore: 100 },
  { id: "future_6h", label: "T +6H", timeOffset: "+6 hours", type: "future", description: "Deterministic Vector Projection", integrityScore: 94 },
  { id: "future_12h", label: "T +12H", timeOffset: "+12 hours", type: "future", description: "Atmospheric Density Trend Forecast", integrityScore: 91 },
  { id: "future_24h", label: "T +24H", timeOffset: "+24 hours", type: "future", description: "Predictive Neural Network Simulation", integrityScore: 86 },
  { id: "future_48h", label: "T +48H", timeOffset: "+48 hours", type: "future", description: "Probabilistic Risk Model Run", integrityScore: 78 },
  { id: "future_72h", label: "T +72H", timeOffset: "+72 hours", type: "future", description: "Long-range Climate Core Extrapolation", integrityScore: 65 },
];

interface PredictiveTimelineProps {
  onTimelineChange?: (point: TimelinePoint) => void;
  isScanning?: boolean;
}

export default function PredictiveTimeline({ onTimelineChange, isScanning }: PredictiveTimelineProps) {
  const [selectedPointId, setSelectedPointId] = useState<string>("now");

  const handlePointSelect = (pt: TimelinePoint) => {
    audioEngine.playTactileClick();
    setSelectedPointId(pt.id);
    if (onTimelineChange) {
      onTimelineChange(pt);
    }
  };

  const selectedPoint = TIMELINE_POINTS.find(p => p.id === selectedPointId) || TIMELINE_POINTS[2];

  return (
    <div id="predictive-timeline" className="w-full bg-zinc-950/95 border border-zinc-900 rounded-3xl p-5 shadow-2xl font-mono relative overflow-hidden z-25">
      {/* Decorative timeline lighting effect */}
      <div className="absolute top-0 left-0 w-24 h-[1px] bg-red-500/50" />
      <div className="absolute top-0 right-0 w-24 h-[1px] bg-red-500/50" />

      {/* Header section with active time status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5 border-b border-zinc-900/60 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-500 animate-pulse" />
          <div>
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">
              Sentinel Predictive Timeline™
            </h3>
            <p className="text-[9px] text-zinc-500 uppercase mt-0.5">
              Live Temporal Simulation Scrub Bar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/60 border border-zinc-900 px-2.5 py-1 rounded-lg">
            <span className="text-[9px] text-zinc-500 uppercase font-bold">MODE:</span>
            <span className={`text-[9px] font-bold uppercase flex items-center gap-1 ${
              selectedPoint.type === "present"
                ? "text-emerald-400"
                : selectedPoint.type === "past"
                ? "text-zinc-400"
                : "text-amber-500 animate-pulse"
            }`}>
              {selectedPoint.type === "present" && <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              {selectedPoint.type === "past" && <History className="w-3 h-3" />}
              {selectedPoint.type === "future" && <TrendingUp className="w-3 h-3" />}
              {selectedPoint.label}
            </span>
          </div>

          <div className="text-[9px] text-zinc-500 font-sans hidden sm:block">
            Confidence: <span className="text-zinc-300 font-mono font-bold">{selectedPoint.integrityScore}%</span>
          </div>
        </div>
      </div>

      {/* Scrub Line track container */}
      <div className="relative py-4 px-2 my-1">
        {/* Continuous timeline line thread */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-zinc-900 -translate-y-1/2 z-0" />
        
        {/* Dynamic completed trajectory track */}
        <div 
          className="absolute top-1/2 left-4 h-0.5 bg-red-950 -translate-y-1/2 z-0 transition-all duration-500"
          style={{
            width: `${(TIMELINE_POINTS.findIndex(p => p.id === selectedPointId) / (TIMELINE_POINTS.length - 1)) * 95}%`
          }}
        />

        <div className="relative flex justify-between items-center z-10">
          {TIMELINE_POINTS.map((pt) => {
            const isSelected = pt.id === selectedPointId;
            const isFuture = pt.type === "future";
            const isPast = pt.type === "past";

            return (
              <button
                key={pt.id}
                onClick={() => handlePointSelect(pt)}
                className="flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                {/* Visual temporal point bubble */}
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    isSelected
                      ? "bg-red-950 border-red-500 text-red-400 scale-125 shadow-[0_0_12px_rgba(230,57,70,0.4)]"
                      : isPast
                      ? "bg-zinc-900/80 border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                      : isFuture
                      ? "bg-black border-amber-900/60 text-amber-600/70 hover:border-amber-500 hover:text-amber-400"
                      : "bg-zinc-900/80 border-zinc-800 text-emerald-500/80 hover:border-emerald-500 hover:text-emerald-400"
                  }`}
                >
                  <span className="text-[8.5px] font-bold">
                    {pt.label.replace("T ", "")}
                  </span>
                </div>

                {/* Micro-dot hover feedback indicators */}
                <span className={`text-[8px] font-mono mt-2 transition-all font-bold ${
                  isSelected 
                    ? "text-red-400" 
                    : isPast 
                    ? "text-zinc-600 group-hover:text-zinc-400" 
                    : "text-zinc-500 group-hover:text-amber-400"
                }`}>
                  {pt.timeOffset}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Point details & dynamic sensor telemetry description read-out */}
      <div className="mt-4 p-3 bg-black/40 border border-zinc-900/50 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-zinc-900 text-red-500/70 flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
              Simulation Phase Context
            </div>
            <div className="text-zinc-300 font-sans mt-0.5 text-[11px]">
              {selectedPoint.description}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-right self-end sm:self-center">
          <span className="text-[10px] text-zinc-600 font-bold uppercase">
            Data Integrity Confidence:
          </span>
          <span className={`text-[11px] font-bold ${
            selectedPoint.integrityScore >= 90
              ? "text-emerald-400"
              : selectedPoint.integrityScore >= 75
              ? "text-amber-500"
              : "text-red-400"
          }`}>
            {selectedPoint.integrityScore}%
          </span>
        </div>
      </div>
    </div>
  );
}
