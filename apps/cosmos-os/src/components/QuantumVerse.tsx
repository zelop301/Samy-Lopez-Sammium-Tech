import { useMemo, useState } from 'react';
import { Atom, Dices, Link2, Save, Sparkles, Waves } from 'lucide-react';

interface QuantumVerseProps {
  onAddJournalLog: (message: string) => void;
}

type Basis = 'position' | 'momentum' | 'spin';

export default function QuantumVerse({ onAddJournalLog }: QuantumVerseProps) {
  const [amplitude, setAmplitude] = useState(0.72);
  const [phase, setPhase] = useState(45);
  const [basis, setBasis] = useState<Basis>('position');
  const [entangled, setEntangled] = useState(false);
  const [measurement, setMeasurement] = useState<string>('Unmeasured superposition');

  const probabilities = useMemo(() => {
    const p0 = Math.min(1, Math.max(0, amplitude ** 2));
    return { p0, p1: 1 - p0 };
  }, [amplitude]);

  const measure = () => {
    const result = Math.random() < probabilities.p0 ? '|0⟩' : '|1⟩';
    const partner = entangled ? (result === '|0⟩' ? '|1⟩' : '|0⟩') : 'independent';
    const message = entangled ? `${result}; partner collapsed to ${partner}` : result;
    setMeasurement(message);
    onAddJournalLog(`⚛️ [QUANTUM MEASUREMENT] Basis ${basis}; state ${message}; phase ${phase}°; P(0) ${(probabilities.p0 * 100).toFixed(1)}%.`);
  };

  return (
    <section className="grid w-full gap-4 text-slate-100 lg:grid-cols-[1.15fr_0.85fr]" aria-label="Quantum wave simulator">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-violet-400/25 bg-gradient-to-br from-violet-500/10 via-slate-950 to-cyan-500/10 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Atom className="h-5 w-5 text-violet-300" />
            <div>
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-violet-200">Qubit State Composer</h2>
              <p className="text-[11px] text-slate-400">Tune a normalized two-state wave function</p>
            </div>
          </div>

          <label htmlFor="qubit-amplitude" className="mb-4 block rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <span className="mb-2 flex justify-between font-mono text-[11px] uppercase text-slate-400">
              |0⟩ amplitude <strong className="text-cyan-300">{amplitude.toFixed(2)}</strong>
            </span>
            <input id="qubit-amplitude" type="range" min="0" max="1" step="0.01" value={amplitude} onChange={(event) => setAmplitude(Number(event.target.value))} className="h-2 w-full accent-cyan-400" />
          </label>

          <label htmlFor="qubit-phase" className="mb-4 block rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <span className="mb-2 flex justify-between font-mono text-[11px] uppercase text-slate-400">
              Relative phase <strong className="text-violet-300">{phase}°</strong>
            </span>
            <input id="qubit-phase" type="range" min="0" max="360" step="1" value={phase} onChange={(event) => setPhase(Number(event.target.value))} className="h-2 w-full accent-violet-400" />
          </label>

          <fieldset className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <legend className="px-1 font-mono text-[10px] uppercase tracking-wide text-slate-500">Measurement basis</legend>
            <div className="grid grid-cols-3 gap-2">
              {(['position', 'momentum', 'spin'] as Basis[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setBasis(option)}
                  className={`rounded-md border px-2 py-2 font-mono text-[10px] uppercase transition ${basis === option ? 'border-cyan-300 bg-cyan-400/15 text-cyan-200' : 'border-slate-800 text-slate-400 hover:border-slate-600'}`}
                  aria-pressed={basis === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => setEntangled((value) => !value)} className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-mono text-xs uppercase transition ${entangled ? 'border-fuchsia-300 bg-fuchsia-400/15 text-fuchsia-200' : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-fuchsia-400/50'}`} aria-pressed={entangled}>
            <Link2 className="h-4 w-4" /> {entangled ? 'Entangled pair active' : 'Create entangled pair'}
          </button>
          <button type="button" onClick={measure} className="flex items-center justify-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-400/15 px-4 py-2.5 font-mono text-xs font-bold uppercase text-cyan-100 transition hover:bg-cyan-400/25">
            <Dices className="h-4 w-4" /> Measure state
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative min-h-52 overflow-hidden rounded-xl border border-cyan-400/20 bg-slate-950 p-4">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(0,200,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,255,.18)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative flex h-40 items-center justify-center">
            <div className="absolute h-32 w-32 rounded-full border border-violet-400/30" />
            <div className="absolute h-24 w-24 animate-spin-slow rounded-full border-t-2 border-cyan-300" style={{ transform: `rotate(${phase}deg)` }} />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/15 text-3xl shadow-[0_0_35px_rgba(139,92,246,.45)]">ψ</div>
          </div>
          <div className="relative text-center font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">Probability field visualization</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-slate-300"><Waves className="h-4 w-4 text-cyan-300" /> Born-rule probabilities</div>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between font-mono text-[10px] text-slate-400"><span>P(|0⟩)</span><span>{(probabilities.p0 * 100).toFixed(1)}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-900"><div className="h-full bg-cyan-400 transition-all" style={{ width: `${probabilities.p0 * 100}%` }} /></div>
            </div>
            <div>
              <div className="mb-1 flex justify-between font-mono text-[10px] text-slate-400"><span>P(|1⟩)</span><span>{(probabilities.p1 * 100).toFixed(1)}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-900"><div className="h-full bg-violet-400 transition-all" style={{ width: `${probabilities.p1 * 100}%` }} /></div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-3">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-emerald-300"><Sparkles className="h-4 w-4" /> Latest observation</div>
          <p className="mt-2 text-xs text-slate-300">{measurement}</p>
        </div>

        <button type="button" onClick={() => onAddJournalLog(`💾 [QUANTUM STATE] ψ = ${amplitude.toFixed(2)}|0⟩ + e^(i${phase}°)√(1-a²)|1⟩; basis ${basis}; entangled ${entangled ? 'yes' : 'no'}.`)} className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 font-mono text-[10px] uppercase text-slate-300 hover:border-cyan-400/50">
          <Save className="h-4 w-4" /> Archive state vector
        </button>
      </div>
    </section>
  );
}
