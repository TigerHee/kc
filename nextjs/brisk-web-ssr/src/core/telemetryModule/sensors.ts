import { match as matchPath } from 'path-to-regexp';
import sensors, { init } from 'gbiz-next/sensors';
import { IS_SERVER_ENV } from 'kc-next/env';
import { bootConfig } from 'kc-next/boot';

export const siteId = 'kcWeb';

export const pageIdMap = {
  '/': 'B1homepage',
};

const handleMatch = ({ path, pathMap, args }) => {
  const [, pathnameWithoutLang] = window.location.pathname.split('/learn');
  const matcher = matchPath(path, { decode: decodeURIComponent });
  return pathMap[path](matcher(pathnameWithoutLang), args);
};

const injectCodeByMatch =
  (event = 'expose', pathMap = {}) =>
    (args) => {
      if (args?.event !== event) return;
      for (const path in pathMap) {
        const result = handleMatch({ path, pathMap, args });
        if (result) {
          return result;
        }
      }
    };

export const injectPageTitleWhenExpose = injectCodeByMatch('expose', {});

export function initSensors() {
  if (IS_SERVER_ENV) return;
  init(
    {
      siteId,
      pageIdMap,
    },
    {
      app_name: process.env.NEXT_PUBLIC_APP_NAME,
      pageTitle: injectPageTitleWhenExpose,
      site_type: bootConfig._BRAND_SITE_,
    },
  );
}

export const kcsensorsClick = (spm: string[] = [], data: any = {}) => {
  if (!spm || !sensors) return;
  const { pagecate, ...rest } = data;
  sensors?.trackClick(spm, { ...rest, pagecate: pagecate || 'topNavigation' });
};

export function loginSensors(uid: number, honorLevel: number) {
  sensors.login(String(uid), String(honorLevel));
}

export { sensors };
