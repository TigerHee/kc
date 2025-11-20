import type { NextRouter } from 'next/router';
import { BootConfig } from 'kc-next/boot';

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BRAND_SITE: 'KC' | 'AU' | 'EU' | 'CL' | 'TH' | 'TR';
      NEXT_PUBLIC_SENTRY_DSN: string;
      NEXT_PUBLIC_APP_NAME: string;
    }
  }

  interface Window {
    __NEXT_DATA__: {
      props: {
        pageProps: {
          _BOOT_CONFIG_: BootConfig;
        };
      };
    };
    __gbiz_share_cache__: unknown;
    ipRestrictCountry: string;
    twttr: {
      conversion: any;
      widgets: any;
    };
    ym: any;
    twq: any;
    _hmt: any;
    fbq: any;
    gtag: any;
    DCLTIME: string;
    uetq: any[];
    bridge?: any;
    extensionDetector: {
      detectAndReport: any;
    };
    onListenEvent: (event: string, callback: () => void) => void;
    mozRequestAnimationFrame: any;
    requestAnimationFrame: any;
    webkitRequestAnimationFrame: any;
    OptanonWrapper: any;
    OneTrust: any;
    __KC_CRTS__: any;
  }
}

export {};
