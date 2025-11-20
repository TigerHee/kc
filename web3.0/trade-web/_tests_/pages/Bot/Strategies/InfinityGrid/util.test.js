/**
 * Owner: mike@kupotech.com
 */
/*
 * @LastEditors: mike mike@kupotech.com
 * @Date: 2023-03-28 16:33:03
 * @LastEditTime: 2024-05-13 19:30:10
 * @Description: 无限网格单测
 */
import { calcBuyNum, calcMinInverst, calcMinPR, calcBuySellNum } from 'Bot/Strategies/InfinityGrid/util';
import { cloneDeep } from 'lodash';

jest.mock('utils/lang', () => ({
  getLang: function() {
    return 'en-US';
  },
  _t: function() {
    return '';
  },
  isRTLLanguage: () => false
}));
describe('无限网格单测', () => {
  const metaData = {
    symbol: 'BTC-USDT',
    lastTradedPrice: 20000
  };
  const symbolInfo = {
    pricePrecision: 4,
    quotaPrecision: 4,
    basePrecision: 4,
    baseMinSize: 0.000001,
    quoteMinSize: 0.00001,
    minimumOrderValue: 0.1,
    minimumInvestment: 10.0001,
    priceIncrement: 0.0001
  };
  const createInfo = {
    down: 15000,
    grid: 60,
    limitAsset: 1000,
    lastTradedPrice: metaData.lastTradedPrice,
    symbolInfo,
    quota: 'USDT',
    gridProfitRatio: 2,
    minimumOrderValue: symbolInfo.minimumOrderValue,
    minimumInvestment: symbolInfo.minimumInvestment,
    priceIncrement: symbolInfo.priceIncrement,
    account: {
      baseAccount: 10000,
      symbolAccount: 10000
    },
    balance: {
      baseAmount: 10000,
      quoteAmount: 10000
    },
    useBaseCurrency: false,
    targetMin: symbolInfo,
    precision: symbolInfo
  };
  createInfo.buyNum = calcBuyNum(createInfo);

  it('计算创建的时候需要购买base的数量', () => {
    expect(calcBuyNum(cloneDeep(createInfo))).toEqual('0.0375');
  });
  it('计算创建的时候需要购买base的数量 ==> basePrecision不存在的情况', () => {
    const _symbolInfo = { ...symbolInfo, basePrecision: 0 };
    createInfo.symbolInfo = _symbolInfo;
    const _createInfo = cloneDeep(createInfo);
    expect(calcBuyNum(_createInfo)).toEqual('0.03750000');
  });
  it('计算创建的时候需要购买base的数量 -> down 0', () => {
    const createInfo = {
      down: 0
    };
    expect(calcBuyNum(createInfo)).toEqual(0);
  });
  it('计算最小投资额度', () => {
    expect(calcMinInverst(cloneDeep(createInfo))).toEqual(40);
  });
  it('计算最小投资额度 -> down 0', () => {
    const createInfo = {
      down: 0,
      targetMin: symbolInfo,
      lastTradedPrice: metaData.lastTradedPrice,
      symbolInfo,
      quota: 'USDT',
      gridProfitRatio: 2
    };
    expect(calcMinInverst(createInfo)).toEqual(40);
  });
  it('计算最小投资额度 ==>  quota 不存在的情况', () => {
    const createInfo = {
      down: 0,
      targetMin: symbolInfo,
      lastTradedPrice: metaData.lastTradedPrice,
      symbolInfo,
      gridProfitRatio: 2
    };
    expect(calcMinInverst(createInfo)).toEqual(40);
  });
  it('计算最小投资额度 -> minimumOrderValue 0.0001', () => {
    const createInfo = {
      down: 2,
      targetMin: symbolInfo,
      lastTradedPrice: metaData.lastTradedPrice,
      symbolInfo,
      quota: 'USDT',
      gridProfitRatio: 2,
      minimumOrderValue: 0.0001
    };
    expect(calcMinInverst(createInfo)).toEqual(500);
  });
  it('根据最低价 priceIncrement计算最小单网格利率', () => {
    expect(calcMinPR(cloneDeep(createInfo))).toEqual([0.2, 10]);
  });
  it('根据最低价 priceIncrement计算最小单网格利率 ==> down不存在的情况', () => {
    const createInfo = {
      priceIncrement: symbolInfo.priceIncrement
    };
    expect(calcMinPR(createInfo)).toEqual([0.2, 10]);
  });

  it('根据最低价 priceIncrement计算最小单网格利率 ==> down非常小的情况', () => {
    const createInfo = {
      down: 0.03,
      priceIncrement: symbolInfo.priceIncrement //  0.0001
    };
    expect(calcMinPR(createInfo)).toEqual([0.34, 10]);
  });


  it('根据当前价格分离买卖单 ==> lastTradedPrice不存在情况', () => {
    const _createInfo = cloneDeep(createInfo);
    _createInfo.lastTradedPrice = 0;
    expect(calcBuySellNum(_createInfo)).toEqual({
      deelBaseNum: 0,
      needInverstBase: 0,
      needInverstQuota: 0
    });
  });
  it('calcBuySellNum', () => {
    expect(calcBuySellNum({})).toEqual({
      deelBaseNum: 0,
      needInverstBase: 0,
      needInverstQuota: 0
    });


    const metaData = {
      symbol: 'BTC-USDT',
      lastTradedPrice: 20000
    };
    const symbolInfo = {
      pricePrecision: 4,
      quotaPrecision: 4,
      basePrecision: 4,
      baseMinSize: 0.000001,
      quoteMinSize: 0.00001,
      minimumOrderValue: 0.1,
      minimumInvestment: 10.0001,
      priceIncrement: 0.0001
    };
    const _createInfo = {
      down: 15000,
      grid: 60,
      limitAsset: 1000,
      lastTradedPrice: metaData.lastTradedPrice,
      symbolInfo,
      quota: 'USDT',
      gridProfitRatio: 2,
      minimumOrderValue: symbolInfo.minimumOrderValue,
      minimumInvestment: symbolInfo.minimumInvestment,
      priceIncrement: symbolInfo.priceIncrement,
      balance: {
        baseAmount: 10000,
        quoteAmount: 10000
      },
      useBaseCurrency: false,
      targetMin: symbolInfo,
      precision: symbolInfo
    };
    _createInfo.buyNum = calcBuyNum(_createInfo);
    expect(calcBuySellNum(_createInfo)).toEqual({
      deelBaseNum: 0.0375,
      needInverstBase: 0,
      needInverstQuota: 1000
    });
  });
});
