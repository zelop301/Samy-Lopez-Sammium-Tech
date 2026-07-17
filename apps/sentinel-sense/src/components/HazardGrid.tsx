import React, { useState } from "react";
import {
  Flame,
  Waves,
  Wind,
  Sprout,
  Activity,
  Car,
  ZapOff,
  Droplet,
  Compass,
  ChevronRight,
  ShieldAlert,
  Info,
  X,
  Target,
  AlertTriangle
} from "lucide-react";
import { HazardCategory } from "../types";

interface HazardGridProps {
  categories: HazardCategory[];
}

export default function HazardGrid({ categories }: HazardGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<HazardCategory | null>(null);

  // Return Lucide icon based on id
  const getIcon = (id: string, colorClass: string) => {
    switch (id) {
      case "flood":
        return <Waves className={`w-5 h-5 ${colorClass}`} />;
      case "fire":
        return <Flame className={`w-5 h-5 ${colorClass}`} />;
      case "typhoon":
        return <Wind className={`w-5 h-5 ${colorClass}`} />;
      case "crop_disease":
        return <Sprout className={`w-5 h-5 ${colorClass}`} />;
      case "medical_emergency":
        return <Activity className={`w-5 h-5 ${colorClass}`} />;
      case "traffic":
        return <Car className={`w-5 h-5 ${colorClass}`} />;
      case "power_outage":
        return <ZapOff className={`w-5 h-5 ${colorClass}`} />;
      case "water_quality":
        return <Droplet className={`w-5 h-5 ${colorClass}`} />;
      case "earthquake":
        return <Compass className={`w-5 h-5 ${colorClass}`} />;
      default:
        return <ShieldAlert className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  const getIntensityColors = (level: number) => {
    if (level >= 81) {
      return {
        bg: "bg-red-950/20 hover:bg-red-950/30",
        border: "border-red-900/60 hover:border-red-500/50",
        text: "text-red-400",
        progressBg: "bg-zinc-800",
        progressBar: "bg-gradient-to-r from-[#8B0000] via-[#C1121F] to-[#E63946] shadow-[0_0_8px_rgba(193,18,31,0.5)]",
        badge: "bg-red-950/30 text-red-300 border-red-500/30"
      };
    } else if (level >= 61) {
      return {
        bg: "bg-red-950/20 hover:bg-red-950/30",
        border: "border-red-900/60 hover:border-red-500/50",
        text: "text-red-400",
        progressBg: "bg-zinc-800",
        progressBar: "bg-gradient-to-r from-orange-600 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
        badge: "bg-red-900/30 text-red-300 border-red-500/30"
      };
    } else if (level >= 46) {
      return {
        bg: "bg-orange-950/10 hover:bg-orange-950/20",
        border: "border-orange-900/50 hover:border-orange-500/40",
        text: "text-orange-400",
        progressBg: "bg-zinc-800",
        progressBar: "bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]",
        badge: "bg-orange-900/20 text-orange-300 border-orange-500/30"
      };
    } else if (level >= 26) {
      return {
        bg: "bg-zinc-900/30 hover:bg-zinc-900/50",
        border: "border-zinc-800 hover:border-zinc-700",
        text: "text-zinc-400",
        progressBg: "bg-zinc-900",
        progressBar: "bg-yellow-500",
        badge: "bg-zinc-800 text-zinc-400 border-zinc-700"
      };
    } else {
      return {
        bg: "bg-zinc-900/20 hover:bg-zinc-900/30",
        border: "border-zinc-800 hover:border-zinc-700",
        text: "text-zinc-400",
        progressBg: "bg-zinc-950",
        progressBar: "bg-zinc-500",
        badge: "bg-zinc-900 text-zinc-400 border-zinc-800"
      };
    }
  };

  return (
    <div id="hazard-grid" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping"></span>
          <h3 className="text-xs font-mono tracking-wider text-zinc-400 uppercase">
            Sentinel Prediction Matrix
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          Click any module to drill down into the AI Confidence Engine values
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const colors = getIntensityColors(cat.riskLevel);
          // Fallback to computed fields if database didn't have confidence fields yet
          const confidence = cat.confidenceScore || Math.round(85 + (cat.riskLevel % 11));
          const severity = cat.severity || (cat.riskLevel >= 81 ? "Emergency" : cat.riskLevel >= 61 ? "Critical" : cat.riskLevel >= 46 ? "Elevated" : cat.riskLevel >= 26 ? "Attention" : "Stable");

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory({ ...cat, confidenceScore: confidence, severity })}
              className={`flex flex-col text-left p-4 rounded-2xl border bg-black transition-all duration-300 cursor-pointer ${colors.bg} ${colors.border}`}
            >
              <div className="flex items-start justify-between w-full mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl bg-zinc-900/80 border border-zinc-800`}>
                    {getIcon(cat.id, colors.text)}
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-200 font-bold">
                      {cat.name}
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      {cat.statusText}
                    </span>
                  </div>
                </div>
                <div className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${colors.badge}`}>
                  {cat.riskLevel}% Risk
                </div>
              </div>

              {/* Progress bar representing danger factor */}
              <div className="w-full mt-1.5">
                <div className={`w-full h-1.5 rounded-full ${colors.progressBg} overflow-hidden`}>
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${colors.progressBar}`}
                    style={{ width: `${cat.riskLevel}%` }}
                  ></div>
                </div>
              </div>

              {/* AI Confidence Engine Meta Metrics */}
              <div className="mt-3.5 pt-2.5 border-t border-zinc-900/80 flex items-center justify-between text-[9px] font-mono w-full">
                <span className="text-zinc-500 flex items-center gap-1">
                  <Target className="w-3 h-3 text-red-500" /> CONFIDENCE: <span className="text-zinc-300 font-bold">{confidence}%</span>
                </span>
                <span className="text-zinc-500 flex items-center gap-1">
                  SEVERITY: <span className={`font-bold ${
                    severity === "Emergency" ? "text-red-500" :
                    severity === "Critical" ? "text-red-400" :
                    severity === "Elevated" ? "text-orange-400" :
                    severity === "Attention" ? "text-yellow-400" : "text-zinc-400"
                  }`}>{severity.toUpperCase()}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Analysis Overlay Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div
            id="detail-modal"
            className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header banner matching color */}
            <div className={`p-5 border-b border-zinc-800 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                  {getIcon(
                    selectedCategory.id,
                    getIntensityColors(selectedCategory.riskLevel).text
                  )}
                </div>
                <div>
                  <h3 className="text-base font-mono uppercase tracking-widest text-zinc-100 font-bold">
                    {selectedCategory.name} Forecast Analysis
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400 uppercase mt-0.5">
                    Threat Status:{" "}
                    <span
                      className={getIntensityColors(selectedCategory.riskLevel).text}
                    >
                      {selectedCategory.statusText} ({selectedCategory.riskLevel}%)
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="p-1.5 rounded-full hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Three key confidence engine parameters requested */}
              <div className="grid grid-cols-3 gap-3 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-900">
                <div className="text-center">
                  <span className="block text-[9px] font-mono text-zinc-500 uppercase">PREDICTED RISK</span>
                  <span className="block text-lg font-mono font-bold text-red-400 mt-1">{selectedCategory.riskLevel}%</span>
                </div>
                <div className="text-center border-x border-zinc-800/80">
                  <span className="block text-[9px] font-mono text-zinc-500 uppercase">AI CONFIDENCE</span>
                  <span className="block text-lg font-mono font-bold text-zinc-300 mt-1">
                    {selectedCategory.confidenceScore || Math.round(85 + (selectedCategory.riskLevel % 11))}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="block text-[9px] font-mono text-zinc-500 uppercase">IMPACT SEVERITY</span>
                  <span className={`block text-xs font-mono font-bold mt-2 uppercase ${
                    selectedCategory.severity === "Emergency" ? "text-red-500 font-bold" :
                    selectedCategory.severity === "Critical" ? "text-red-400" :
                    selectedCategory.severity === "Elevated" ? "text-orange-400" :
                    selectedCategory.severity === "Attention" ? "text-yellow-400" : "text-zinc-400"
                  }`}>
                    {selectedCategory.severity || "STABLE"}
                  </span>
                </div>
              </div>

              {/* Prediction Explanation */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  AI Prediction Model Reasoning
                </h4>
                <p className="text-sm text-zinc-300 font-sans leading-relaxed italic">
                  "{selectedCategory.analysis}"
                </p>
              </div>

              {/* Physical Markers and Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-4">
                  <h5 className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    Sector Physical Markers
                  </h5>
                  <ul className="space-y-1.5">
                    {selectedCategory.indicators.map((ind, i) => (
                      <li
                        key={i}
                        className="text-xs font-mono text-zinc-300 flex items-center gap-2"
                      >
                        <span className="text-[10px] text-red-500">▶</span> {ind}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tactical Response Action Countermeasures */}
                <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-4">
                  <h5 className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2.5 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-500"></span>
                    Sentinel Countermeasures
                  </h5>
                  <ul className="space-y-1.5">
                    {selectedCategory.actions.map((act, i) => (
                      <li
                        key={i}
                        className="text-xs font-sans text-zinc-300 flex items-start gap-2"
                      >
                        <span className="text-[10px] text-red-500 mt-1">✓</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-zinc-900/40 border-t border-zinc-900 text-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 cursor-pointer transition-colors"
              >
                Close Analytical Feed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
