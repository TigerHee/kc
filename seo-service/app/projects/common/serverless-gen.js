/**
 * aws serverless 调用
 * Owner: hanx.wei@kupotech.com
 */
const { request } = require('urllib');
const { SERVERLESS_TRIGGER } = require('@scripts/config');
const logger = require('@app/worker/logger');
const sliceArray = require('@utils/slice-array');

async function requestServerless(data) {
  try {
    const result = await request(SERVERLESS_TRIGGER, {
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data,
    });
    if (result.statusCode !== 200) {
      throw new Error(`Request serverless failed, code ${result.statusCode}`);
    }
    return result.data;
  } catch (err) {
    // console.log('Serverless Trigger Error', err);
    logger.error('Serverless Trigger Error', err);
  }
}

async function callServerlessGen(
  projectName,
  urls,
  pageType,
  theme,
  lambdaOptions
) {
  await requestServerless({
    pageType,
    projectName,
    urls,
    taskType: 'GEN',
    theme,
    lambdaOptions,
  });
}

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

async function startServerlessJob(langs, routesInfo, lambdaOptions) {
  const tasks = genServerlessTasks(this.config.projectName, langs, routesInfo);
  logger.debug(`start serverless tasks ${tasks.length}`);
  for (const task of tasks) {
    const urls = genUrls(task, this.host, this.entry);
    logger.debug(
      `start call serverless gen, task: ${task.lang}, urls: ${urls.length}`
    );
    // console.log(`start call serverless gen, task: ${task.lang}, urls: ${urls.length}`);
    // logger.debug(`${urls}`);
    await callServerlessGen(
      task.projectName,
      urls,
      'pc',
      task.theme,
      lambdaOptions
    );
    if (this.config.mobileGen) {
      await callServerlessGen(
        task.projectName,
        urls,
        'mobile',
        task.theme,
        lambdaOptions
      );
    }
    // await new Promise(resolve => setTimeout(resolve, 1000));
    const resetStopFlag = false;
    if (this.checkStopFlag(resetStopFlag)) break;
  }
  logger.debug('serverless tasks call end');
}

module.exports = startServerlessJob;
