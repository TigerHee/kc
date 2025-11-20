import { serviceWorker } from 'kc-next/utils';
import { IS_CLIENT_ENV, IS_PROD } from "kc-next/env";
import JsBridge from "gbiz-next/bridge";
import { getGlobalTenantConfig } from 'gbiz-next/tenant';
import { IAppModule } from "../types";

export const serviceWorkerModule: IAppModule = {
  name: "serviceWorker",
  init: () => {
    if (IS_CLIENT_ENV && IS_PROD) {
      const isInApp = JsBridge.isApp();
      // 注册 service worker
      if (!isInApp) {
        const globalTenantConfig = getGlobalTenantConfig();
        if (globalTenantConfig.registerServiceWorker) {
          serviceWorker.registerServiceWorker();
        } else {
          serviceWorker.unRegisterServiceWorker();
        }
      }
    }
  },
};
