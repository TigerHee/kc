import { IConfig } from '@kucoin/api-generator';

const config: IConfig = {
  projectName: 'brisk-web-ssr',
  api: [
    {
      service: 'ucenter',
      outputDir: './src/api',
      baseURL: '/_api/ucenter',
      swaggerUrl: 'https://inner.sit.kucoin.net/ucenter/v3/api-docs',
      apiClient: 'gbiz-next/commonRequest',
      include: [
        '/locale',
        '/user-info',
        '/user/locale',
        '/country-codes',
        '/v2/api-keys',
        '/v2/sub/user/create',
        '/passkey/delete',
        '/v1/sub/user/access',
      ],
      exclude: [],
    },
    {
      service: 'currency',
      outputDir: './src/api',
      baseURL: '/_api/currency',
      swaggerUrl: 'https://inner.sit.kucoin.net/currency/v3/api-docs',
      apiClient: 'gbiz-next/commonRequest',
      include: ['/rates', '/v2/prices'],
      exclude: [],
    },
    {
      service: 'growth-config',
      outputDir: './src/api',
      baseURL: '/_api/growth-config',
      swaggerUrl: 'https://inner.sit.kucoin.net/growth-config/v3/api-docs',
      apiClient: 'gbiz-next/commonRequest',
      include: ['/get/white/config', '/get/client/config/codes'],
      exclude: [],
    },
    {
      service: 'trade-front',
      outputDir: './src/api',
      baseURL: '/_api/trade-front',
      swaggerUrl: 'https://inner.sit.kucoin.net/trade-front/v3/api-docs',
      apiClient: 'gbiz-next/commonRequest',
      include: ['/maintenance-status'],
      exclude: [],
    },
    {
      service: 'broker',
      outputDir: './src/api',
      baseURL: '/_api/broker',
      swaggerUrl: 'https://inner.sit.kucoin.net/broker/v3/api-docs',
      apiClient: 'gbiz-next/commonRequest',
      include: ['/invitation-code/getDefaultByBrokerName'],
      exclude: [],
    },
  ],
};

export default config;
