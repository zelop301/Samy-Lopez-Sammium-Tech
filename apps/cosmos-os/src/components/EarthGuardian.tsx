import { useMemo, useState } from 'react';
import { AlertTriangle, Crosshair, Radar, Save, Shield, Zap } from 'lucide-react';

interface EarthGuardianProps {
  onAddJournalLog: (message: string) => void;
}

type DeflectionMethod = 'kinetic' | 'gravity' | 'laser';

const methodLabels: Record<DeflectionMethod, string> = {
  kinetic: 'Kinetic impactor',
  gravity: 'Gravity tractor',
  laser: 'Laser ablation',
};

export default function EarthGuardian({ onAddJournalLog }: EarthGuardianProps) {
  const [diameter, setDiameter] = useState(180);
  const [velocity, setVelocity] = useState(19);
  const [leadTime, setLeadTime] = useState(8);
  const [method, setMethod] = useState<DeflectionMethod>('kinetic');
  const [engaged, setEngaged] = useState(false);

  const analysis = useMemo(() => {
    const radius = diameter / 2;
    const density = 3000;
    const massKg = (4 / 3) * Math.PI * radius ** 3 * density;
    const energyJ = 0.5 * massKg * (velocity * 1000) ** 2;
    const megatons = energyJ / 4.184e15;
    const leadFactor = Math.min(1, leadTime / 12);
    const methodFactor = method === 'kinetic' ? 0.86 : method === 'gravity' ? 0.62 : 0.74;
    const success = Math.round(Math.min(99, 35 + leadFactor * 45 + methodFactor * 18 - diameter / 30));
    return { massKg, megatons, success: Math.max(5, success) };
  }, [diameter, velocity, leadTime, method]);

  const engage = () => {
    setEngaged(true);
    onAddJournalLog(`🛡️ [PLANETARY DEFENSE] ${methodLabels[method]} engaged against ${diameter} m object at ${velocity} km/s with ${leadTime} years lead time; modeled success ${analysis.success}%.`);
  };

  return (
    <section className="grid w-full gap-4 text-slate-100 lg:grid-cols-[1.05fr_0.95fr]" aria-label="Planetary defense simulator">
      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-emerald-400/25 bg-gradient-to-br from-emerald-500/10 via-slate-950 to-cyan-500/10 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-300" />
            <div>
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-emerald-200">Near-Earth Object Deflector</h2>
              <p className="text-[11px] text-slate-400">Educational planetary-defense scenario</p>
            </div>
          </div>

          {[
            { id: 'asteroid-diameter', label: 'Object diameter', value: diameter, min: 20, max: 1000, step: 10, unit: 'm', setter: setDiameter },
            { id: 'asteroid-velocity', label: 'Relative velocity', value: velocity, min: 8, max: 45, step: 1, unit: 'km/s', setter: setVelocity },
            { id: 'asteroid-lead-time', label: 'Warning lead time', value: leadTime, min: 1, max: 25, step: 1, unit: 'years', setter: setLeadTime },
          ].map((control) => (
            <label key={control.id} htmlFor={control.id} className="mb-3 block rounded-lg border border-slate-800 bg-slate-950/70 p-3 last:mb-0">
              <span className="mb-2 flex justify-between font-mono text-[11px] uppercase text-slate-400"><span>{control.label}</span><strong className="text-emerald-300">{control.value} {control.unit}</strong></span>
              <input id={control.id} type="range" min={control.min} max={control.max} step={control.step} value={control.value} onChange={(event) => control.setter(Number(event.target.value))} className="h-2 w-full accent-emerald-400" />
            </label>
          ))}
        </div>

        <fieldset className="rounded-xl border border-slate-800 bg-slate-950/75 p-4">
          <legend className="px-1 font-mono text-[10px] uppercase tracking-wide text-slate-500">Deflection architecture</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {(Object.keys(methodLabels) as DeflectionMethod[]).map((option) => (
              <button key={option} type="button" onClick={() => { setMethod(option); setEngaged(false); }} className={`rounded-lg border p-3 text-left transition ${method === option ? 'border-emerald-300 bg-emerald-400/15' : 'border-slate-800 bg-slate-900/50 hover:border-slate-600'}`} aria-pressed={method === option}>
                <div className="font-mono text-[10px] uppercase text-slate-200">{methodLabels[option]}</div>
                <div className="mt-1 text-[9px] leading-relaxed text-slate-500">{option === 'kinetic' ? 'Fast momentum transfer' : option === 'gravity' ? 'Slow precision tug' : 'Continuous surface thrust'}</div>
              </button>
            ))}
          </div>
        </fieldset>

        <button type="button" onClick={engage} className="flex items-center justify-center gap-2 rounded-lg border border-emerald-300/45 bg-emerald-400/15 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-emerald-100 transition hover:bg-emerald-400/25">
          <Crosshair className="h-4 w-4" /> Engage deflection plan
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-xl border border-emerald-400/20 bg-slate-950">
          <div className="absolute h-48 w-48 animate-spin-slow rounded-full border border-dashed border-emerald-400/25" />
          <div className="absolute h-36 w-36 rounded-full border border-cyan-400/20" />
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/20 text-5xl shadow-[0_0_40px_rgba(59,130,246,.35)]">🌍</div>
          <div className="absolute right-[14%] top-[20%] h-8 w-8 rounded-full bg-stone-500 shadow-[0_0_16px_rgba(251,146,60,.45)]" />
          <Radar className="absolute bottom-4 left-4 h-5 w-5 animate-pulse text-emerald-300" />
          <div className="absolute bottom-4 right-4 font-mono text-[9px] text-emerald-300">TRACK LOCKED</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <Zap className="mb-2 h-4 w-4 text-amber-300" />
            <div className="text-[9px] uppercase tracking-wider text-slate-500">Impact energy</div>
            <div className="mt-1 font-mono text-[11px] text-slate-200">{analysis.megatons.toLocaleString(undefined, { maximumFractionDigits: 1 })} Mt TNT</div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <AlertTriangle className="mb-2 h-4 w-4 text-orange-300" />
            <div className="text-[9px] uppercase tracking-wider text-slate-500">Object mass</div>
            <div className="mt-1 font-mono text-[11px] text-slate-200">{analysis.massKg.toExponential(2)} kg</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-4">
          <div className="mb-2 flex justify-between font-mono text-[10px] uppercase text-slate-400"><span>Modeled success probability</span><strong className="text-emerald-300">{analysis.success}%</strong></div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-900"><div className="h-full bg-emerald-400 transition-all" style={{ width: `${analysis.success}%` }} /></div>
          <p className="mt-3 text-[10px] leading-relaxed text-slate-500">Long warning time has the strongest effect. This score is illustrative and is not a real mission-design or hazard-prediction model.</p>
        </div>

        <div className={`rounded-lg border p-3 ${engaged ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-slate-800 bg-slate-950/70'}`}>
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-300">Defense state</div>
          <p className="mt-1 text-xs text-slate-400">{engaged ? `${methodLabels[method]} sequence active. Course correction telemetry archived.` : 'Tracking solution ready. Deflection system on standby.'}</p>
        </div>

        <button type="button" onClick={() => onAddJournalLog(`💾 [NEO ASSESSMENT] ${diameter} m diameter; ${velocity} km/s; ${leadTime}-year warning; ${methodLabels[method]}; estimated success ${analysis.success}%.`)} className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 font-mono text-[10px] uppercase text-slate-300 hover:border-emerald-400/50">
          <Save className="h-4 w-4" /> Save threat assessment
        </button>
      </div>
    </section>
  );
}
