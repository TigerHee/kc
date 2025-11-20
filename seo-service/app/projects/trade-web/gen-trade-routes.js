/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-06-19 15:44:28
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-06-20 16:12:52
 * @FilePath: /seo-service/app/projects/trade-web/gen-trade-routes.js
 * @Description:
 */
/**
 * Owner: Chelsey.Fan@kupotech.com
 */
const fetch = require('isomorphic-fetch');
const { getUrlPath } = require('./constants');
async function main(langPrefixs, apiHost, subPath) {
  if (langPrefixs.length < 1) {
    langPrefixs = [];
  }
  try {
    let routesWithoutLang = [];
    if (subPath === '/trade') {
      const data =
        (await fetch(
          `${apiHost}/_api/currency/symbols`
        ) /** 获取所有语言的现货交易对 */
          .then(res => res.json())
          .then(res => res.data)) || [];
      routesWithoutLang = data.map(
        ({ code }) => `${subPath}${getUrlPath(code)}`
      );
    } else if (subPath === '/trade/margin') {
      const marginData =
        (await fetch(
          `${apiHost}/_api/margin-config/margin-symbols`
        ) /** 获取所有语言的杠杆交易对 */
          .then(res => res.json())
          .then(res => res.data)) || [];

      routesWithoutLang = marginData
        .filter(item => item.isMarginEnabled === true)
        .map(item => `${subPath}${getUrlPath(item.symbol)}`);
    } else if (subPath === '/trade/isolated') {
      const marginData =
        (await fetch(
          `${apiHost}/_api/margin-config/margin-symbols`
        ) /** 获取所有语言的杠杆交易对 */
          .then(res => res.json())
          .then(res => res.data)) || [];

      routesWithoutLang = marginData
        .filter(item => item.isIsolatedEnabled === true)
        .map(item => `${subPath}${getUrlPath(item.symbol)}`);
    }

    return this.stopFlag
      ? {
        withoutLang: [],
      }
      : {
        withoutLang: routesWithoutLang,
      };
  } catch (err) {
    console.log(err);
    return {
      withoutLang: [],
    };
  }
}
module.exports = main;
