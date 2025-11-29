/**
 * Advanced AI Analytics Engine for Machine Maintenance
 * Includes: K-Means Clustering, Anomaly Detection, Time-Series Forecasting
 */

export interface MachineCluster {
  id: string;
  centroid: {
    health: number;
    temp: number;
    vibration: number;
  };
  machines: string[];
  characteristics: string;
}

export interface AnomalyScore {
  machineId: string;
  score: number; // 0-1, higher = more anomalous
  reason: string;
}

export interface TimeSeriesForecast {
  machineId: string;
  periods: number[];
  historicalHealth: number;
  forecastedHealth: number[];
  confidence: number;
}

export interface HealthDistribution {
  ranges: {
    excellent: number; // 80-100
    good: number; // 60-80
    fair: number; // 40-60
    poor: number; // 20-40
    critical: number; // 0-20
  };
  mean: number;
  median: number;
  stdDev: number;
}

export interface PredictiveMetrics {
  fleetHealthTrend: "improving" | "stable" | "declining";
  projectedDowntime: number; // percentage
  recommendedMaintenanceWindow: string;
  riskScore: number; // 0-100
}

/**
 * K-Means Clustering Algorithm
 * Groups similar machines for comparative analysis
 */
export function kMeansClustering(
  machines: any[],
  k: number = 3
): MachineCluster[] {
  if (machines.length === 0) return [];

  // Normalize features (0-1 scale)
  const normalized = machines.map((m) => ({
    id: m.id,
    health: m.health / 100,
    temp: Math.min(m.temp / 120, 1), // max 120°C
    vibration: Math.min(m.vibration / 10, 1), // max 10 m/s²
  }));

  // Random initialization of centroids
  const centroids = Array(k)
    .fill(0)
    .map(() => ({
      health: Math.random(),
      temp: Math.random(),
      vibration: Math.random(),
    }));

  // K-Means iterations
  let assignments: number[] = [];
  for (let iter = 0; iter < 10; iter++) {
    // Assign each point to nearest centroid
    assignments = normalized.map((point) => {
      let minDist = Infinity;
      let closestCluster = 0;

      centroids.forEach((centroid, idx) => {
        const dist = Math.sqrt(
          Math.pow(point.health - centroid.health, 2) +
            Math.pow(point.temp - centroid.temp, 2) +
            Math.pow(point.vibration - centroid.vibration, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          closestCluster = idx;
        }
      });

      return closestCluster;
    });

    // Update centroids
    for (let i = 0; i < k; i++) {
      const pointsInCluster = normalized.filter((_, idx) => assignments[idx] === i);
      if (pointsInCluster.length > 0) {
        const avgHealth =
          pointsInCluster.reduce((sum, p) => sum + p.health, 0) /
          pointsInCluster.length;
        const avgTemp =
          pointsInCluster.reduce((sum, p) => sum + p.temp, 0) /
          pointsInCluster.length;
        const avgVibration =
          pointsInCluster.reduce((sum, p) => sum + p.vibration, 0) /
          pointsInCluster.length;

        centroids[i] = {
          health: avgHealth,
          temp: avgTemp,
          vibration: avgVibration,
        };
      }
    }
  }

  // Generate cluster results
  const clusters: MachineCluster[] = centroids.map((centroid, idx) => {
    const machineIds = normalized
      .filter((_, midx) => assignments[midx] === idx)
      .map((p) => p.id);

    const characteristics =
      centroid.health > 0.8
        ? "🟢 Healthy Fleet"
        : centroid.health > 0.6
          ? "🟡 Maintenance Needed"
          : "🔴 Critical Machines";

    return {
      id: `cluster-${idx}`,
      centroid: {
        health: Math.round(centroid.health * 100),
        temp: Math.round(centroid.temp * 120),
        vibration: Number((centroid.vibration * 10).toFixed(2)),
      },
      machines: machineIds,
      characteristics,
    };
  });

  return clusters.filter((c) => c.machines.length > 0);
}

/**
 * Anomaly Detection using Statistical Methods
 * Identifies outlier machines based on multi-dimensional analysis
 */
export function detectAnomalies(machines: any[]): AnomalyScore[] {
  if (machines.length < 2) return [];

  // Calculate statistics for each metric
  const healthValues = machines.map((m) => m.health);
  const tempValues = machines.map((m) => m.temp);
  const vibrationValues = machines.map((m) => m.vibration);

  const getStats = (values: number[]) => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) /
      values.length;
    const stdDev = Math.sqrt(variance);
    return { mean, stdDev };
  };

  const healthStats = getStats(healthValues);
  const tempStats = getStats(tempValues);
  const vibrationStats = getStats(vibrationValues);

  // Z-score based anomaly detection
  const anomalies = machines.map((machine) => {
    const healthZ = Math.abs((machine.health - healthStats.mean) / (healthStats.stdDev || 1));
    const tempZ = Math.abs((machine.temp - tempStats.mean) / (tempStats.stdDev || 1));
    const vibrationZ = Math.abs(
      (machine.vibration - vibrationStats.mean) / (vibrationStats.stdDev || 1)
    );

    // Anomaly score (0-1, higher = more anomalous)
    const maxZ = Math.max(healthZ, tempZ, vibrationZ);
    const anomalyScore = Math.min(1, maxZ / 3); // Normalize to 0-1

    let reason = "";
    if (healthZ > 2) reason += "Unusual health level. ";
    if (tempZ > 2) reason += "Temperature outlier. ";
    if (vibrationZ > 2) reason += "Vibration anomaly. ";

    return {
      machineId: machine.id,
      score: anomalyScore,
      reason: reason.trim() || "Minor deviations detected.",
    };
  });

  return anomalies.filter((a) => a.score > 0.3).sort((a, b) => b.score - a.score);
}

