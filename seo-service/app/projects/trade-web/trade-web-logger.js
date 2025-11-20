/**
 * Owner: will.wang@kupotech.com
 */

/**
 * 通过子进程往父进程发消息，实现父进程输出log，避免进程之间文件写入冲突
 * @param {*} type log类型
 * @param {*} message 消息
 */
const sendLog = (type, message) => {
  try {
    process.send({ type, message });
  } catch (error) {
    console.log('trade web log失败');
  }
};

module.exports = {
  info: message => {
    sendLog('info', message);
  },
  warn: message => {
    sendLog('warn', message);
  },
  error: message => {
    sendLog('error', message);
  },
  debug: message => {
    sendLog('debug', message);
  },
};
