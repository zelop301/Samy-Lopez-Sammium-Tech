import React, { useEffect, useState } from "react";
import { AlertCircle, ShieldAlert, ArrowRight, Radio } from "lucide-react";

interface AlertsTickerProps {
  alerts: string[];
  overallScore: number;
}

export default function AlertsTicker({ alerts, overallScore }: AlertsTickerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (alerts.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % alerts.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [alerts]);

  const getBorderColor = () => {
    if (overallScore >= 81) return "border-red-600/40 bg-red-950/20 text-red-100 shadow-[0_0_15px_rgba(193,18,31,0.15)]";
    if (overallScore >= 61) return "border-orange-500/30 bg-orange-950/10 text-orange-200 shadow-[0_0_12px_rgba(249,115,22,0.1)]";
    if (overallScore >= 46) return "border-amber-500/20 bg-amber-950/5 text-amber-200";
    return "border-zinc-800 bg-zinc-950 text-zinc-300";
  };

  return (
    <div
      id="alerts-ticker"
      className={`border rounded-2xl p-4 transition-all duration-500 ${getBorderColor()} overflow-hidden relative flex flex-col md:flex-row md:items-center justify-between gap-3`}
    >
      <div className="flex items-center gap-3 w-full md:w-3/4">
        {/* Flashing Status indicator */}
        <div className="flex items-center justify-center">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800">
            {overallScore >= 61 ? (
              <>
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                <ShieldAlert className="w-4 h-4 text-red-500 relative z-10 animate-pulse" />
              </>
            ) : (
              <Radio className="w-4 h-4 text-zinc-400 relative z-10" />
            )}
          </div>
        </div>

        {/* Ticker statement with transition key */}
        <div className="flex-1 overflow-hidden min-h-[36px] flex items-center">
          <div
            key={activeIndex}
            className="text-xs font-mono tracking-wide leading-relaxed animate-in slide-in-from-bottom-2 duration-300"
          >
            {alerts[activeIndex] || "Sentinel radar feeds are clear. Active sectors report within nominal parameters."}
          </div>
        </div>
      </div>

      {/* Quick stats on the right side of the ticker bar */}
      <div className="flex items-center gap-3 shrink-0 self-end md:self-auto border-t border-zinc-900 md:border-t-0 pt-2 md:pt-0">
        <span className="text-[10px] font-mono text-zinc-500 uppercase">
          Total Alerts: <span className="text-zinc-300 font-semibold">{alerts.length}</span>
        </span>
        {alerts.length > 1 && (
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % alerts.length)}
            className="p-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors text-[10px] font-mono flex items-center gap-1 cursor-pointer"
          >
            Next <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
