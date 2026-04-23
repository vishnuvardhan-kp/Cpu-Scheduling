
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, BarChart3 } from 'lucide-react';

const MetricsPanel = ({ processes, metrics }) => {
  if (!metrics || Object.keys(metrics).length === 0) return null;

  const processIds = Object.keys(metrics);
  const totalWT = processIds.reduce((sum, id) => sum + metrics[id].waitingTime, 0);
  const totalTAT = processIds.reduce((sum, id) => sum + metrics[id].turnaroundTime, 0);
  
  const avgWT = (totalWT / processes.length).toFixed(2);
  const avgTAT = (totalTAT / processes.length).toFixed(2);

  return (
    <div className="space-y-8 mt-12 mb-12 animate-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card flex flex-col items-center justify-center text-center p-8 border-indigo-500/20">
          <Clock className="w-8 h-8 text-indigo-500 dark:text-indigo-400 mb-2" />
          <span className="text-3xl font-bold text-slate-900 dark:text-white">{avgWT}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Avg Waiting Time</span>
        </div>
        <div className="glass-card flex flex-col items-center justify-center text-center p-8 border-purple-500/20">
          <CheckCircle2 className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
          <span className="text-3xl font-bold text-slate-900 dark:text-white">{avgTAT}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Avg Turnaround Time</span>
        </div>
        <div className="glass-card flex flex-col items-center justify-center text-center p-8 border-pink-500/20">
          <BarChart3 className="w-8 h-8 text-pink-500 dark:text-pink-400 mb-2" />
          <span className="text-3xl font-bold text-slate-900 dark:text-white">{totalWT}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Total WT</span>
        </div>
        <div className="glass-card flex flex-col items-center justify-center text-center p-8 border-emerald-500/20">
          <BarChart3 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-2" />
          <span className="text-3xl font-bold text-slate-900 dark:text-white">{totalTAT}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Total TAT</span>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
         <div className="p-4 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10">
            <h3 className="font-bold text-slate-900 dark:text-white">Detailed Metrics Per Process</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Process</th>
                  <th className="px-6 py-4">Arrival Time</th>
                  <th className="px-6 py-4">Burst Time</th>
                  <th className="px-6 py-4">Waiting Time</th>
                  <th className="px-6 py-4">Turnaround Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {processes.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
                        <span className="font-bold text-slate-900 dark:text-white">{p.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{p.arrivalTime}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{p.burstTime}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded text-sm font-bold">
                        {metrics[p.id]?.waitingTime}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded text-sm font-bold">
                        {metrics[p.id]?.turnaroundTime}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
