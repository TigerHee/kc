/**
 * Owner: willen@kupotech.com
 */
// 上报只在测试环境和线上环境
// 测试环境上报 public-web-debug 线上上报 public-web
import sentry from '@kc/sentry';
import { IS_PROD_ENV, IS_TEST_ENV, _DEV_ } from 'utils/env';
import isMobile from 'utils/isMobile';
const env = _DEV_ ? 'dev' : IS_TEST_ENV ? 'sit' : 'prod';
const sentryInit = () => {
  const release = `${_APP_NAME_}@${_VERSION_}`;
  if (!IS_PROD_ENV) {
    return;
  }
  sentry.init({
    dsn: 'https://954359c3c8024554933cec4677303001@sentry-v2.staticimg.co/3',
    environment: env,
    release,
  });
  //ssg设备版本不一致异常
  checkSSGDevice();
};

sentryInit();
/**
 * 自定义异常
 */

//上报websocket重连5次异常
export function checkWsConnectError() {
  sentry.captureEvent({
    message: `websocket: 重连5次依然失败`,
    level: 'error',
    tags: {
      requestError: 'websocketError',
    },
    fingerprint: 'websocket连接异常',
  });
}

//ssg设备版本不一致异常
function checkSSGDevice() {
  if (window.SSG_isApp === true || typeof window.SSG_isMobile !== 'boolean') {
    return;
  }
  let _isMobile = isMobile();
  if (window.SSG_isMobile !== _isMobile) {
    sentry.captureEvent({
      message: `ssg设备不一致异常`,
      level: 'error',
      tags: {
        errorType: 'ssg_device_unique',
      },
      fingerprint: `ssg设备不一致异常:${window.location.href}`,
    });
  }
}

export function reportPriceKlineError(error, state) {
  try {
    sentry.configureScope((scope) => {
      scope.setFingerprint(`币种详情 K 线渲染异常:${window.location.href}`);
    });
    sentry.captureEvent({
      message: '币种详情 K 线渲染异常',
      level: 'error',
      tags: {
        errorType: 'price_kline_error',
      },
      extra: {
        state,
        error,
      },
    });
  } catch (e) {
    console.log(e);
  }
}

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
