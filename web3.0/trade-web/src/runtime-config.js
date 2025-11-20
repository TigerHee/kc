/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-06-12 17:25:10
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-08-14 16:29:56
 * @FilePath: /trade-web/src/runtime-config.js
 * @Description: browser
 */
/**
 * Owner: borden@kupotech.com
 */
/**
 * runtime: browser
 */

let siteRelation = {};
if (typeof window !== 'undefined') {
  if (typeof window._WEB_RELATION_ !== 'undefined') {
    siteRelation = window._WEB_RELATION_;
  } else {
    // Raven.captureException(new Error('GET undefined _WEB_RELATION_'));
  }
}

const runtimeConfig = _RUNTIME_CONFIG_;

runtimeConfig.siteCfg = {
  ...siteRelation,
  ...runtimeConfig.siteCfg,
};

runtimeConfig.DEFAULT_LANG = window._DEFAULT_LANG_;
runtimeConfig.DEFAULT_LOCALE = window._DEFAULT_LOCALE_;

module.exports = runtimeConfig;
