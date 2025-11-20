/*
 * Owner: hanx.wei@kupotech.com
 */
import type { NextRouter } from "kc-next/compat/router";

declare global {
  interface Window {
    _BRAND_SITE_: string;
    _WEB_RELATION_: unknown;
    _BRAND_LOGO_: string;
    _LANG_DOMAIN_: string[];
    _DEFAULT_LOCALE_: string;
    $Router: NextRouter;
    __gbiz_share_cache__: unknown;
    ipRestrictCountry: string;
    _BRAND_NAME_: string;
    __KC_LANGUAGES__: unknown;
    twttr: {
      conversion: any;
      widgets: any;
    };
    ym: any;
    twq: any;
    extensionDetector: {
      detectAndReport: any;
    };
    onListenEvent: (event: string, callback: () => void) => void;
    mozRequestAnimationFrame: any;
    requestAnimationFrame: any;
    webkitRequestAnimationFrame: any;
    OptanonWrapper: any;
    OneTrust: any;
    sensors?: {
      __page_clicked__?: boolean
      track: (string, object) => void
    };
  }

  declare const GBIZ_NEXT_LOCALE_PATH: string;
}

export {};
