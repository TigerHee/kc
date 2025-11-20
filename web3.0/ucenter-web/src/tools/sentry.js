/**
 * Owner: willen@kupotech.com
 */
// 上报只在测试环境和线上环境
// 测试环境上报 public-web-debug 线上上报 public-web
import sentry from '@kc/sentry';
import { IS_PROD, IS_TEST_ENV, _DEV_ } from 'utils/env';
import isMobile from 'utils/isMobile';

const sentryInit = () => {
  const release = `${_APP_NAME_}@${_VERSION_}`;
  // 测试环境不上报
  // SENTRY_DEBUG 在 webpack/define.js 中配置，默认为 false, 本地调试可打开
  if (!IS_PROD && !SENTRY_DEBUG) {
    return;
  }
  sentry.init({
    dsn: 'https://e9fea097d0c4408f9d9880b210885b71@sentry-v2.staticimg.co/53',
    environment: _DEV_ ? 'dev' : IS_TEST_ENV ? 'sit' : 'prod',
    release,
  });
  //ssg设备版本不一致异常
  checkSSGDevice();
};

sentryInit();

export function sentryReport(opt) {
  try {
    sentry.captureEvent(opt);
  } catch (e) {
    console.log(e);
  }
}

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
  if (typeof window.SSG_isMobile !== 'boolean') {
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

// intl key 缺失告警
export function reportIntlMissing(key) {
  try {
    sentry.captureEvent({
      message: `i18n key missing: ${key}`,
      level: 'error',
      tags: { errorType: 'i18n_missing_key' },
      fingerprint: key,
    });
  } catch (e) {
    console.log(e);
  }
}

/** /restrict 路由 code 不匹配 */
export function reportRestrictMismatch(code) {
  try {
    sentry.captureEvent({
      message: `/restrict code mismatch: ${code}`,
      level: 'error',
      tags: { errorType: 'restrict_code' },
      fingerprint: 'restrict_code',
    });
  } catch (e) {
    console.log(e);
  }
}
