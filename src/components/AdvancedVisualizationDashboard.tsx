"use client";
import React, { useMemo } from "react";
import {
  kMeansClustering,
  detectAnomalies,
  forecastHealthTrend,
  analyzeHealthDistribution,
  generatePredictiveMetrics,
  analyzeCorrelations,
  MachineCluster,
  AnomalyScore,
} from "@/lib/machineAIAnalytics";

export default function AdvancedVisualizationDashboard({
  machines,
}: {
  machines: any[];
}) {
  const analytics = useMemo(() => {
    if (!machines || machines.length === 0) {
      return {
        clusters: [],
        anomalies: [],
        forecasts: [],
        distribution: {
          ranges: { excellent: 0, good: 0, fair: 0, poor: 0, critical: 0 },
          mean: 0,
          median: 0,
          stdDev: 0,
        },
        predictive: {
          fleetHealthTrend: "stable" as const,
          projectedDowntime: 0,
          recommendedMaintenanceWindow: "No data",
          riskScore: 0,
        },
        correlations: {
          healthTempCorr: 0,
          healthVibrationCorr: 0,
          tempVibrationCorr: 0,
        },
      };
    }

    const clusters = kMeansClustering(machines, 3);
    const anomalies = detectAnomalies(machines);
    const forecasts = forecastHealthTrend(machines, 7);
    const distribution = analyzeHealthDistribution(machines);
    const predictive = generatePredictiveMetrics(machines, clusters, anomalies);
    const correlations = analyzeCorrelations(machines);

    return {
      clusters,
      anomalies,
      forecasts,
      distribution,
      predictive,
      correlations,
    };
  }, [machines]);

  return (
    <div className="space-y-6">
      {/* Risk & Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`p-6 rounded-xl border backdrop-blur-sm ${
            analytics.predictive.riskScore > 70
              ? "bg-red-950/20 border-red-800/50"
              : analytics.predictive.riskScore > 40
                ? "bg-amber-950/20 border-amber-800/50"
                : "bg-emerald-950/20 border-emerald-800/50"
          }`}
        >
          <div className="text-sm text-slate-400 font-semibold mb-2">
            FLEET RISK SCORE
          </div>
          <div
            className={`text-4xl font-bold ${
              analytics.predictive.riskScore > 70
                ? "text-red-400"
                : analytics.predictive.riskScore > 40
                  ? "text-amber-400"
                  : "text-emerald-400"
            }`}
          >
            {analytics.predictive.riskScore}/100
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {analytics.predictive.fleetHealthTrend === "improving"
              ? "📈 Trending Upward"
              : analytics.predictive.fleetHealthTrend === "declining"
                ? "📉 Trending Downward"
                : "→ Stable"}
          </div>
        </div>

        <div className="p-6 rounded-xl border border-slate-700 bg-slate-800/30">
          <div className="text-sm text-slate-400 font-semibold mb-2">
            FLEET HEALTH DISTRIBUTION
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Average:</span>
              <span className="font-bold text-emerald-400">
                {analytics.distribution.mean}%
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Median:</span>
              <span className="font-bold text-cyan-400">
                {analytics.distribution.median}%
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Std Dev:</span>
              <span className="font-bold text-slate-300">
                {analytics.distribution.stdDev}%
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-slate-700 bg-slate-800/30">
          <div className="text-sm text-slate-400 font-semibold mb-2">
            MAINTENANCE WINDOW
          </div>
          <div className="text-sm text-slate-200 leading-relaxed">
            {analytics.predictive.recommendedMaintenanceWindow}
          </div>
          <div className="text-xs text-slate-400 mt-3">
            Projected downtime: {analytics.predictive.projectedDowntime}%
          </div>
        </div>
      </div>

      {/* Health Distribution Chart */}
      <div className="p-6 rounded-xl border border-slate-700 bg-slate-800/30">
        <h3 className="font-bold text-slate-100 mb-6 flex items-center gap-2">
          📊 Health Range Distribution
        </h3>
        <div className="space-y-3">
          {[
            {
              label: "Excellent (80-100%)",
              value: analytics.distribution.ranges.excellent,
              color: "bg-emerald-500",
              darkColor: "bg-emerald-900/30",
            },
            {
              label: "Good (60-80%)",
              value: analytics.distribution.ranges.good,
              color: "bg-cyan-500",
              darkColor: "bg-cyan-900/30",
            },
            {
              label: "Fair (40-60%)",
              value: analytics.distribution.ranges.fair,
              color: "bg-amber-500",
              darkColor: "bg-amber-900/30",
            },
            {
              label: "Poor (20-40%)",
              value: analytics.distribution.ranges.poor,
              color: "bg-orange-500",
              darkColor: "bg-orange-900/30",
            },
            {
              label: "Critical (0-20%)",
              value: analytics.distribution.ranges.critical,
              color: "bg-red-500",
              darkColor: "bg-red-900/30",
            },
          ].map((item, idx) => {
            const total = Object.values(analytics.distribution.ranges).reduce(
              (a, b) => a + b,
              0
            );
            const percent = total > 0 ? (item.value / total) * 100 : 0;

            return (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="font-bold text-slate-200">
                    {item.value} machines
                  </span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Health Trend Forecast */}
      <div className="p-6 rounded-xl border border-slate-700 bg-slate-800/30">
        <h3 className="font-bold text-slate-100 mb-6 flex items-center gap-2">
          📈 7-Day Health Forecast (Top 5 At-Risk Machines)
        </h3>
        <div className="space-y-4">
          {analytics.forecasts
            .filter((f) => machines.find((m) => m.id === f.machineId)?.health < 70)
            .slice(0, 5)
            .map((forecast) => {
              const machine = machines.find((m) => m.id === forecast.machineId);
              const lastForecast =
                forecast.forecastedHealth[forecast.forecastedHealth.length - 1];
              const trend = lastForecast < forecast.historicalHealth ? "📉" : "📈";

              return (
                <div key={forecast.machineId} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-100">
                      {machine?.name}
                    </span>
                    <span className="text-xs">
                      {forecast.historicalHealth}%
                      <span className="text-slate-400 mx-1">→</span>
                      <span className="font-bold">{lastForecast}%</span>
                      <span className="ml-1">{trend}</span>
                    </span>
                  </div>
                  <div className="flex gap-1 h-6">
                    {forecast.forecastedHealth.map((health, idx) => {
                      const heightPercent = Math.max(10, (health / 100) * 100);
                      const colorClass =
                        health > 70
                          ? "bg-emerald-500"
                          : health > 50
                            ? "bg-amber-500"
                            : health > 30
                              ? "bg-orange-500"
                              : "bg-red-500";

                      return (
                        <div
                          key={idx}
                          className={`flex-1 rounded-sm ${colorClass} transition-all hover:opacity-70`}
                          style={{ height: `${heightPercent}%` }}
                          title={`Day ${idx + 1}: ${health}%`}
                        ></div>
                      );
                    })}
                  </div>
                  <div className="text-xs text-slate-400">
                    Confidence: {(forecast.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Machine Clustering Analysis */}
      {analytics.clusters.length > 0 && (
        <div className="p-6 rounded-xl border border-slate-700 bg-slate-800/30">
          <h3 className="font-bold text-slate-100 mb-6 flex items-center gap-2">
            🎯 Machine Clustering Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.clusters.map((cluster: MachineCluster) => (
              <div
                key={cluster.id}
                className={`p-4 rounded-lg border ${
                  cluster.characteristics.includes("Healthy")
                    ? "border-emerald-800/50 bg-emerald-950/20"
                    : cluster.characteristics.includes("Maintenance")
                      ? "border-amber-800/50 bg-amber-950/20"
                      : "border-red-800/50 bg-red-950/20"
                }`}
              >
                <div className="text-sm font-bold text-slate-100 mb-3">
                  {cluster.characteristics}
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400">Count:</span>
                    <span className="float-right font-bold text-slate-200">
                      {cluster.machines.length} machines
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Avg Health:</span>
                    <span className="float-right font-bold text-slate-200">
                      {cluster.centroid.health}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Avg Temp:</span>
                    <span className="float-right font-bold text-slate-200">
                      {cluster.centroid.temp}°C
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Avg Vibration:</span>
                    <span className="float-right font-bold text-slate-200">
                      {cluster.centroid.vibration} m/s²
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-400">
                  <div className="font-mono">
                    {cluster.machines.slice(0, 3).join(", ")}
                    {cluster.machines.length > 3
                      ? ` +${cluster.machines.length - 3}`
                      : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Correlation Heatmap */}
      <div className="p-6 rounded-xl border border-slate-700 bg-slate-800/30">
        <h3 className="font-bold text-slate-100 mb-6 flex items-center gap-2">
          🔥 Metric Correlations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Health ↔ Temperature",
              value: analytics.correlations.healthTempCorr,
              meaning:
                analytics.correlations.healthTempCorr > 0.5
                  ? "Strong positive correlation"
                  : analytics.correlations.healthTempCorr < -0.5
                    ? "Strong negative correlation"
                    : "Weak correlation",
            },
            {
              label: "Health ↔ Vibration",
              value: analytics.correlations.healthVibrationCorr,
              meaning:
                analytics.correlations.healthVibrationCorr > 0.5
                  ? "Strong positive correlation"
                  : analytics.correlations.healthVibrationCorr < -0.5
                    ? "Strong negative correlation"
                    : "Weak correlation",
            },
            {
              label: "Temperature ↔ Vibration",
              value: analytics.correlations.tempVibrationCorr,
              meaning:
                analytics.correlations.tempVibrationCorr > 0.5
                  ? "Strong positive correlation"
                  : analytics.correlations.tempVibrationCorr < -0.5
                    ? "Strong negative correlation"
                    : "Weak correlation",
            },
          ].map((corr, idx) => {
            const absValue = Math.abs(corr.value);
            const color =
              absValue > 0.7
                ? "from-red-600 to-red-400"
                : absValue > 0.4
                  ? "from-amber-600 to-amber-400"
                  : absValue > 0.2
                    ? "from-cyan-600 to-cyan-400"
                    : "from-slate-600 to-slate-400";

            return (
              <div key={idx} className="space-y-2">
                <div className="text-sm font-semibold text-slate-100">
                  {corr.label}
                </div>
                <div
                  className={`p-4 rounded-lg bg-gradient-to-br ${color} text-white text-center`}
                >
                  <div className="text-2xl font-bold">
                    {(corr.value * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs mt-1">{corr.meaning}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anomaly Detection Results */}
      {analytics.anomalies.length > 0 && (
        <div className="p-6 rounded-xl border border-red-800/50 bg-red-950/20">
          <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
            ⚠️ Anomaly Detection ({analytics.anomalies.length} Found)
          </h3>
          <div className="space-y-3">
            {analytics.anomalies.map((anomaly: AnomalyScore) => {
              const machine = machines.find((m) => m.id === anomaly.machineId);
              return (
                <div
                  key={anomaly.machineId}
                  className="p-3 rounded-lg bg-red-900/20 border border-red-800/30"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-red-300">
                      {machine?.name}
                    </span>
                    <span className="text-xs bg-red-900/50 px-2 py-1 rounded">
                      {(anomaly.score * 100).toFixed(0)}% anomalous
                    </span>
                  </div>
                  <div className="text-sm text-red-200">{anomaly.reason}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
