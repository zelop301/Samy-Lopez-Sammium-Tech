import React from "react";
import { ChevronDown, Code2, Sparkles, Terminal, ArrowRight } from "lucide-react";
import cosmicNebula from "../assets/images/cosmic_nebula_banner_1784106863105.jpg";
import samHeadshot from "../assets/images/sam_lopez_profile_1784109885244.jpg";

export default function Hero() {
  const handleScrollToProjects = () => {
    const element = document.getElementById("featured-projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 py-24 px-4 sm:px-6 lg:px-8"
    >
      {/* Cinematic Background Nebula Image with Blurs and Grid Lines */}
      <div className="absolute inset-0 z-0">
        <img
          src={cosmicNebula}
          alt="Cosmic Space Backdrop"
          className="w-full h-full object-cover opacity-35 select-none scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Deep dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/70 to-slate-950" />
        
        {/* Subtle grid lines background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.15)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Futuristic Floating Accent Light Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />

      {/* Centered Main Cinematic Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 flex flex-col items-center">
        
        {/* Animated Avatar with Cyber Reticle Overlay */}
        <div className="relative group">
          {/* Circular HUD Ring Background Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full opacity-40 blur-md group-hover:opacity-75 group-hover:scale-105 transition-all duration-1000" />
          
          {/* Outer Sci-Fi Rotating Ring */}
          <div className="absolute -inset-2.5 rounded-full border border-dashed border-blue-400/30 animate-[spin_40s_linear_infinite]" />
          <div className="absolute -inset-1.5 rounded-full border border-double border-emerald-400/20 animate-[spin_20s_linear_infinite_reverse]" />

          {/* Solid Rounded Border Container for Image */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-slate-800 bg-slate-950 flex items-center justify-center shadow-2xl">
            <img
              src={samHeadshot}
              alt="Sam Lopez Headshot"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Quick Online Tech Badge */}
          <span className="absolute bottom-2 right-2 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950"></span>
          </span>
        </div>

        {/* Small Intro Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 backdrop-blur-md shadow-lg shadow-black/50">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-mono tracking-widest text-emerald-300 font-bold uppercase">
            FOUNDER @ SAMMIUM TECH
          </span>
          <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
        </div>

        {/* Cinematic Headline */}
        <div className="space-y-4 max-w-3xl">
          <span className="text-[11px] font-mono tracking-[0.25em] text-blue-400 block font-bold uppercase">
            PROJECT INFINITY
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-sm">
            Building Intelligent Systems,<br />
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-md">
              Scientific Visualizations,<br />and AI Experiences.
            </span>
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base font-sans max-w-2xl mx-auto leading-relaxed font-normal pt-1">
            I design immersive AI interfaces, scientific visualizations, and interactive digital experiences that explore the future of intelligent systems. Through Sammium Tech, I experiment with concepts ranging from AI operating systems to quantum-inspired simulations and research dashboards.
          </p>
        </div>

        {/* Interactive KPI Counter Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-xl pt-2">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-850 p-3 rounded-xl text-center">
            <div className="text-lg font-bold text-white font-mono">Sammium ONE</div>
            <div className="text-[9px] text-slate-400 font-mono tracking-wide uppercase">AI Operating System</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-850 p-3 rounded-xl text-center">
            <div className="text-lg font-bold text-white font-mono">Quantum Univ.</div>
            <div className="text-[9px] text-slate-400 font-mono tracking-wide uppercase">Scientific Viz</div>
          </div>
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-850 p-3 rounded-xl text-center col-span-2 sm:col-span-1">
            <div className="text-lg font-bold text-emerald-400 font-mono">Live Labs</div>
            <div className="text-[9px] text-slate-400 font-mono tracking-wide uppercase">Interactive Simulators</div>
          </div>
        </div>

        {/* Action Button Links */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-4 w-full sm:w-auto">
          <button
            onClick={handleScrollToProjects}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-xs font-bold font-mono tracking-wider shadow-lg shadow-emerald-600/10 hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition duration-200 cursor-pointer uppercase"
          >
            EXPLORE PROJECTS
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold font-mono tracking-wider transition duration-200 uppercase"
          >
            READ BUILDER STORY
          </a>
        </div>

        {/* Scroll Indicator Chevron */}
        <div className="pt-8 animate-bounce opacity-50">
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </div>

      </div>
    </section>
  );
}
