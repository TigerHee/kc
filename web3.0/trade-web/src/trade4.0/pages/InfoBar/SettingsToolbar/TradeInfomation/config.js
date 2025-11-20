/**
 * Owner: garuda@kupotech.com
 */
import { siteCfg } from 'config';

import { _t, _tHTML } from 'utils/lang';

import { isDisplayMargin } from '@/meta/multiTenantSetting';

import { FUTURES_COMPLIANT_SPM, FUTURES_RATE_PROFIT } from '@/meta/multSiteConfig/futures';

// event name
export const EVENT_DIALOG_NAME = 'open@tradeInformationDialog';
export const EVENT_DRAWER_NAME = 'open@tradeInformationDrawer';

export const TYPES_ENUM = {
  RATE: 'RATE',
  PRICE: 'PRICE',
  MARGIN_DATA: 'MARGIN_DATA',
  LIMIT: 'LIMIT',
  BASIC: 'BASIC',
  API: 'API',
};

// 现货跟杠杆的内容
export const LIST = [
  {
    fileName: 'toolbar',
    icon: 'trading-fee-rate',
    text: _t('tradeForm.feeRemark.title'),
    type: TYPES_ENUM.RATE,
  },
  ...(isDisplayMargin()
    ? [
      {
        fileName: 'toolbar',
        icon: 'price-protect',
        text: _t('3TZ8uXEjttkbDu8NFjwcYh'),
        type: TYPES_ENUM.PRICE,
      },
        {
          fileName: 'toolbar',
          icon: 'margin-data',
          text: _t('kG1WnUTPDqYzE7LdbktWZY'),
          type: TYPES_ENUM.MARGIN_DATA,
        },
        {
          fileName: 'toolbar',
          icon: 'risk-limit',
          text: _t('6XuGzZ7ZwVtcHe5au5wzse'),
          type: TYPES_ENUM.LIMIT,
        },
      ]
    : []),
  {
    fileName: 'toolbar',
    icon: 'basic-information',
    text: _t('sxk7BHsBShgcsPVu87NVjd'),
    type: TYPES_ENUM.BASIC,
  },
  {
    fileName: 'toolbar',
    icon: 'futures-api',
    text: 'API',
    type: TYPES_ENUM.API,
  },
];

const DEFAULT_SYMBOL = 'XBTUSDTM';

// 合约的内容
export const FUTURES_LIST = [
  {
    fileName: 'toolbar',
    icon: 'futures-detail',
    text: _t('contract.detail'),
    pathKey: 'symbol',
    path: (symbol = DEFAULT_SYMBOL) => `${siteCfg.KUMEX_HOST}/contract/detail/${symbol}`,
  },
  {
    fileName: 'toolbar',
    icon: 'futures-index',
    text: _t('contract.index'),
    pathKey: 'symbol',
    path: (symbol = DEFAULT_SYMBOL) =>
      `${siteCfg.KUMEX_HOST}/contract/index/${symbol}-spot-price`,
    color: 'transparent',
  },
  {
    fileName: 'toolbar',
    icon: 'futures-rate',
    text: _t('contract.rate'),
    pathKey: 'symbol',
    path: (symbol = DEFAULT_SYMBOL) =>
      `${siteCfg.KUMEX_HOST}/contract/funding-rate-history/${symbol}`,
  },
  {
    fileName: 'toolbar',
    icon: 'futures-profit',
    text: _t('funding.rate.profit.tip'),
    path: `${siteCfg.KUMEX_HOST}/rate-profit`,
    spm: FUTURES_COMPLIANT_SPM.FUTURES_RATE_PROFIT_SPM,
    ruleId: FUTURES_RATE_PROFIT,
  },
  {
    fileName: 'toolbar',
    icon: 'futures-fund',
    text: _t('contract.fund'),
    pathKey: 'settleCurrency',
    path: (currency = 'BTC') => `${siteCfg.KUMEX_HOST}/contract/insurance-fund-history/${currency}`,
  },
  {
    fileName: 'toolbar',
    icon: 'futures-risk',
    text: _t('risk.limit.title'),
    pathKey: 'symbol',
    path: (symbol = DEFAULT_SYMBOL) =>
      `${siteCfg.KUMEX_HOST}/contract/risk-limit/${symbol}`,
  },
  {
    fileName: 'toolbar',
    icon: 'futures-api',
    text: 'API',
    path: `${siteCfg.MAINSITE_HOST}/docs/rest/futures-trading/market-data/introduction`,
  },
];
