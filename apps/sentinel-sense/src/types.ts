export interface HazardCategory {
  id: 'flood' | 'fire' | 'typhoon' | 'crop_disease' | 'medical_emergency' | 'traffic' | 'power_outage' | 'water_quality' | 'earthquake';
  name: string;
  riskLevel: number; // 0 to 100
  confidenceScore: number; // 0 to 100 (AI Confidence Engine)
  severity: 'Stable' | 'Attention' | 'Elevated' | 'Critical' | 'Emergency'; // Severity level
  statusText: string; // e.g., "Elevated Activity"
  analysis: string; // Brief 1-2 sentence AI description
  indicators: string[]; // e.g., ["Precipitation: 45mm/h", "Saturated soils"]
  actions: string[]; // Actionable guidelines
}

export interface PredictionResult {
  id: string;
  locationName: string;
  overallThreatScore: number; // 0 to 100
  threatGrade: 'LOW' | 'MODERATE' | 'ELEVATED' | 'SEVERE' | 'CRITICAL';
  awarenessLevel: 1 | 2 | 3 | 4 | 5; // Level 1 - 5 Awareness
  confidenceScore: number; // Overall Confidence
  summary: string;
  categories: HazardCategory[];
  senseAlerts: string[]; // Spidey-sense indicators
  timestamp: string;
  inputs?: SimulationInputs;
  fallbackActive?: boolean;
  rateLimited?: boolean;
  highDemand?: boolean;
  errorMessage?: string;
  engine?: string;
}

export interface SimulationInputs {
  location: string;
  temperature: number; // in C
  humidity: number; // in %
  windSpeed: number; // in km/h
  precipitation: number; // in mm/h
  seismicActivity: number; // Richter-scale index (0 to 10)
  cropHealthIndex: number; // Normalized (0 to 100)
  infrastructureLoad: number; // Normalized (0 to 100)
  waterPh: number; // pH scale (0 to 14)
  customScenario: string; // Text field
}

export interface HistoricalScan {
  id: string;
  locationName: string;
  overallThreatScore: number;
  threatGrade: 'LOW' | 'MODERATE' | 'ELEVATED' | 'SEVERE' | 'CRITICAL';
  awarenessLevel: 1 | 2 | 3 | 4 | 5;
  timestamp: string;
  summary: string;
}
