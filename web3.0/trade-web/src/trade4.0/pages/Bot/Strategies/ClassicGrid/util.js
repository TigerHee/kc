/**
 * Owner: mike@kupotech.com
 */
import Decimal from 'decimal.js/decimal';
import { floatToPercent } from 'Bot/helper';

const maxCustomInverstGridNumber = 100; // 最大挂单数量
const defaultInverstGridNumber = 41; // 默认格子数量
/** 计算每个格子可以购买的base数量 */
/**
 * @param {*} inverst 投资额
 * @param {*} gridLevels 价格档位
 * @param {*} float 浮动参数
 * @param {*} lastTradedPrice 最新价格
 * @param {Number} basePrecision  base精度
 */
export const calcBuyNumPerGrid = (
  inverst,
  gridLevels,
  float = 0.95,
  lastTradedPrice = 0,
  basePrecision = 8,
) => {
  if (!inverst || !gridLevels.length) return 0;
  lastTradedPrice = Number(lastTradedPrice || 0);
  gridLevels = [...gridLevels];
  gridLevels.pop();
  let sumObj = 0;
  gridLevels.forEach((level) => {
    level = +level;
    // 小于当前价 就用那个时候的价格去买
    if (level < lastTradedPrice) {
      sumObj = Decimal(sumObj).add(level);
    } else if (level >= lastTradedPrice) {
      // 大于当前价格 就用现在的价格去买
      sumObj = Decimal(sumObj).add(lastTradedPrice);
    }
  });
  // 0.95保守计算
  return Decimal(inverst).times(float).div(sumObj).toFixed(basePrecision, Decimal.ROUND_DOWN);
};
/** 计算格子的价格差，价格挡 */
/**
 * @param {*} min 区间下限
 * @param {*} max 区间上限
 * @param {*} gridNum 网格数量/网格档位点  注意： 页面上显示的是挂单数量  （网格数量 = 挂单数量 + 1）
 * @param {*} precision 精度
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

// console.log(calcGridPriceLeval(0.0000086, 0.0000015, 101, 7), 999)
// feeRate来自 这个接口/v1/grid/task/symbol/info
// maxCustomInverstGridNumber 配置的100个 注意这个是配置 他们会改
// defaultInverstGridNumber 配置的默认数量
// gridProfitRatio来自于params接口中的字段
/** 计算最大格子数量 */
export const calcMaxGridNum = (max, min, pricePrecison, gridProfitRatio) => {
  max = +max;
  min = +min;
  if (!max || !min || max < min || !gridProfitRatio) return 0;
  // 最小价格差 5/1000是手续费 max 是以最大价格去算
  // 价格差 恰好等于手续费，为利润最小化，以此计算
  // 保险起见 就用max计算
  // const fee = Decimal(feeRate).times(2).add(perGridProfitRate);
  const minProfit = Decimal(max).times(gridProfitRatio);
  let gridNum = Math.floor(Decimal(max).sub(min).div(minProfit).toNumber());
  gridNum = Math.floor(Math.min(gridNum, maxCustomInverstGridNumber));

  // 处理上面计算出来的网格diff可能小于pricePrecison精度问题
  if (pricePrecison) {
    const maxGridNum = Math.floor(
      Decimal(max).sub(min).div(Math.pow(10, -pricePrecison)).valueOf(),
    );
    gridNum = Math.min(maxGridNum, gridNum);
  }
  return gridNum || defaultInverstGridNumber;
};

/**
 * 计算最小的max,即使利润恰好是手续费的时候
 * gridProfitRatio 来自于接口
 * @param {*} min
 */
export const calcMinMax = (min, basePrecison = 8, gridProfitRatio) => {
  min = +min;
  if (!min || !gridProfitRatio) return 0;
  // 区间下限/(1-2*fee)  = max
  // min /(1 - fee)**2 == max  ==> 1-2*fee + fee**2
  // min /(1 - 2 * fee)  ==> 1 - 2*fee 这个要保守些
  return Decimal(min)
    .div(Decimal(1).sub(Decimal(2).times(gridProfitRatio)))
    .toFixed(basePrecison, Decimal.ROUND_UP);
};

// 区间价格范围：根据当前价格上下浮动5倍
export const minMaxRange = (lastTradedPrice, precision) => {
  lastTradedPrice = +lastTradedPrice;
  if (!lastTradedPrice) return { min: 0, max: 0 };
  return {
    min: Number(Decimal(lastTradedPrice).div(5).toFixed(precision, Decimal.ROUND_DOWN)),
    max: Number(Decimal(lastTradedPrice).times(5).toFixed(precision, Decimal.ROUND_DOWN)),
  };
};

