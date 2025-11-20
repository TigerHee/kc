/**
 * Owner: mike@kupotech.com
 */
import { formatNumber, toCableCase, getAvailLang } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';
import { siteCfg } from 'config';

const { KUCOIN_HOST } = siteCfg;

export const DEFAULTSYMBOL = 'BTC/USDT';

// 提交数据格式
export const submitData = ({
  followTaskId,
  couponId,
  min,
  max,
  symbol,
  grid,
  inverst,
  stopLossPrice,
  stopProfitPrice,
  openUnitPrice,
  useBaseCurrency,
  baseAmount,
  quotaAmount,
  createEntrance,
  createWay,
}) => ({
  params: [
    {
      code: 'down',
      value: Number(min),
    },
    {
      code: 'up',
      value: Number(max),
    },
    {
      code: 'symbol',
      value: toCableCase(symbol),
    },
    {
      code: 'depth',
      value: Number(grid),
    },
    {
      code: 'limitAsset',
      value: Number(inverst),
    },
    {
      code: 'stopLossPrice',
      value: Number(stopLossPrice || 0),
    },
    {
      code: 'stopProfitPrice',
      value: Number(stopProfitPrice || 0),
    },
    {
      code: 'openUnitPrice',
      value: Number(openUnitPrice || 0),
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
  templateId: 1,
  followTaskId,
  couponId, // 卡券id
  useBaseCurrency,
});

// 使用教程跳转地址
export const toturial = {
  en_US: {
    ai: `${KUCOIN_HOST}/support/900004174806-KuCoin-Tutorial-3-Steps-on-Making-Passive-Income-With-KuCoin-Trading-Bot-`,
    custom: `${KUCOIN_HOST}/support/900004174466-Classic-Grid`,
  },
  zh_CN: {
    ai: `${KUCOIN_HOST}/zh-hans/support/900004174486-%E7%BB%8F%E5%85%B8%E7%BD%91%E6%A0%BC-AI%E5%8F%82%E6%95%B0%E8%AE%BE%E7%BD%AE%E6%95%99%E7%A8%8B`,
    custom: `${KUCOIN_HOST}/zh-hans/support/900005129463-%E7%BB%8F%E5%85%B8%E7%BD%91%E6%A0%BC-%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8F%82%E6%95%B0%E8%AE%BE%E7%BD%AE%E6%95%99%E7%A8%8B`,
  },
};

// 入场价格链接
const entryPriceActicle = {
  zh_CN: `${KUCOIN_HOST}/zh-hans/support/5110407224089-%E3%80%90%E7%BD%91%E6%A0%BC%E4%BA%A4%E6%98%93%E3%80%91%E5%B8%81%E4%BB%B7%E4%B8%8B%E8%B7%8C%E5%8F%88%E5%9B%9E%E8%B0%83-%E4%B8%BA%E4%BB%80%E4%B9%88%E6%88%91%E7%9A%84%E6%94%B6%E7%9B%8A%E6%98%AF%E8%B4%9F%EF%BC%9F-`,
  en_US: `${KUCOIN_HOST}/support/5110407224089-[Grid-Trading]-The-currency-price-fell-and-then-corrected-why-is-my-return-negative-`,
};
export const getEntryPirceActicle = () => {
  return entryPriceActicle[getAvailLang()];
};

// 运行卡片字段提示说明配置
export const tipConfig = () => ({
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
      en_US: `${KUCOIN_HOST}/support/900004174466--Spot-Grid-Introduction-to-Parameters`,
      zh_CN: `${KUCOIN_HOST}/zh-hant/support/900004174466--%E7%B6%B2%E6%A0%BC%E4%BA%A4%E6%98%93-%E5%8F%83%E6%95%B8%E7%B0%A1%E4%BB%8B`,
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
    moreLinks: entryPriceActicle,
  },
  breakEven: {
    title: _t('profitchart1'),
    content: _tHTML('8YgDcWwoYwzq8tEGapeNY6'),
    okText: _t('gridform24'),
  },
  overBreakEven: {
    title: _t('goodhint'),
    content: _t('2Bzn5msAP8DMdhASgxcgQ5'),
    okText: _t('gridform24'),
  },
  avgBuyPrice: {
    title: _t('buyavgprice'),
    content: _t('avgpricehint'),
    okText: _t('gridform24'),
    cancelText: null,
  },
  canReInvestment: {
    title: _t('8wXevk7txKQcBRBAR16bwn'),
    content: _t('tRHTdEV2BBBhCfe78okJp4'),
    secContent: _t('urdQKWLojQhF5ZZ3EzqkeM'),
    okText: _t('gridform24'),
  },
  closeRobot: (item, symbolInfo) => ({
    title: _t('hJd67FCzWGtw2uMbbGp54F'),
    content: item.completeTime
      ? _tHTML('oCoi27wA2eQCZeZRnqeN7y', {
          base: symbolInfo.base,
          quota: symbolInfo.quota,
          lastTradePrice: formatNumber(item.price, symbolInfo.quotaPrecision),
          breakEvenPrice: formatNumber(item.breakEvenPrice, symbolInfo.quotaPrecision),
          // completeTime: getDayHourTime(item.completeTime),
        })
      : _tHTML('n9Z8zaJemd3TxnBtekM7vG', {
          base: symbolInfo.base,
          quota: symbolInfo.quota,
          lastTradePrice: formatNumber(item.price, symbolInfo.quotaPrecision),
          breakEvenPrice: formatNumber(item.breakEvenPrice, symbolInfo.quotaPrecision),
        }),
    link: `${_t('c1cj1eVsJt5hZXn4xE6yty')} >`,
    okText: _t('x2BvbpDz4noiBeCXdNHFWd'),
    cancelText: _t('kw7jbihEkVChFaAAMN6yKv'),
  }),
  canReInvestment2: {
    title: _t('8wXevk7txKQcBRBAR16bwn'),
    content: _t('tRHTdEV2BBBhCfe78okJp4'),
    okText: _t('gridform24'),
  },
  noticeOutbound: {
    title: _t('outrangehint'),
    content: _t('outrangecontent'),
    okText: _t('gridform24'),
  },
});

export const minCustomInverstGridNumber = 2; // 最小挂单数量
export const maxCustomInverstGridNumber = 100; // 最大挂单数量
