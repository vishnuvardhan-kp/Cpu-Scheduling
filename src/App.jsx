
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AlgorithmSelector from './components/AlgorithmSelector';
import ProcessInputPanel from './components/ProcessInputPanel';
import GanttChart from './components/GanttChart';
import MetricsPanel from './components/MetricsPanel';
import { calculateFCFS, calculateSJF, calculateSRTF, calculatePriority, calculateRoundRobin } from './utils/algorithms';
import { Moon, Sun, Monitor } from 'lucide-react';

const COLORS = [
  '#6366f1', '#a855f7', '#ec4899', '#f43f5e', 
  '#f59e0b', '#10b981', '#06b6d4', '#3b82f6',
  '#8b5cf6', '#d946ef'
];


function App() {
  const [algorithm, setAlgorithm] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Simulation State
  const [simulationState, setSimulationState] = useState('setup'); // 'setup', 'running', 'paused', 'finished'
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(500); // ms per unit
  const [ganttSegments, setGanttSegments] = useState([]);
  const [fullPlan, setFullPlan] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Default processes
  useEffect(() => {
    if (processes.length === 0) {
      addProcess(0, 5, 1);
      addProcess(2, 3, 2);
    }
  }, []);

  // Simulation Loop
  useEffect(() => {
    let interval = null;
    if (simulationState === 'running' && fullPlan) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          const totalDuration = fullPlan.timeline.length > 0 
            ? fullPlan.timeline[fullPlan.timeline.length - 1].endTime 
            : 0;
          
          if (next > totalDuration) {
            setSimulationState('finished');
            setShowResults(true);
            clearInterval(interval);
            return prev;
          }
          return next;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [simulationState, fullPlan, playbackSpeed]);

  // Update segments based on currentTime
  useEffect(() => {
    if (!fullPlan || currentTime === 0) return;

    const currentProcessEntry = fullPlan.timeline.find(
      entry => currentTime > entry.startTime && currentTime <= entry.endTime
    );

    if (currentProcessEntry) {
      setGanttSegments(prev => {
        const lastSegment = prev[prev.length - 1];
        if (lastSegment && lastSegment.processId === currentProcessEntry.processId && lastSegment.endTime === currentTime - 1) {
          // Extend current segment
          const updated = [...prev];
          updated[updated.length - 1] = { ...lastSegment, endTime: currentTime };
          return updated;
        } else {
          // Start new segment
          return [...prev, {
            ...currentProcessEntry,
            startTime: currentTime - 1,
            endTime: currentTime,
            segmentId: Date.now()
          }];
        }
      });
    }
  }, [currentTime, fullPlan]);

  const addProcess = (at = 0, bt = 5, pri = 1) => {
    const newId = processes.length > 0 ? Math.max(...processes.map(p => p.id)) + 1 : 1;
    const newProcess = {
      id: newId,
      label: `P${newId}`,
      arrivalTime: at,
      burstTime: bt,
      priority: pri,
      color: COLORS[newId % COLORS.length]
    };
    setProcesses([...processes, newProcess]);
  };

  const updateProcess = (id, field, value) => {
    setProcesses(processes.map(p => p.id === id ? { ...p, [field]: value } : p));
    resetSimulation();
  };

  const removeProcess = (id) => {
    setProcesses(processes.filter(p => p.id !== id));
    resetSimulation();
  };

  const resetSimulation = () => {
    setSimulationState('setup');
    setCurrentTime(0);
    setGanttSegments([]);
    setFullPlan(null);
    setShowResults(false);
  };

  const runSimulation = () => {
    let result;
    switch (algorithm) {
      case 'FCFS': result = calculateFCFS(processes); break;
      case 'SJF': result = calculateSJF(processes); break;
      case 'SRTF': result = calculateSRTF(processes); break;
      case 'Priority': result = calculatePriority(processes); break;
      case 'RR': result = calculateRoundRobin(processes, timeQuantum); break;
      default: return;
    }
    
    setFullPlan(result);
    setGanttSegments([]);
    setCurrentTime(0);
    setSimulationState('running');
    setShowResults(false);
    
    // Scroll to chart
    setTimeout(() => {
      const chart = document.getElementById('gantt-chart-section');
      if (chart) chart.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const reset = () => {
    setProcesses([]);
    resetSimulation();
    addProcess(0, 5, 1);
    addProcess(2, 3, 2);
  };

  // Derived state for live display
  const activeProcess = fullPlan?.timeline.find(
    entry => currentTime > entry.startTime && currentTime <= entry.endTime
  );

  const readyQueue = processes.filter(p => {
    const isArrived = p.arrivalTime <= currentTime;
    const isNotStarted = !fullPlan?.timeline.some(e => e.processId === p.id && e.startTime < currentTime);
    const isNotFinished = fullPlan?.timeline.some(e => e.processId === p.id && e.endTime > currentTime);
    // Rough logic for ready queue: arrived and either not started or was running but not yet finished
    return isArrived && (isNotStarted || (isNotFinished && activeProcess?.processId !== p.id));
  });

  const completedProcesses = processes.filter(p => {
    const lastEntry = fullPlan?.timeline.filter(e => e.processId === p.id).pop();
    return lastEntry && lastEntry.endTime <= currentTime;
  });

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 dark:opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500 blur-[120px]"></div>
      </div>

      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/50">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Schedulero</span>
        </div>
        
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-3 bg-white/5 dark:bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
      </nav>

      <main className="relative z-10 pb-20">
        <AnimatePresence mode="wait">
          {!algorithm ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <AlgorithmSelector onSelect={setAlgorithm} isDarkMode={isDarkMode} />
            </motion.div>
          ) : (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ProcessInputPanel 
                algorithm={algorithm}
                processes={processes}
                addProcess={() => addProcess()}
                updateProcess={updateProcess}
                removeProcess={removeProcess}
                timeQuantum={timeQuantum}
                setTimeQuantum={setTimeQuantum}
                startSimulation={runSimulation}
                reset={reset}
                back={() => { setAlgorithm(null); resetSimulation(); }}
                simulationState={simulationState}
                setSimulationState={setSimulationState}
                playbackSpeed={playbackSpeed}
                setPlaybackSpeed={setPlaybackSpeed}
                currentTime={currentTime}
                activeProcess={activeProcess}
                readyQueue={readyQueue}
                completedProcesses={completedProcesses}
                isDarkMode={isDarkMode}
              />

              <div id="gantt-chart-section" className="max-w-7xl mx-auto px-6">
                {(simulationState !== 'setup' || ganttSegments.length > 0) && (
                  <>
                    <GanttChart 
                      segments={ganttSegments} 
                      currentTime={currentTime} 
                      totalDuration={fullPlan?.timeline.length > 0 ? fullPlan.timeline[fullPlan.timeline.length - 1].endTime : 0}
                      activeProcessId={activeProcess?.processId}
                      isDarkMode={isDarkMode}
                    />
                    
                    {showResults && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <MetricsPanel processes={processes} metrics={fullPlan?.metrics} isDarkMode={isDarkMode} />
                      </motion.div>
                    )}
                    
                    <div className="flex justify-center mt-12 gap-4">
                       {simulationState === 'finished' && (
                         <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => { resetSimulation(); runSimulation(); }}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full text-sm font-bold shadow-lg"
                         >
                           Replay Simulation
                         </motion.button>
                       )}
                      <motion.button
                         whileHover={{ scale: 1.05 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                         className="px-8 py-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-sm font-bold"
                      >
                        Back to Top
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 p-8 text-center text-slate-500 text-sm">
        <p>© 2026 Schedulero · Advanced CPU Scheduling Simulator</p>
      </footer>
    </div>
  );
}

export default App;
