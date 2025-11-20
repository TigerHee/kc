/**
 * Owner: mike@kupotech.com
 */
import Decimal from 'decimal.js';
import { _t } from 'Bot/utils/lang';
import { formatNumber } from 'Bot/helper';

const feeRate = 4 / 1000;
const maxGridNum = 100;
const minGridNum = 2;
export const minCustomInverstGridNumber = 2; // 最小挂单数量
/**
 * @description: 计算可以购买的最大格子数量
 * @param {*} max 区间上限
 * @param {*} min 区间下限
 * @param {*} pricePrecison 价格精度
 * @return {*}
 */
export const calcGridNumRange = (max, min, pricePrecison) => {
  max = +max;
  min = +min;
  if (!max || !min || max < min) {
    return {
      maxGridNum,
      minGridNum,
      rangeText: `${_t('gridform15')}(${minGridNum}-${maxGridNum})`,
    };
  }
  // 最小价格差 5/1000是手续费 max 是以最大价格去算
  // 价格差 恰好等于手续费，为利润最小化，以此计算
  // 保险起见 就用max计算
  const minProfit = Decimal(max).times(feeRate);
  let gridNum = Math.floor(Decimal(max).sub(min).div(minProfit).toNumber());
  gridNum = Math.floor(Math.min(gridNum, maxGridNum));
  gridNum = +Math.max(minGridNum, gridNum);

  if (pricePrecison) {
    // 处理上面计算出来的网格diff可能小于pricePrecison精度问题
    const maxGridNumForMinDiff = Math.floor(
      Decimal(max).sub(min).div(Math.pow(10, -pricePrecison)).valueOf(),
    );
    gridNum = Math.min(maxGridNumForMinDiff, gridNum);
  }

  const range = {
    maxGridNum: gridNum,
    minGridNum,
    rangeText: `${_t('gridform15')}(${minGridNum}-${gridNum})`,
  };

  if (minGridNum === gridNum) {
    range.rangeText = `${_t('gridform15')} ${minGridNum}`;
  } else if (minGridNum < gridNum) {
    range.rangeText = `${_t('gridform15')}(${minGridNum}-${gridNum})`;
  }
  return range;
};

/**
 * @description: 计算最小的max,即使利润恰好是手续费的时候
 * @param {*} min  区间下限
 * @param {*} basePrecison base精度
 * @return {*}
 */
export const calcMinMax = (min, basePrecison = 8) => {
  min = +min;
  if (!min) return 0;
  // 区间下限/(1-最小挂单数量*每格最小利润)
  return Decimal(min)
    .div(Decimal(1).sub(Decimal(2).times(feeRate)))
    .toFixed(basePrecison, Decimal.ROUND_UP);
};

/**
 * @description: 计算区间上下范围。根据当前价格上下浮动20倍
 * @param {*} lastTradedPrice 当前价格
 * @param {*} precision 价格精度
 * @return {*}
 */
export const minMaxRange = (lastTradedPrice, precision) => {
  lastTradedPrice = +lastTradedPrice;
  if (!lastTradedPrice) return { min: 0, max: 0 };
  return {
    min: Number(Decimal(lastTradedPrice).div(20).toFixed(precision, Decimal.ROUND_DOWN)),
    max: Number(Decimal(lastTradedPrice).times(20).toFixed(precision, Decimal.ROUND_DOWN)),
  };
};

/**
 * @description: 计算格子的价格差，价格挡
 * @param {*} min 区间下限
 * @param {*} max 区间上限
 * @param {*} gridNum 网格数量/网格档位点  注意： 页面上显示的是挂单数量  （网格数量 = 挂单数量 + 1）
 * @param {*} precision 价格精度
 * @return {*}
 */
export const calcGridPriceLeval = (max, min, gridNum, precision = 8) => {
  max = +max;
  min = +min;
  gridNum = +gridNum;
  if (!max || !min || !gridNum || max < min || gridNum <= 2) {
    return {
      levelPrice: 0,
      gridLevels: [],
    };
  }
  // 价格差
  const levelPrice = Decimal(max)
    .sub(min)
    .div(gridNum - 1)
    .toFixed(precision, Decimal.ROUND_DOWN);
  if (+levelPrice <= 0) {
    return {
      levelPrice: 0,
      gridLevels: [],
    };
  }
  // 价格档
  const gridLevels = [min];
  let startLevelPrice = min;
  Array.from({ length: gridNum - 2 }).forEach((el, index) => {
    const t = Decimal(startLevelPrice).add(levelPrice).toFixed(precision, Decimal.ROUND_DOWN);
    gridLevels.push(t);
    startLevelPrice = t;
  });
  gridLevels.push(max);
  return {
    levelPrice,
    gridLevels,
  };
};

export const getBlowUpPrice = (blowUpPrice, precision) => {
  let blowUpPriceNew;
  if (['0', 0].includes(blowUpPrice)) {
    blowUpPriceNew = 0;
  } else if (!blowUpPrice) {
    blowUpPriceNew = '--';
  } else {
    blowUpPriceNew = formatNumber(blowUpPrice, precision);
  }
  return blowUpPriceNew;
};

/**
 * @description: 根据两个接口中的两个字段数据, 计算最小投资额度
 * 自定义中 只有方向 杠杆的时候的最小投资额度
 * @return {*}
 */
export const getMinAmount = ({
  createInfoMinAmount,
  relatedParamsMinAmount,
  leverage,
  precision,
}) => {
  // 交易对中的除以杠杆倍数， calc中的取最大的
  const minAmountInSymbol = Decimal(createInfoMinAmount ?? 0)
    .div(leverage)
    .toNumber();
  let minAmount = Math.max(relatedParamsMinAmount ?? 0, minAmountInSymbol);
  minAmount = Decimal(minAmount).toFixed(precision, Decimal.ROUND_UP);
  return minAmount;
};
