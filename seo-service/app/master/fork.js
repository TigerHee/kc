/**
 * Owner: hanx.wei@kupotech.com
 */
const cluster = require('cluster');
const path = require('path');

function forkAll(options) {
  forkRouteTaskWorker();
  for (let i = 1; i <= options.count; i++) {
    forkOne({ index: i.toString(), ...options });
  }
}

function forkOne(options) {
  const { index, env = {}, settings = {} } = options;
  const workerFile = path.resolve(__dirname, '../worker/index.js');
  cluster.setupMaster({
    ...settings,
    exec: workerFile,
  });
  const worker = cluster.fork({
    ...env,
    worker_index: index,
  });
  worker.__index = index;
}

function forkRouteTaskWorker() {
  const workerFile = path.resolve(__dirname, '../worker/route-task-worker.js');
  cluster.setupMaster({
    exec: workerFile,
  });
  const worker = cluster.fork({
    worker_index: '0',
  });
  worker.__index = '0';
}

exports.forkAll = forkAll;
exports.forkOne = forkOne;
exports.forkRouteTaskWorker = forkRouteTaskWorker;
