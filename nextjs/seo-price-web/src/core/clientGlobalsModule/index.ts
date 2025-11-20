import { injectClientGlobals } from "kc-next/boot";
import { enableOneTrust, enableIpRestrictLang } from "gbiz-next/tenant";
import { app } from "@/app";
import { IAppModule } from "../types";
import { IS_CLIENT_ENV } from "kc-next/env";
// import { initClientXVersion } from 'gbiz-next/request';

export const clientGlobalsModule: IAppModule = {
  name: "clientGlobals",
  init: () => {
    if (IS_CLIENT_ENV) {
      app.initConfig();
      injectClientGlobals();
      enableOneTrust();
      enableIpRestrictLang();
    }
  },
};
