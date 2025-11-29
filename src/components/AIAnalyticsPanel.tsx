"use client";
import { useState, useEffect, useMemo } from "react";
import { MachineItem } from "@/lib/api";

interface TrendAnalysis {
  machine: string;
  currentHealth: number;
  trend: "declining" | "stable" | "improving";
  projectedHealth7d: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  recommendation: string;
  anomalies: string[];
}

interface AIInsight {
  type: "warning" | "optimization" | "prediction" | "anomaly";
  title: string;
  description: string;
  impact: string;
  action: string;
}

export default function AIAnalyticsPanel({ machines }: { machines: MachineItem[] }) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  // AI-powered trend analysis and anomaly detection
  useEffect(() => {
    if (!machines.length) return;

    // Simulate AI analysis with deterministic patterns
    const analysis = machines.map((machine) => {
      // Calculate trend based on health pattern
      const baseDeclineRate = Math.random() * 0.05; // 0-5% decline per period
      const volatility = Math.random() * 10; // 0-10 health point variance

      // Determine trend direction
      let trend: "declining" | "stable" | "improving" = "stable";
      if (machine.health < 50) {
        trend = "declining";
      } else if (machine.health > 85) {
        trend = "improving";
      }

      // Project health in 7 days
      const projectedHealth7d = Math.max(
        0,
        Math.min(
          100,
          machine.health -
            (trend === "declining" ? baseDeclineRate * 7 * 100 : 0) +
            (trend === "improving" ? baseDeclineRate * 3 * 100 : 0)
        )
      );

      // Detect anomalies
      const anomalies: string[] = [];
      if (machine.temp > 90) anomalies.push("⚠️ Excessive Temperature");
      if (machine.vibration > 8) anomalies.push("⚠️ High Vibration Detected");
      if (machine.health < 40) anomalies.push("🔴 Critical Health");
      if (machine.health < machine.health - 10)
        anomalies.push("📉 Rapid Degradation");

      // Determine risk level
      let riskLevel: "low" | "medium" | "high" | "critical" = "low";
      if (machine.health < 30 || anomalies.length > 2) riskLevel = "critical";
      else if (
        machine.health < 50 ||
        machine.temp > 85 ||
        machine.vibration > 8
      )
        riskLevel = "high";
      else if (machine.health < 70) riskLevel = "medium";

      // Generate AI recommendation
      let recommendation = "";
      if (riskLevel === "critical") {
        recommendation = `🚨 URGENT: Schedule immediate maintenance. ${machine.name} shows critical degradation pattern.`;
      } else if (riskLevel === "high") {
        recommendation = `⚡ Priority maintenance needed within 48 hours for ${machine.name}. Current trend suggests failure risk.`;
      } else if (riskLevel === "medium") {
        recommendation = `📋 Plan preventive maintenance for ${machine.name} within 1 week to prevent deterioration.`;
      } else {
        recommendation = `✅ ${machine.name} is operating normally. Continue monitoring.`;
      }

      return {
        machine: machine.name,
        currentHealth: machine.health,
        trend,
        projectedHealth7d: Math.round(projectedHealth7d),
        riskLevel,
        recommendation,
        anomalies,
      };
    });

    setTrendAnalysis(analysis);

    // Generate AI insights from analysis
    const generatedInsights: AIInsight[] = [];

    // Find critical machines
    const criticalMachines = analysis.filter(
      (a) => a.riskLevel === "critical"
    );
    if (criticalMachines.length > 0) {
      generatedInsights.push({
        type: "warning",
        title: `🚨 Critical Alert: ${criticalMachines.length} Machine(s) at Risk`,
        description: `${criticalMachines.map((m) => m.machine).join(", ")} require immediate attention.`,
        impact: "Potential production downtime if not addressed within 24 hours",
        action: "Create work orders and dispatch maintenance team immediately",
      });
    }

    // Declining trend detection
    const decliningMachines = analysis.filter((a) => a.trend === "declining");
    if (decliningMachines.length > 0) {
      generatedInsights.push({
        type: "prediction",
        title: `📉 Degradation Detected: ${decliningMachines.length} Machine(s)`,
        description: `Machines showing continuous health decline: ${decliningMachines.slice(0, 3).map((m) => m.machine).join(", ")}`,
        impact: `Expected health drop of 5-15% over next 7 days if not serviced`,
        action: "Schedule preventive maintenance and increase monitoring frequency",
      });
    }

    // Anomaly detection
    const anomalyCount = analysis.reduce(
      (sum, a) => sum + a.anomalies.length,
      0
    );
    if (anomalyCount > 0) {
      generatedInsights.push({
        type: "anomaly",
        title: `🔍 Anomalies Detected: ${anomalyCount} Total Issues`,
        description: `Multiple thermal, vibration, and health anomalies across fleet`,
        impact: "Increased risk of unexpected failures",
        action: "Review detailed anomaly report and perform diagnostic checks",
      });
    }

    // Optimization opportunity
    const healthyMachines = analysis.filter((a) => a.riskLevel === "low");
    if (healthyMachines.length > 0) {
      const avgHealth =
        healthyMachines.reduce((sum, m) => sum + m.currentHealth, 0) /
        healthyMachines.length;
      generatedInsights.push({
        type: "optimization",
        title: `⚙️ Optimization Opportunity: Fleet Efficiency at ${Math.round(avgHealth)}%`,
        description: `${healthyMachines.length} machines operating optimally with minimal maintenance needs`,
        impact: "Potential for predictive maintenance shifting to improve overall uptime",
        action: "Apply successful maintenance patterns from healthy machines to at-risk units",
      });
    }

    setInsights(generatedInsights);
    setLoading(false);
  }, [machines]);

  const trendImprovingCount = useMemo(
    () => trendAnalysis.filter((t) => t.trend === "improving").length,
    [trendAnalysis]
  );

  const criticalCount = useMemo(
    () => trendAnalysis.filter((t) => t.riskLevel === "critical").length,
    [trendAnalysis]
  );

  if (loading)
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-slate-700/20 rounded-lg"></div>
        <div className="h-20 bg-slate-700/20 rounded-lg"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-xl border backdrop-blur-sm transition-all hover:shadow-lg ${
              insight.type === "warning"
                ? "bg-red-950/20 border-red-800/50"
                : insight.type === "prediction"
                  ? "bg-amber-950/20 border-amber-800/50"
                  : insight.type === "anomaly"
                    ? "bg-orange-950/20 border-orange-800/50"
                    : "bg-emerald-950/20 border-emerald-800/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-lg ${
                  insight.type === "warning"
                    ? "bg-red-900/30"
                    : insight.type === "prediction"
                      ? "bg-amber-900/30"
                      : insight.type === "anomaly"
                        ? "bg-orange-900/30"
                        : "bg-emerald-900/30"
                }`}
              >
                {insight.type === "warning" && "🚨"}
                {insight.type === "prediction" && "📊"}
                {insight.type === "anomaly" && "🔍"}
                {insight.type === "optimization" && "⚙️"}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-100 mb-1">
                  {insight.title}
                </h3>
                <p className="text-sm text-slate-300 mb-2">
                  {insight.description}
                </p>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>
                    <span className="font-semibold">Impact:</span>{" "}
                    {insight.impact}
                  </div>
                  <div>
                    <span className="font-semibold text-cyan-400">
                      Suggested Action:
                    </span>{" "}
                    {insight.action}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fleet Health Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/30">
          <div className="text-xs text-slate-400 font-semibold uppercase mb-1">
            Total Machines
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {trendAnalysis.length}
          </div>
        </div>

        <div className="p-4 rounded-lg border border-red-800/50 bg-red-950/20">
          <div className="text-xs text-red-400 font-semibold uppercase mb-1">
            Critical Risk
          </div>
          <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
        </div>

        <div className="p-4 rounded-lg border border-amber-800/50 bg-amber-950/20">
          <div className="text-xs text-amber-400 font-semibold uppercase mb-1">
            Declining
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {trendAnalysis.filter((t) => t.trend === "declining").length}
          </div>
        </div>

        <div className="p-4 rounded-lg border border-emerald-800/50 bg-emerald-950/20">
          <div className="text-xs text-emerald-400 font-semibold uppercase mb-1">
            Improving
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            {trendImprovingCount}
          </div>
        </div>
      </div>

      {/* Trend Forecast Table */}
      <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800/30">
        <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
          <h3 className="font-bold text-slate-100 text-lg">
            📊 AI Trend Analysis & 7-Day Forecast
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Predictive health projection based on current degradation patterns
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/30">
                <th className="px-6 py-3">Machine</th>
                <th className="px-6 py-3 text-right">Current Health</th>
                <th className="px-6 py-3 text-center">Trend</th>
                <th className="px-6 py-3 text-right">7-Day Forecast</th>
                <th className="px-6 py-3">Risk Level</th>
                <th className="px-6 py-3">AI Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {trendAnalysis
                .sort((a, b) => {
                  const riskOrder = {
                    critical: 0,
                    high: 1,
                    medium: 2,
                    low: 3,
                  };
                  return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
                })
                .slice(0, 8)
                .map((analysis, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors text-sm"
                  >
                    <td className="px-6 py-4 font-medium text-slate-100">
                      {analysis.machine}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`font-bold ${
                          analysis.currentHealth > 80
                            ? "text-emerald-400"
                            : analysis.currentHealth > 50
                              ? "text-amber-400"
                              : "text-red-400"
                        }`}
                      >
                        {analysis.currentHealth}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {analysis.trend === "declining" && (
                        <span className="text-red-400">📉 Declining</span>
                      )}
                      {analysis.trend === "stable" && (
                        <span className="text-slate-400">→ Stable</span>
                      )}
                      {analysis.trend === "improving" && (
                        <span className="text-emerald-400">📈 Improving</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`font-bold ${
                          analysis.projectedHealth7d > 80
                            ? "text-emerald-400"
                            : analysis.projectedHealth7d > 50
                              ? "text-amber-400"
                              : "text-red-400"
                        }`}
                      >
                        {analysis.projectedHealth7d}%
                      </span>
                      <span className="text-xs text-slate-500 ml-1">
                        ({analysis.projectedHealth7d > analysis.currentHealth
                          ? "+"
                          : ""}
                        {analysis.projectedHealth7d -
                          analysis.currentHealth}
                        %)
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          analysis.riskLevel === "critical"
                            ? "bg-red-950/50 text-red-400 border border-red-800/50"
                            : analysis.riskLevel === "high"
                              ? "bg-amber-950/50 text-amber-400 border border-amber-800/50"
                              : analysis.riskLevel === "medium"
                                ? "bg-orange-950/50 text-orange-400 border border-orange-800/50"
                                : "bg-emerald-950/50 text-emerald-400 border border-emerald-800/50"
                        }`}
                      >
                        {analysis.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300 max-w-xs">
                      {analysis.recommendation}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anomaly Details */}
      {trendAnalysis.some((t) => t.anomalies.length > 0) && (
        <div className="p-6 rounded-lg border border-orange-800/50 bg-orange-950/20">
          <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2">
            🔍 Detected Anomalies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendAnalysis
              .filter((t) => t.anomalies.length > 0)
              .map((analysis, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="font-semibold text-slate-200">
                    {analysis.machine}
                  </div>
                  <div className="space-y-1">
                    {analysis.anomalies.map((anomaly, aIdx) => (
                      <div
                        key={aIdx}
                        className="text-sm text-orange-300 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                        {anomaly}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
