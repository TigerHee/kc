/**
 * Owner: jesse@kupotech.com
 */
// 上报只在测试环境和线上环境
// 测试环境上报 landing-web-debug 线上上报 landing-web
import { IS_PROD } from 'utils/env';

const release = `${_APP_NAME_}@${_VERSION_}`;
// const debugDsn = 'https://88445f870bd7459db8738f3f99f68d4f@sentry-v2.staticimg.co/10';
const prodDsn = 'https://777e423054ce4d668f87d44712a605a6@sentry-v2.staticimg.co/11';

const getSentry = () => import('@kc/sentry').then(res => {
  const sentry = res.default;
  return sentry;
});

const sentryInit = () => {
  if (IS_PROD) {
    // 线上环境
    getSentry().then(sentry => {
      if (!sentry) return
      sentry.init({
        dsn: prodDsn,
        projectName: 'landing-web',
        environment: 'prod', // 环境，site 对应国际站，site-cn 对应国内站
        release,
      });
    })
  }
};

export const Severity = {
  Fatal: 'fatal',
  Error: 'error',
  Warning: 'warning',
  Log: 'log',
  Info: 'info',
  Debug: 'debug',
};

export function report(options = {}) {
  if (!options.message) {
    throw new Error('options.message must exist ');
  }
  if (!options.level) {
    throw new Error('options.level must exist ');
  }
  const { message, level = 'fatal', tags = {}, ...others } = options;
  return getSentry().then(sentry => {
    if (!sentry) return;
    return sentry.captureEvent({
      message,
      level: level,
      tags,
      ...others,
    })
  });
}

/**
 * sentry key缺失上报
 * @param {*} key
 */
export function reportIntlMissing(key) {
  try {
    getSentry().then(sentry => {
      if (!sentry) return;
      sentry.captureEvent({
        message: `i18n key missing: ${key}`,
        level: 'error',
        tags: {
          errorType: 'i18n_missing_key',
        },
        fingerprint: key,
      });
    })
  } catch (e) {
    console.log(e);
  }
}

/**
 * 音频加载失败上报
 * @param {string} data.url 失败的音频url
 * @param {string} data.errorMessage 失败信息
 * @param {string} data.errorCode 失败编码
 *
 *
 */
export function reportAudioError({ url, errorMessage, errorCode }) {
  try {
    getSentry().then((sentry) => {
      if (!sentry) return;
      sentry.captureEvent({
        message: `audio onError: errorMessage is ${errorMessage}; error url is ${url};  errorCode is ${errorCode};`,
        level: 'info',
        tags: {
          errorType: 'landing_audio_error',
        },
        fingerprint: url,
      });
    });
  } catch (e) {
    console.log(e);
  }
}

export default sentryInit;