/**
 * 计算网格利润范围（扣除手续费）
 * @param {*} min
 * @param {*} max
 * @param {*} levelPrice 这个公式计算出calcGridPriceLeval
 * @param {*} feeRate 来自 这个接口/v1/grid/task/symbol/info
 */
export const calcGridProfitRange = (min, max, levelPrice, feeRate) => {
  min = +min;
  max = +max;
  levelPrice = +levelPrice;
  if (!min || !max || max < min || !levelPrice || !feeRate) return '--';

  // 最高卖价=区间上限
  // 最低买价=区间下限
  // 最高买价=区间上限- 间距
  // 最低卖价=区间下限+间距
  // 最低利润率 = （区间价格间距-区间最高买价*费率-区间最高卖价*费率）/区间最高买价
  // 最高利润率 = （区间价格间距-区间最低买价*费率-区间最低卖价*费率）/区间最低买价
  const maxBuy = Decimal(max).sub(levelPrice);
  const minSell = Decimal(min).add(levelPrice);

  const minFee = Decimal(levelPrice)
    .sub(Decimal(maxBuy).times(feeRate))
    .sub(Decimal(max).times(feeRate))
    .div(maxBuy)
    .toFixed(4, Decimal.ROUND_DOWN);

  const maxFee = Decimal(levelPrice)
    .sub(Decimal(min).times(feeRate))
    .sub(Decimal(minSell).times(feeRate))
    .div(min)
    .toFixed(4, Decimal.ROUND_DOWN);

  if (minFee === maxFee) {
    return floatToPercent(maxFee, 2);
  } else {
    return `${floatToPercent(minFee, 2)} ～ ${floatToPercent(maxFee, 2)}`;
  }
};

/**
 * @param {*} minimumOrderValue 最小下单金额
 * @param {*} minBaseInverst baseMinSize
 * @param {*} minimumInvestment 接口中的最小投资额
 * @param {*} gridNum 挂单数量
 * @param {*} max 最高价格
 * @param {*} min 最低价格
 * @param {*} precision 精度
 * @param {*} baseMinSize kc 最小下单数量
 * @param {*} lastTradedPrice 最新成交价格
 * @param {*} minimumOrderValue 最小下单价值
 * @param {*} minimumInvestment 接口中最小投资额
 */
export const calcMinInvertByGridNum = ({
  min,
  max,
  gridNum,
  precision,
  baseMinSize,
  lastTradedPrice,
  minimumOrderValue,
  minimumInvestment,
  isNotice,
  float = 1.2,
}) => {
  if (!minimumInvestment) {
    return {
      minInverst: 0,
      isShowHot: false,
    };
  }
  if (!baseMinSize || !gridNum || !min || !max || !minimumOrderValue || !lastTradedPrice) {
    return {
      minInverst: minimumInvestment ? Decimal(minimumInvestment).toFixed() : 0,
      isShowHot: isNotice,
    };
  }
  const { basePrecision, pricePrecision, quotaPrecision } = precision;
  gridNum = +gridNum;
  // 计算价格档位
  const { gridLevels } = calcGridPriceLeval(max, min, gridNum + 1, pricePrecision);
  // 去掉最高的价格档位
  gridLevels.pop();
  const sumDecimal = gridLevels.reduce((a, b) => Decimal(a).add(b), 0);
  // 计算最小下单数量
  const minGridSize = calculateMinGridSize({
    lastTradedPrice,
    min,
    baseMinSize,
    basePrecision,
    minimumOrderValue,
  });
  let minInverst = Decimal(sumDecimal)
    .times(minGridSize)
    .times(float)
    .toFixed(quotaPrecision, Decimal.ROUND_UP);
  minInverst = Math.max(minInverst, minimumInvestment); // 去最大值
  return {
    minInverst,
    isShowHot: isNotice,
  };
};
/** 计算最小下单数量
 * @param {*} lastTradedPrice 最新成交价格
 * @param {*} min 区间下限
 * @param {*} baseMinSize 接口中的最小下单数量
 * @param {*} basePrecision base精度
 * @param {*} minimumOrderValue 接口中的最小下单价值
 */
