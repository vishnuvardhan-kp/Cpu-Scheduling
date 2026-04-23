
export const calculateFCFS = (processes) => {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;
  const timeline = [];
  const metrics = {};

  sorted.forEach((p) => {
    if (currentTime < p.arrivalTime) {
      currentTime = p.arrivalTime;
    }
    const start = currentTime;
    currentTime += p.burstTime;
    timeline.push({
      processId: p.id,
      label: p.label,
      startTime: start,
      endTime: currentTime,
      color: p.color
    });
    
    const turnaroundTime = currentTime - p.arrivalTime;
    metrics[p.id] = {
      turnaroundTime,
      waitingTime: turnaroundTime - p.burstTime,
    };
  });

  return { timeline, metrics };
};

export const calculateSJF = (processes) => {
  let currentTime = 0;
  const timeline = [];
  const metrics = {};
  const remaining = [...processes].map(p => ({ ...p }));
  const completed = [];

  while (completed.length < processes.length) {
    const available = remaining.filter(p => !completed.includes(p.id) && p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      currentTime = Math.min(...remaining.filter(p => !completed.includes(p.id)).map(p => p.arrivalTime));
      continue;
    }

    const next = available.reduce((prev, curr) => curr.burstTime < prev.burstTime ? curr : prev);
    
    const start = currentTime;
    currentTime += next.burstTime;
    timeline.push({
      processId: next.id,
      label: next.label,
      startTime: start,
      endTime: currentTime,
      color: next.color
    });

    const turnaroundTime = currentTime - next.arrivalTime;
    metrics[next.id] = {
      turnaroundTime,
      waitingTime: turnaroundTime - next.burstTime,
    };
    completed.push(next.id);
  }

  return { timeline, metrics };
};

export const calculateSRTF = (processes) => {
  let currentTime = 0;
  const timeline = [];
  const metrics = {};
  const remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  const completed = [];
  
  let currentProcess = null;
  let lastSwitchTime = 0;

  while (completed.length < processes.length) {
    const available = remaining.filter(p => !completed.includes(p.id) && p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      currentTime = Math.min(...remaining.filter(p => !completed.includes(p.id)).map(p => p.arrivalTime));
      continue;
    }

    const next = available.reduce((prev, curr) => curr.remainingTime < prev.remainingTime ? curr : prev);

    if (currentProcess && currentProcess.id !== next.id) {
      timeline.push({
        processId: currentProcess.id,
        label: currentProcess.label,
        startTime: lastSwitchTime,
        endTime: currentTime,
        color: currentProcess.color
      });
      lastSwitchTime = currentTime;
    }

    if (!currentProcess || currentProcess.id !== next.id) {
      currentProcess = next;
      lastSwitchTime = currentTime;
    }

    currentTime++;
    next.remainingTime--;

    if (next.remainingTime === 0) {
      timeline.push({
        processId: next.id,
        label: next.label,
        startTime: lastSwitchTime,
        endTime: currentTime,
        color: next.color
      });
      lastSwitchTime = currentTime;
      
      const turnaroundTime = currentTime - next.arrivalTime;
      metrics[next.id] = {
        turnaroundTime,
        waitingTime: turnaroundTime - next.burstTime,
      };
      completed.push(next.id);
      currentProcess = null;
    }
  }

  return { timeline, metrics };
};

export const calculatePriority = (processes) => {
  let currentTime = 0;
  const timeline = [];
  const metrics = {};
  const remaining = [...processes].map(p => ({ ...p }));
  const completed = [];

  while (completed.length < processes.length) {
    const available = remaining.filter(p => !completed.includes(p.id) && p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      currentTime = Math.min(...remaining.filter(p => !completed.includes(p.id)).map(p => p.arrivalTime));
      continue;
    }

    // Lower number = Higher priority
    const next = available.reduce((prev, curr) => curr.priority < prev.priority ? curr : prev);
    
    const start = currentTime;
    currentTime += next.burstTime;
    timeline.push({
      processId: next.id,
      label: next.label,
      startTime: start,
      endTime: currentTime,
      color: next.color
    });

    const turnaroundTime = currentTime - next.arrivalTime;
    metrics[next.id] = {
      turnaroundTime,
      waitingTime: turnaroundTime - next.burstTime,
    };
    completed.push(next.id);
  }

  return { timeline, metrics };
};

export const calculateRoundRobin = (processes, quantum) => {
  let currentTime = 0;
  const timeline = [];
  const metrics = {};
  const remaining = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
  const queue = [];
  const completed = [];
  
  // Initial fill: find processes that arrive at time 0
  const sortedByArrival = [...remaining].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const addToQueue = (time, excludingProcessId) => {
    sortedByArrival.forEach(p => {
      if (p.arrivalTime <= time && 
          p.id !== excludingProcessId && 
          !queue.find(qp => qp.id === p.id) && 
          !completed.includes(p.id)) {
        queue.push(p);
      }
    });
  };

  currentTime = sortedByArrival[0].arrivalTime;
  addToQueue(currentTime, null);

  while (completed.length < processes.length) {
    if (queue.length === 0) {
      const nextArrival = sortedByArrival.find(p => !completed.includes(p.id));
      if (nextArrival) {
        currentTime = nextArrival.arrivalTime;
        addToQueue(currentTime, null);
      } else break;
    }

    const current = queue.shift();
    const start = currentTime;
    const executeTime = Math.min(current.remainingTime, quantum);
    
    currentTime += executeTime;
    current.remainingTime -= executeTime;
    
    timeline.push({
      processId: current.id,
      label: current.label,
      startTime: start,
      endTime: currentTime,
      color: current.color
    });

    // New processes arriving during execution should be added to queue BEFORE returning the current process
    addToQueue(currentTime, current.id);

    if (current.remainingTime > 0) {
      queue.push(current);
    } else {
      const turnaroundTime = currentTime - current.arrivalTime;
      metrics[current.id] = {
        turnaroundTime,
        waitingTime: turnaroundTime - current.burstTime,
      };
      completed.push(current.id);
    }
  }

  return { timeline, metrics };
};
