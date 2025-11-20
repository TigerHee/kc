/**
 * aws serverless 调用，给定时任务使用的
 * Owner: hanx.wei@kupotech.com
 */
const { callServerlessGen } = require('@app/master/call-serverless');
const logger = require('@app/master/logger');
const sliceArray = require('@utils/slice-array');

function genServerlessTasks(projectName, langs, routesInfo) {
  const allTasks = [];
  for (const theme of routesInfo.themes) {
    if (routesInfo.withoutLang.length !== 0) {
      // 生成不带语言的路由
      const slicedRoutes = sliceArray(routesInfo.withoutLang);
      langs.forEach(lang => {
        const tasks = slicedRoutes.map(routes => {
          return {
            lang,
            projectName,
            routes,
            routeSetName: routesInfo.routeSetName,
            isApp: routesInfo.isApp,
            theme,
          };
        });
        allTasks.push(...tasks);
      });
    }
    if (routesInfo.withLang !== null) {
      // 不同语言需要生成的路由不一样
      Object.keys(routesInfo.withLang).forEach(lang => {
        const slicedRoutes = sliceArray(routesInfo.withLang[lang]);
        const tasks = slicedRoutes.map(routes => {
          return {
            lang,
            projectName,
            routes,
            routeWithLangPrefix: true,
            routeSetName: routesInfo.routeSetName,
            isApp: routesInfo.isApp,
            theme,
          };
        });
        allTasks.push(...tasks);
      });
    }
  }
  return allTasks;
}

function genUrls(task, host, entry) {
  return task.routes.map(route => {
    if (task.routeSetName === 'routes') {
      // 指定路由不拼接 entry
      entry = '';
    }
    if (task.routeWithLangPrefix) {
      return `${host}${entry}${route}`;
    }
    return task.lang === 'en'
      ? `${host}${entry}${route}`
      : `${host}/${task.lang}${entry}${route}`;
  });
}

async function startServerlessJob(langs, routesInfo) {
  const tasks = genServerlessTasks(this.config.projectName, langs, routesInfo);
  logger.debug(`start serverless tasks ${tasks.length}`);
  for (const task of tasks) {
    const urls = genUrls(task, this.host, this.entry);
    logger.debug(`start call serverless gen, task: ${task.lang}, urls: ${urls.length}`);
    // logger.debug(`${urls}`);
    await callServerlessGen(task.projectName, urls, 'pc');
    if (this.config.mobileGen) {
      await callServerlessGen(task.projectName, urls, 'mobile');
    }
  }
  logger.debug('serverless tasks call end');
}

module.exports = startServerlessJob;
