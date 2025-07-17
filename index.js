const axios = require("axios");
const { Worker, isMainThread, parentPort } = require("worker_threads");

const TARGET_URL = "http://localhost:10617";
const REQUESTS_PER_WORKER = 1000;

async function sendRequests() {
  for (let i = 0; i < REQUESTS_PER_WORKER; i++) {
    try {
      await axios.get(TARGET_URL);
       console.log(`Request ${i + 1} OK`);
    } catch (error) {
       console.error(`Request ${i + 1} failed`);
    }
  }
  parentPort.postMessage("done");
}

if (isMainThread) {
  const WORKER_COUNT = 10; // Número de hilos paralelos

  for (let i = 0; i < WORKER_COUNT; i++) {
    const worker = new Worker(__filename);
    worker.on("message", msg => {
      if (msg === "done") {
        console.log(`Worker ${i + 1} finished`);
      }
    });
  }
} else {
  sendRequests();
}
