import React, { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Github, LoaderCircle, Maximize2, RotateCcw } from "lucide-react";
import { getFlagshipProject } from "../data/flagshipProjects";

type Props = {
  slug: string;
  onBack: () => void;
};

export default function FlagshipProjectExperience({ slug, onBack }: Props) {
  const project = getFlagshipProject(slug);
  const [frameKey, setFrameKey] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = project ? `${project.title} | Sam Lopez` : "Project | Sam Lopez";
    return () => {
      document.title = "Sam Lopez | AI Architect & Product Builder";
    };
  }, [project]);

  if (!project) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-center text-white">
        <div className="space-y-4">
          <p className="text-sm text-slate-400">This project route does not exist.</p>
          <button onClick={onBack} className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-900">
            Return to portfolio
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Portfolio
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{project.title}</p>
            <p className="truncate text-[10px] uppercase tracking-[0.16em] text-slate-500">{project.status}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLoaded(false);
              setFrameKey((value) => value + 1);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-900"
          >
            <RotateCcw className="h-4 w-4" />
            Reload
          </button>
          {project.sourcePath && (
            <a
              href={project.sourcePath}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.title} source code on GitHub`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-900"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">Source</span>
            </a>
          )}
          <a
            href={project.demoPath}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
          >
            <Maximize2 className="h-4 w-4" />
            Full screen
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      <div className="border-b border-amber-400/15 bg-amber-400/5 px-4 py-2 text-center text-[10px] leading-5 text-amber-100/75 sm:text-xs">
        {project.deploymentNote ??
          "GitHub Pages runs this as a static interactive demo. Features that call Gemini or Express require the project backend to be deployed separately."}
      </div>

      <section className="relative flex-1 bg-black">
        {!loaded && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-slate-950">
            <div className="flex flex-col items-center gap-4 text-center">
              <LoaderCircle className="h-8 w-8 animate-spin text-cyan-300" />
              <div>
                <p className="text-sm font-semibold text-white">Initializing {project.title}</p>
                <p className="mt-1 max-w-lg px-6 text-xs leading-5 text-slate-500">
                  {project.deploymentNote ?? "The full project is loaded only when you launch it."}
                </p>
              </div>
            </div>
          </div>
        )}
        <iframe
          key={frameKey}
          src={project.demoPath}
          title={`${project.title} interactive experience`}
          onLoad={() => setLoaded(true)}
          className="h-[calc(100vh-4rem)] min-h-[680px] w-full border-0 bg-black"
          allow="fullscreen; clipboard-read; clipboard-write; microphone; autoplay"
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </section>
    </main>
  );
}
