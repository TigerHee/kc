/**
 * Owner: mike@kupotech.com
 */
import { getAvailLang } from 'Bot/helper';
import { _t } from 'Bot/utils/lang';
import { siteCfg } from 'config';
import { addDeposit, getCalcBlowUpPrice } from 'FutureGrid/services';

const { KUCOIN_HOST } = siteCfg;
// 提交数据格式
export const submitData = (options) => ({
  params: [
    {
      code: 'down',
      value: Number(options.lowerPrice),
    },
    {
      code: 'up',
      value: Number(options.upperPrice),
    },
    {
      code: 'symbol',
      value: options.symbol,
    },
    {
      code: 'depth',
      value: Number(options.gridNum) + 1,
    },
    {
      code: 'limitAsset',
      value: Number(options.limitAsset),
    },
    {
      code: 'stopLossPrice',
      value: Number(options.stopLossPrice || 0),
    },
    {
      code: 'stopProfitPrice',
      value: Number(options.stopProfitPrice || 0),
    },
    {
      code: 'openUnitPrice',
      value: Number(options.openUnitPrice || 0),
    },
    {
      code: 'direction',
      value: options.direction,
    },
    {
      code: 'leverage',
      value: options.leverage,
    },
    {
      code: 'createEntrance',
      value: options.createEntrance || 'otherCreate',
    },
    {
      code: 'createWay',
      value: options.createWay,
    },
  ],
  templateId: 3,
  prizeId: options.goldCoupon?.id,
  couponId: options.coupon?.id,
  useBaseCurrency: false,
});

// 使用教程跳转地址
export const toturial = {
  en_US: {
    ai: `${KUCOIN_HOST}/support/900006636823-Run-the-Futures-Grid-Bot-to-Earn-Profit-at-Ease-`,
    custom: `${KUCOIN_HOST}/support/900006636823-Run-the-Futures-Grid-Bot-to-Earn-Profit-at-Ease-`,
  },
  zh_CN: {
    ai: `${KUCOIN_HOST}/zh-hans/support/900006636823-Run-the-Futures-Grid-Bot-to-Earn-Profit-at-Ease-`,
    custom: `${KUCOIN_HOST}/zh-hans/support/900006636823-Run-the-Futures-Grid-Bot-to-Earn-Profit-at-Ease-`,
  },
};

// 爆仓使用教程跳转地址
const liquidation = {
  en_US: `${KUCOIN_HOST}/support/8664870317849-What-is-Liquidation-`,
  zh_CN: `${KUCOIN_HOST}/zh-hant/support/8664870317849-%E4%BB%80%E9%BA%BD%E6%98%AF%E5%BC%B7%E5%88%B6%E5%B9%B3%E5%80%89-`,
};
//
export const jumpLiquidationDetails = () => {
  const lang = getAvailLang();
  // jump(liquidation[lang]);
};

// 方向 ==> 国际化key
export const directionLangCfg = {
  long: 'zuoduo',
  short: 'zuokong',
};
// 方向 ==> 显示文本的颜色
export const diectionColorCfg = {
  long: 'color-primary',
  short: 'color-secondary',
};

// 合约网格交易对的的图标地址
// https://assets3.staticimg.com/futures/ALICE.png
export const getIconUrl = (base, imgUrl) => {
  if (imgUrl) return imgUrl;
  if (!base) return;
  // XBT单独处理，比较特殊
  base = base === 'XBT' ? 'BTC' : base;
  return `https://assets3.staticimg.com/futures/${base}.png`;
};

// 合约增加保证金 风险
const riskConfig = {
  low: {
    // icon: require('assets/widgets/lowrisk.svg'),
    lang: 'futrgrid.lowrisk',
    color: '#26BC9C',
  },
  mid: {
    // icon: require('assets/widgets/midrisk.svg'),
    lang: 'futrgrid.midrisk',
    color: '#E9B776',
  },
  high: {
    // icon: require('assets/widgets/highrisk.svg'),
    lang: 'futrgrid.highrisk',
    color: '#ED6666',
  },
};
// 1-3倍为低风险；4-5为中风险；6-10为高风险
export const getRiskByLeverage = (leverage) => {
  leverage = +leverage;
  leverage = Math.min(10, leverage);
  let type = 'low';
  if (leverage >= 1 && leverage <= 3) {
    type = 'low';
  } else if (leverage >= 4 && leverage <= 5) {
    type = 'mid';
  } else if (leverage >= 6 && leverage <= 10) {
    type = 'high';
  }
  return riskConfig[type];
};

// 网格配置页面的说明文字
export const tipConfig = () => ({
  pricerange: {
    title: _t('futrgrid.pricerange'),
    content: _t('futrgrid.futurerangehint'),
  },
  3: {
    title: _t('gridform15'),
    content: _t('gridformTip6'),
  },
  4: {
    title: _t('gridform29'),
    content: _t('gridformTip7'),
  },
  stoppricelong: {
    title: _t('gridform21'),
    content: _t('futrgrid.stoppricehintlong'),
  },
  stoppriceshort: {
    title: _t('gridform21'),
    content: _t('futrgrid.stoppricehintshort'),
  },
  6: {
    title: _t('openprice'),
    content: _t('gridformTip9'),
  },
  stopprofitpricelong: {
    title: _t('stopprofit'),
    content: _t('stopprofitpricehintlong'),
  },
  stopprofitpriceshort: {
    title: _t('stopprofit'),
    content: _t('stopprofitpricehintshort'),
  },
  openpricelong: {
    title: _t('openprice'),
    content: _t('futrgrid.openpricelong'),
  },
  openpriceshort: {
    title: _t('openprice'),
    content: _t('futrgrid.openpriceshort'),
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
    okText: _t('gridform24'),
    cancelText: null,
  },
  funding: {
    title: _t('futrgrid.assetrate'),
    content: _t('futrgrid.fundingfeehint'),
    okText: _t('clsgrid.btchintcancel'),
    cancelText: _t('gridform24'),
    moreLinks: {
      en_US: `${KUCOIN_HOST}/support/900005080563-Futures-Encyclopedia-01-What-is-a-Funding-Rate-`,
      zh_CN: `${KUCOIN_HOST}/zh-hans/support/900005080563-%E4%B8%80%E6%96%87%E6%90%9E%E6%87%82%E8%B5%84%E9%87%91%E8%B4%B9%E7%8E%87`,
    },
  },
  noticeOutbound: {
    title: _t('outrangehint'),
    content: _t('outrangecontent'),
    okText: _t('gridform24'),
  },
});

// 风险限额参考文档跳转地址
const riskJumpUrl = {
  en_US: `${KUCOIN_HOST}/blog/what-is-risk-limit-level-on-kucoin-futures-cn`,
  zh_CN: `${KUCOIN_HOST}/zh-hant/blog/what-is-risk-limit-level-on-kucoin-futures-cn`,
};

export const riskJump = () => {
  // const lang = getAvailLang();
  // jump(riskJumpUrl[lang]);
};

/**
 * @description: 追加保证金弹窗的接口配置
 */
export const addMarginApiConfig = {
  submit: addDeposit,
  calcBlowUp: getCalcBlowUpPrice,
};
