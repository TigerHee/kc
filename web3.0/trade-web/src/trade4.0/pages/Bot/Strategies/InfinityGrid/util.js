/**
 * Owner: mike@kupotech.com
 */
import { minInverst, perGridPRRange } from './config';
import Decimal from 'decimal.js/decimal';

// ---无限网格
/**
 * @description: 计算创建的时候需要购买base的数量
 * @description: 1-（入场价-最低价）/入场价】*总投资额=买入交易币种数量 【U的价值】
 * @param {*} lastTradedPrice 最新成交价格
 * @param {*} down 下限
 * @param {*} symbolInfo 精度
 * @param {*} limitAsset 总投资额度
 * @return {*}
 */
export const calcBuyNum = ({ down, lastTradedPrice, symbolInfo, limitAsset }) => {
  down = +down;
  lastTradedPrice = +lastTradedPrice;
  limitAsset = +limitAsset;
  if (!down || !limitAsset || !lastTradedPrice) return 0;
  const sellRatio = Decimal(lastTradedPrice).sub(down).div(lastTradedPrice);
  const buyRatio = Decimal(1).sub(sellRatio);
  return buyRatio
    .times(limitAsset)
    .div(lastTradedPrice)
    .toFixed(symbolInfo?.basePrecision || 8, Decimal.ROUND_UP);
};

const minConfig = {
  BTC: 0.0002,
  ETH: 0.01,
  USDT: 40,
  KCS: 6,
};
/**
 * @description: 计算最小投资额度
 * @param {*}  quota
 * @param {*}  down 区间下限
 * @param {*}  gridProfitRatio 单网格利率
 * @param {*}  lastTradedPrice 最新价格
 * @param {*}  minimumOrderValue 最小下单金额
 * @param {*}  symbolInfo
 * @param {*}  minimumInvestment 接口中的最小下单金额
 * @return {*}
 */
export const calcMinInverst = ({
  quota,
  down,
  gridProfitRatio,
  lastTradedPrice,
  minimumOrderValue, // 最小下单金额
  symbolInfo,
  minimumInvestment, //  接口中的最小下单金额
}) => {
  down = +down;
  gridProfitRatio = +gridProfitRatio;
  lastTradedPrice = +lastTradedPrice;
  const baseMinSize = +symbolInfo.baseMinSize;
  if (!down || !gridProfitRatio || !lastTradedPrice) {
    if (quota) {
      return minConfig[quota] || minInverst;
    } else {
      return minInverst;
    }
  }
  // (投资额 * （1-（当前价-最低价）/当前价）) * 单网格利润=baseMinSize * 当前价 * 5
  // 其中限制条件： baseMinSize * 当前价 < minimumOrderValue， 取minimumOrderValue
  // 如果计算结果小于40u，则取40u
  let temp = Decimal(baseMinSize).times(lastTradedPrice);
  if (minimumOrderValue) {
    temp = temp.lessThan(minimumOrderValue) ? minimumOrderValue : temp;
  }

  const minCalcInverst = Decimal(temp).times(5);
  const sellRatio = Decimal(lastTradedPrice).sub(down).div(lastTradedPrice);
  const buyRatio = Decimal(1).sub(sellRatio);
  const min = Decimal(minCalcInverst)
    .div(gridProfitRatio)
    .div(buyRatio)
    .toFixed(symbolInfo?.quotaPrecision || 8, Decimal.ROUND_UP);

  const minBase = minConfig[quota] || minInverst;
  let minInverstTemp = Math.max(min, minBase);
  //   和来自接口中的最小下单金额比较
  if (minimumInvestment) {
    minInverstTemp = Math.max(minInverstTemp, minimumInvestment);
  }

  return minInverstTemp;
};

/**
 * @description: 根据最低价 priceIncrement计算最小单网格利率
 * @param {*} down 区间下限
 * @param {*} priceIncrement 价格精度0.000001
 * @return {*}
 */
export const calcMinPR = ({ down, priceIncrement }) => {
  down = +down;
  priceIncrement = +priceIncrement;
  if (!down || !priceIncrement) return perGridPRRange;
  const minPR = 0.002; // 最小PR；
  const maxPR = 0.1; // 最大PR;
  const up = perGridPRRange[1];
  let low = perGridPRRange[0];
  low = Decimal(low).div(100);
  const t = Decimal(down).times(low);

  if (t.greaterThanOrEqualTo(priceIncrement)) {
    return perGridPRRange;
  }
  // 倒推：恰好是priceIncrement的时候 最小的low
  low = Decimal(priceIncrement).div(down).toFixed(4, Decimal.ROUND_CEIL);
  // 只能在0.002～0.1之间
  low = Math.min(Math.max(low, minPR), maxPR);
  return [Decimal(low).times(100).toNumber(), up];
};

/**
 * @description:根据当前价格分离买卖单
 * 然后计算出需要处理（买卖）的quota数量，以及实际投入分布
 * @param {*} lastTradedPrice 最新成交价格
 * @param {*} buyNum 创建需要购买的BASE数量 由calcBuyNum 公式计算出
 * @param {*} useBaseCurrency 是否用多币种
 * @param {*} limitAsset 总投资额度
 * @param {*} balance 账户余额
 * @param {*} symbolInfo 精度信息
 * @return {*}
 */
