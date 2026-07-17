import React, { useState } from "react";
import { Cpu, ChevronRight, Zap, Info, Database, Server, BellRing, Sparkles } from "lucide-react";

export default function AiDecisionPipeline() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    { title: "Sensor Ingestion", desc: "Aggregates IoT logs, satellite heat maps, and river sensors.", icon: Database },
    { title: "Data Norm", desc: "Aligns diverse physical telemetry feeds to standard tensor matrices.", icon: Server },
    { title: "Data Clean", desc: "Filters sensor noise, dropouts, and calibrates regional offsets.", icon: Info },
    { title: "Data Fusion", desc: "Combines atmospheric conditions with geospatial soil metrics.", icon: Cpu },
    { title: "AI Analysis", desc: "Sentinel core models process raw tensors for trend lines.", icon: Sparkles },
    { title: "Pattern Recog", desc: "Triggers predictive models for anomalous thermal/hydraulic rises.", icon: Zap },
    { title: "Risk Predict", desc: "Calculates mathematical likelihood vectors per hazard.", icon: Zap },
    { title: "Confidence Engine", desc: "Computes confidence score based on telemetry consistency.", icon: Info },
    { title: "Decision Engine", desc: "Maps hazards against regional emergency rule matrix.", icon: Cpu },
    { title: "Recommendations", desc: "Generates actionable, evidence-based mitigation checklists.", icon: Info },
    { title: "Auto Notifications", desc: "Triggers cell broadcasts, sirens, and civic control alerts.", icon: BellRing }
  ];

  return (
    <div id="ai-pipeline" className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-red-500 animate-pulse" />
          <h2 className="text-sm font-mono uppercase tracking-widest text-zinc-100 font-bold">
            Sentinel AI Decision Pipeline
          </h2>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 uppercase">
          TELEMETRY STREAM TO ACTION
        </span>
      </div>

      <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
        Trace how incoming physical telemetry from the real world is ingested, normalized, cleaned, and evaluated through our proprietary predictive neural networks to generate real-time community alerts. Hover over any step to view operational logs.
      </p>

      {/* Grid Flow Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-11 gap-3 relative">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isHovered = hoveredStep === idx;

          return (
            <div key={step.title} className="flex items-center lg:flex-col lg:items-stretch relative">
              <div
                onMouseEnter={() => setHoveredStep(idx)}
                onMouseLeave={() => setHoveredStep(null)}
                className={`flex-1 flex flex-col justify-between p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer min-h-[110px] lg:min-h-[125px] ${
                  isHovered
                    ? "bg-red-950/20 border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    : "bg-black/60 border-zinc-900 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg ${isHovered ? "bg-red-500/20 text-red-400" : "bg-zinc-900 text-zinc-400"}`}>
                    <StepIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-600 font-bold">0{idx + 1}</span>
                </div>

                <div className="mt-2">
                  <h3 className={`text-[10px] font-mono uppercase tracking-tight font-bold ${
                    isHovered ? "text-red-400" : "text-zinc-200"
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-[8px] text-zinc-500 leading-normal mt-1 block max-h-12 overflow-hidden truncate whitespace-normal">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* Connector lines (only for desktop layout) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-zinc-800">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Popover helper text box */}
      <div className="mt-5 bg-black/40 border border-zinc-900 rounded-xl p-3 min-h-[64px] flex items-center justify-center text-center">
        {hoveredStep !== null ? (
          <div className="animate-fade-in">
            <span className="text-xs font-mono text-red-400 font-bold block uppercase mb-0.5">
              Step {hoveredStep + 1}: {steps[hoveredStep].title}
            </span>
            <span className="text-[11px] text-zinc-300">
              {steps[hoveredStep].desc}
            </span>
          </div>
        ) : (
          <span className="text-xs text-zinc-500 font-mono italic">
            Hover over any pipeline milestone to review detail layers.
          </span>
        )}
      </div>
    </div>
  );
}
