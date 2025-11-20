/**
 * Owner: chelsey.fan@kupotech.com
 */
import isMobile from 'utils/isMobile';
import sentry from '@kc/sentry';
import { IS_PROD_ENV } from 'utils/env';

const sentryInit = () => {
  // dev 和 sit 环境不上报
  if (!IS_PROD_ENV) {
    return;
  }
  sentry.init({
    dsn: 'https://a781f07ac8ab4dca82eabcae615ce77f@sentry-v2.staticimg.co/12',
    environment: 'prod',
    release: `${_APP_NAME_}@${_VERSION_}`,
  });
  checkSSGDevice();
};
sentryInit();
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
      scope.setFingerprint(`Converter详情 K 线渲染异常:${window.location.href}`);
    });
    sentry.captureEvent({
      message: 'Converter详情 K 线渲染异常',
      level: 'error',
      tags: {
        biz: sentry.bizType.platform,
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

export function report404() {
  try {
    const paths = JSON.parse(sessionStorage.getItem('KC_LATEST_URLS')) || [];
    sentry.captureEvent({
      // 设置上报
      message: '404 页面访问',
      level: 'warning',
      tags: {
        url: window?.location?.href,
        referrer: document?.referrer || '',
      },
      fingerprint: '404_visit',
      extra: {
        paths: paths,
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