/**
 * Exponential Smoothing Time-Series Forecasting
 * Predicts machine health over time
 */
export function forecastHealthTrend(
  machines: any[],
  forecastPeriods: number = 7
): TimeSeriesForecast[] {
  return machines.map((machine) => {
    // Simulate historical trend based on current metrics
    const currentHealth = machine.health;
    const degradationRate = machine.status === "CRITICAL" ? 0.08 : machine.status === "WARNING" ? 0.03 : 0.01;

    const forecastedHealth: number[] = [];
    let projectedHealth = currentHealth;

    for (let i = 1; i <= forecastPeriods; i++) {
      // Exponential smoothing with degradation
      const alpha = 0.3; // Smoothing factor
      const trend = -degradationRate * currentHealth;

      projectedHealth = alpha * projectedHealth + (1 - alpha) * (projectedHealth + trend);
      projectedHealth = Math.max(0, Math.min(100, projectedHealth));

      forecastedHealth.push(Math.round(projectedHealth));
    }

    // Calculate confidence (higher health = higher confidence)
    const confidence = Math.max(0.6, currentHealth / 100);

    return {
      machineId: machine.id,
      periods: Array.from({ length: forecastPeriods }, (_, i) => i + 1),
      historicalHealth: currentHealth,
      forecastedHealth,
      confidence,
    };
  });
}

/**
 * Health Distribution Analysis
 * Analyzes overall fleet health distribution
 */
export function analyzeHealthDistribution(machines: any[]): HealthDistribution {
  if (machines.length === 0) {
    return {
      ranges: { excellent: 0, good: 0, fair: 0, poor: 0, critical: 0 },
      mean: 0,
      median: 0,
      stdDev: 0,
    };
  }

  const healthValues = machines.map((m) => m.health).sort((a, b) => a - b);

  // Count by range
  const ranges = {
    excellent: healthValues.filter((h) => h >= 80).length,
    good: healthValues.filter((h) => h >= 60 && h < 80).length,
    fair: healthValues.filter((h) => h >= 40 && h < 60).length,
    poor: healthValues.filter((h) => h >= 20 && h < 40).length,
    critical: healthValues.filter((h) => h < 20).length,
  };

  // Calculate statistics
  const mean = healthValues.reduce((a, b) => a + b, 0) / healthValues.length;

  const median = healthValues[Math.floor(healthValues.length / 2)];

  const variance =
    healthValues.reduce((sum, h) => sum + Math.pow(h - mean, 2), 0) /
    healthValues.length;
  const stdDev = Math.sqrt(variance);

  return { ranges, mean: Math.round(mean), median, stdDev: Math.round(stdDev) };
}

