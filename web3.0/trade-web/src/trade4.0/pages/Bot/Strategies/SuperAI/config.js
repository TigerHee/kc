/**
 * Owner: mike@kupotech.com
 */
import { toCableCase, getAvailLang } from 'Bot/helper';
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
  gridNum,
  inverst,
  stopLossPrice,
  stopProfitPrice,
  openUnitPrice,
  templateId,
  baseAmount,
  quotaAmount,
  createEntrance,
  createWay,
  prizeId,
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
      value: Number(gridNum) + 1,
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
      value: Number(inverst),
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
  templateId,
  followTaskId,
  prizeId,
  couponId, // 卡券id
  useBaseCurrency: false,
});

// 现货网格是如何挣钱的
export const howtogrow = {
  en_US: `${KUCOIN_HOST}/support/9283560452761-How-to-Grow-Profit-in-Spot-Grid-Trading-`,
  zh_HK: `${KUCOIN_HOST}/zh-hant/support/9283560452761-%E5%A6%82%E4%BD%95%E5%9C%A8%E7%8E%B0%E8%B4%A7%E7%BD%91%E6%A0%BC%E4%BA%A4%E6%98%93%E4%B8%AD%E8%8E%B7%E5%BE%97%E5%88%A9%E6%B6%A6%EF%BC%9F`,
};
// 使用教程跳转地址
export const toturial = {
  en_US: `${KUCOIN_HOST}/support/19843150706329`,
  zh_CN: `${KUCOIN_HOST}/zh-hant/support/19844154904345`,
};

// 入场价格链接
const entryPriceActicle = {
  zh_CN: `${KUCOIN_HOST}/zh-hans/support/5110407224089-%E3%80%90%E7%BD%91%E6%A0%BC%E4%BA%A4%E6%98%93%E3%80%91%E5%B8%81%E4%BB%B7%E4%B8%8B%E8%B7%8C%E5%8F%88%E5%9B%9E%E8%B0%83-%E4%B8%BA%E4%BB%80%E4%B9%88%E6%88%91%E7%9A%84%E6%94%B6%E7%9B%8A%E6%98%AF%E8%B4%9F%EF%BC%9F-`,
  en_US: `${KUCOIN_HOST}/support/5110407224089-[Grid-Trading]-The-currency-price-fell-and-then-corrected-why-is-my-return-negative-`,
};
export const getEntryPirceActicle = () => {
  return entryPriceActicle[getAvailLang()];
};
