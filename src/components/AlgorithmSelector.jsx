
import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Timer, BarChart, Layers } from 'lucide-react';

const algorithms = [
  { id: 'FCFS', name: 'First Come First Serve', icon: <Timer className="w-8 h-8" />, desc: 'Simple, non-preemptive' },
  { id: 'SJF', name: 'Shortest Job First', icon: <Zap className="w-8 h-8" />, desc: 'Non-preemptive, minimizes waiting time' },
  { id: 'SRTF', name: 'Shortest Remaining Time', icon: <Cpu className="w-8 h-8" />, desc: 'Preemptive version of SJF' },
  { id: 'Priority', name: 'Priority Scheduling', icon: <Layers className="w-8 h-8" />, desc: 'Based on priority levels' },
  { id: 'RR', name: 'Round Robin', icon: <BarChart className="w-8 h-8" />, desc: 'Time-sliced preemptive scheduling' },
];

const AlgorithmSelector = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Choose CPU Scheduling Algorithm
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Select an algorithm for Online Food Delivery Order Processing. Each has unique characteristics and execution patterns.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {algorithms.map((algo, index) => (
          <motion.button
            key={algo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(algo.id)}
            className="glass-card group text-left relative overflow-hidden flex flex-col items-start gap-4 h-full"
          >
            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
              {algo.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{algo.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{algo.desc}</p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              {algo.icon}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmSelector;
