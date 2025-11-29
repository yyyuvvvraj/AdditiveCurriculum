// src/components/MaintenanceOptimizer.tsx
"use client";

import { GeneticAlgorithmResult, MaintenanceSchedule } from "@/lib/geneticAlgorithm";

interface MaintenanceOptimizerProps {
  optimization: GeneticAlgorithmResult | null;
  loading?: boolean;
}

export default function MaintenanceOptimizer({ optimization, loading = false }: MaintenanceOptimizerProps) {
  if (loading) {
    return (
      <div className="card p-6 rounded-2xl border border-slate-700 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-700/50 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-slate-700/30 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!optimization) {
    return (
      <div className="card p-6 rounded-2xl border border-slate-700 shadow-sm">
        <p className="text-slate-400 text-sm">No optimization data available. Add machines to start.</p>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-950/30 text-red-300 border-red-800';
    if (priority === 'medium') return 'bg-amber-950/30 text-amber-300 border-amber-800';
    return 'bg-emerald-950/30 text-emerald-300 border-emerald-800';
  };

  return (
    <div className="space-y-6">
      {/* Header with KPIs */}
      <div className="card p-6 rounded-2xl border border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-100 mb-4">🧬 Genetic Algorithm: Maintenance Optimization</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/30 p-4 rounded-xl">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Expected Uptime</p>
            <p className="text-2xl font-bold text-cyan-400">{optimization.expectedUptime.toFixed(1)}%</p>
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-xl">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">Total Est. Cost</p>
            <p className="text-2xl font-bold text-amber-400">₹{optimization.totalCost.toLocaleString()}</p>
          </div>
          
          <div className="bg-slate-800/30 p-4 rounded-xl">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-1">GA Fitness Score</p>
            <p className="text-2xl font-bold text-emerald-400">{optimization.fitness}</p>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-400">
          <span className="inline-block mr-4">📊 Generation: {optimization.generation}</span>
          <span className="inline-block">🎯 {optimization.schedules.length} machines optimized</span>
        </div>
      </div>

      {/* Maintenance Schedules Table */}
      <div className="card rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h4 className="font-bold text-slate-100">Recommended Maintenance Schedule</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/30 text-slate-400 font-medium border-b border-slate-700">
              <tr>
                <th className="px-6 py-3">Machine</th>
                <th className="px-6 py-3">Days Till Maintenance</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Est. Cost</th>
                <th className="px-6 py-3">Risk Reduction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {optimization.schedules.map((schedule: MaintenanceSchedule) => (
                <tr key={schedule.machineId} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-100">{schedule.machineId}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-700/50 text-slate-200">
                      {schedule.daysTillMaintenance} days
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityColor(schedule.priority)}`}>
                      {schedule.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">₹{schedule.estimatedCost.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="w-32 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                        style={{ width: `${schedule.failureRiskReduction}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-400 mt-1 block">{schedule.failureRiskReduction}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-cyan-950/20 border border-cyan-800/50 rounded-lg p-4">
        <p className="text-sm text-cyan-300">
          <strong>💡 How it works:</strong> The genetic algorithm evolves maintenance schedules across 
          <strong> {optimization.generation} generations</strong> to find the optimal balance between machine 
          uptime, maintenance costs, and failure prevention. Higher priority machines are scheduled sooner.
        </p>
      </div>
    </div>
  );
}
