import type { HistoricalScan, SimulationInputs } from "../types";

export const PRESET_INPUTS: Record<string, SimulationInputs> = {
  "scan-california": {
    location: "California Forestlands (Dry Season)",
    temperature: 41,
    humidity: 9,
    windSpeed: 38,
    precipitation: 0,
    seismicActivity: 1.2,
    cropHealthIndex: 45,
    infrastructureLoad: 85,
    waterPh: 6.8,
    customScenario:
      "Severe heatwave. Dry winds gusting through parched chaparral. Power companies considering public safety shutoffs.",
  },
  "scan-mumbai": {
    location: "Mumbai Metropolitan Area",
    temperature: 29,
    humidity: 95,
    windSpeed: 25,
    precipitation: 45,
    seismicActivity: 0.5,
    cropHealthIndex: 80,
    infrastructureLoad: 92,
    waterPh: 6.2,
    customScenario:
      "Heavy monsoon rains. Main drainage pipes blocked, local river water levels near danger marks. High morning commute traffic.",
  },
  "scan-tokyo": {
    location: "Tokyo Coastal Zone",
    temperature: 26,
    humidity: 88,
    windSpeed: 65,
    precipitation: 28,
    seismicActivity: 2.1,
    cropHealthIndex: 75,
    infrastructureLoad: 80,
    waterPh: 7.1,
    customScenario:
      "Typhoon approaching from the south-east. Wind speeds rising fast. Power substations monitored for grid instability.",
  },
  "scan-kansas": {
    location: "Kansas Corn Belt (Agricultural)",
    temperature: 32,
    humidity: 35,
    windSpeed: 15,
    precipitation: 2,
    seismicActivity: 0.1,
    cropHealthIndex: 58,
    infrastructureLoad: 30,
    waterPh: 7,
    customScenario:
      "Extended hot spell during corn pollination. Early spots of leaf blight reported. Low moisture levels in shallow soils.",
  },
};

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString();

export const DEMO_SCANS: HistoricalScan[] = [
  {
    id: "scan-california",
    locationName: "California Forestlands (Dry Season)",
    overallThreatScore: 88,
    threatGrade: "CRITICAL",
    awarenessLevel: 5,
    timestamp: minutesAgo(15),
    summary:
      "Critically high temperatures and single-digit humidity trigger acute fire warnings. Dry brush and strong wind gusts create severe fire-propagation risk.",
  },
  {
    id: "scan-mumbai",
    locationName: "Mumbai Metropolitan Area",
    overallThreatScore: 82,
    threatGrade: "CRITICAL",
    awarenessLevel: 5,
    timestamp: minutesAgo(45),
    summary:
      "Intense monsoonal rain and saturated drainage channels produce severe urban flood and traffic-disruption alerts.",
  },
  {
    id: "scan-tokyo",
    locationName: "Tokyo Coastal Zone",
    overallThreatScore: 72,
    threatGrade: "SEVERE",
    awarenessLevel: 4,
    timestamp: minutesAgo(120),
    summary:
      "Pre-typhoon pressure changes and strong coastal gusts indicate elevated wind, flood, and power-grid risk.",
  },
  {
    id: "scan-kansas",
    locationName: "Kansas Corn Belt (Agricultural)",
    overallThreatScore: 38,
    threatGrade: "MODERATE",
    awarenessLevel: 2,
    timestamp: minutesAgo(240),
    summary:
      "Low soil moisture and crop stress create a moderate agricultural-risk profile while infrastructure risks remain comparatively low.",
  },
];
