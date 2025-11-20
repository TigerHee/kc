/**
 * Owner: hanx.wei@kupotech.com
 */
const configs = require('@scripts/config');

module.exports = {
  send(method, message, extend) {
    process.send({
      fromWorker: process.env.worker_index,
      event: 'log',
      payload: {
        method,
        message,
        extend,
      },
    });
  },

  info(message, data) {
    this.send('info', message, data);
  },

  warn(message) {
    this.send('warn', message);
  },

  error(message, error) {
    if (error) {
      message = `${message}\n${error.message || ''}\n${error.stack || ''}`;
    }
    this.send('error', message);
  },

  debug(message, data) {
    configs.isDev && this.send('debug', message, data);
  },
};
