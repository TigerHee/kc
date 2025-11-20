/**
 * Owner: Mike@kupotech.com
 */
import Decimal from 'decimal.js/decimal';
import { getBase } from 'Bot/helper';
import { _t } from 'Bot/utils/lang';
import { siteCfg } from 'config';
import { formatExecuteTime, isSelectWeek, getDayOfWeek } from './util';

const { KUCOIN_HOST } = siteCfg;


// 定投周期
export const INVERSTCYCLE = () => [
  // {
  //     label: '5分钟',
  //     value: 'm5'
  // },
  {
    label: _t('auto.orderhourtime', { hour: 1 }),
    value: 'H1',
    hour: 1,
  },
  {
    label: _t('auto.orderhourtime2', { hour: 4 }),
    value: 'H4',
    hour: 4,
  },
  {
    label: _t('auto.orderhourtime2', { hour: 8 }),
    value: 'H8',
    hour: 8,
  },
  {
    label: _t('auto.orderhourtime2', { hour: 12 }),
    value: 'H12',
    hour: 12,
  },
  {
    label: _t('auto.orderdaytime', { hour: 1 }),
    value: 'D1',
    hour: 24,
  },
  {
    label: _t('auto.orderdaytime2', { hour: 2 }),
    value: 'D2',
    hour: 2 * 24,
  },
  {
    label: _t('auto.orderdaytime2', { hour: 3 }),
    value: 'D3',
    hour: 3 * 24,
  },
  {
    label: _t('auto.orderdaytime2', { hour: 4 }),
    value: 'D4',
    hour: 4 * 24,
  },
  {
    label: _t('auto.orderweektime', { hour: 1 }),
    value: 'W1',
    hour: 7 * 24,
  },
  {
    label: _t('auto.orderweektime2', { hour: 2 }),
    value: 'W2',
    hour: 14 * 24,
  },
];
export const getINVERSTCYCLE = () => {
  const inverstCycleMap = Object.create(null);
  INVERSTCYCLE().forEach(el => {
    inverstCycleMap[el.value] = {
      ...el,
    };
  });
  return inverstCycleMap;
};

// 转换成map 方便使用
export const INVERSTCYCLEMAPS = () => {
  const map = new Map();
  const config = INVERSTCYCLE();
  config.forEach(el => {
    map.set(el.value, el.label);
  });
  return map;
};

export const getInverstCycle = interval => {
  if (!interval) return '';
  const INVERSTCYCLEMAPSS = INVERSTCYCLEMAPS();
  return INVERSTCYCLEMAPSS.get(interval) ?? '';
};
export const NOW = 'NOW';
// 首次下单时间
const filterEffetTime = (hasNow = true) => {
  const H = new Date().getHours();
  const min = 5;
  const when = [];
  const handleMinites = () => {
    const children = [];
    // 处理分钟
    Array.from({ length: 60 }).forEach((m, mindex) => {
      const minites = mindex * min;
      if (minites <= 55) {
        children.push({
          label: _t('auto.minites', { m: (`0${ minites}`).slice(-2) }),
          value: minites,
        });
      }
    });
    return children;
  };
  Array(24)
    .fill(0)
    .forEach((_, index) => {
      if (H === index && hasNow) {
        when.push({
          label: _t('auto.noworder'),
          value: NOW,
        });
      }
      when.push({
        label: _t('auto.hours', { h: (`0${ index}`).slice(-2) }),
        value: index,
        children: handleMinites(),
      });
    });
  return when;
};

export const orderTime = {
  filterEffetTime,
};

/**
 * @description: 周一到周日
 */
export const WEEKS = () => [
  {
    label: _t('monday'),
    value: 1,
  },
  {
    label: _t('tuesday'),
    value: 2,
  },
  {
    label: _t('wednesday'),
    value: 3,
  },
  {
    label: _t('thursday'),
    value: 4,
  },
  {
    label: _t('friday'),
    value: 5,
  },
  {
    label: _t('saturday'),
    value: 6,
  },
  {
    label: _t('sunday'),
    value: 7,
  },
];
// 提交数据格式
export const submitData = (formData) => {
  const {
    maxBuyPrice,
    maxTotalCost,
    createEntrance,
    createWay,
    symbol,
    amount,
    profitTarget,
    interval, // 定投周期
    dayOfWeek, // 定投日
    isTargetSellBase,
    executeTime, // 首次定投时间
    coupon,
  } = formData;

  return {
    params: [
      {
        code: 'symbol',
        value: symbol,
      },
      {
        code: 'amount',
        value: amount,
      },
      {
        code: 'interval',
        value: interval[0],
      },
      {
        code: 'dayOfWeek',
        value: isSelectWeek(interval) ? getDayOfWeek(dayOfWeek) : null,
      },
      {
        code: 'profitTarget',
        value: Decimal(profitTarget)
          .times(0.01)
          .valueOf(),
      },
      {
        code: 'isTargetSellBase',
        value: Boolean(isTargetSellBase),
      },
      {
        code: 'maxTotalCost',
        value: maxTotalCost,
      },
      {
        code: 'maxBuyPrice',
        value: maxBuyPrice,
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
    executeTime: formatExecuteTime({ executeTime, dayOfWeek, interval }),
    templateId: 2,
    couponId: coupon?.id,
  };
};
// 定投投资最大限制
const inverstMax = {
  BTC: 10000,
  ETH: 10000,
  OTHER: 2000,
};

export const getInverstMax = symbol => {
  const base = getBase(symbol);
  return inverstMax[base] || inverstMax.OTHER;
};

// 使用教程跳转地址
export const toturial = {
  en_US: `${KUCOIN_HOST}/support/20917465281817`,
  zh_CN: `${KUCOIN_HOST}/support/20917465281817`,
};
