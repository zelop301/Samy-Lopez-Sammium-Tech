import React from "react";
import { motion } from "motion/react";
import { 
  GitBranch, HelpCircle, AlertOctagon, ArrowRight, BrainCircuit, 
  Lightbulb, Compass, ThumbsUp, Activity
} from "lucide-react";
import { PredictionResult } from "../types";

interface AiDecisionReasoningProps {
  currentPrediction: PredictionResult | null;
}

export default function AiDecisionReasoning({ currentPrediction }: AiDecisionReasoningProps) {
  if (!currentPrediction) {
    return (
      <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 shadow-2xl font-mono flex items-center justify-center text-zinc-500 text-xs min-h-[300px]">
        Waiting for Sentinel Scan data stream...
      </div>
    );
  }

  const overallThreat = currentPrediction.overallThreatScore;
  const isHighAlert = overallThreat >= 60;

  // Safe fallback for optional inputs
  const inputs = currentPrediction.inputs || {
    temperature: 25,
    humidity: 50,
    windSpeed: 15,
    precipitation: 0,
    seismicActivity: 0.0,
    cropHealthIndex: 80,
    infrastructureLoad: 40,
    waterPh: 7.0,
    customScenario: ""
  };

  // Derive logical stages of AI reasoning based on current telemetry
  const reasoningSteps = [
    {
      stage: "Observation",
      title: "Atmospheric Correlation",
      desc: `Ingested ${currentPrediction.locationName} environment matrices. Temp: ${inputs.temperature}°C, Humidity: ${inputs.humidity}%.`,
      status: "RESOLVED",
    },
    {
      stage: "Anomaly Detection",
      title: "Multidimensional Outlier Alignment",
      desc: inputs.seismicActivity > 2.0 
        ? "Seismic stress levels elevated. Crustal strain matches high risk." 
        : inputs.windSpeed > 45 
        ? "Dynamic high velocity wind vector shear registered."
        : "Standard baseline thresholds met. Minor convective friction observed.",
      status: "COMPLETE",
    },
    {
      stage: "Probabilistic Model Run",
      title: "Bayesian Risk Weights",
      desc: `Fitted dynamic vector models. Calculated overall vulnerability index at ${overallThreat}%.`,
      status: "STABLE",
    },
  ];

  return (
    <div id="ai-decision-reasoning" className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 shadow-2xl font-mono flex flex-col justify-between h-full min-h-[420px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4.5 h-4.5 text-red-500 animate-pulse" />
            <div>
              <h2 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">
                AI Cognitive Reasoning Path
              </h2>
              <p className="text-[9px] text-zinc-500 uppercase mt-0.5">
                Explainable Neural Logic & Signal Fusion
              </p>
            </div>
          </div>
        </div>

        {/* Steps Pipeline */}
        <div className="space-y-4">
          {reasoningSteps.map((step, idx) => (
            <div key={idx} className="relative flex gap-3 pl-1">
              {/* Connector line */}
              {idx < reasoningSteps.length - 1 && (
                <div className="absolute left-[13px] top-6 bottom-0 w-[1px] bg-zinc-900" />
              )}

              {/* Step circle */}
              <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-400 z-10 flex-shrink-0">
                0{idx + 1}
              </div>

              {/* Step details */}
              <div className="bg-black/30 border border-zinc-900/60 rounded-xl p-2.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] px-1.5 py-0.5 bg-zinc-900 text-zinc-400 font-extrabold rounded">
                    {step.stage}
                  </span>
                  <span className="text-[8.5px] text-emerald-400 font-extrabold">
                    {step.status}
                  </span>
                </div>
                <h4 className="text-[10px] font-bold text-zinc-200 mt-1.5">
                  {step.title}
                </h4>
                <p className="text-[9.5px] text-zinc-500 mt-1 font-sans leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Sentinel Recommendation Advice Card */}
        <div className="mt-4 p-3 bg-red-950/20 border border-red-900/40 rounded-2xl">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[10.5px] font-bold text-red-400 uppercase tracking-wider">
                Sentinel Synthesis Advice
              </h4>
              <p className="text-[10px] text-zinc-400 font-sans leading-relaxed mt-0.5">
                {currentPrediction.summary || "No warnings issued. System observing standard patterns."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Confidence Footer */}
      <div className="mt-4 pt-3.5 border-t border-zinc-900/80 flex items-center justify-between text-[10px]">
        <span className="text-zinc-600 font-bold uppercase">Reasoning Method:</span>
        <span className="text-zinc-400 uppercase">
          Bayesian Weight Model v4.12
        </span>
      </div>
    </div>
  );
}
