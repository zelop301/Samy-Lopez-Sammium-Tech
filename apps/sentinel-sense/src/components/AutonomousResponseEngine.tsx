import React, { useState, useEffect } from "react";
import { Play, CheckCircle2, AlertCircle, Sparkles, Terminal, ShieldAlert } from "lucide-react";

interface AutonomousResponseEngineProps {
  overallScore: number;
  awarenessLevel: number;
  locationName: string;
}

export default function AutonomousResponseEngine({ overallScore, awarenessLevel, locationName }: AutonomousResponseEngineProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Dynamic list of workflows depending on severity
  const getWorkflowSteps = () => {
    if (overallScore >= 81) {
      return [
        { id: "sms", name: "Deploy Mobile Cell Broadcast Alerts", desc: "Sent emergency SMS warning to 100% of local SIM cards.", status: "completed" },
        { id: "siren", name: "Activate Flood/Siren Systems", desc: "Mechanical audio warnings active in Zone C & Riverbanks.", status: "completed" },
        { id: "lgu", name: "Signal State Civil Defense Command", desc: "Relayed telemetry packets to regional disaster management.", status: "completed" },
        { id: "traffic", name: "Reroute Major Expressways", desc: "Configured Google Maps and road signage to lock down underpasses.", status: "active" },
        { id: "evac", name: "Open Evacuation Shelters", desc: "Opened high-school gyms & high-ground community centers.", status: "pending" },
        { id: "dispatch", name: "Dispatch Rescue Vehicles", desc: "Sent amphibious crafts and search helicopters to local sector.", status: "pending" }
      ];
    } else if (overallScore >= 61) {
      return [
        { id: "lgu", name: "Notify Emergency Wardens", desc: "Pushed automated dashboard telemetry to emergency marshals.", status: "completed" },
        { id: "grid", name: "Trigger Automated Grid Safety Shutoff", desc: "Shut down vulnerable transformers in dry vegetation forestland.", status: "completed" },
        { id: "sms", name: "Broadcast Local Hazard Warns", desc: "Dispatched local SMS alerts to dry brush zones.", status: "active" },
        { id: "dispatch", name: "Pre-position Emergency Fire Engines", desc: "Staged forest water tenders 5km outside of dry canyon rim.", status: "pending" }
      ];
    } else if (overallScore >= 46) {
      return [
        { id: "sens", name: "Increase Remote Sensing Frequency", desc: "Adjusted orbital radar intervals from 15 minutes to 1 minute.", status: "completed" },
        { id: "lgu", name: "Ping Local Environmental Offices", desc: "Delivered predictive soil moisture and temperature reports.", status: "active" },
        { id: "monitor", name: "Activate CCTV AI Smoke Sensors", desc: "Enabled computer vision models on regional forestry cameras.", status: "pending" }
      ];
    } else {
      return [
        { id: "baseline", name: "Continuous Sentinel Surveillance Feed", desc: "AI models operating on background environmental telemetry logs.", status: "completed" }
      ];
    }
  };

  const steps = getWorkflowSteps();

  // Reset simulation step on prediction change
  useEffect(() => {
    setActiveStep(0);
    setIsPlaying(true);
  }, [overallScore]);

  // Stepper simulation timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  // Levels list mapping
  const levels = [
    { num: 1, name: "⚪ Level 1: Stable", desc: "Normal Operations" },
    { num: 2, name: "🟡 Level 2: Attention", desc: "Minor Anomaly" },
    { num: 3, name: "🟠 Level 3: Elevated Risk", desc: "Confidence Rising" },
    { num: 4, name: "🔴 Level 4: Critical", desc: "Immediate Response" },
    { num: 5, name: "🔴 Level 5: National Emergency", desc: "Multi-System Control" }
  ];

  return (
    <div id="autonomous-response" className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5 mb-5">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-red-500 animate-pulse" />
            <h2 className="text-sm font-mono uppercase tracking-widest text-zinc-100 font-bold">
              Autonomous Response Engine
            </h2>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Auto-Pilot
          </span>
        </div>

        {/* Current Awareness Level Indicator Banner */}
        <div className="mb-6 grid grid-cols-5 gap-1.5 bg-black/40 p-2.5 rounded-2xl border border-zinc-900">
          {levels.map((lvl) => {
            const isActive = lvl.num === awarenessLevel;
            const isPassed = lvl.num < awarenessLevel;

            // Colors based on level
            const getLvlBg = () => {
              if (lvl.num === 5) return isActive ? "bg-red-950/40 border-red-600 text-red-400" : "text-zinc-600 border-transparent";
              if (lvl.num === 4) return isActive ? "bg-red-900/30 border-red-500 text-red-300" : "text-zinc-600 border-transparent";
              if (lvl.num === 3) return isActive ? "bg-orange-900/20 border-orange-500 text-orange-300" : "text-zinc-600 border-transparent";
              if (lvl.num === 2) return isActive ? "bg-yellow-900/20 border-yellow-500 text-yellow-300" : "text-zinc-600 border-transparent";
              return isActive ? "bg-zinc-900/40 border-zinc-800 text-zinc-400" : "text-zinc-600 border-transparent";
            };

            return (
              <div
                key={lvl.num}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all duration-300 ${getLvlBg()} ${
                  isPassed ? "opacity-40" : ""
                }`}
                title={`${lvl.name}: ${lvl.desc}`}
              >
                <span className="text-xs font-bold font-mono">L{lvl.num}</span>
                <span className="text-[8px] font-mono tracking-tighter hidden md:inline">
                  {lvl.num === 5 ? "Emergency" : lvl.num === 4 ? "Critical" : lvl.num === 3 ? "Elevated" : lvl.num === 2 ? "Attention" : "Stable"}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] font-mono text-zinc-500 uppercase mb-4">
          Emergency Action Checklist for <span className="text-zinc-300">{locationName || "Monitored Zone"}</span>:
        </p>

        {/* Stepper Steps UI */}
        <div className="space-y-4">
          {steps.map((step, idx) => {
            const isCompleted = idx < activeStep;
            const isCurrent = idx === activeStep;
            
            return (
              <div
                key={step.id}
                className={`flex gap-3 items-start transition-all duration-500 ${
                  isCompleted ? "opacity-50" : isCurrent ? "scale-[1.01]" : "opacity-30"
                }`}
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] font-mono ${
                    isCompleted
                      ? "bg-zinc-950/40 border-zinc-700 text-zinc-300"
                      : isCurrent
                      ? "bg-red-950/50 border-red-500 text-red-400 animate-pulse"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500"
                  }`}>
                    {isCompleted ? "✓" : idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-0.5 h-6 my-1 ${
                      isCompleted ? "bg-zinc-700/50" : "bg-zinc-800"
                    }`} />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    isCurrent ? "text-red-400" : isCompleted ? "text-zinc-300" : "text-zinc-500"
                  }`}>
                    {step.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 font-sans leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-5 border-t border-zinc-900 mt-6 flex justify-between items-center text-[10px] font-mono text-zinc-500">
        <span>STATUS: {isPlaying ? "EXECUTING ACTIONS..." : "CHECKLIST ARMED"}</span>
        {isPlaying ? (
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
          </span>
        ) : (
          <button
            onClick={() => {
              setActiveStep(0);
              setIsPlaying(true);
            }}
            className="text-zinc-400 hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1 uppercase"
          >
            <Play className="w-3 h-3 text-red-500" /> Retrigger Sequence
          </button>
        )}
      </div>
    </div>
  );
}
