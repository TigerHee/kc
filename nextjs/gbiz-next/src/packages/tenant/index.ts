import { bootConfig } from 'kc-next/boot';
import { getCurrentLang } from 'kc-next/i18n';
import { IS_PROD } from 'tools/env';
import {
  getGlobalTenantConfig,
  TTenantCode,
} from './config/globalTenantConfig';
import { kucoinv2Storage as storage } from 'tools/storage';
import JsBridge from 'tools/jsBridge';
import { ONE_TRUST_LANG_MAP } from './config/oneTrust';

export function enableIpRestrictLang() {
  const tenantConfig = getGlobalTenantConfig(
    bootConfig._BRAND_SITE_ as TTenantCode
  );
  if (tenantConfig.enableIpRestrictLang) {
    const nextUrl = new URL(window.location as any);
    let ipRestrictLang = nextUrl.searchParams.get('x');
    if (ipRestrictLang) {
      if (ipRestrictLang === 'l') {
        ipRestrictLang = 'fr_FR';
      }
      window.ipRestrictCountry = ipRestrictLang;
      nextUrl.searchParams.delete('x');
      if (storage.getItem('lang') === ipRestrictLang) {
        storage.setItem('lang', 'en_US');
      }
      if (nextUrl.searchParams.get('lang') === ipRestrictLang) {
        nextUrl.searchParams.delete('lang');
      }
      history.replaceState({}, '', nextUrl);
    }
  }
}

export function enableOneTrust() {
  const tenantConfig = getGlobalTenantConfig(
    bootConfig._BRAND_SITE_ as TTenantCode
  );
  if (tenantConfig.enableOneTrust) {
    window.onOneTrustLoaded?.(() => {
      try {
        const isInApp = JsBridge.isApp();
        // 在 APP 中，直接允许所有，关闭 OneTrust
        if (isInApp) {
          window.OneTrust.AllowAll();
          return;
        }
        // 线下环境隐藏 oneTrust，目前只有泰国站需要
        if (tenantConfig.oneTrustHiddenInDev && !IS_PROD) {
          window.OneTrust.AllowAll();
          return;
        }
        const currentLang = getCurrentLang();
        const oneTrustLang =
          // eslint-disable-next-line prototype-pollution/no-bracket-notation-property-accessor
          ONE_TRUST_LANG_MAP[currentLang] || bootConfig._DEFAULT_LOCALE_;
        window.OneTrust.changeLanguage(oneTrustLang);

        setTimeout(() => {
          // 语言准备好之后，再展示 oneTrust 的 UI
          const style = document.getElementById('custom-onetrust-style');
          if (style) {
            style.remove();
          }
        }, 300);
      } catch (error) {
        console.error('OneTrust error', error);
      }
    });
  }
}

export { getGlobalTenantConfig };
