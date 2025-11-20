const os = require('os');
const dayjs = require('dayjs');
const fse = require('fs-extra');
const Logger = require('@kc-node/logger');

// const KAFKA_BROKERS = '10.40.0.24:9092,10.40.0.25:9092,10.40.0.26:9092,10.40.0.28:9092,10.40.0.29:9092';
// const KAFKA_BROKERS = 'kfk28-new-log1.kucoin:9092,kfk28-new-log2.kucoin:9092,kfk28-new-log3.kucoin:9092,kfk28-new-log4.kucoin:9092,kfk28-new-log5.kucoin:9092,kfk28-new-log6.kucoin:9092,kfk28-new-log7.kucoin:9092'
// const KAFKA_TOPIC = 'other-biz-logs';

class JsonLogger {
  constructor(options) {
    this.app = options.app || 'unknown';
    this.logPath = options.logPath;

    fse.ensureFileSync(this.logPath);

    this.logger = new Logger({
      name: this.app,
      appenders: {
        log: {
          type: 'dateFile',
          pattern: 'yyyy-MM-dd',
          filename: this.logPath,
          layout: {
            type: 'pattern',
            pattern: '%d{yyyy-MM-dd hh:mm:ss.SSS} [%p] [%c] - %m',
          },
          maxLogSize: 1024 * 1024 * 1024,
          numBackups: 3,
        },
      },
    });
  }

  generateContent(level, message) {
    const content = Object.create(null);
    content.app = this.app;
    content.hostname = os.hostname();
    content.env = process.env.serverEnv;
    content['@timestamp'] = dayjs().format();
    content.level = level;
    content.message = message;
    return message;
  }

  // writeLog(level, message) {

  // }

  info(message, data) {
    if (data) {
      message = `${message}\n${JSON.stringify(data)}`;
    }
    // this.writeLog('INFO', message);
    this.logger.info(message);
  }

  warn(message) {
    // this.writeLog('WARN', message);
    this.logger.warn(message);
  }

  error(message, error) {
    if (error) {
      message = `${message}\n${error.message || ''}\n${error.stack || ''}`;
    }
    // this.writeLog('ERROR', message);
    this.logger.error(message);
  }

  debug(message, data) {
    if (data) {
      message = `${message}\n${JSON.stringify(data)}`;
    }
    // this.writeLog('DEBUG', message);
    this.logger.debug(message);
  }
}

module.exports = JsonLogger;