export const calcBuySellNum = (calcOptions) => {
  const { useBaseCurrency, balance, symbolInfo } = calcOptions;
  let { buyNum, lastTradedPrice, limitAsset } = calcOptions;
  if (!lastTradedPrice || !limitAsset || !buyNum) {
    return {
      // 恰好够
      deelBaseNum: 0,
      // 实际需要的base投资额
      needInverstBase: 0,
      // 实际需要的quota数量
      needInverstQuota: 0,
    };
  }
  let { baseAmount: baseAccount, quoteAmount: quotaAccount } = balance;
  let { baseMinSize, quoteMinSize } = symbolInfo;
  const { basePrecision, quotaPrecision } = symbolInfo;
  baseMinSize = +baseMinSize;
  quoteMinSize = +quoteMinSize;
  limitAsset = +limitAsset;
  lastTradedPrice = +lastTradedPrice;
  buyNum = +buyNum;

  // 账户去向下精度
  baseAccount = +Decimal(baseAccount).toFixed(basePrecision, Decimal.ROUND_DOWN);
  quotaAccount = +Decimal(quotaAccount).toFixed(quotaPrecision, Decimal.ROUND_DOWN);

  // 网格实际需要的base卖单数量
  const gridRealNeedBaseNum = buyNum;
  // 网格实际需要的quota数量 = 总资产 - BTC的价值
  let gridRealNeedQuotaNum = Decimal(limitAsset)
    .sub(Decimal(gridRealNeedBaseNum).times(lastTradedPrice))
    .toFixed(quotaPrecision, Decimal.ROUND_DOWN);

  gridRealNeedQuotaNum = +gridRealNeedQuotaNum;

  // 检查计算出的值是否满足交易的最小数量，计算需要处理的base数量
  const checkMinSizeAndCalcDeelBaseNum = (assetLayout) => {
    assetLayout.needInverstBase = +assetLayout.needInverstBase;
    // 4.检查needInverstBase needInverstQuota如果小于最小交易数量，就直接置为0
    if (assetLayout.needInverstBase < baseMinSize && assetLayout.needInverstBase > 0) {
      assetLayout.needInverstBase = 0;
      assetLayout.needInverstQuota = Decimal(limitAsset).toFixed(
        quotaPrecision,
        Decimal.ROUND_DOWN,
      );
    } else if (assetLayout.needInverstQuota < quoteMinSize && assetLayout.needInverstQuota > 0) {
      assetLayout.needInverstBase = Decimal(limitAsset)
        .div(lastTradedPrice)
        .toFixed(basePrecision, Decimal.ROUND_DOWN);
      assetLayout.needInverstQuota = 0;
    }
    // 处理计算出的needInverstBase  needInverstQuota 在使用多币种 满仓时，因为价格变化，导致计算出大于账户余额的问题
    assetLayout.needInverstBase = Math.min(assetLayout.needInverstBase, baseAccount);
    assetLayout.needInverstQuota = Math.min(assetLayout.needInverstQuota, quotaAccount);

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
  if (!useBaseCurrency) {
    assetLayout = {
      // 实际划转的base投资额
      needInverstBase: 0,
      // 实际划转的quota数量
      needInverstQuota: Decimal(limitAsset).toFixed(quotaPrecision, Decimal.ROUND_DOWN),
    };

    assetLayout = checkMinSizeAndCalcDeelBaseNum(assetLayout);
    return assetLayout;
  }

  // 使用base的情况==========
  // 在投资总额中分配 base\quota的账户余额， 三种情况
  // 需要处理的base数量：实际需要的base - 划转的base
  //  1.base 不够，quota有多余的，用 quota去购买
  if (baseAccount < gridRealNeedBaseNum && gridRealNeedQuotaNum < quotaAccount) {
    // baseAccount 就是需要划转的base数量
    // 差的base
    const baseToQuota = Decimal(baseAccount)
      .times(lastTradedPrice)
      .toFixed(quotaPrecision, Decimal.ROUND_DOWN);
    assetLayout = {
      // 实际划转的base投资额
      needInverstBase: baseAccount,
      // 实际划转的quota数量
      needInverstQuota: Decimal(limitAsset)
        .sub(baseToQuota)
        .toFixed(quotaPrecision, Decimal.ROUND_DOWN),
    };
  } else if (baseAccount > gridRealNeedBaseNum && gridRealNeedQuotaNum > quotaAccount) {
    // 2.base 有多余的， 但quota不够， 需要卖掉多余的base
    assetLayout = {
      // 实际划转的base投资额
      needInverstBase: Decimal(limitAsset)
        .sub(quotaAccount)
        .div(lastTradedPrice)
        .toFixed(basePrecision, Decimal.ROUND_DOWN),
      // 实际划转的quota数量
      needInverstQuota: quotaAccount,
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
