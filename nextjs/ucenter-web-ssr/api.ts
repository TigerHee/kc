import { IConfig } from '@kucoin/api-generator';

const config: IConfig = {
  projectName: 'ucenter-web-ssr',
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
        '/user/whitelist/security-methods/{token}',
      ],
      exclude: [],
    },
    {
      service: 'currency',
      outputDir: './src/api',
      baseURL: '/_api/currency',
      swaggerUrl: 'https://inner.sit.kucoin.net/currency/v3/api-docs',
      apiClient: 'gbiz-next/commonRequest',
      include: ['/rates', '/v2/prices', '/site/transfer-currencies'],
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
      service: 'kucoin-config',
      outputDir: './src/api',
      baseURL: '/_api/kucoin-config',
      swaggerUrl: 'https://inner.sit.kucoin.net/kucoin-config/v3/api-docs',
      apiClient: 'gbiz-next/commonRequest',
      include: ['/web/international/config-list'],
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
    {
      service: 'growth-ucenter',
      outputDir: './src/api',
      swaggerUrl: 'https://inner.sit.kucoin.net/growth-ucenter/v3/api-docs',
      baseURL: '/_api/growth-ucenter',
      apiClient: 'gbiz-next/commonRequest',
      include: ['/invitation/user-by-rcode'],
      exclude: [],
    },
  ],
};

export default config;
