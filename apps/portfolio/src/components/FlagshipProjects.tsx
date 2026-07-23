import React from "react";
import { ArrowUpRight, Cpu, Github, Layers3, Sparkles } from "lucide-react";
import { flagshipProjects } from "../data/flagshipProjects";

type Props = {
  onOpen: (slug: string) => void;
};

const accentMap = {
  cyan: {
    border: "hover:border-cyan-400/50",
    glow: "from-cyan-500/25",
    text: "text-cyan-300",
    badge: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
    button: "border-cyan-400/30 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/15",
  },
  emerald: {
    border: "hover:border-emerald-400/50",
    glow: "from-emerald-500/25",
    text: "text-emerald-300",
    badge: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    button: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/15",
  },
  violet: {
    border: "hover:border-violet-400/50",
    glow: "from-violet-500/25",
    text: "text-violet-300",
    badge: "border-violet-400/25 bg-violet-400/10 text-violet-200",
    button: "border-violet-400/30 bg-violet-400/10 text-violet-100 hover:bg-violet-400/15",
  },
};

export default function FlagshipProjects({ onOpen }: Props) {
  return (
    <section id="featured-projects" className="relative overflow-hidden border-t border-slate-900 bg-slate-950 px-4 py-24 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_38%)]" />
      <div className="relative mx-auto max-w-7xl space-y-12">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr] lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Flagship Systems
            </div>
            <h2 className="max-w-4xl font-display text-4xl font-black tracking-tight text-white sm:text-6xl">
              {flagshipProjects.length} systems. One portfolio.
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">
              My flagship projects are presented as complete, launchable experiences. Each system keeps its own visual identity while living inside one unified Sammium portfolio architecture.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/35 p-5 text-sm leading-6 text-slate-400 backdrop-blur-sm">
            <div className="mb-2 flex items-center gap-2 text-slate-200">
              <Layers3 className="h-4 w-4 text-cyan-300" />
              Integrated architecture
            </div>
            Static workspaces are isolated and lazy-loaded, while production deployments open through their live services. This protects initial load speed and prevents dependency conflicts.
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {flagshipProjects.map((project, index) => {
            const accent = accentMap[project.accent];
            return (
              <article
                key={project.slug}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-900/45 transition duration-500 ${accent.border}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={project.preview}
                    alt={`${project.title} interface preview`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${accent.glow} via-slate-950/15 to-transparent`} />
                  <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-3">
                    <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] backdrop-blur-md ${accent.badge}`}>
                      {project.status}
                    </span>
                    <span className="rounded-full border border-white/10 bg-slate-950/65 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-slate-300 backdrop-blur-md">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  <div className="space-y-2">
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${accent.text}`}>{project.eyebrow}</p>
                    <h3 className="font-display text-2xl font-black tracking-tight text-white">{project.title}</h3>
                    <p className="text-sm leading-6 text-slate-400">{project.description}</p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2">
                        <Cpu className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accent.text}`} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-md border border-slate-800 bg-slate-950/70 px-2 py-1 text-[9px] font-medium text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className={`grid gap-2 ${project.sourcePath ? "grid-cols-[minmax(0,1fr)_auto]" : "grid-cols-1"}`}>
                    <button
                      type="button"
                      onClick={() => onOpen(project.slug)}
                      aria-label={`Launch ${project.title} complete experience`}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] transition ${accent.button}`}
                    >
                      Launch complete experience
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                    {project.sourcePath && (
                      <a
                        href={project.sourcePath}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${project.title} source code on GitHub`}
                        title="View source code"
                        className={`grid min-h-11 min-w-11 place-items-center rounded-xl border transition ${accent.button}`}
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
