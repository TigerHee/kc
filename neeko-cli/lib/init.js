/**
 * Owner: simple@kupotech.com
 */
const fs = require('fs');
const chalk = require('chalk');
const { PROJECT_CONFIG, CONF_TEMP, TASK_TEMP } = require('./const');
const log = console.log;

const init = () => {
  fs.access(PROJECT_CONFIG.dir, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdirSync(PROJECT_CONFIG.dir);
    }
    fs.access(PROJECT_CONFIG.configFile, fs.constants.F_OK, (err) => {
      if (err) {
        fs.writeFileSync(PROJECT_CONFIG.configFile, CONF_TEMP, 'utf8');
      }

      log(chalk.greenBright('init config success!'));
    });
    fs.access(PROJECT_CONFIG.taskFile, fs.constants.F_OK, (err) => {
      if (err) {
        fs.writeFileSync(PROJECT_CONFIG.taskFile, TASK_TEMP, 'utf8');
      }

      log(chalk.greenBright('init task.json success!'));
    });
  });
};

module.exports = init;
