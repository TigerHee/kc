/**
 * Owner: hanx.wei@kupotech.com
 */
require('module-alias/register');
const EventEmitter = require('events');
const ProjectsHandler = require('@app/projects');
const Messenger = require('@app/worker/messenger');
const configs = require('@scripts/config');
const robot = require('@app/worker/robot');
const logger = require('@app/worker/logger');

const WORKER_INDEX = process.env.worker_index;

process.on('uncaughtException', err => {
  console.log(err);
  logger.error(`worker ${WORKER_INDEX} process exit uncaughtException`, err);
  robot.error(`worker ${WORKER_INDEX} process exit uncaughtException: ${err.msg || err.message || err.type}`);
});
process.on('unhandledRejection', err => {
  console.log(err);
  logger.error(`worker ${WORKER_INDEX} process exit unhandledRejection`, err);
  robot.error(`worker ${WORKER_INDEX} process exit unhandledRejection: ${err.msg || err.message || err.type}`);
});

process.on('warning', e => logger.warn(`worker ${WORKER_INDEX} process warning: ${e.stack}`));

class RouteTaskWorker extends EventEmitter {
  constructor() {
    super();
    this.messenger = new Messenger(WORKER_INDEX, this);
    this.puppeteerManager = null;
    this.projectsHandler = new ProjectsHandler(configs, this);
    this.messenger.send({ event: 'worker-started' });
  }

  heartBeat() {
    this.messenger.send({
      event: 'worker-heart-beat',
    });
  }
}

new RouteTaskWorker();
