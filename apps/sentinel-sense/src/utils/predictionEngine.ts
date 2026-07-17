import type { HazardCategory, PredictionResult, SimulationInputs } from "../types";

/**
 * Deterministic local hazard simulator used when the API is unavailable or
 * when users intentionally enable local-only mode. This keeps the demo fully
 * functional on static hosts without exposing an API key in the browser.
 */
export function getFallbackPrediction(inputs: Partial<SimulationInputs>): PredictionResult {
  const {
    location = "Simulated Zone",
    temperature = 25,
    humidity = 50,
    windSpeed = 15,
    precipitation = 0,
    seismicActivity = 0.5,
    cropHealthIndex = 80,
    infrastructureLoad = 40,
    waterPh = 7.0,
    customScenario = ""
  } = inputs;

  const normalizedInputs: SimulationInputs = {
    location,
    temperature,
    humidity,
    windSpeed,
    precipitation,
    seismicActivity,
    cropHealthIndex,
    infrastructureLoad,
    waterPh,
    customScenario,
  };

  // Compute calculated values based on sliders
  const floodRisk = Math.min(100, Math.round((precipitation * 1.8) + (humidity * 0.2)));
  const humidityPenalty = Math.max(0, 100 - humidity);
  const fireRisk = precipitation > 2 ? 5 : Math.min(100, Math.round((temperature * 1.5) + (humidityPenalty * 0.4) + (windSpeed * 0.4)));
  const typhoonRisk = Math.min(100, Math.round((windSpeed * 1.0) + (precipitation * 0.5) + (humidity * 0.1)));
  const cropDiseaseRisk = Math.min(100, Math.round((100 - cropHealthIndex) * 0.6 + (humidity * 0.4)));
  const tempExtremeness = Math.abs(temperature - 22) * 1.5;
  const disasterMultiplier = (fireRisk > 75 ? 30 : 0) + (typhoonRisk > 75 ? 30 : 0) + (seismicActivity > 5 ? 40 : 0);
  const medicalRisk = Math.min(100, Math.round(tempExtremeness + disasterMultiplier + (infrastructureLoad * 0.2)));
  const weatherImpact = (precipitation > 15 ? 25 : 0) + (windSpeed > 40 ? 20 : 0) + (seismicActivity > 4 ? 40 : 0);
  const trafficRisk = Math.min(100, Math.round((infrastructureLoad * 0.6) + weatherImpact));
  const powerRisk = Math.min(100, Math.round((windSpeed * 0.5) + (seismicActivity * 7) + (infrastructureLoad * 0.3) + (temperature > 38 ? 15 : 0)));
  const phDeviation = Math.abs(waterPh - 7.0) * 12;
  const waterRisk = Math.min(100, Math.round(phDeviation + (precipitation * 0.8)));
  const earthquakeRisk = Math.min(100, Math.round(seismicActivity * 10));

  const getSeverity = (risk: number): 'Stable' | 'Attention' | 'Elevated' | 'Critical' | 'Emergency' => {
    if (risk >= 81) return 'Emergency';
    if (risk >= 61) return 'Critical';
    if (risk >= 46) return 'Elevated';
    if (risk >= 26) return 'Attention';
    return 'Stable';
  };

  // Basic confidence algorithm (confidence is higher if we have explicit inputs/scenarios or normal ranges)
  const getConfidence = (risk: number): number => {
    return Math.round(85 + (risk % 11) + (customScenario ? 3 : 0));
  };

  const categoriesData: HazardCategory[] = [
    {
      id: "flood",
      name: "Floods",
      riskLevel: floodRisk,
      confidenceScore: getConfidence(floodRisk),
      severity: getSeverity(floodRisk),
      statusText: floodRisk > 80 ? "Severe Overflow Inundation" : floodRisk > 60 ? "Critical Flood Hazard" : floodRisk > 45 ? "Active Inundation Threat" : "Minimal Runoff Risk",
      analysis: `Precipitation of ${precipitation}mm/hr coupled with ${humidity}% humidity indicates ${floodRisk > 75 ? 'severe drainage saturation and localized flooding' : 'moderate surface runoff and ponding'}.`,
      indicators: [`Precipitation: ${precipitation} mm/h`, `Humidity Level: ${humidity}%`, `Soil Saturation: ${Math.round(humidity * 0.9)}%`],
      actions: ["Move sensitive electronics to elevated levels.", "Monitor regional drainage channels.", "Avoid flooded underpasses."]
    },
    {
      id: "fire",
      name: "Fires",
      riskLevel: fireRisk,
      confidenceScore: getConfidence(fireRisk),
      severity: getSeverity(fireRisk),
      statusText: fireRisk > 80 ? "Acute Conflagration Alarm" : fireRisk > 60 ? "Critical Burn Warning" : fireRisk > 45 ? "Dry Brush Alert" : "Stable Fire Indicators",
      analysis: `Extreme dry index (${temperature}°C, ${humidity}% humidity) combined with ${windSpeed} km/h wind gusts creates ${fireRisk > 75 ? 'prime conditions for rapid-onset forest or structural fires' : 'moderate combustible risks'}.`,
      indicators: [`Ambient Air Temp: ${temperature}°C`, `Relative Humidity: ${humidity}%`, `Wind Velocity: ${windSpeed} km/h`],
      actions: ["Strict ban on outdoor burns.", "Maintain buffer clear zones around structures.", "Verify local fire hydrant pressure."]
    },
    {
      id: "typhoon",
      name: "Typhoons",
      riskLevel: typhoonRisk,
      confidenceScore: getConfidence(typhoonRisk),
      severity: getSeverity(typhoonRisk),
      statusText: typhoonRisk > 80 ? "Super Cyclone Velocity" : typhoonRisk > 60 ? "Imminent Cyclonic Winds" : typhoonRisk > 45 ? "High Sea Gust Watch" : "Calm Atmospheric Cells",
      analysis: `Wind speeds peaking at ${windSpeed} km/h under ${humidity}% atmospheric moisture level suggest ${typhoonRisk > 75 ? 'structural damage and wave swells' : 'marginal wind shears'}.`,
      indicators: [`Max Wind Gust: ${windSpeed} km/h`, `Barometric Moisture: ${humidity}%`, `Tropical Depression State: Active`],
      actions: ["Secure all loose outdoor structures.", "Stay indoors and clear of coastal boardwalks.", "Prepare emergency solar battery packs."]
    },
    {
      id: "crop_disease",
      name: "Crop Disease",
      riskLevel: cropDiseaseRisk,
      confidenceScore: getConfidence(cropDiseaseRisk),
      severity: getSeverity(cropDiseaseRisk),
      statusText: cropDiseaseRisk > 80 ? "Catastrophic Field Rupture" : cropDiseaseRisk > 60 ? "Severe Crop Blight" : cropDiseaseRisk > 45 ? "Vegetation Spore Outbreak" : "Healthy Vegetation",
      analysis: `Crop Health rating of ${cropHealthIndex}/100 and relative humidity of ${humidity}% create ${cropDiseaseRisk > 75 ? 'favorable conditions for mold spore development and rot' : 'negligible botanical threats'}.`,
      indicators: [`Crop Health Metric: ${cropHealthIndex}/100`, `Foliar Wetness Index: High`, `Spore Proliferation Risk: Elevated`],
      actions: ["Apply preventive natural anti-fungals.", "Optimize crop row spacing for maximum airflow.", "Monitor plant foliage for early spotting."]
    },
    {
      id: "medical_emergency",
      name: "Medical Emergencies",
      riskLevel: medicalRisk,
      confidenceScore: getConfidence(medicalRisk),
      severity: getSeverity(medicalRisk),
      statusText: medicalRisk > 80 ? "Hospital Triage Congestion" : medicalRisk > 60 ? "Extreme Medical Dispatch Alert" : medicalRisk > 45 ? "Heat Stress Caution" : "Standard EMS Loads",
      analysis: `Severe environmental stressors (${temperature}°C, infrastructure load ${infrastructureLoad}%) raise ${medicalRisk > 75 ? 'the potential for critical thermal shock, trauma, and rapid EMS dispatch' : 'minor dehydration vectors'}.`,
      indicators: [`Wet Bulb Globe Temp: ${Math.round(temperature * 1.1)}°C`, `EMS Grid Dispatch Load: ${infrastructureLoad}%`, `Thermal Shock Index: High`],
      actions: ["Establish cooling shelters.", "Hydrate continuously.", "Equip field response units with IV rehydration bags."]
    },
    {
      id: "traffic",
      name: "Traffic Congestion",
      riskLevel: trafficRisk,
      confidenceScore: getConfidence(trafficRisk),
      severity: getSeverity(trafficRisk),
      statusText: trafficRisk > 80 ? "Complete Regional Lock" : trafficRisk > 60 ? "Complete Arterial Lock" : trafficRisk > 45 ? "Commuter Delay Warnings" : "Free-Flowing Corridors",
      analysis: `Heavy infrastructure demand (${infrastructureLoad}%) compounded by ${precipitation > 0 ? 'precipitation slip hazards' : 'commuter surges'} triggers ${trafficRisk > 75 ? 'complete traffic stalemates' : 'normal delays'}.`,
      indicators: [`Road Congestion Coefficient: ${infrastructureLoad}%`, `Roadway Friction: ${precipitation > 10 ? 'Slippery' : 'Dry'}`, `Transit Backlog: Moderate`],
      actions: ["Reroute commercial freight away from the core.", "Enable remote working policies.", "Deploy traffic management wardens."]
    },
    {
      id: "power_outage",
      name: "Power Outages",
      riskLevel: powerRisk,
      confidenceScore: getConfidence(powerRisk),
      severity: getSeverity(powerRisk),
      statusText: powerRisk > 80 ? "Substation Grid Collapse" : powerRisk > 60 ? "Grid Collapse Danger" : powerRisk > 45 ? "Grid Voltage Fluctuations" : "Stable Power Grid",
      analysis: `Peak power grid load of ${infrastructureLoad}% and physical wind stress (${windSpeed} km/h) create ${powerRisk > 75 ? 'critical transformer failure vectors' : 'minor brownout chances'}.`,
      indicators: [`Grid Thermal Load: ${infrastructureLoad}%`, `Substation Feeder Stress: High`, `Transformer Ambient Temp: ${temperature}°C`],
      actions: ["Prepare standalone back-up generators.", "Reduce commercial non-essential power draw.", "Inspect power transformer hot points."]
    },
    {
      id: "water_quality",
      name: "Water Quality",
      riskLevel: waterRisk,
      confidenceScore: getConfidence(waterRisk),
      severity: getSeverity(waterRisk),
      statusText: waterRisk > 80 ? "Toxic Effluent Contamination" : waterRisk > 60 ? "Water Contamination Alert" : waterRisk > 45 ? "Ph Acidic Washout" : "Pristine Aquatic Reading",
      analysis: `Water pH level reading of ${waterPh} and monsoonal storm washes suggest ${waterRisk > 75 ? 'potential chemical acid run-off or chemical leaching' : 'normal aquatic readings'}.`,
      indicators: [`Measured Water pH: ${waterPh}`, `Turbidity Metric: Elevated`, `Agricultural Runoff: Active`],
      actions: ["Deploy portable active carbon filters.", "Boil municipal tap water before use.", "Execute emergency pH balancing procedures."]
    },
    {
      id: "earthquake",
      name: "Earthquakes",
      riskLevel: earthquakeRisk,
      confidenceScore: getConfidence(earthquakeRisk),
      severity: getSeverity(earthquakeRisk),
      statusText: earthquakeRisk > 80 ? "Severe Fault Rupture" : earthquakeRisk > 60 ? "Active Rupture Warnings" : earthquakeRisk > 45 ? "Sub-Surface Aftershocks" : "Stable Crustal Activity",
      analysis: `Active seismic tremor of magnitude ${seismicActivity} indicates ${earthquakeRisk > 75 ? 'severe risk of structural collapse and bridge damage' : 'minor tectonic plate adjustments'}.`,
      indicators: [`Seismic Intensity: ${seismicActivity} Richter`, `Sub-crustal displacement: Active`, `Liquefaction Indicator: Low`],
      actions: ["Drop, cover, and hold under sturdy items.", "Shut off residential natural gas main valves.", "Stay clear of high-voltage wiring posts."]
    }
  ];

  // Calculate overall threat score
  const overallScore = Math.max(
    Math.round(
      (floodRisk * 0.15) +
      (fireRisk * 0.15) +
      (typhoonRisk * 0.15) +
      (cropDiseaseRisk * 0.05) +
      (medicalRisk * 0.1) +
      (trafficRisk * 0.05) +
      (powerRisk * 0.1) +
      (waterRisk * 0.05) +
      (earthquakeRisk * 0.2)
    ),
    1
  );

  let grade: 'LOW' | 'MODERATE' | 'ELEVATED' | 'SEVERE' | 'CRITICAL' = "LOW";
  let awLevel: 1 | 2 | 3 | 4 | 5 = 1;

  if (overallScore >= 81) {
    grade = "CRITICAL";
    awLevel = 5;
  } else if (overallScore >= 61) {
    grade = "SEVERE";
    awLevel = 4;
  } else if (overallScore >= 46) {
    grade = "ELEVATED";
    awLevel = 3;
  } else if (overallScore >= 26) {
    grade = "MODERATE";
    awLevel = 2;
  } else {
    grade = "LOW";
    awLevel = 1;
  }

  // Spidey sense warnings
  const alerts: string[] = [];
  if (floodRisk > 60) alerts.push("🚨 SENSE ALERT: Rising water tables detected. Ground moisture saturation has bypassed warning thresholds!");
  if (fireRisk > 60) alerts.push("🔥 SENSE ALERT: High dry-brush index detected! Combustibles are highly susceptible to sudden spark generation.");
  if (typhoonRisk > 60) alerts.push("🌪 SENSE ALERT: Atmospheric pressure dropping rapidly. Sea swell vectors are expanding!");
  if (cropDiseaseRisk > 60) alerts.push("🌱 SENSE ALERT: Mold spores thriving under high humidity levels. Agricultural fields require fast treatment.");
  if (medicalRisk > 60) alerts.push("🚑 SENSE ALERT: Extreme environment indices will place excessive load on immediate medical services.");
  if (trafficRisk > 60) alerts.push("🚦 SENSE ALERT: Commuter routes report high friction. Urban blockages imminent.");
  if (powerRisk > 60) alerts.push("⚡ SENSE ALERT: Transmission lines are under wind stress. Voltage dips expected.");
  if (waterRisk > 60) alerts.push("🌊 SENSE ALERT: Water pH reading shows sharp deviations. Leaching or run-off suspected.");
  if (earthquakeRisk > 60) alerts.push("🌋 SENSE ALERT: Heavy ground vibrations registered! Tectonic plates in active slip state.");

  if (alerts.length === 0) {
    alerts.push("🟢 Sentinel systems report normal indicators across the local sector.");
  }

  // Construct fallback summary
  let genSummary = customScenario ? `Analyzing scenario: "${customScenario}". ` : "";
  genSummary += `Located in ${location}. Overall Hazard Index is calculated at ${overallScore}% (${grade} - Level ${awLevel} Awareness). `;
  if (overallScore >= 81) {
    genSummary += "LEVEL 5 EMERGENCY: Ambient sensors register severe multi-system failure loops. Evacuation coordinators are notified and emergency sirens deployed.";
  } else if (overallScore > 65) {
    genSummary += "Immediate preventive layouts and community evacuation corridors must be cleared. High threat values are registered for physical infrastructure.";
  } else if (overallScore > 35) {
    genSummary += "Slightly elevated warnings exist. Moderate attention should be dedicated to primary drainage channels, local crop health, and transformer temperatures.";
  } else {
    genSummary += "The sector remains calm. Routine Sentinel surveillance feeds continue to monitor baseline parameters.";
  }

  return {
    id: "scan-" + Math.random().toString(36).substr(2, 9),
    locationName: location,
    overallThreatScore: overallScore,
    threatGrade: grade,
    awarenessLevel: awLevel,
    confidenceScore: Math.round(92 + (overallScore % 7)),
    summary: genSummary,
    categories: categoriesData,
    senseAlerts: alerts,
    timestamp: new Date().toISOString(),
    inputs: normalizedInputs
  };
}
