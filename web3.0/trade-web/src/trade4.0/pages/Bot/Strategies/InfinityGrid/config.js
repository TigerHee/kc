/**
 * Owner: mike@kupotech.com
 */
import { toCableCase } from 'Bot/helper';
import { _t } from 'Bot/utils/lang';
import { siteCfg } from 'config';

const { KUCOIN_HOST } = siteCfg;

export const DEFAULTSYMBOL = 'BTC/USDT';

// 手续费
export const feeBasicRate = 8 / 10000;

// 最大投资额度配置
export const maxInverstConfig = {
  USDT: 100000,
  USDC: 100000,
  BTC: 4,
  ETH: 50,
  KCS: 5000,
};

export const perGridPRRange = [0.2, 10]; // 网格利润范围
export const minInverst = 40; // 最小投资额度
export const minPriceRatio = 0.1; // 最低价小于当前的的比率
// 提交数据格式
export const submitData = ({
  down,
  gridProfitRatio,
  baseAmount,
  quotaAmount,
  couponId,
  symbol,
  stopLossPrice,
  stopProfitPrice,
  limitAsset,
  templateId,
  useBaseCurrency,
  createEntrance,
  createWay,
  prizeId,
}) => ({
  params: [
    {
      code: 'down',
      value: Number(down),
    },
    {
      code: 'gridProfitRatio',
      value: Number(gridProfitRatio),
    },
    {
      code: 'symbol',
      value: toCableCase(symbol),
    },
    {
      code: 'limitAsset',
      value: Number(limitAsset),
    },
    {
      code: 'stopLossPrice',
      value: Number(stopLossPrice || 0),
    },
    {
      code: 'stopProfitPrice',
      value: Number(stopProfitPrice || 0),
    },

    // 动态计算出来的参数
    {
      code: 'baseAmount',
      value: Number(baseAmount || 0),
    },
    {
      code: 'quotaAmount',
      value: Number(quotaAmount || 0),
    },
    {
      code: 'createEntrance',
      value: createEntrance || 'otherCreate',
    },
    {
      code: 'createWay',
      value: createWay,
    },
  ],
  templateId: 5,
  couponId, // 卡券id
  prizeId,
  useBaseCurrency: Boolean(useBaseCurrency),
});

// 使用教程跳转地址
export const toturial = {
  en_US: {
    ai: `${KUCOIN_HOST}/support/4410943372697`,
    custom: `${KUCOIN_HOST}/support/4410943372697`,
  },
  zh_CN: {
    ai: `${KUCOIN_HOST}/zh-hans/support/4410943372697`,
    custom: `${KUCOIN_HOST}/zh-hans/support/4410943372697`,
  },
};

// 网格配置页面的说明文字
export const tipConfig = () => ({
  minprice: {
    title: _t('minprice'),
    content: _t('minpricehint'),
  },
  pergridpr: (range) => ({
    title: _t('pergridpr'),
    content: _t('pergridprhint', { range }),
  }),
  pricerange: {
    title: _t('futrgrid.pricerange'),
    content: _t('futrgrid.classgridrangehint'),
  },
  3: {
    title: _t('gridform15'),
    content: _t('gridformTip6'),
  },
  4: {
    title: _t('gridform29'),
    content: _t('gridformTip7'),
  },
  5: {
    title: _t('gridform21'),
    content: _t('gridformTip8'),
  },
  6: {
    title: _t('openprice'),
    content: _t('gridformTip9'),
  },
  7: (base, quota) => ({
    title: _t('gridformTip10', { base }),
    content: _t('gridformTip11', { base, quota }),
  }),
  8: {
    title: _t('stopprofit'),
    content: _t('stopprofitpricehintlong'),
  },
  gridprofit: {
    title: _t('card8'),
    content: _t('futrgrid.classgridprofit'),
    okText: _t('gridform24'),
    cancelText: null,
  },
  float: {
    title: _t('card9'),
    content: _t('futrgrid.floathint'),
    okText: _t('clsgrid.btchintcancel'),
    cancelText: _t('gridform24'),
    moreLinks: {
      en_US: `${KUCOIN_HOST}/support/5088420120345-[Essential-for-Newbies]-The-PNL-Calculation`,
      zh_CN: `${KUCOIN_HOST}/zh-hans/support/5088420120345-【入门必读】浮动盈亏的计算方法`,
    },
  },
  firstFun: {
    title: _t('smart.showquota2'),
    content: _t('futrgrid.classgridprofit'),
    okText: _t('gridform24'),
    cancelText: null,
  },
  currentV: {
    title: _t('smart.showquota3'),
    content: _t('futrgrid.classgridprofit'),
    okText: _t('gridform24'),
    cancelText: null,
  },
  entryPrice: {
    title: _t('card14'),
    content: _t('uodateentrypricehint'),
    okText: _t('clsgrid.btchintcancel'),
    cancelText: _t('gridform24'),
    moreLinks: {
      zh_CN: `${KUCOIN_HOST}/zh-hans/support/5110407224089-【网格交易】币价下跌又回调-为什么我的收益是负？-`,
      en_US: `${KUCOIN_HOST}/support/5110407224089-[Grid-Trading]-The-currency-price-fell-and-then-corrected-why-is-my-return-negative-`,
    },
  },
});
