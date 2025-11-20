/**
 * Owner: victor.ren@kupotech.com
 */
import { useEffect } from 'react';
import { IS_SERVER_ENV, IS_SSG_ENV } from 'kc-next/env';
import { isInApp } from '../common/tools';
import { _DEV_ } from 'tools/env';
import * as Sentry from '@sentry/nextjs';
// import { getSentry } from 'tools/sentry/init';

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
  if (_DEV_) {
    console.error(`boot variable missing: ${key}`);
    return;
  }
  try {
    Sentry.captureEvent({
      message: `boot variable missing: ${key}`,
      level: 'error',
      tags: {
        errorType: 'boot_variable_missing',
      },
      fingerprint: key,
    });
  } catch (e) {
    console.log(e);
  }
}

// FIX ME! 应该将此方法放到base-web
// TODO 后续可能会移除
export default function useVariablesCheck() {
  useEffect(() => {
    if (IS_SSG_ENV || isInApp || IS_SERVER_ENV) return;
    try {
      const _BOOT_CONFIG_ = window.__NEXT_DATA__?.props.pageProps._BOOT_CONFIG_
      if (!_BOOT_CONFIG_) {
        return;
      }
      variables.forEach(dep => {
        if (!_BOOT_CONFIG_[dep]) {
          reportMsg(dep);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, []);
}
