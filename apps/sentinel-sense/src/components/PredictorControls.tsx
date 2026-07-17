import React, { useState } from "react";
import { Sliders, RefreshCw, Send, HelpCircle, Landmark, Cpu } from "lucide-react";
import { SimulationInputs } from "../types";

interface PredictorControlsProps {
  onTriggerScan: (inputs: SimulationInputs) => void;
  isScanning: boolean;
  forceLocal?: boolean;
  onToggleForceLocal?: (val: boolean) => void;
}

const PRESET_DATA = {
  california: {
    location: "California Forestlands (Dry Season)",
    temperature: 41,
    humidity: 9,
    windSpeed: 38,
    precipitation: 0,
    seismicActivity: 1.2,
    cropHealthIndex: 45,
    infrastructureLoad: 85,
    waterPh: 6.8,
    customScenario: "Severe heatwave. Dry winds gusting through parched chaparral. Power companies considering public safety shutoffs."
  },
  mumbai: {
    location: "Mumbai Metropolitan Area",
    temperature: 29,
    humidity: 95,
    windSpeed: 25,
    precipitation: 45,
    seismicActivity: 0.5,
    cropHealthIndex: 80,
    infrastructureLoad: 92,
    waterPh: 6.2,
    customScenario: "Heavy monsoon rains. Main drainage pipes blocked, local river water levels near danger marks. High morning commute traffic."
  },
  tokyo: {
    location: "Tokyo Coastal Zone",
    temperature: 26,
    humidity: 88,
    windSpeed: 65,
    precipitation: 28,
    seismicActivity: 2.1,
    cropHealthIndex: 75,
    infrastructureLoad: 80,
    waterPh: 7.1,
    customScenario: "Typhoon approaching from the south-east. Wind speeds rising fast. Power substations monitored for grid instability."
  },
  kansas: {
    location: "Kansas Corn Belt (Agricultural)",
    temperature: 32,
    humidity: 35,
    windSpeed: 15,
    precipitation: 2,
    seismicActivity: 0.1,
    cropHealthIndex: 58,
    infrastructureLoad: 30,
    waterPh: 7.0,
    customScenario: "Extended hot spell during corn pollination. Early spots of leaf blight reported. Low moisture levels in shallow soils."
  },
  pacific_ring: {
    location: "Kyoto Mountain Foot",
    temperature: 18,
    humidity: 60,
    windSpeed: 10,
    precipitation: 0,
    seismicActivity: 6.8,
    cropHealthIndex: 90,
    infrastructureLoad: 75,
    waterPh: 7.2,
    customScenario: "Sudden tectonic tremor registered at 6.8 magnitude. Critical bridge inspections initiated, high threat of power transformer failures."
  }
};

