/**
 * Owner: hanx.wei@kupotech.com
 */
const cluster = require('cluster');
const logger = require('@app/master/logger');
const robot = require('@app/master/robot');

class Messenger {
  constructor(master) {
    this.master = master;
  }

  listen() {
    cluster.on('message', (worker, data) => {
      const { fromWorker, event, payload } = data;
      if (event === 'log') {
        const { method, message, extend } = payload;
        logger[method](message, extend);
        return;
      } else if (event === 'notice') {
        const { method, message, isHTML } = payload;
        robot[method](message, isHTML);
        return;
      }
      this.master.emit(event, { eventName: event, fromWorker, instance: worker, payload });
    });
  }

  send(workers, data) {
    if (Array.isArray(workers)) {
      for (const worker of workers) {
        worker.send(data);
      }
    } else {
      workers.send(data);
    }
  }
}

module.exports = Messenger;