/**
 * Predictive Maintenance Metrics
 * Generates actionable maintenance insights
 */
export function generatePredictiveMetrics(
  machines: any[],
  clusters: MachineCluster[],
  anomalies: AnomalyScore[]
): PredictiveMetrics {
  if (machines.length === 0) {
    return {
      fleetHealthTrend: "stable",
      projectedDowntime: 0,
      recommendedMaintenanceWindow: "No action needed",
      riskScore: 0,
    };
  }

  // Calculate fleet health trend
  const avgHealth = machines.reduce((sum, m) => sum + m.health, 0) / machines.length;
  const criticalCount = machines.filter((m) => m.health < 30).length;
  const warningCount = machines.filter((m) => m.health < 60).length;

  let fleetHealthTrend: "improving" | "stable" | "declining" = "stable";
  if (avgHealth > 75) fleetHealthTrend = "improving";
  else if (avgHealth < 50) fleetHealthTrend = "declining";

  // Projected downtime based on critical machines
  const projectedDowntime = (criticalCount / machines.length) * 100;

  // Recommended maintenance window
  let recommendedMaintenanceWindow = "No urgent maintenance needed";
  if (criticalCount > 3) {
    recommendedMaintenanceWindow = "🚨 Immediate maintenance required (next 24 hours)";
  } else if (warningCount > machines.length * 0.4) {
    recommendedMaintenanceWindow = "⚡ Priority maintenance (next 48-72 hours)";
  } else if (warningCount > 0) {
    recommendedMaintenanceWindow = "📋 Scheduled maintenance (next 1-2 weeks)";
  }

  // Risk score calculation
  let riskScore = 0;
  riskScore += (criticalCount / machines.length) * 50;
  riskScore += (warningCount / machines.length) * 30;
  riskScore += anomalies.length * 2;
  riskScore = Math.min(100, riskScore);

  return {
    fleetHealthTrend,
    projectedDowntime: Math.round(projectedDowntime),
    recommendedMaintenanceWindow,
    riskScore: Math.round(riskScore),
  };
}

/**
 * Correlation Analysis
 * Identifies relationships between metrics (health, temp, vibration)
 */
export function analyzeCorrelations(machines: any[]): {
  healthTempCorr: number;
  healthVibrationCorr: number;
  tempVibrationCorr: number;
} {
  if (machines.length < 2) {
    return {
      healthTempCorr: 0,
      healthVibrationCorr: 0,
      tempVibrationCorr: 0,
    };
  }

  const calculateCorrelation = (x: number[], y: number[]) => {
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b) / n;
    const meanY = y.reduce((a, b) => a + b) / n;

    const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0);
    const denomX = Math.sqrt(x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0));
    const denomY = Math.sqrt(y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0));

    return denomX * denomY > 0 ? numerator / (denomX * denomY) : 0;
  };

  const healthVals = machines.map((m) => m.health);
  const tempVals = machines.map((m) => m.temp);
  const vibrationVals = machines.map((m) => m.vibration);

  return {
    healthTempCorr: parseFloat(calculateCorrelation(healthVals, tempVals).toFixed(3)),
    healthVibrationCorr: parseFloat(
      calculateCorrelation(healthVals, vibrationVals).toFixed(3)
    ),
    tempVibrationCorr: parseFloat(calculateCorrelation(tempVals, vibrationVals).toFixed(3)),
  };
}
