/**
 * Owner: hanx.wei@kupotech.com
 */

module.exports = {
  send(method, message, isHTML) {
    process.send({
      fromWorker: process.env.worker_index,
      event: 'notice',
      payload: {
        method,
        message,
        isHTML,
      },
    });
  },

  info(message, isHTML = false) {
    this.send('info', message, isHTML);
  },

  warn(message, isHTML = false) {
    this.send('warn', message, isHTML);
  },

  error(message, isHTML = false) {
    this.send('error', message, isHTML);
  },
};
