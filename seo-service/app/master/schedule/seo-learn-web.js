/**
 * Owner: ella.wang@kupotech.com
 */
const robot = require('@app/master/robot');
const logger = require('@app/master/logger');

function seoLearnWebSchedule() {
  const projectName = 'seo-learn-web';
  logger.info(`触发 ${projectName} lambda 定时任务`);
  robot.info(`触发 ${projectName} lambda 定时任务`);
  // 测试环境跳过
  if (this.master.options.config.IS_TEST_ENV) {
    logger.info('测试环境跳过定时任务执行');
    return;
  }
  // 如果当前 project 在执行中，则本次定时任务不再触发
  const project = this.master.projectManager.getProject(projectName);
  if (project) return;

  this.master.startLambdaScheduleWork(projectName);
}

module.exports = seoLearnWebSchedule;
