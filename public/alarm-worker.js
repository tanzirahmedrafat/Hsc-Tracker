// Dedicated Background Web Worker for accurate alarm checking without DOM throttling

let intervalId = null;

self.onmessage = function (e) {
  if (e.data === 'START') {
    if (intervalId) clearInterval(intervalId);
    // Tick every 5 seconds to guarantee alarm catches exact minute
    intervalId = setInterval(() => {
      self.postMessage('TICK');
    }, 5000);
  } else if (e.data === 'STOP') {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
};
