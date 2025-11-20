/**
 * Owner: willen@kupotech.com
 */
import siteConfig from 'utils/siteConfig';
import runInApp from 'utils/runInApp';
import { addLangToPath } from 'tools/i18n';

/**
 * 完全屏蔽socket的pathname，
 * 内部实现使用的是match，支持正则表达式
 */
export const socketBlockUrlList = ['404'];

const { DOCS_HOST, KUCOIN_HOST } = siteConfig;
// api相关 ----------------------------- start
export const apiTabMap = {
  trade: {
    name: 'margin.api',
    docs: 'margin.api.docs',
    text: 'margin.api.text',
    href: DOCS_HOST,
    host: '',
  },
  contract: {
    name: 'futures.api',
    docs: 'api.landingPage.seeAPI.futures',
    text: 'futures.api.text',
    href: [DOCS_HOST, '/futures'].join(''),
    host: '-',
    // host: 'http://localhost:2999/futures-web',
  },
};

// GooglePlay 不合规下架地区: 印尼
// const ILLEGAL_GP_LIST = ['ID'];

export const COUNTRY_INFO_KEY = 'locale_country_info';
export const COUNTRY_INFO_PULLING_VALUE = undefined;
export const authMap = {
  API_COMMON: {
    name: 'vGeoG6ES46EgfbizBCpK3C',
    desc: 'api.auth.common.intro',
  },
  API_SPOT: {
    name: 'qRMb6gjBoXKuUVxHim36DH',
    desc: 'pKdqLp4kR1F2Cm8Mq7wu8U',
  },
  API_MARGIN: {
    name: 'qMTZzCnx4j1piJvG25RDaD',
    desc: 'rxthXoDhUnUeQXfAtrWHtL',
  },
  API_FUTURES: {
    name: 'vD4iaWF9Efu86FmGYegrTr',
    desc: '6fcxviY7Sw9RhwTtcHWd2t',
  },
  API_WITHDRAW: {
    name: 'api.withDraw',
    desc: 'api.auth.withdraw',
  },
};

export const authMapSensorKey = {
  API_SPOT: 'SpotTrade',
  API_MARGIN: 'MarginTrade',
  API_FUTURES: 'FuturesTrade',
  API_WITHDRAW: 'Withdraw',
};
// api相关 ----------------------------- end
const isInApp = runInApp();
// 卡券中心 -- start

export const COUPON_CENTER_URL = `${isInApp ? '/platform' : ''}/account/vouchers`;

export const COUPON_CENTER_WEB_URL = addLangToPath(`${KUCOIN_HOST}${COUPON_CENTER_URL}`);
// 卡券中心 -- end
