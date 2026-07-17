import React, { useState } from 'react';
import { Sparkles, Send, Brain } from 'lucide-react';

interface ResearchJournalProps {
  logs: string[];
  onAddLog: (text: string) => void;
  onClearLogs: () => void;
  onSnapTelemetry: () => void;
}

export default function ResearchJournal({
  logs,
  onAddLog,
  onClearLogs,
  onSnapTelemetry,
}: ResearchJournalProps) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    // Add custom timestamp
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    onAddLog(`✍️ [OBSERVER @ ${timeStr}] ${inputText}`);
    setInputText("");
  };

  return (
    <div id="research-journal-panel" className="bg-[#02030A]/85 border border-[#00C8FF]/30 rounded-xl p-5 backdrop-blur-md shadow-[0_0_25px_rgba(2,3,10,0.85)] max-w-lg w-full flex flex-col gap-4 font-sans text-[#F8FAFC]">
      <div className="flex items-center justify-between border-b border-[#00C8FF]/20 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#8B5CF6] animate-pulse" />
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#8B5CF6]">
            Research Journal Logbook
          </h2>
        </div>
        <button
          onClick={onClearLogs}
          className="text-[9px] text-[#00C8FF] hover:underline font-mono"
        >
          CLEAR LOGS
        </button>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Record your simulated scientific discoveries. Add manual field notes or snap live telemetry coordinates from active gravitation drives directly into your logbook.
      </p>

      {/* Logs Scroll Window */}
      <div className="bg-slate-950/90 border border-slate-900 rounded-lg p-3 h-52 overflow-y-auto flex flex-col gap-2.5 font-mono text-xs max-h-52 scrollbar-thin">
        {logs.map((log, index) => (
          <div
            key={index}
            className="border-b border-slate-900 pb-2 text-slate-300 leading-relaxed last:border-b-0"
          >
            {log}
          </div>
        ))}
      </div>

      {/* Manual Entry Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-900 pt-3">
        <input
          id="custom-log-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Record astronomical field notes..."
          className="flex-1 bg-slate-950 border border-[#00C8FF]/20 rounded px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#00C8FF]/50 font-mono"
        />
        <button
          type="submit"
          className="p-2 rounded bg-[#8B5CF6] text-slate-950 hover:bg-[#8B5CF6]/85 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </form>

      {/* Fast telemetry snapshot click */}
      <button
        id="snap-telemetry-btn"
        onClick={onSnapTelemetry}
        className="w-full py-2 rounded bg-[#061226]/80 hover:bg-[#00C8FF]/10 text-[#00C8FF] border border-[#00C8FF]/30 text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Snap Current Gravitation Telemetry
      </button>
    </div>
  );
}
