import { withFetchInterceptor } from 'kc-next/utils';
import { IAppModule } from '../types';
import { IS_SERVER_ENV } from 'kc-next/env';

export const fetchInterceptorModule: IAppModule = {
  name: 'fetchInterceptor',
  init: () => {
    //拦截服务端next fetch
    if (IS_SERVER_ENV) {
      global.fetch = withFetchInterceptor();
    }
  },
};
