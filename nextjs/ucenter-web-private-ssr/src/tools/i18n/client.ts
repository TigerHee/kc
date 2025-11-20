'use client';
import { initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import {
  backend,
  lowerCaseLng,
  serializeConfig,
  debug,
  defaultNS,
  ns,
  interpolation,
  saveMissing,
} from '../../../next-i18next.config';
import * as telemetry from '@/core/telemetryModule';
import { siteLocales } from 'kc-next/boot';

function getOptions() {
  return {
    debug,
    //如果语言加载失败，客户端需要要用默认语言兜底,但是会多加载一个en 的语言文件
    fallbackLng: undefined, // or provide a valid FallbackLng value if needed
    supportedLngs: siteLocales,
    lowerCaseLng,
    serializeConfig,
    backend,
    defaultNS,
    ns,
    interpolation,
    saveMissing,
    missingKeyHandler: (lng, ns, key) => {
      telemetry.reportIntlMissing(key);
    },
  };
}

// on client side the normal singleton is ok
i18next
  .use(initReactI18next)
  .use(Backend)
  .init({
    ...getOptions(),
    lng: undefined, // let detect the language on client side
    preload: [],
  });

export default i18next;
