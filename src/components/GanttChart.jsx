import { motion } from 'framer-motion';

const GanttChart = ({ segments, currentTime, totalDuration, activeProcessId, isDarkMode }) => {
  if (!segments) return null;

  // Ensure totalDuration is at least the current time to allow playhead movement
  const displayDuration = Math.max(totalDuration || 0, currentTime, 10);
  
  return (
    <div className="glass-card mt-12 overflow-hidden border-indigo-500/20">
      <div className="p-4 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
           <h3 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
             <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
             Real-Time Execution Timeline
           </h3>
        </div>
        <div className="flex gap-4 text-xs font-mono">
           <span className="text-slate-500 dark:text-slate-400">Time: <span className="text-indigo-600 dark:text-indigo-400">{currentTime}</span></span>
           <span className="text-slate-500 dark:text-slate-400">Total: <span className="text-slate-600 dark:text-slate-200">{totalDuration}</span></span>
        </div>
      </div>
      
      <div className="p-8 overflow-x-auto">
        <div className="relative pt-10 pb-12 min-w-[800px]">
          {/* Time markers */}
          <div className="absolute top-0 left-0 w-full h-full flex">
            {Array.from({ length: displayDuration + 1 }).map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 border-l border-white/${i % 5 === 0 ? '10' : '5'} relative`}
                style={{ flexBasis: `${100 / displayDuration}%` }}
              >
                {i % 2 === 0 && (
                  <span className="absolute -top-6 left-0 -translate-x-1/2 text-[10px] text-slate-500 font-mono">
                    {i}
                  </span>
                ) }
              </div>
            ))}
          </div>

          {/* Process bars */}
          <div className="relative h-20 flex items-center bg-slate-50 dark:bg-white/5 rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-inner">
            {segments.map((item, index) => {
              const width = ((item.endTime - item.startTime) / displayDuration) * 100;
              const left = (item.startTime / displayDuration) * 100;
              const isActive = activeProcessId === item.processId && item.endTime === currentTime;

              return (
                <motion.div
                  key={item.segmentId || index}
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`absolute h-full flex items-center justify-center border-r border-white/20 overflow-hidden ${isActive ? 'z-10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : ''}`}
                  style={{ 
                    left: `${left}%`, 
                    width: `${width}%`,
                    backgroundColor: isDarkMode ? item.color + '66' : item.color + '22',
                    borderLeft: `4px solid ${item.color}`,
                    color: isDarkMode ? '#fff' : '#1e293b' // Keep white text in dark mode, dark in light mode
                  }}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="pulsar"
                      className="absolute inset-0 bg-white/10"
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                  <div className="flex flex-col items-center">
                    <span className="font-black text-sm drop-shadow-md">
                      {item.label}
                    </span>
                    {width > 5 && (
                      <span className="text-[10px] opacity-60 font-bold">
                        {item.startTime}-{item.endTime}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Playhead */}
          <motion.div 
            className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 z-20 shadow-[0_0_10px_theme(colors.indigo.500)]"
            animate={{ left: `${(currentTime / displayDuration) * 100}%` }}
            transition={{ type: "tween", ease: "linear", duration: 0.5 }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rotate-45 rounded-sm"></div>
            <div className="absolute top-2 left-2 bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded font-black shadow-lg whitespace-nowrap">
              T = {currentTime}
            </div>
          </motion.div>
          
          {/* Legend/Labels at bottom */}
          <div className="absolute -bottom-10 left-0 w-full px-2">
             <div className="flex justify-between w-full text-[10px] text-slate-500 font-bold uppercase tracking-widest">
               <span>Start Sequence</span>
               <span>Predicted Finish ({totalDuration})</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