export const calculateMinGridSize = ({
  lastTradedPrice,
  min,
  baseMinSize,
  basePrecision,
  minimumOrderValue,
}) => {
  if (!minimumOrderValue || !lastTradedPrice || !min || !baseMinSize) {
    return 0;
  }
  const minSize = Decimal(minimumOrderValue)
    .div(Math.min(lastTradedPrice, min))
    .toFixed(basePrecision, Decimal.ROUND_UP);
  return Math.max(minSize, baseMinSize);
};
/**
 * 根据当前价格分离买卖单
 * 然后计算出需要处理（买卖）的quota数量，以及实际投入分布
 * @param {*} isUseBase 是否使用多币种
 * @param {*} lastTradedPrice 最新成交价格
 * @param {*} openUnitPrice 触发开单价格
 * @param {*} lastTradedPrice 最新成交价格
 * @param {*} max 最高价格
 * @param {*} min 最低价格
 * @param {*} gridNum 网格数量
 * @param {*} inverst 总投资额度
 * @param {*} baseAccount base账户
 * @param {*} symbolAccount quota账户
 * @param {*} baseIncrement base精度
 * @param {*} pricePrecision price精度
 * @param {*} quotaPrecision quota精度
 * @param {*} baseMinSize base最小挂单数量
 * @param {*} quoteMinSize quota最小挂单数量
 */
