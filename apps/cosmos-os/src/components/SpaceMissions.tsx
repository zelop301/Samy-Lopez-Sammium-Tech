import { useMemo, useState } from 'react';
import { Gauge, Orbit, Rocket, Satellite, Save, Timer } from 'lucide-react';

interface SpaceMissionsProps {
  onAddJournalLog: (message: string) => void;
}

const EARTH_RADIUS_KM = 6371;
const EARTH_MU = 398600.4418;

export default function SpaceMissions({ onAddJournalLog }: SpaceMissionsProps) {
  const [altitude, setAltitude] = useState(420);
  const [inclination, setInclination] = useState(51.6);
  const [payload, setPayload] = useState(1200);
  const [launched, setLaunched] = useState(false);

  const mission = useMemo(() => {
    const radius = EARTH_RADIUS_KM + altitude;
    const velocity = Math.sqrt(EARTH_MU / radius);
    const periodMinutes = (2 * Math.PI * Math.sqrt(radius ** 3 / EARTH_MU)) / 60;
    const roughDeltaV = 7.8 + Math.max(0, altitude - 200) * 0.00008 + payload * 0.00002;
    return { radius, velocity, periodMinutes, roughDeltaV };
  }, [altitude, payload]);

  const launch = () => {
    setLaunched(true);
    onAddJournalLog(`🚀 [MISSION INSERTION] Payload ${payload} kg placed at ${altitude} km, inclination ${inclination.toFixed(1)}°, orbital speed ${mission.velocity.toFixed(2)} km/s, period ${mission.periodMinutes.toFixed(1)} min.`);
  };

  return (
    <section className="grid w-full gap-4 text-slate-100 lg:grid-cols-[1fr_1fr]" aria-label="Space mission planner">
      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-cyan-400/25 bg-gradient-to-br from-cyan-500/10 via-slate-950 to-blue-500/10 p-4">
          <div className="mb-4 flex items-center gap-2">
            <Rocket className="h-5 w-5 text-cyan-300" />
            <div>
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-200">Orbit Insertion Planner</h2>
              <p className="text-[11px] text-slate-400">Simplified circular Earth orbit calculator</p>
            </div>
          </div>

          {[
            { id: 'mission-altitude', label: 'Target altitude', value: altitude, min: 160, max: 36000, step: 10, unit: 'km', setter: setAltitude },
            { id: 'mission-inclination', label: 'Orbital inclination', value: inclination, min: 0, max: 98, step: 0.1, unit: '°', setter: setInclination },
            { id: 'mission-payload', label: 'Payload mass', value: payload, min: 50, max: 12000, step: 50, unit: 'kg', setter: setPayload },
          ].map((control) => (
            <label key={control.id} htmlFor={control.id} className="mb-3 block rounded-lg border border-slate-800 bg-slate-950/70 p-3 last:mb-0">
              <span className="mb-2 flex justify-between font-mono text-[11px] uppercase text-slate-400"><span>{control.label}</span><strong className="text-cyan-300">{control.value.toLocaleString()} {control.unit}</strong></span>
              <input id={control.id} type="range" min={control.min} max={control.max} step={control.step} value={control.value} onChange={(event) => control.setter(Number(event.target.value))} className="h-2 w-full accent-cyan-400" />
            </label>
          ))}
        </div>

        <button type="button" onClick={launch} className="flex items-center justify-center gap-2 rounded-lg border border-cyan-300/45 bg-cyan-400/15 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-cyan-100 transition hover:bg-cyan-400/25">
          <Rocket className="h-4 w-4" /> Execute insertion burn
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative flex min-h-56 items-center justify-center overflow-hidden rounded-xl border border-blue-400/20 bg-slate-950">
          <div className="absolute h-48 w-48 rounded-full border border-dashed border-cyan-400/30" style={{ transform: `rotate(${inclination}deg)` }} />
          <div className="absolute h-40 w-40 animate-spin-slow rounded-full border-t border-cyan-300/80" />
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/20 text-5xl shadow-[0_0_40px_rgba(59,130,246,.35)]">🌍</div>
          <Satellite className="absolute right-[20%] top-[22%] h-6 w-6 animate-pulse text-cyan-200" />
          <div className="absolute bottom-3 font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500">Trajectory preview · not to scale</div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Gauge, label: 'Circular velocity', value: `${mission.velocity.toFixed(3)} km/s` },
            { icon: Timer, label: 'Orbital period', value: `${mission.periodMinutes.toFixed(1)} min` },
            { icon: Orbit, label: 'Orbital radius', value: `${mission.radius.toLocaleString(undefined, { maximumFractionDigits: 0 })} km` },
            { icon: Rocket, label: 'Estimated Δv', value: `${mission.roughDeltaV.toFixed(2)} km/s` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
              <Icon className="mb-2 h-4 w-4 text-cyan-300" />
              <div className="text-[9px] uppercase tracking-wider text-slate-500">{label}</div>
              <div className="mt-1 font-mono text-[11px] text-slate-200">{value}</div>
            </div>
          ))}
        </div>

        <div className={`rounded-lg border p-3 ${launched ? 'border-emerald-400/30 bg-emerald-400/10' : 'border-amber-400/20 bg-amber-400/5'}`}>
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-300">Mission status</div>
          <p className="mt-1 text-xs text-slate-400">{launched ? 'Nominal orbit acquired. Telemetry archived.' : 'Flight solution ready. Awaiting insertion command.'}</p>
        </div>

        <button type="button" onClick={() => onAddJournalLog(`💾 [FLIGHT PLAN] ${altitude} km circular orbit; ${inclination.toFixed(1)}° inclination; ${payload} kg payload; predicted period ${mission.periodMinutes.toFixed(1)} min.`)} className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 font-mono text-[10px] uppercase text-slate-300 hover:border-cyan-400/50">
          <Save className="h-4 w-4" /> Save flight plan
        </button>
      </div>
    </section>
  );
}
