import { initAppDclTime } from 'gbiz-next/bridge';
import { IAppModule } from "../types";

export const jsBridgeModule: IAppModule = {
  name: "jsBridge",
  init: () => {
    initAppDclTime();
  },
};
