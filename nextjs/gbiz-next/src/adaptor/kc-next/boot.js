export { getCurrentLang } from './i18n';

export const bootConfig = {
  _BRAND_SITE_: window._BRAND_SITE_,
  _SITE_CONFIG_: window._SITE_CONFIG_,
  _BASE_CURRENCY_: window._BASE_CURRENCY_,
  _LANG_DOMAIN_: window._LANG_DOMAIN_,
  _DEFAULT_LOCALE_: window._DEFAULT_LOCALE_,
  _DEFAULT_LANG_: window._DEFAULT_LANG_,
  _BRAND_LOGO_: window._BRAND_LOGO_,
  localesMap: window.__KC_LANGUAGES_BASE_MAP__.baseToLang,
  langsMap: window.__KC_LANGUAGES_BASE_MAP__.langToBase,
  _BRAND_LOGO_MINI_: window._BRAND_LOGO_MINI_,
  _DEFAULT_RATE_CURRENCY_: window._DEFAULT_RATE_CURRENCY_,
  _BRAND_NAME_: window._BRAND_NAME_,
  _BRAND_FAVICON_: window._BRAND_FAVICON_,
};

export function getHref() {
  return window.location.href;
}

export function getSiteConfig() {
  return window._WEB_RELATION_;
}

export function getOrigin() {
  return window.location.origin;
}

export function getIsApp() {
  return window.navigator.userAgent.includes('KuCoin');
}

export function getHostname() {
  return window.location.hostname;
}

export function getUserAgent() {
  return window.navigator.userAgent;
}

export function getPathname() {
  return window.location.pathname;
}