export const calcBuySellNum = (calcOptions) => {
  const { gridNum, precision, openUnitPrice, isUseBase, max, min, targetMin } = calcOptions;
  let { baseAccount, inverst, lastTradedPrice, symbolAccount } = calcOptions;
  if (!lastTradedPrice || !gridNum || !max || !min || !inverst) {
    return {
      // 恰好够
      deelBaseNum: 0,
      // 实际需要的base投资额
      needInverstBase: 0,
      // 实际需要的quota数量
      needInverstQuota: 0,
    };
  }
  let { baseMinSize, quoteMinSize } = targetMin;
  const { pricePrecision, basePrecision, quotaPrecision } = precision;
  baseMinSize = +baseMinSize;
  quoteMinSize = +quoteMinSize;
  inverst = +inverst;

  // 如果触发开单价格存在 ，就直接参与计算，否则用当前价格
  if (openUnitPrice) {
    lastTradedPrice = +openUnitPrice;
  } else {
    lastTradedPrice = +lastTradedPrice;
  }

  baseAccount = +Decimal(baseAccount).toFixed(basePrecision, Decimal.ROUND_DOWN);
  symbolAccount = +Decimal(symbolAccount).toFixed(quotaPrecision, Decimal.ROUND_DOWN);

  // 以下是核心
  // 先计算价格差 价格档位
  const levelObj = calcGridPriceLeval(max, min, gridNum, pricePrecision);
  const levelPrice = +levelObj.levelPrice;
  const gridLevels = levelObj.gridLevels;
  // 分离出 买单 卖单的档位
  const buy = [];
  const sell = [];
  // 最低价
  const minLevel = Number(gridLevels[0]);
  // 最高价
  const maxLevel = Number(gridLevels[gridLevels.length - 1]);
  // 买单价格必须小于最新价格且不为最高价格，卖单价格必须大于等于(最新价格+diff)且不为最低价格
  gridLevels.forEach((level) => {
    level = +level;
    // sell
    if (level > lastTradedPrice && level !== minLevel) {
      sell.push(level);
    } else if (level < lastTradedPrice - levelPrice && level !== maxLevel) {
      // buy
      buy.push(level);
    }
  });

  // 每个格子需要购买的base数量
  const gridPerNum = calcBuyNumPerGrid(inverst, gridLevels, 0.95, lastTradedPrice, basePrecision);
  let gridRealNeedBaseNum;
  let gridRealNeedQuotaNum;
  // 临界条件
  // 如果全部挂卖单
  if (sell.length === gridLevels.length - 1 && buy.length === 0) {
    gridRealNeedBaseNum = Decimal(inverst)
      .div(lastTradedPrice)
      .toFixed(basePrecision, Decimal.ROUND_DOWN);
    gridRealNeedQuotaNum = 0;
  } else if (buy.length === gridLevels.length - 1 && sell.length === 0) {
    // 如果全挂买单
    gridRealNeedBaseNum = 0;
    gridRealNeedQuotaNum = Decimal(inverst).toFixed(quotaPrecision, Decimal.ROUND_DOWN);
  } else {
    // 网格实际需要的base卖单数量
    gridRealNeedBaseNum = Decimal(sell.length)
      .times(gridPerNum)
      .toFixed(basePrecision, Decimal.ROUND_DOWN);
    // 网格实际需要的quota数量 = 总资产 - BTC的价值
    gridRealNeedQuotaNum = Decimal(inverst)
      .sub(Decimal(gridRealNeedBaseNum).times(lastTradedPrice))
      .toFixed(quotaPrecision, Decimal.ROUND_DOWN);
  }

  gridRealNeedBaseNum = +gridRealNeedBaseNum;
  gridRealNeedQuotaNum = +gridRealNeedQuotaNum;
  // 检查计算出的值是否满足交易的最小数量，计算需要处理的base数量
  const checkMinSizeAndCalcDeelBaseNum = (assetLayout) => {
    assetLayout.needInverstBase = +assetLayout.needInverstBase;
    // 4.检查needInverstBase needInverstQuota如果小于最小交易数量，就直接置为0
    if (assetLayout.needInverstBase < baseMinSize && assetLayout.needInverstBase > 0) {
      assetLayout.needInverstBase = 0;
      assetLayout.needInverstQuota = Decimal(inverst).toFixed(quotaPrecision, Decimal.ROUND_DOWN);
    } else if (assetLayout.needInverstQuota < quoteMinSize && assetLayout.needInverstQuota > 0) {
      assetLayout.needInverstBase = Decimal(inverst)
        .div(lastTradedPrice)
        .toFixed(basePrecision, Decimal.ROUND_DOWN);
      assetLayout.needInverstQuota = 0;
    }
    // 处理计算出的needInverstBase  needInverstQuota 在使用多币种 满仓时，因为价格变化，导致计算出大于账户余额的问题
    assetLayout.needInverstBase = Math.min(assetLayout.needInverstBase, baseAccount);
    assetLayout.needInverstQuota = Math.min(assetLayout.needInverstQuota, symbolAccount);

    // 计算需要处理的base ,也就是是买还是卖掉base 的数量，负数表示需要卖掉
    assetLayout.deelBaseNum = Decimal(gridRealNeedBaseNum)
      .sub(assetLayout.needInverstBase)
      .toNumber();
    // 需要处理的数量，需要乘以0.95 ,因为python里面是这样计算的
    assetLayout.deelBaseNum =
      assetLayout.deelBaseNum === 0
        ? 0
        : Decimal(assetLayout.deelBaseNum).toFixed(basePrecision, Decimal.ROUND_DOWN);
    assetLayout.deelBaseNum = Number(assetLayout.deelBaseNum);
    return assetLayout;
  };
  let assetLayout = {};
  // 不使用base的情况=========
  if (!isUseBase) {
    assetLayout = {
      // 实际划转的base投资额
      needInverstBase: 0,
      // 实际划转的quota数量
      needInverstQuota: Decimal(inverst).toFixed(quotaPrecision, Decimal.ROUND_DOWN),
    };

    assetLayout = checkMinSizeAndCalcDeelBaseNum(assetLayout);
    return assetLayout;
  }

  // 使用base的情况==========
  // 在投资总额中分配 base\quota的账户余额， 三种情况
  // 需要处理的base数量：实际需要的base - 划转的base
  //  1.base 不够，quota有多余的，用 quota去购买
  if (baseAccount < gridRealNeedBaseNum && gridRealNeedQuotaNum < symbolAccount) {
    // baseAccount 就是需要划转的base数量
    // 差的base
    const baseToQuota = Decimal(baseAccount)
      .times(lastTradedPrice)
      .toFixed(quotaPrecision, Decimal.ROUND_DOWN);
    assetLayout = {
      // 实际划转的base投资额
      needInverstBase: baseAccount,
      // 实际划转的quota数量
      needInverstQuota: Decimal(inverst)
        .sub(baseToQuota)
        .toFixed(quotaPrecision, Decimal.ROUND_DOWN),
    };
  } else if (baseAccount > gridRealNeedBaseNum && gridRealNeedQuotaNum > symbolAccount) {
    // 2.base 有多余的， 但quota不够， 需要卖掉多余的base
    assetLayout = {
      // 实际划转的base投资额
      needInverstBase: Decimal(inverst)
        .sub(symbolAccount)
        .div(lastTradedPrice)
        .toFixed(basePrecision, Decimal.ROUND_DOWN),
      // 实际划转的quota数量
      needInverstQuota: symbolAccount,
    };
  } else {
    // 3.base,quota 恰好够
    assetLayout = {
      // 恰好够
      // 实际划转的base投资额
      needInverstBase: gridRealNeedBaseNum,
      // 实际划转的quota数量
      needInverstQuota: gridRealNeedQuotaNum,
    };
  }

  assetLayout = checkMinSizeAndCalcDeelBaseNum(assetLayout);
  return assetLayout;
};
