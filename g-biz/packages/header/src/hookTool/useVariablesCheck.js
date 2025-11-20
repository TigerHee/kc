/**
 * Owner: victor.ren@kupotech.com
 */
import { useEffect } from 'react';
import { isSSG, isInApp } from '../common/tools';

const variables = [
  '_BRAND_NAME_',
  '_BRAND_SITE_',
  '_BRAND_LOGO_',
  '_SAFE_WEB_DOMAIN_',
  '_LANG_DOMAIN_',
  // '_DEFAULT_LANG_',
  // '_DEFAULT_LOCALE_',
];

function reportMsg(key) {
  if (__env__ === 'development') {
    console.error(`boot variable missing: ${key}`);
    return;
  }
  const sentryNamespace = window.SENTRY_NAMESPACE || 'SentryLazy';
  try {
    if (window[sentryNamespace]) {
      window[sentryNamespace]?.captureEvent({
        message: `boot variable missing: ${key}`,
        level: 'error',
        tags: {
          errorType: 'boot_variable_missing',
        },
        fingerprint: key,
      });
    }
  } catch (e) {
    console.log(e);
  }
}

// FIX ME! 应该将此方法放到base-web
export default function useVariablesCheck() {
  useEffect(() => {
    if (isSSG || isInApp) return;
    variables.forEach((dep) => {
      if (!window[dep]) {
        reportMsg(dep);
      }
    });
  }, []);
}
