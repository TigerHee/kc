/**
 * Owner: hanx.wei@kupotech.com
 */
const EventEmitter = require('events');
const Koa = require('koa');
const bodyParse = require('koa-bodyparser');
const routes = require('./routes');

class Server extends EventEmitter {
  constructor(master) {
    super();
    this.app = new Koa();
    this.app.use(bodyParse());
    if (process.env.USE_LOCAL) {
      this.app.use(require('./local')(master.options.config));
    }
    this.app.use(routes);
    this.app.server = this;
  }

  start(port) {
    this.app.listen(port, () => {
      console.log(`listen on http://localhost:${port}`);
      this.emit('server-started');
    });
  }
}

module.exports = Server;
