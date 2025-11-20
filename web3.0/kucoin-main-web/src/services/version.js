/**
 * Owner: willen@kupotech.com
 */
/**
 * check version on browser
 * runtime: browser
 */
import sentry from '@kc/sentry';
function handleVersion(version) {
  sentry.captureEvent({
    message: `版本不一致异常: json[${version}]/app[${_APP_}]`,
    level: 'warning',
    tags: {
      errorType: 'version_unique',
    },
    fingerprint: `版本不一致异常: json[${version}]/app[${_APP_}]`,
  });
}
export async function checkVersionReload() {
  if (typeof window._KC_CHECK_VERSION_ === 'function') {
    const url = `/kucoin-main-web/version.json?_t=${Date.now()}`;
    window._KC_CHECK_VERSION_(
      url,
      {
        env: _DEV_ ? 'development' : 'production',
        version: _APP_,
      },
      handleVersion,
    );
  }
}
