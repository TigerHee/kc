/**
 * Owner: hanx.wei@kupotech.com
 */
const Logger = require('./log');
const config = require('@scripts/config');

const logger = new Logger({
  app: 'SEO-SERVICE',
  logPath: config.logPath,
});

module.exports = logger;
