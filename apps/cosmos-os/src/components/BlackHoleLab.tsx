import { useMemo } from 'react';
import { Activity, Atom, Gauge, Orbit, Radio, Save, Waves } from 'lucide-react';

interface BlackHoleLabProps {
  mass: number;
  setMass: (value: number) => void;
  spin: number;
  setSpin: (value: number) => void;
  charge: number;
  setCharge: (value: number) => void;
  accretion: number;
  setAccretion: (value: number) => void;
  distance: number;
  setDistance: (value: number) => void;
  onAddJournalLog: (message: string) => void;
}

interface ControlProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}

function Control({ id, label, value, min, max, step, unit, onChange }: ControlProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
      <span className="flex items-center justify-between gap-3 text-[11px] font-mono uppercase tracking-wide text-slate-400">
        {label}
        <strong className="text-cyan-300">{value.toFixed(step < 0.1 ? 2 : 1)} {unit}</strong>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer accent-cyan-400"
      />
    </label>
  );
}

export default function BlackHoleLab({
  mass,
  setMass,
  spin,
  setSpin,
  charge,
  setCharge,
  accretion,
  setAccretion,
  distance,
  setDistance,
  onAddJournalLog,
}: BlackHoleLabProps) {
  const metrics = useMemo(() => {
    const solarMasses = mass * 1_000_000;
    const schwarzschildRadiusKm = 2.953 * solarMasses;
    const normalizedTerm = Math.max(0, 1 - spin ** 2 - charge ** 2);
    const outerHorizonKm = (schwarzschildRadiusKm / 2) * (1 + Math.sqrt(normalizedTerm));
    const diskTemperatureMk = Math.max(0.1, (accretion / Math.max(mass, 0.1)) * 5.8);
    const observerRadius = Math.max(schwarzschildRadiusKm * 1.05, distance * 9.461e12);
    const dilation = Math.sqrt(Math.max(0.001, 1 - schwarzschildRadiusKm / observerRadius));

    return {
      solarMasses,
      schwarzschildRadiusKm,
      outerHorizonKm,
      diskTemperatureMk,
      dilation,
    };
  }, [mass, spin, charge, accretion, distance]);

  const saveSnapshot = () => {
    const time = new Date().toLocaleTimeString([], { hour12: false });
    onAddJournalLog(
      `⚫ [SINGULARITY LAB @ ${time}] Mass ${mass.toFixed(2)}M M☉ | spin ${spin.toFixed(2)} | charge ${charge.toFixed(2)} | event horizon ${metrics.outerHorizonKm.toExponential(2)} km | accretion ${accretion.toFixed(1)} M☉/yr.`,
    );
  };

  return (
    <section className="grid w-full gap-4 text-slate-100 lg:grid-cols-[1.1fr_0.9fr]" aria-label="Black hole laboratory controls">
      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-amber-400/25 bg-gradient-to-br from-amber-500/10 via-slate-950 to-violet-500/10 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Orbit className="h-5 w-5 text-amber-300" />
              <div>
                <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-amber-200">Kerr–Newman Sandbox</h2>
                <p className="text-[11px] text-slate-400">Educational, normalized parameters</p>
              </div>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 font-mono text-[9px] text-emerald-300">SIMULATION STABLE</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Control id="black-hole-mass" label="Mass" value={mass} min={0.5} max={15} step={0.1} unit="M M☉" onChange={setMass} />
            <Control id="black-hole-spin" label="Spin parameter" value={spin} min={0} max={0.99} step={0.01} unit="a*" onChange={setSpin} />
            <Control id="black-hole-charge" label="Charge ratio" value={charge} min={0} max={0.6} step={0.01} unit="Q*" onChange={setCharge} />
            <Control id="black-hole-accretion" label="Accretion rate" value={accretion} min={0} max={25} step={0.5} unit="M☉/yr" onChange={setAccretion} />
          </div>

          <div className="mt-3">
            <Control id="observer-distance" label="Observer distance" value={distance} min={8} max={80} step={1} unit="LY" onChange={setDistance} />
          </div>
        </div>

        <button
          type="button"
          onClick={saveSnapshot}
          className="flex items-center justify-center gap-2 rounded-lg border border-cyan-400/35 bg-cyan-400/10 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-cyan-200 transition hover:bg-cyan-400/20 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          <Save className="h-4 w-4" /> Save telemetry to journal
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative flex min-h-48 items-center justify-center overflow-hidden rounded-xl border border-violet-400/25 bg-slate-950">
          <div className="absolute h-44 w-44 animate-spin-slow rounded-full border border-dashed border-amber-300/50" />
          <div className="absolute h-32 w-32 animate-reverse-spin rounded-full border-8 border-violet-500/15 shadow-[0_0_45px_rgba(139,92,246,0.35)]" />
          <div className="h-20 w-20 rounded-full bg-black shadow-[0_0_24px_8px_rgba(0,0,0,1),0_0_60px_18px_rgba(245,158,11,0.22)]" />
          <div className="absolute bottom-3 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500">Relativistic field preview</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Atom, label: 'Mass', value: `${(metrics.solarMasses / 1_000_000).toFixed(2)}M M☉` },
            { icon: Orbit, label: 'Outer horizon', value: `${metrics.outerHorizonKm.toExponential(2)} km` },
            { icon: Waves, label: 'Schwarzschild radius', value: `${metrics.schwarzschildRadiusKm.toExponential(2)} km` },
            { icon: Activity, label: 'Disk temperature', value: `${metrics.diskTemperatureMk.toFixed(1)} MK` },
            { icon: Gauge, label: 'Clock-rate factor', value: metrics.dilation.toFixed(6) },
            { icon: Radio, label: 'Signal state', value: spin > 0.9 ? 'Frame drag high' : 'Nominal' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg border border-slate-800 bg-slate-950/75 p-3">
              <Icon className="mb-2 h-4 w-4 text-cyan-300" />
              <div className="text-[9px] uppercase tracking-wider text-slate-500">{label}</div>
              <div className="mt-1 break-words font-mono text-[11px] text-slate-200">{value}</div>
            </div>
          ))}
        </div>

        <p className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-[10px] leading-relaxed text-slate-400">
          Values are simplified educational approximations. Charge and spin are normalized to keep the visual sandbox numerically stable rather than model a specific observed black hole.
        </p>
      </div>
    </section>
  );
}
