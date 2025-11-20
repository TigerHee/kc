/**
 * Owner: mike@kupotech.com
 */
import DialogRef from 'Bot/components/Common/DialogRef';
import { addMargin, calcBlowUpPrice } from './services';
import { div100 } from 'Bot/helper';
import { _t, _tHTML } from 'Bot/utils/lang';
import { siteCfg } from 'config';
import forEach from 'lodash/forEach';

const { KUCOIN_HOST } = siteCfg;
// 文案解释配置
export const toastHintConfig = {
  // 加仓倍投倍数
  '9Soj8pxepbL1a8gov36Ykk': {
    content: 'xescsPTBxhJ8tGwxXLWsxT',
  },
  // 首轮开仓条件
  p36PVMDHJnGYexgBmLgrvN: {
    content: 'jmZNGsWkbicMxcRqV3Y1T7',
  },
  // 循环开仓条件
  rTsH2BV1bbEsPXqZxwNscA: {},
  // 开仓价格区间
  g7VQsQSvnwTQ19cKnCM1ip: {
    content: 'phs73ydx17VG4QybstGt8U',
  },
  // 止损
  lossstop: {
    content: 'mBWqXJwBkAoy5VTk9hwzHR', // 止损弹窗文案修改
  },
  // 套利利润
  soJMwxHAKzNREmaAgBB4Ki: {
    content: 'kzrRfHuKkXe4SUsKaUrLfq',
  },
  // 浮动盈亏
  card9: {
    content: 'futrgrid.floathint',
  },
  // 本轮卖出价
  pdv39ijbcXv82gesCF8kNp: {
    content: 'a7LeMs6927iGFyRS3NSGG9',
  },
  // 本轮入场价格
  icR7y4ADodCUhopdk4mbut: {
    content: 'thisentryPriceHint',
  },
};

// 网格配置页面的说明文字
export const tipConfig = () => {
  const results = {};
  forEach(toastHintConfig, (item, key) => {
    if (item.content) {
      results[key] = {
        content: _t(item.content),
      };
    }
  });
  return results;
};
/**
 * @description: 解释的文案的dialog
 * @param {*} key 文案标题的key
 * @return {*}
 */
export const showHintDialog = (key) => {
  if (!key || !toastHintConfig[key]) return;
  const t = _tHTML(toastHintConfig[key].content);
  DialogRef.info({
    title: _t(key),
    content: t,
    okText: _t('gridform24'),
    cancelText: null,
    maskClosable: true,
  });
};

const templateId = 12;
// 提交数据格式
export const formatSubmitData = (options) => ({
  params: [
    {
      code: 'symbol',
      value: options.symbol,
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
      code: 'buyAfterFall',
      value: div100(options.buyAfterFall),
    },
    {
      code: 'buyTimes',
      value: options.buyTimes,
    },
    {
      code: 'buyMultiple',
      value: options.buyMultiple,
    },
    {
      code: 'stopProfitPercent',
      value: div100(options.stopProfitPercent),
    },
    {
      code: 'limitAsset',
      value: Number(options.limitAsset),
    },
    {
      code: 'openUnitPrice',
      value: options.openUnitPrice,
    },
    {
      code: 'circularOpeningCondition',
      value: options.circularOpeningCondition,
    },
    {
      code: 'minPrice',
      value: options.minPrice,
    },
    {
      code: 'maxPrice',
      value: options.maxPrice,
    },
    {
      code: 'stopLossPercent',
      value: div100(options.stopLossPercent) || undefined,
    },
    {
      code: 'stopLossPrice',
      value: options.stopLossPrice || undefined,
    },
  ],
  templateId,
  couponId: options.coupon?.id,
  prizeId: options.prizeId,
});

// 使用教程跳转地址
export const toturial = {
  en_US: `${KUCOIN_HOST}/support/25836601700505`,
  zh_CN: `${KUCOIN_HOST}/support/25836601700505`,
};

const RSI = 'RSI';
export const choice = () => [
  {
    lang: _t('startnow'),
    value: 'IMMEDIATELY',
  },
  {
    lang: `RSI(7,${_t('auto.orderhourtime', { hour: 1 })}) < 30`,
    value: RSI,
    meta: {
      value: 30,
      compareUnit: '<',
      compare: (val) => Number(val) < 30,
    },
    direction: 'long',
    description: '8w1cSkYurACadZXtMehzR7', // 文本描述
    dark: require(`@/assets/bot/martingale/future-mar-cycle-long-dark.svg`).default,
    light: require(`@/assets/bot/martingale/future-mar-cycle-long-light.svg`).default,
  },
  {
    lang: `RSI(7,${_t('auto.orderhourtime', { hour: 1 })}) > 70`,
    value: RSI,
    direction: 'short',
    meta: {
      value: 70,
      compareUnit: '>',
      compare: (val) => Number(val) > 70,
    },
    description: 'mvc6N7L4y87UhtWh6fcFVq',
    dark: require(`@/assets/bot/martingale/future-mar-cycle-short-dark.svg`).default,
    light: require(`@/assets/bot/martingale/future-mar-cycle-short-light.svg`).default,
  },
  {
    lang: _t('notCycle'),
    value: 'NEVER',
  },
];
/**
 * @description: 根据方向 值获取循环开仓的文本展示
 * @param {*} direction
 * @param {*} circularOpeningCondition
 * @return {*}
 */
export const getCircleChoice = ({ direction, circularOpeningCondition }) => {
  if (circularOpeningCondition === RSI && direction) {
    return choice().find((el) => el.direction === direction)?.lang;
  }
  return choice().find((el) => el.value === circularOpeningCondition)?.lang;
};

/**
 * @description: 追加保证金弹窗的接口配置
 */
export const addMarginApiConfig = {
  submit: addMargin,
  calcBlowUp: calcBlowUpPrice,
};
// 合约类型策略, 投资额度精度长度限制在8位以内
export const getInputMaxInvestPrecision = (precision) => {
  const inputMaxInvestPrecision = 8;
  return Math.min(precision, inputMaxInvestPrecision);
};
