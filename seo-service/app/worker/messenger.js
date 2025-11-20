/**
 * Owner: hanx.wei@kupotech.com
 */
class Messenger {
  constructor(workerIndex, worker) {
    this.workerIndex = workerIndex;
    this.worker = worker;

    process.on('message', message => {
      if (!this.worker.projectsHandler) return;
      const { event, payload } = message;
      if (event === 'action') {
        const { projectName, handlerName, params } = payload;
        this.worker.projectsHandler[projectName][handlerName](params).then(event => {
          this.send(event);
        });
      } else if (event === 'heart-beat') {
        this.worker.heartBeat();
      } else {
        this.worker.projectsHandler.emit(event, payload);
      }
    });
  }

  send(data) {
    process.send({
      fromWorker: this.workerIndex,
      ...data,
    });
  }
}

module.exports = Messenger;
