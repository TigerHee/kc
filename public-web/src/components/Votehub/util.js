/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-03-05 10:27:59
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-05 12:11:32
 * @FilePath: /public-web/src/components/Votehub/util.js
 * @Description:
 */
/**
 * Owner: jessie@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import history from '@kucoin-base/history';
import siteCfg from 'src/utils/siteConfig';

const { KUCOIN_HOST } = siteCfg;

// 收口跳转到登录方法，app调用原生
export const skip2Login = () => {
  const isInApp = JsBridge.isApp();
  if (isInApp) {
    JsBridge.open({
      type: 'jump',
      params: {
        url: '/user/login',
      },
    });
  } else {
    history.push('/ucenter/signin?backUrl=' + encodeURIComponent(window.location.href));
  }
};

// 通用跳转方法，app调用原生
export const skip2Url = (url, prefix = KUCOIN_HOST) => {
  const isInApp = JsBridge.isApp();
  // if (isInApp) {
  //   const tragetUrl = prefix + addLangToPath(url);
  //   JsBridge.open({
  //     type: 'jump',
  //     params: {
  //       url: `/link?url=${encodeURIComponent(tragetUrl)}`,
  //     },
  //   });
  // } else {
  history.push(url);
  //}
};
