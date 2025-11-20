import { RequestInterceptor, RuntimeEnvironment } from '../../types';
import { getCurrentLang } from 'kc-next/i18n';

const addLang: RequestInterceptor = baseConfig => {
  return {
    name: 'addLang',
    description: '自动添加语言参数',
    presetEnvironment: [RuntimeEnvironment.APP, RuntimeEnvironment.BROWSER, RuntimeEnvironment.SSR],
    supportEnvironment: [RuntimeEnvironment.APP, RuntimeEnvironment.BROWSER, RuntimeEnvironment.SSR],
    async onFulfilled(requestConfig) {
      if (requestConfig.disableLang) {
        return requestConfig;
      }
      let lang: string | null | undefined;
      if (baseConfig.environment === RuntimeEnvironment.SSR) {
        lang = getCurrentLang();
      } else {
        lang =
          requestConfig.params?.lang ||
          baseConfig.langByPath ||
          getCurrentLang() ||
          baseConfig.kcStorage?.getItem('lang');
      }
      requestConfig.params = requestConfig.params || {};
      requestConfig.params.lang = lang;

      return requestConfig;
    },
  };
};

export default addLang;
