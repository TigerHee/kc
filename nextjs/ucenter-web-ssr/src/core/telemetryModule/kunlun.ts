import { IS_SERVER_ENV } from 'kc-next/env';
import * as kunlun from '@kc/web-kunlun';
import { bootConfig } from 'kc-next/boot';

export function initKunlun() {
  if (IS_SERVER_ENV) return;
  kunlun.init({
    // 需要在 kunlun 上重点关注的接口
    apis: [],
    site: bootConfig._BRAND_SITE_ || 'KC',
    project: process.env.NEXT_PUBLIC_APP_NAME,
  });
  return kunlun;
}

export { kunlun };
