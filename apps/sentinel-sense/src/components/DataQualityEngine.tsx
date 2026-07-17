import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, AlertTriangle, CheckCircle, Flame, Server, 
  Radio, RefreshCw, Cpu, Activity, Info, Key, FileText
} from "lucide-react";
import { audioEngine } from "../utils/AudioEngine";

interface SensorQualityState {
  source: string;
  category: "satellite" | "iot" | "hydro" | "infrastructure";
  health: number; // 0-100
  latencyMs: number;
  completeness: number; // 0-100
  verified: boolean;
  freshness: string;
}

export default function DataQualityEngine() {
  const [activeTab, setActiveTab] = useState<"health" | "integrity">("health");
  const [sensors, setSensors] = useState<SensorQualityState[]>([
    { source: "L-BAND METEOSAT-12", category: "satellite", health: 100, latencyMs: 142, completeness: 100, verified: true, freshness: "0.8s ago" },
    { source: "TERRESTRIAL HYDROMETER-GRID", category: "hydro", health: 98, latencyMs: 12, completeness: 100, verified: true, freshness: "1.4s ago" },
    { source: "SIEMENS POWER SUBSTATIONS", category: "infrastructure", health: 94, latencyMs: 35, completeness: 98, verified: true, freshness: "2.1s ago" },
    { source: "AGRICULTURAL VEGETATION PROBES", category: "iot", health: 89, latencyMs: 245, completeness: 95, verified: true, freshness: "5.7s ago" },
    { source: "URBAN COMMUTE BEACON NET", category: "infrastructure", health: 92, latencyMs: 8, completeness: 100, verified: true, freshness: "0.2s ago" },
    { source: "BIOMETRIC DISTRIBUTED DATABASE", category: "iot", health: 96, latencyMs: 18, completeness: 99, verified: true, freshness: "1.1s ago" },
  ]);

  const [auditLogs, setAuditLogs] = useState<string[]>([
    "COMPLETED SHA-256 CHECK PRE-SCAN INTEGRATION",
    "DE-DUPLICATED 42 REDUNDANT COGNITIVE STRANDS",
    "VERIFIED SECURE TLS 1.3 TRANSMISSION CHANNELS",
    "AUTONOMOUS OUTLIER DETECTION: NO CRITICAL ANOMALIES",
    "SCHEMA MATCH VALIDATED: METADATA STRUCTURE IS DIRECT",
  ]);

  // Simulate dynamic telemetry updates of quality metrics
  useEffect(() => {
    const timer = setInterval(() => {
      setSensors(prev => prev.map(s => {
        const hNoise = Math.floor(Math.random() * 3) - 1;
        const lNoise = Math.floor(Math.random() * 10) - 5;
        const freshSec = (parseFloat(s.freshness.split("s")[0]) + 0.5).toFixed(1);

        return {
          ...s,
          health: Math.max(70, Math.min(100, s.health + hNoise)),
          latencyMs: Math.max(4, s.latencyMs + lNoise),
          freshness: parseFloat(freshSec) > 8 ? "0.1s ago" : `${freshSec}s ago`
        };
      }));

      // Occasionally prepend an operational audit log
      if (Math.random() > 0.6) {
        const events = [
          `VERIFIED CRYPTO TOKEN HASH: 0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
          "SCHEMA VALIDATION: CONFORMS TO XML SNTL v7.8",
          `CLEANSED STREAMING CONVERGENT DATA FOR SECTOR ${Math.floor(Math.random() * 8) + 1}`,
          "CONFLICT RESOLUTION ENGINE: ZERO COLLISION MATRIX",
          "AUTOMATIC ROLLBACK CACHE SYNCED SUCCESSFULLY",
        ];
        const newEvent = events[Math.floor(Math.random() * events.length)];
        setAuditLogs(prev => [newEvent, ...prev.slice(0, 4)]);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const handleTabClick = (tab: "health" | "integrity") => {
    audioEngine.playTactileClick();
    setActiveTab(tab);
  };

  const getHealthBadge = (health: number) => {
    if (health >= 95) return <span className="text-emerald-400">OPTIMAL</span>;
    if (health >= 85) return <span className="text-amber-500">STABLE</span>;
    return <span className="text-red-400">DEGRADED</span>;
  };

  return (
    <div id="data-quality-engine" className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 shadow-2xl font-mono flex flex-col h-full justify-between min-h-[420px]">
      <div>
        {/* Module Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-red-500 animate-pulse" />
            <div>
              <h2 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">
                Data Quality & Trust Engine
              </h2>
              <p className="text-[9px] text-zinc-500 uppercase mt-0.5">
                Dynamic Validation & Cryptographic Auditing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-black/60 border border-zinc-900 rounded-lg p-0.5">
            <button
              onClick={() => handleTabClick("health")}
              className={`px-2 py-1 text-[8.5px] rounded font-bold uppercase cursor-pointer ${
                activeTab === "health" ? "bg-zinc-900 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Health
            </button>
            <button
              onClick={() => handleTabClick("integrity")}
              className={`px-2 py-1 text-[8.5px] rounded font-bold uppercase cursor-pointer ${
                activeTab === "integrity" ? "bg-zinc-900 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Integrity
            </button>
          </div>
        </div>

        {/* Tab 1: Sensors Health Matrix */}
        <AnimatePresence mode="wait">
          {activeTab === "health" && (
            <motion.div
              key="health-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-2.5"
            >
              {sensors.map((s, idx) => (
                <div 
                  key={s.source}
                  className="bg-black/40 border border-zinc-900/60 hover:border-zinc-800 rounded-xl p-2.5 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1 rounded-lg bg-zinc-900 text-zinc-500">
                      {s.category === "satellite" ? <Radio className="w-3.5 h-3.5" /> : <Server className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-zinc-200 truncate flex items-center gap-1.5">
                        <span>{s.source}</span>
                        {s.verified && (
                          <span className="text-[8px] px-1 py-0.5 bg-emerald-950 text-emerald-400 font-extrabold rounded" title="Cryptographically Signed Payload">
                            TLS1.3 SEC
                          </span>
                        )}
                      </div>
                      <div className="text-[8.5px] text-zinc-500 flex items-center gap-2 mt-0.5">
                        <span>LATENCY: <span className="text-zinc-400 font-bold">{s.latencyMs}ms</span></span>
                        <span>•</span>
                        <span>FRESHNESS: <span className="text-zinc-400 font-bold">{s.freshness}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right pl-2 flex-shrink-0">
                    <div className="text-[10px] font-extrabold flex items-center justify-end gap-1.5">
                      {getHealthBadge(s.health)}
                    </div>
                    <div className="text-[8.5px] text-zinc-500 font-sans mt-0.5">
                      Comp: {s.completeness}%
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Tab 2: Security & Immutable Logs */}
          {activeTab === "integrity" && (
            <motion.div
              key="integrity-tab"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-3"
            >
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/60 border border-zinc-900 p-2.5 rounded-xl text-center">
                  <div className="text-[14px] font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                    <Key className="w-4 h-4 text-emerald-500" />
                    AES-GCM 256
                  </div>
                  <div className="text-[8px] text-zinc-500 uppercase mt-1">
                    Sensor Channel Encryption
                  </div>
                </div>

                <div className="bg-black/60 border border-zinc-900 p-2.5 rounded-xl text-center">
                  <div className="text-[14px] font-extrabold text-red-500 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                    DE-DUP ACTIVE
                  </div>
                  <div className="text-[8px] text-zinc-500 uppercase mt-1">
                    Data Overlap Collision
                  </div>
                </div>
              </div>

              {/* Immutable Ledger Feed */}
              <div className="space-y-2">
                <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  Immutable Integrity Ledger (SHA-256)
                </div>
                <div className="bg-black/80 border border-zinc-900/60 rounded-xl p-3 space-y-2 max-h-[170px] overflow-y-auto font-mono scrollbar-thin">
                  {auditLogs.map((log, i) => (
                    <div key={i} className="text-[9px] leading-relaxed text-zinc-400 border-l border-zinc-800 pl-2 py-0.5 hover:text-zinc-200 transition-colors">
                      <span className="text-zinc-600 font-extrabold mr-1">[01:14:28]</span>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Aggregate Score Footer */}
      <div className="mt-4 pt-3.5 border-t border-zinc-900/80 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1">
          <Info className="w-3 h-3 text-zinc-500" />
          <span className="text-zinc-500 uppercase">FUSION TRUST INDEX:</span>
        </div>
        <span className="text-emerald-400 font-extrabold">
          98.6% VERIFIED (OPTIMAL)
        </span>
      </div>
    </div>
  );
}
