/**
 * Owner: hanx.wei@kupotech.com
 */
const EventEmitter = require('events');

/**
 * worker.current = { project, taskId }
 * instance = cluster:worker
 */
class WorkerManager extends EventEmitter {
  constructor(config) {
    super();
    this.workers = new Map();
    this.workingPageWorkerLimit = config.workerCount;
    this.workingPageWorkerCount = 0;
  }

  workerIndexKey(index) {
    return `worker_index_${index}`;
  }

  initWorker(index, worker) {
    const key = this.workerIndexKey(index);
    const tag = index !== '0' ? 'page' : 'route';
    this.workers.set(key, {
      current: null,
      instance: worker,
      tag,
    });
  }

  deleteWorker(index) {
    const key = this.workerIndexKey(index);
    return this.workers.delete(key);
  }

  getWorker(index) {
    const key = this.workerIndexKey(index);
    return this.workers.get(key);
  }

  setWorkerFree(worker) {
    worker.current = null;
    if (worker.tag === 'page') {
      this.workingPageWorkerCount--;
    }
  }

  setWorkerWorking(current, worker) {
    if (worker.tag === 'page' && worker.current === null) {
      this.workingPageWorkerCount++;
    }
    worker.current = current;
  }

  getFreeRouteWorker() {
    const key = this.workerIndexKey('0');
    const worker = this.workers.get(key);
    return worker.current === null ? worker : null;
  }

  getFreePageWorker() {
    if (this.workingPageWorkerCount === this.workingPageWorkerLimit) return null;
    const iter = this.workers.values();
    let worker = iter.next().value;
    while (worker) {
      if (
        worker.tag === 'page' &&
        worker.current === null &&
        this.workingPageWorkerCount < this.workingPageWorkerLimit
      ) {
        return worker;
      }
      worker = iter.next().value;
    }
    return null;
  }

  getWorkingProjectWorkers(projectName) {
    const iter = this.workers.values();
    const workers = [];
    let worker = iter.next().value;
    while (worker) {
      if (worker.current && worker.current.project === projectName) {
        workers.push(worker);
      }
      worker = iter.next().value;
    }
    return workers;
  }
}

module.exports = WorkerManager;
