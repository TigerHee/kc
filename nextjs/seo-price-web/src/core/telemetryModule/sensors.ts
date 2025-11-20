import { match as matchPath } from "path-to-regexp";
import sensors, { init } from "gbiz-next/sensors";
import { IS_SERVER_ENV } from "kc-next/env";

export const siteId = "kcWeb";

export const pageIdMap = {
  '/price': 'B5CoinsPriceHomePage',
  '/price/hot-list': 'B5CoinsPriceHomePage',
  '/price/top-gainers': 'B5CoinsPriceHomePage',
  '/price/new-coins': 'B5CoinsPriceHomePage',
  '/price/:coin': 'B5CoinPriceDetails',
};

export function initSensors() {
  if (IS_SERVER_ENV) return;
  init(
    {
      siteId,
      pageIdMap,
    },
    {
      app_name: process.env.NEXT_PUBLIC_APP_NAME,
    },
     { web_page_leave: true, page_view: true },
  );
}

export const kcsensorsClick = (spm: string[] = [], data: any = {}) => {
  if (!spm || !sensors) return;
  const { pagecate, ...rest } = data;
  sensors?.trackClick(spm, { ...rest, pagecate: pagecate || "topNavigation" });
};

export function loginSensors(uid: number, honorLevel: number) {
  sensors.login(String(uid), String(honorLevel));
}

export { sensors };
