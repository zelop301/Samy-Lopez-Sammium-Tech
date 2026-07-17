import React from "react";
import { History, ShieldAlert, Zap, Radio } from "lucide-react";
import { HistoricalScan } from "../types";

interface HistorySidebarProps {
  scans: HistoricalScan[];
  activeScanId: string | undefined;
  onSelectScan: (id: string) => void;
  isScanning: boolean;
}

export default function HistorySidebar({ scans, activeScanId, onSelectScan, isScanning }: HistorySidebarProps) {
  
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "CRITICAL":
        return "text-red-500 bg-red-950/20 border-red-900/40";
      case "SEVERE":
        return "text-orange-400 bg-orange-950/25 border-orange-900/30";
      case "ELEVATED":
        return "text-amber-400 bg-amber-950/15 border-amber-900/30";
      case "MODERATE":
        return "text-zinc-300 bg-zinc-900 border-zinc-800";
      default:
        return "text-zinc-400 bg-zinc-950 border-zinc-800";
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "Just now";
    }
  };

  return (
    <div id="history-sidebar" className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3.5 mb-5">
          <History className="w-5 h-5 text-red-500 animate-pulse" />
          <h2 className="text-sm font-mono uppercase tracking-widest text-zinc-100 font-bold">
            Sentinel Logs
          </h2>
        </div>

        {scans.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono text-zinc-500">
            No previous scans registered. Trigger your first telemetry scan to populate logs.
          </div>
        ) : (
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {scans.map((scan) => {
              const isActive = scan.id === activeScanId;
              const gradeClass = getGradeColor(scan.threatGrade);
              
              return (
                <button
                  key={scan.id}
                  disabled={isScanning}
                  onClick={() => onSelectScan(scan.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between items-start gap-2 cursor-pointer ${
                    isActive
                      ? "bg-zinc-900/90 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                      : "bg-black/40 border-zinc-900 hover:bg-zinc-900/40 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-mono font-bold text-zinc-200 truncate max-w-[150px]">
                      {scan.locationName}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">
                      {formatTime(scan.timestamp)}
                    </span>
                  </div>

                  <p className="text-[10px] text-zinc-400 font-sans line-clamp-2 italic leading-relaxed">
                    "{scan.summary}"
                  </p>

                  <div className="flex items-center justify-between w-full pt-1.5 border-t border-zinc-900/80 mt-1">
                    <span className="text-[9px] font-mono text-zinc-500">
                      SCORE: <span className="text-zinc-300 font-semibold">{scan.overallThreatScore}%</span>
                    </span>
                    <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${gradeClass}`}>
                      {scan.threatGrade}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-zinc-900 mt-6 text-center">
        <div className="text-[10px] font-mono text-zinc-500 uppercase flex items-center justify-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-zinc-500 animate-pulse" />
          <span>SENSE_REGISTRY: ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
