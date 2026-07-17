import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal, ShieldCheck, Heart, Server, Activity, 
  Database, RefreshCw, Radio, CheckCircle, Flame, AlertTriangle
} from "lucide-react";
import { audioEngine } from "../utils/AudioEngine";

interface MetricRowProps {
  label: string;
  value: string | number;
  status: "nominal" | "warning" | "error";
}

function MetricRow({ label, value, status }: MetricRowProps) {
  const statusColor = {
    nominal: "text-emerald-400",
    warning: "text-amber-500",
    error: "text-red-500"
  }[status];

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-zinc-900/40 text-[10.5px]">
      <span className="text-zinc-500 uppercase">{label}</span>
      <span className={`${statusColor} font-bold font-mono`}>{value}</span>
    </div>
  );
}

export default function EngineeringDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [latency, setLatency] = useState(14);
  const [uptime, setUptime] = useState(99.98);
  const [queueLength, setQueueLength] = useState(0);
  const [schedulerJobs, setSchedulerJobs] = useState(5);
  const [dbStatus, setDbStatus] = useState<"nominal" | "warning">("nominal");

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(10, Math.min(60, prev + Math.floor(Math.random() * 9) - 4)));
      setQueueLength(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
      setSchedulerJobs(prev => Math.max(1, Math.min(12, prev + Math.floor(Math.random() * 3) - 1)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    audioEngine.playTactileClick();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative font-mono z-30">
      {/* Small dedicated engineering HUD launcher button */}
      <button
        onClick={handleToggle}
        className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-[9.5px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
          isOpen
            ? "bg-red-950/40 border-red-800 text-red-400 shadow-[0_0_10px_rgba(193,18,31,0.2)]"
            : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <Terminal className="w-3.5 h-3.5" />
        <span>Engineering HUD</span>
      </button>

      {/* Embedded slide-out Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 pointer-events-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              {/* Header */}
              <div className="p-4 border-b border-zinc-900 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4.5 h-4.5 text-red-500 animate-pulse" />
                  <div>
                    <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-widest">
                      Sentinel Operations Diagnostics
                    </h3>
                    <p className="text-[9px] text-zinc-500 uppercase mt-0.5">
                      Flagship Engineering & Service Telemetry Grid
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleToggle}
                  className="px-2.5 py-1 text-[9px] rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors border border-zinc-800 cursor-pointer"
                >
                  CLOSE HUD
                </button>
              </div>

              {/* Main diagnostics grids */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Column 1: Core Networking & Server status */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10.5px] font-bold text-zinc-400 border-b border-zinc-900 pb-1 mb-2 uppercase">
                      SERVICE LATENCY & HEALTH
                    </h4>
                    <div className="space-y-1">
                      <MetricRow label="Websocket Uplink" value="ACTIVE / CONNECTED" status="nominal" />
                      <MetricRow label="Network Latency" value={`${latency} ms`} status={latency > 45 ? "warning" : "nominal"} />
                      <MetricRow label="Sensor Fleet Uptime" value={`${uptime}%`} status="nominal" />
                      <MetricRow label="Internal DB Cluster" value="HEALTHY / SYNCED" status="nominal" />
                      <MetricRow label="Secure Crypto Key TLS" value="VERIFIED" status="nominal" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10.5px] font-bold text-zinc-400 border-b border-zinc-900 pb-1 mb-2 uppercase">
                      SCHEDULER & PIPELINE QUEUE
                    </h4>
                    <div className="space-y-1">
                      <MetricRow label="Active Backlog Jobs" value={queueLength} status={queueLength > 3 ? "warning" : "nominal"} />
                      <MetricRow label="Current Thread Allocation" value={`${schedulerJobs} threads`} status="nominal" />
                      <MetricRow label="Deduplication Task" value="COMPLETED" status="nominal" />
                      <MetricRow label="Anomaly Engine Cache" value="NOMINAL" status="nominal" />
                    </div>
                  </div>
                </div>

                {/* Column 2: Live console stream logs */}
                <div className="bg-black border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-zinc-900/60 pb-2 mb-3">
                      <span className="text-[9.5px] font-bold text-zinc-400 uppercase">
                        REAL-TIME LEDGER LOGS
                      </span>
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    </div>

                    <div className="space-y-1.5 max-h-[170px] overflow-y-auto text-[9px] text-zinc-500 leading-relaxed font-mono scrollbar-thin">
                      <div className="border-l border-zinc-800 pl-2">
                        <span className="text-zinc-600">[OK]</span> Core engine successfully established TLS handshake.
                      </div>
                      <div className="border-l border-zinc-800 pl-2">
                        <span className="text-zinc-600">[OK]</span> Syncing weather front L-Band telemetry (14.2 GBps).
                      </div>
                      <div className="border-l border-zinc-800 pl-2">
                        <span className="text-zinc-600">[OK]</span> Successfully verified sha-256 signature hashes.
                      </div>
                      <div className="border-l border-zinc-800 pl-2">
                        <span className="text-red-500">[ALERT]</span> High humidity threshold bypass detected in Mumbai.
                      </div>
                      <div className="border-l border-zinc-800 pl-2">
                        <span className="text-zinc-600">[OK]</span> Initialized proactive drone cluster in sector 4.
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-900/60 text-center">
                    <span className="text-[8px] text-zinc-600 uppercase">
                      Sentinel diagnostic panel v3.0 • SAMMIUM RESEARCH LABS
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="p-3 bg-black/60 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500">
                <span>DATABASE TRANSACTION ENGINE:</span>
                <span className="text-emerald-400 font-extrabold uppercase">
                  READY & REPLICATED
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
