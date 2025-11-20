import { RequestInterceptor, RuntimeEnvironment } from '../../types';

const addLang: RequestInterceptor = (baseConfig) => {
  return {
    name: 'addLang',
    description: '自动添加语言参数',
    async onFulfilled(requestConfig) {
      if (requestConfig.disableLang) {
        return requestConfig;
      }
      const lang =
        requestConfig.params?.lang ||
        baseConfig.langByPath ||
        baseConfig.kcStorage?.getItem('lang');
      requestConfig.params = requestConfig.params || {};
      requestConfig.params.lang = lang;

      return requestConfig;
    },
  };
};

export default addLang;
