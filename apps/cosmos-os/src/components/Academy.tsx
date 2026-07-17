import { useState } from 'react';
import { BookOpen, CheckCircle2, GraduationCap, Lightbulb, RotateCcw, Telescope } from 'lucide-react';

const lessons = [
  {
    title: 'Galaxy Dynamics',
    level: 'Foundations',
    summary: 'Compare spiral and elliptical galaxies, rotation curves, stellar populations, and the evidence for dark-matter halos.',
    fact: 'Outer stars in many spiral galaxies move faster than visible matter alone predicts.',
  },
  {
    title: 'Black Hole Physics',
    level: 'Intermediate',
    summary: 'Explore event horizons, accretion disks, frame dragging, gravitational redshift, and the limits of simplified visual models.',
    fact: 'An event horizon is a causal boundary, not a material surface.',
  },
  {
    title: 'Quantum Measurement',
    level: 'Intermediate',
    summary: 'Learn how amplitudes become probabilities and why measurement outcomes differ from classical hidden-state intuition.',
    fact: 'Probability is obtained from the squared magnitude of a quantum amplitude.',
  },
  {
    title: 'Orbital Mechanics',
    level: 'Applied',
    summary: 'Connect orbital radius, velocity, period, inclination, and maneuver cost using idealized circular-orbit relationships.',
    fact: 'A higher circular orbit has lower orbital speed but a longer period.',
  },
];

const quiz = {
  question: 'Which observation strongly motivated dark-matter halo models for spiral galaxies?',
  answers: ['Flat outer rotation curves', 'Blue stellar color', 'Planetary seasons', 'Solar flares'],
  correct: 0,
};

export default function Academy() {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const lesson = lessons[lessonIndex];

  return (
    <section className="grid w-full gap-4 text-slate-100 lg:grid-cols-[0.8fr_1.2fr]" aria-label="Cosmos science academy">
      <aside className="rounded-xl border border-amber-400/20 bg-slate-950/75 p-4">
        <div className="mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-amber-300" />
          <div>
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-amber-200">Learning Tracks</h2>
            <p className="text-[11px] text-slate-500">Select a compact training module</p>
          </div>
        </div>

        <div className="space-y-2">
          {lessons.map((item, index) => (
            <button key={item.title} type="button" onClick={() => { setLessonIndex(index); setAnswer(null); }} className={`w-full rounded-lg border p-3 text-left transition ${lessonIndex === index ? 'border-amber-300/60 bg-amber-400/10' : 'border-slate-800 bg-slate-900/45 hover:border-slate-600'}`} aria-pressed={lessonIndex === index}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-200">{item.title}</span>
                <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-[8px] uppercase text-slate-500">{item.level}</span>
              </div>
              <div className="mt-1 font-mono text-[9px] text-slate-600">Module {String(index + 1).padStart(2, '0')}</div>
            </button>
          ))}
        </div>
      </aside>

      <div className="flex flex-col gap-3">
        <article className="rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 via-slate-950 to-amber-500/5 p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-cyan-300"><BookOpen className="h-4 w-4" /> Current lesson</div>
              <h3 className="text-lg font-bold text-white">{lesson.title}</h3>
            </div>
            <Telescope className="h-7 w-7 text-cyan-300/70" />
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{lesson.summary}</p>
          <div className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-amber-300"><Lightbulb className="h-4 w-4" /> Key idea</div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">{lesson.fact}</p>
          </div>
        </article>

        <div className="rounded-xl border border-violet-400/20 bg-slate-950/75 p-4">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-violet-300">Knowledge check</div>
          <p className="mb-3 text-sm font-medium text-slate-200">{quiz.question}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {quiz.answers.map((option, index) => {
              const selected = answer === index;
              const correct = answer !== null && index === quiz.correct;
              const wrong = selected && answer !== quiz.correct;
              return (
                <button key={option} type="button" onClick={() => setAnswer(index)} className={`rounded-lg border px-3 py-2 text-left text-xs transition ${correct ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-200' : wrong ? 'border-rose-400/50 bg-rose-400/10 text-rose-200' : selected ? 'border-violet-300 bg-violet-400/10 text-violet-200' : 'border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-600'}`}>
                  {option}
                </button>
              );
            })}
          </div>

          {answer !== null && (
            <div className={`mt-3 flex items-start gap-2 rounded-lg border p-3 text-xs ${answer === quiz.correct ? 'border-emerald-400/25 bg-emerald-400/5 text-emerald-200' : 'border-amber-400/25 bg-amber-400/5 text-amber-200'}`}>
              {answer === quiz.correct ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <RotateCcw className="mt-0.5 h-4 w-4 shrink-0" />}
              <span>{answer === quiz.correct ? 'Correct. Flat rotation curves indicate additional gravitating mass beyond the visible disk.' : 'Review the galaxy-dynamics lesson and try again.'}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
