import { initQueryPersistence } from 'gbiz-next/QueryPersistence';
import { IS_CLIENT_ENV } from 'kc-next/env';
import { IAppModule } from '../types';

export const queryPersistenceModule: IAppModule = {
  name: 'queryPersistence',
  init: () => {
    if (IS_CLIENT_ENV) {
      initQueryPersistence();
    }
  },
};
