/**
 * Owner: willen@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { isIOS } from 'helper';
import sensors from 'tools/ext/kc-sensors';
import { IS_PROD } from 'utils/env';
import isMobile from 'utils/isMobile';

// 神策sdk- track方法
// 神策sdk原生track方法，详情参阅神策sdk文档
export const track = (eventType, options) => {
  sensors.track(eventType, options);
};

export const trackClick = (spm, data = {}) => {
  sensors.trackClick(spm, data);
};

// 获取神策 ab 结果
export const getSensorsABResult = async (options) => {
  const _config = options || {};
  return await sensors?.fastFetchABTest(_config);
};

// 上报接口耗时
export const trackRequest = (requestName, duration) => {
  if (!IS_PROD) {
    console.log(`${requestName} ${duration}`);
  }
  sensors.track('web_request_performance', {
    url: window.location.href,
    app_name: 'ucenter_web',
    request_name: requestName,
    request_duration: duration,
    platform: isMobile() ? (isIOS() ? 'ios' : 'android') : 'web',
    is_app: JsBridge.isApp(),
  });
};
