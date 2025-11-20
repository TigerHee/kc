/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-29 15:13:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-24 15:06:15
 * @FilePath: /seo-service/app/projects/public-web/gen-app-default-routes.js
 * @Description:
 */
const logger = require('@app/worker/logger');

const staticRoutes = [
  '/pre-market',
  '/gemvote',
  '/gemvote/history',
  '/gemvote/voting',
  '/gemspace',
  '/gemslot',
  '/gempool',
  '/gempool/history',
];

module.exports = async function() {
  logger.debug(`start get app default routes for ${this.host}${this.entry}`);
  const { THEME_DEFAULT } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'app-default',
    priority: 3,
    withoutLang: [],
    withLang: null,
    isApp: true,
    // themes: [ THEME_DEFAULT, THEME_DARK ], // dark 主题测试
    themes: [THEME_DEFAULT],
  };
  return this.stopFlag
    ? routesInfo
    : {
      ...routesInfo,
      withoutLang: staticRoutes,
    };
};
