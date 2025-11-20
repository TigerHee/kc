/**
 * Owner: mike@kupotech.com
 */
import { getAvailLang, div100 } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';
import { siteCfg } from 'config';

const { KUCOIN_HOST } = siteCfg;

export const DEFAULTSYMBOL = 'BTC/USDT';

// 提交数据格式
export const submitData = (options) => {
  const {
    createWay = 'AI',
    leverage,
    prizeId,
    limitAsset,
    riskVersion,
    symbol,
    stopLossPercent,
    couponId,
  } = options;
  return {
    couponId,
    templateId: 9,
    createWay,
    useBaseCurrency: false,
    prizeId,
    params: [
      { code: 'symbol', value: symbol },
      { code: 'limitAsset', value: limitAsset },
      { code: 'leverage', value: leverage },
      {
        code: 'stopLossPercent',
        value: prizeId ? '' : stopLossPercent ? div100(stopLossPercent) : '',
      },
      { code: 'riskVersion', value: riskVersion },
    ],
  };
};
// 使用教程跳转地址
export const toturial = {
  en_US: `${KUCOIN_HOST}/support/20917216547737`,
  zh_CN: `${KUCOIN_HOST}/support/20917216547737`,
};
// AI双向赢声明教程链接
const statementLink = {
  link1: {
    en_US: `${KUCOIN_HOST}/support/20065000773913`,
    zh_CN: `${KUCOIN_HOST}/zh-hant/support/20065000773913`,
  },
  link2: {
    en_US: `${KUCOIN_HOST}/support/20065069619097`,
    zh_CN: `${KUCOIN_HOST}/zh-hant/support/20065069619097`,
  },
};
export const handleLinkClick = (e) => {
  const linkType = e.target?.dataset?.type;
  const lang = getAvailLang();
  window.open(statementLink[linkType][lang]);
};
// 方向 ==> 国际化key
export const directionLangCfg = {
  long: 'zuoduo',
  short: 'zuokong',
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
  realizedProfit: {
    title: _t('realizedProfit'),
    content: _t('realizedProfitContent'),
    okText: _t('gridform24'),
    cancelText: null,
  },
  float: {
    // 浮动赢亏
    title: _t('floatTitle'),
    content: _tHTML('floatContent'),
    okText: _t('gridform24'),
    cancelText: null,
  },
});

// 风险限额参考文档跳转地址
const riskJumpUrl = {
  en_US: `${KUCOIN_HOST}/blog/what-is-risk-limit-level-on-kucoin-futures-cn`,
  zh_CN: `${KUCOIN_HOST}/zh-hant/blog/what-is-risk-limit-level-on-kucoin-futures-cn`,
};

// export const riskJump = () => {
//   const lang = getAvailLang();
//   jump(riskJumpUrl[lang]);
// };

// 订单详情字段提示说明配置
export const robotParamsConfig = () => ({
  noticeOutbound: {
    title: _t('outrangehint'),
    content: _t('outrangecontent'),
    okText: _t('gridform24'),
  },
});
