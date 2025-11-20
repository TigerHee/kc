interface SupportBotEmbed {
  close?: () => void;
  open?: () => void;
  hasOpened?: boolean;
}

declare global {
  interface Window {
    sessionStorage: any;
    requestAnimationFrame: any;
    mozRequestAnimationFrame: any;
    webkitRequestAnimationFrame: any;
    ipRestrictCountry: string;
    onKYCSiteChange: (callback: (siteType: string) => void) => void;
    onIPSiteChange: (callback: (siteType: string) => void) => void;
    ipRestrictCountry: string;
    _SWITCH_SITE_: any;
    routerBase?: string;
    __KC_CRTS__?: Array<{path: string}>
    pushTo?: (url: string) => void;
    WITHOOU_LANG_PATH: string[];
    zE: any;
    _x_ws_debug: any;
    _hmt: any;
    Sentry: any;
    SSG_theme?: boolean;
    onOneTrustLoaded: any;
    OptanonWrapper: any;
    OneTrust: any;
    twq: any;
    twttr: any;
    DCLTIME: number;
    AppleID: any;
    Telegram: any;
    google: any;
    SENTRY_NAMESPACE: any;
    setXVersion: (xversion: string) => void;
    _useSSG?: boolean;
    initialGbizNextI18nStore?: any;
    __KC_LANGUAGES__?: any;
    __KC_LANGUAGES_BASE_MAP__?: any;
    _DEFAULT_LOCALE_?: any;
    _BRAND_NAME_?: string;
    _BASE_CURRENCY_?: any;
    _DEFAULT_LANG_?: any;
    initialGbizNextLanguage?: any;
    g_initialProps?: any;
    __COMPLIANCE_FR_START__?: boolean;
    __COMPLIANCE_EVENT?: any;
    __COMPLIANCE_START__?: boolean;
    _complianceState_: {
      isLoadObserve: boolean;
      rulers?: any,
      ruleUID: number,
      isError: boolean,
      active: boolean,
      observeEnable?: boolean,
      observePageEnable?: boolean,
      init: boolean,
    }
    System?: {
      import: (url: string) => Promise<any>
    }
    // supportBot
    supportBotEmbed?: SupportBotEmbed;
    noticePushTo?: (url: string) => void;
  }
  declare const _DEV_: boolean;
  declare const GOOGLE_CAPTCHA_SITE_KEY: string;
  declare const GOOGLE_CAPTCHA_DEV_SITE_KEY: string;
  declare const __version__: any;
}

export {};