export default function PredictorControls({
  onTriggerScan,
  isScanning,
  forceLocal = false,
  onToggleForceLocal
}: PredictorControlsProps) {
  const [inputs, setInputs] = useState<SimulationInputs>({
    location: "California Forestlands (Dry Season)",
    temperature: 41,
    humidity: 9,
    windSpeed: 38,
    precipitation: 0,
    seismicActivity: 1.2,
    cropHealthIndex: 45,
    infrastructureLoad: 85,
    waterPh: 6.8,
    customScenario: "Severe heatwave. Dry winds gusting through parched chaparral. Power companies considering public safety shutoffs."
  });

  const handleSliderChange = (field: keyof SimulationInputs, val: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleSelectPreset = (presetKey: string) => {
    if (presetKey in PRESET_DATA) {
      setInputs(PRESET_DATA[presetKey as keyof typeof PRESET_DATA]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerScan(inputs);
  };

  const handleReset = () => {
    setInputs({
      location: "Metropolitan Delta Zone",
      temperature: 25,
      humidity: 50,
      windSpeed: 15,
      precipitation: 0,
      seismicActivity: 0.0,
      cropHealthIndex: 80,
      infrastructureLoad: 40,
      waterPh: 7.0,
      customScenario: ""
    });
  };

  return (
    <div id="predictor-controls" className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5 mb-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-red-500 animate-pulse" />
            <h2 className="text-sm font-mono uppercase tracking-widest text-zinc-100 font-bold">
              Telemetry Simulator
            </h2>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Reset Controls
          </button>
        </div>

        {/* Predictive Compute Core Engine Selector */}
        <div className="mb-5 bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-950/30 border border-red-900/40 text-red-400 rounded-xl mt-0.5">
              <Cpu className="w-4 h-4 text-red-500 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider text-red-400 uppercase block font-extrabold">
                PREDICTIVE COMPUTE CORE
              </span>
              <span className="text-[11px] text-zinc-400 font-sans block mt-0.5">
                Set computing framework for telemetry & multi-hazard risk analysis.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-900 p-1 rounded-xl w-full md:w-auto">
            <button
              type="button"
              onClick={() => onToggleForceLocal?.(false)}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer text-center ${
                !forceLocal
                  ? "bg-red-950/40 border border-red-800/60 text-red-400 shadow-[0_0_15px_rgba(193,18,31,0.2)]"
                  : "border border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Gemini AI
            </button>
            <button
              type="button"
              onClick={() => onToggleForceLocal?.(true)}
              className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold tracking-wider transition-all duration-300 cursor-pointer text-center ${
                forceLocal
                  ? "bg-red-950/40 border border-red-800/60 text-red-400 shadow-[0_0_15px_rgba(193,18,31,0.2)]"
                  : "border border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Local Engine
            </button>
          </div>
        </div>

        {/* Preset Selector Badges */}
        <div className="mb-6">
          <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block mb-2.5">
            Load Historical Baseline Presets
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
              { id: "california", name: "🔥 Wildfire" },
              { id: "mumbai", name: "🌧 Monsoon" },
              { id: "tokyo", name: "🌪 Typhoon" },
              { id: "kansas", name: "🌱 Ag Blight" },
              { id: "pacific_ring", name: "🌋 Seismic" }
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className="px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-red-500/50 text-[11px] font-medium text-zinc-300 transition-all duration-200 text-left truncate flex items-center justify-between cursor-pointer"
              >
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location input */}
          <div>
            <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block mb-1.5">
              TARGET SECTOR / REGION
            </label>
            <input
              type="text"
              required
              value={inputs.location}
              onChange={(e) => handleSliderChange("location", e.target.value)}
              placeholder="e.g., California Hills, Mumbai Core, etc."
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-lg px-3 py-2 text-xs font-sans text-zinc-200 placeholder-zinc-600 transition-all"
            />
          </div>

          {/* Grid sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span>🌡 TEMPERATURE</span>
                <span className="text-red-400 font-bold">{inputs.temperature}°C</span>
              </div>
              <input
                type="range"
                min="-10"
                max="50"
                step="1"
                value={inputs.temperature}
                onChange={(e) => handleSliderChange("temperature", parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Humidity Slider */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span>💧 RELATIVE HUMIDITY</span>
                <span className="text-zinc-300 font-bold">{inputs.humidity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={inputs.humidity}
                onChange={(e) => handleSliderChange("humidity", parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Wind Speed */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span>🌪 WIND VELOCITY</span>
                <span className="text-zinc-300 font-bold">{inputs.windSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                value={inputs.windSpeed}
                onChange={(e) => handleSliderChange("windSpeed", parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Precipitation */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span>🌧 PRECIPITATION RATE</span>
                <span className="text-zinc-300 font-bold">{inputs.precipitation} mm/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={inputs.precipitation}
                onChange={(e) => handleSliderChange("precipitation", parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Seismic Activity */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span>🌋 SEISMIC STRESS (0-10)</span>
                <span className="text-zinc-300 font-bold">{inputs.seismicActivity} Richter</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={inputs.seismicActivity}
                onChange={(e) => handleSliderChange("seismicActivity", parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Crop Health Index */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span>🌱 VEGETATION HEALTH</span>
                <span className="text-zinc-300 font-bold">{inputs.cropHealthIndex}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={inputs.cropHealthIndex}
                onChange={(e) => handleSliderChange("cropHealthIndex", parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Infrastructure Grid Load */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span>⚡ GRID / TRANSIT CAPACITY</span>
                <span className="text-zinc-300 font-bold">{inputs.infrastructureLoad}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={inputs.infrastructureLoad}
                onChange={(e) => handleSliderChange("infrastructureLoad", parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            {/* Water pH */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
                <span>🌊 AQUATIC pH READING</span>
                <span className="text-zinc-300 font-bold">pH {inputs.waterPh}</span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                step="0.1"
                value={inputs.waterPh}
                onChange={(e) => handleSliderChange("waterPh", parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
          </div>

          {/* Custom Scenario String */}
          <div className="pt-2">
            <label className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block mb-1.5 flex items-center gap-1">
              <span>CUSTOM ENVIRONMENTAL SCENARIOS / HAZARD CONTEXT</span>
              <span title="Describe dynamic triggers such as grid lock, solar storms, volcanic ash, or dry lightning."><HelpCircle className="w-3 h-3 text-zinc-600 cursor-help" aria-hidden="true" /></span>
            </label>
            <textarea
              rows={2}
              value={inputs.customScenario}
              onChange={(e) => handleSliderChange("customScenario", e.target.value)}
              placeholder="e.g. Local dams near peak spill height. Forest lightning strike registered. Power transformer station reported temperature bypasses."
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-lg p-3 text-xs font-sans text-zinc-200 placeholder-zinc-600 transition-all resize-none"
            />
          </div>
        </form>
      </div>

      <div className="pt-6">
        <button
          id="btn-trigger-scan"
          type="button"
          disabled={isScanning}
          onClick={handleSubmit}
          className={`w-full py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 border cursor-pointer ${
            isScanning
              ? "bg-red-950/20 border-red-900 text-red-400 cursor-not-allowed"
              : "bg-red-950/30 border-red-800/80 text-red-400 hover:bg-red-900/40 hover:text-red-200 hover:border-red-600 shadow-[0_0_20px_rgba(193,18,31,0.15)] hover:shadow-[0_0_35px_rgba(193,18,31,0.3)]"
          }`}
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
              <span>Scanning Telemetry grids...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 animate-pulse text-red-500" />
              <span>Trigger Sentinel Scan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
