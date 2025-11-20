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

// 声明 SVG 模块类型 - 支持两种导入方式
declare module '*.svg' {
  import React from 'react';
  // 默认导出：import icon from '*.svg'
  const content: string;
  export default content;
  // 命名导出：import { ReactComponent } from '*.svg'
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}

// 声明其他图片资源模块类型
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

declare module '*.bmp' {
  const content: string;
  export default content;
}

export {};
