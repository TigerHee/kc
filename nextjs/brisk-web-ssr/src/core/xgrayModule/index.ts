import { xgrayCheck } from 'gbiz-next/common-base';
import { IAppModule } from '../types';
import { IS_CLIENT_ENV } from 'kc-next/env';

export const xgrayModule: IAppModule = {
  name: 'xgray',
  init: () => {
    if (IS_CLIENT_ENV) {
      xgrayCheck(process.env.NEXT_PUBLIC_APP_NAME);
    }
  },
};
