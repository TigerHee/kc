/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-03-03 11:22:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-06-24 15:06:46
 * @FilePath: /seo-service/app/projects/public-web/gen-default-routes.js
 * @Description:
 */
/**
 * 获取 public-web 静态路由
 * Owner: hanx.wei@kupotech.com
 */
const logger = require('@app/worker/logger');

const staticRoutes = [
  '/convert',
  '/kcs',
  '/download/android',
  '/download',
  '/download/ios',
  '/gemvote',
  '/gemvote/voting',
  '/gemvote/history',
  '/gemspace',
  '/cert',
  '/information/currencyOffline',
  '/gemslot',
  '/gempool',
  '/gempool/history',
];

module.exports = async function() {
  logger.debug(`start get default routes for ${this.host}${this.entry}`);
  const { THEME_DEFAULT, THEME_DARK } = this.configs.globalSupportThemes;
  const routesInfo = {
    routeSetName: 'default',
    priority: 1,
    withoutLang: [],
    withLang: null,
    isApp: false,
    themes: [THEME_DEFAULT, THEME_DARK],
  };
  return this.stopFlag
    ? routesInfo
    : {
      ...routesInfo,
      withoutLang: staticRoutes,
    };
};
