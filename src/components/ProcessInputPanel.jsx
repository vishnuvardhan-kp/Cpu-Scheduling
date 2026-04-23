import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Play, RefreshCw, ChevronLeft, Pause, FastForward, SkipForward } from 'lucide-react';
import ProcessCard from './ProcessCard';

const ProcessInputPanel = ({ 
  algorithm, 
  processes, 
  addProcess, 
  updateProcess, 
  removeProcess, 
  timeQuantum, 
  setTimeQuantum, 
  startSimulation,
  reset,
  back,
  simulationState,
  setSimulationState,
  playbackSpeed,
  setPlaybackSpeed,
  currentTime,
  activeProcess,
  readyQueue,
  completedProcesses,
  isDarkMode
}) => {
  const isSimulationActive = simulationState === 'running' || simulationState === 'paused' || simulationState === 'finished';

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={back}
            className="p-3 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 rounded-full transition-colors text-slate-600 dark:text-slate-400"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{algorithm} Simulator</h2>
            <p className="text-slate-600 dark:text-slate-400">
              {simulationState === 'setup' ? 'Configure your processes and click start.' : 'Simulation in progress...'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {algorithm === 'RR' && simulationState === 'setup' && (
            <div className="flex items-center gap-3 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl">
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-300">TIME QUANTUM</span>
              <input
                type="number"
                min="1"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(parseInt(e.target.value) || 1)}
                className="w-16 bg-slate-900/50 border border-indigo-500/30 rounded px-2 py-1 text-center outline-none focus:border-indigo-400"
              />
            </div>
          )}
          
          {simulationState === 'setup' ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={reset}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl flex items-center gap-2 font-semibold transition-all border border-white/10"
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={startSimulation}
                disabled={processes.length === 0}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5 fill-current" /> Start Simulation
              </motion.button>
            </>
          ) : (
            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1 px-2">
                {[0.5, 1, 2].map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(500 / speed)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${playbackSpeed === 500 / speed ? 'bg-indigo-500 text-white' : 'hover:bg-white/5 text-slate-400'}`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
              
              <div className="h-6 w-px bg-white/10 mx-1"></div>

              {simulationState !== 'finished' && (
                <button
                  onClick={() => setSimulationState(simulationState === 'running' ? 'paused' : 'running')}
                  className="p-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl transition-colors text-white"
                >
                  {simulationState === 'running' ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>
              )}
              
              <button
                onClick={() => { setSimulationState('setup'); }}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-slate-200"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {simulationState === 'setup' ? (
          <motion.div 
            key="setup-ui"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {processes.map((p) => (
              <ProcessCard
                key={p.id}
                process={p}
                updateProcess={updateProcess}
                removeProcess={removeProcess}
                showPriority={algorithm === 'Priority'}
                isDarkMode={isDarkMode}
              />
            ))}
            
            <motion.button
              layout
              whileHover={{ scale: 1.02, backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)' }}
              whileTap={{ scale: 0.98 }}
              onClick={addProcess}
              className="border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl p-6 min-h-[200px] flex flex-col items-center justify-center gap-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-bold tracking-wider">ADD PROCESS</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="simulation-dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {/* Time Card */}
            <div className="glass-card flex flex-col items-center justify-center p-6 border-indigo-500/30">
              <span className="text-4xl font-black text-indigo-400 mono">{currentTime}</span>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">Current Time</span>
            </div>

            {/* Active Process Card */}
            <div className="glass-card flex flex-col items-center justify-center p-6 border-emerald-500/30">
              <div className="flex items-center gap-3">
                {activeProcess ? (
                  <>
                    <div className="w-10 h-10 rounded-full animate-pulse flex items-center justify-center text-white font-bold" style={{ backgroundColor: activeProcess.color }}>
                      {activeProcess.label}
                    </div>
                    <span className="text-xl font-bold">Executing</span>
                  </>
                ) : (
                  <span className="text-xl font-bold text-slate-500">CPU IDLE</span>
                )}
              </div>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-widest mt-2 font-mono">Status</span>
            </div>

            {/* Ready Queue Card */}
            <div className="glass-card col-span-1 md:col-span-2 p-6 flex flex-col gap-3">
               <div className="flex justify-between items-center">
                 <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Ready Queue</span>
                 <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-slate-400">{readyQueue.length} Waiting</span>
               </div>
               <div className="flex flex-wrap gap-2 h-12 items-center">
                 {readyQueue.length > 0 ? (
                   readyQueue.map(p => (
                     <motion.div 
                        key={p.id} 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }}
                        className="px-3 py-1 rounded-lg border border-white/10 flex items-center gap-2 bg-white/5"
                     >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
                        <span className="text-sm font-bold">{p.label}</span>
                     </motion.div>
                   ))
                 ) : (
                   <span className="text-sm text-slate-600 italic">No processes waiting</span>
                 )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {simulationState === 'setup' && processes.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card mt-12 overflow-hidden"
        >
          <div className="p-4 bg-white/5 border-b border-white/10">
            <h3 className="font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Input Overview
            </h3>
          </div>
          <div className="p-4 flex flex-wrap gap-4">
            {processes.map(p => (
              <div key={p.id} className="text-sm px-3 py-1.5 bg-slate-800/80 rounded-lg border border-white/5 flex items-center gap-2">
                <span className="font-bold" style={{ color: p.color }}>{p.label}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">AT: {p.arrivalTime}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">BT: {p.burstTime}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProcessInputPanel;
