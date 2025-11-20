/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-10-06 20:30:34
 * @LastEditors: mike mike@kupotech.com
 * @LastEditTime: 2024-06-27 13:27:12
 * @FilePath: /trade-web/src/utils/sentry.js
 * @Description:
 */
/**
 * Owner: borden@kupotech.com
 */

// 上报只在测试环境和线上环境
// 测试环境上报 trad-web-debug 线上上报 trade-web

import sentry from '@kc/sentry';
import { _IS_TEST_ENV_, IS_PROD } from 'src/utils/env';

const debugDsn =
  'https://93e3392d93b44324bb7fe31911e74d7f@sentry-v2.staticimg.co/4';
const prodDsn =
  'https://3e8c6ea20018492abc3e1d2e4a18dcd9@sentry-v2.staticimg.co/5';

const commonSentryConfig = {
  projectName: 'trade-web',
  release: `${_APP_NAME_}@${_VERSION_}`,
};

const SentryConf = {
  'trade-web': {
    dsn: !_DEV_ ? prodDsn : debugDsn, // sentry 应用唯一地址，比如 https://954359c3c8024554933cec4677303001@sentry-v2.staticimg.co/3
  },
  'trade-web4.0': {
    dsn: 'https://a3a4a7682a234e3a9064ac0a6fa980f4@sentry-v2.staticimg.co/51',
  },
};

/**
 *
 * @param {'trade-web' | 'trade-web4.0'} [projectName]
 * @returns
 */
export const sentryInit = (projectName = 'trade-web') => {
  try {
    // 本地不上报
    if (_DEV_ && !LOCAL_SENTRY_DEBUG) {
      return;
    }
    if (_DEV_) {
      console.log('只在测试环境打印 => ', 'Sentry ProjectName: ', projectName);
    }
    // 测试环境根据参数判断是否上报，默认上报
    if (_IS_TEST_ENV_ && !SENTRY_DEBUG) {
      return;
    }
    sentry.init({
      ...commonSentryConfig,
      ...SentryConf[projectName],
      projectName,
      environment: _IS_TEST_ENV_ ? 'sit' : IS_PROD ? 'prod' : 'dev', // 当前环境，枚举值需要为 dev/sit/prod
      tracesSampleRate: 0.005, // 重新设置一个采样率 30W PV 差不多 1.5K
    });
  } catch (err) {
    console.error(err);
  }
};

// sentryInit();

export function reportIntlMissing(key) {
  try {
    sentry.captureEvent({
      message: `i18n key missing: ${key}`,
      level: 'error',
      tags: {
        errorType: 'i18n_missing_key',
      },
      fingerprint: key,
    });
  } catch (e) {
    console.log(e);
  }
}
