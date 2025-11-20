import { RequestInterceptor } from '../../types';

const addXVersion: RequestInterceptor = (baseConfig) => {
  return {
    name: 'addXVersion',
    description: '自动添加x-version',
    async onFulfilled(requestConfig) {
      const xVersion = baseConfig.xVersion || baseConfig.kcStorage?.getItem('_x_version');
      if (!xVersion) {
        return requestConfig;
      }
      requestConfig.params = requestConfig.params || {};
      requestConfig.params['x-version'] = xVersion;
      requestConfig.headers.set('X-VERSION', xVersion);
      return requestConfig;
    },
  };
};

export default addXVersion;
