/**
 * Owner: hanx.wei@kupotech.com
 */
const robot = require('@app/master/robot');
const logger = require('@app/master/logger');
const { THEME_DEFAULT } = require('@scripts/themes');

// 一天三次，8小时一次的任务
function hoursTasksSchedule() {
  const routeSetName = 'price';
  logger.info(`触发 brisk-web 首页、${routeSetName} 定时任务`);

  logger.info(`触发 seo-price-web 首页、${routeSetName} 定时任务`);
  robot.info(`触发 seo-price-web 首页、${routeSetName} 定时任务`);
  // 测试环境跳过
  if (this.master.options.config.IS_TEST_ENV) {
    logger.info('测试环境跳过定时任务执行');
    return;
  }

  this.master.runRoutes({
    project: 'seo-price-web',
    routeSets: [routeSetName],
    // langs: [ 'en', 'zh-hant' ],
    keepDistFile: true,
  });
  this.master.runRoutes({
    project: 'brisk-web',
    routes: {
      [THEME_DEFAULT]: {
        webRoutes: ['/'], // 首页 useServerless:false
      },
    },
    insertCurrentProject: true, // 如果 public-web 已经在运行就插入当前的任务队列
    // langs: [ 'en', 'zh-hant' ],
    keepDistFile: true,
  });
}

module.exports = hoursTasksSchedule;
