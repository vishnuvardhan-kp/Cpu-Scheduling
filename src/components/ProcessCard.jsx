
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, User } from 'lucide-react';

const ProcessCard = ({ process, updateProcess, removeProcess, showPriority }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}
      className="glass-card flex flex-col gap-4 min-w-[280px]"
    >
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg" style={{ backgroundColor: process.color, color: '#fff' }}>
            {process.label}
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-200">Process Settings</span>
        </div>
        <button
          onClick={() => removeProcess(process.id)}
          className="p-2 hover:bg-red-500/20 text-slate-400 dark:text-slate-500 hover:text-red-500 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Arrival Time</label>
          <input
            type="number"
            min="0"
            value={process.arrivalTime}
            onChange={(e) => updateProcess(process.id, 'arrivalTime', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50 dark:text-white text-slate-900 transition-colors shadow-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Burst Time</label>
          <input
            type="number"
            min="1"
            value={process.burstTime}
            onChange={(e) => updateProcess(process.id, 'burstTime', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50 dark:text-white text-slate-900 transition-colors shadow-sm"
          />
        </div>

        {showPriority && (
          <div className="space-y-1">
            <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Priority</label>
            <input
              type="number"
              min="1"
              value={process.priority}
              onChange={(e) => updateProcess(process.id, 'priority', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50 dark:text-white text-slate-900 transition-colors shadow-sm"
              placeholder="Lower = Higher priority"
            />
          </div>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-500">
        <span>ID: {process.id}</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: process.color }}></div>
          <span>Execution Color</span>
        </div>
      </div>
    </motion.div>
  );
};
export default ProcessCard;
