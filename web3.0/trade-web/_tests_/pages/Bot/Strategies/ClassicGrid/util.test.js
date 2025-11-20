/**
 * Owner: mike@kupotech.com
 */
/*
 * @LastEditors: mike mike@kupotech.com
 * @Date: 2023-03-28 16:33:03
 * @LastEditTime: 2024-06-27 14:15:30
 * @Description: 现货网格单测
 */
import {
  calcBuyNumPerGrid,
  calcGridPriceLeval,
  calcMaxGridNum,
  calcMinMax,
  minMaxRange,
  calcGridProfitRange,
  calcMinInvertByGridNum,
  calculateMinGridSize,
  calcBuySellNum,
} from 'Bot/Strategies/ClassicGrid/util';

jest.mock('utils/lang', () => ({
  getLang: function () {
    return 'en-US';
  },
  _t: function () {
    return '';
  },
  isRTLLanguage: () => false,
}));
describe('现货网格单测', () => {
  const metaData = {
    symbol: 'BTC-USDT',
    lastTradedPrice: 20000,
  };
  const symbolInfo = {
    pricePrecision: 4,
    quotaPrecision: 4,
    basePrecision: 4,
    baseMinSize: 0.000001,
    quoteMinSize: 0.00001,
    minimumOrderValue: 0.1,
    minimumInvestment: 10.0001,
  };
  const createInfo = {
    min: 15000,
    max: 23000,
    grid: 60,
    inverst: 1000,
  };
  const priceLevel = calcGridPriceLeval(
    createInfo.max,
    createInfo.min,
    createInfo.grid,
    symbolInfo.pricePrecision,
  );
  const priceLevelHere = {
    levelPrice: '135.5932',
    gridLevels: [
      15000,
      '15135.5932',
      '15271.1864',
      '15406.7796',
      '15542.3728',
      '15677.9660',
      '15813.5592',
      '15949.1524',
      '16084.7456',
      '16220.3388',
      '16355.9320',
      '16491.5252',
      '16627.1184',
      '16762.7116',
      '16898.3048',
      '17033.8980',
      '17169.4912',
      '17305.0844',
      '17440.6776',
      '17576.2708',
      '17711.8640',
      '17847.4572',
      '17983.0504',
      '18118.6436',
      '18254.2368',
      '18389.8300',
      '18525.4232',
      '18661.0164',
      '18796.6096',
      '18932.2028',
      '19067.7960',
      '19203.3892',
      '19338.9824',
      '19474.5756',
      '19610.1688',
      '19745.7620',
      '19881.3552',
      '20016.9484',
      '20152.5416',
      '20288.1348',
      '20423.7280',
      '20559.3212',
      '20694.9144',
      '20830.5076',
      '20966.1008',
      '21101.6940',
      '21237.2872',
      '21372.8804',
      '21508.4736',
      '21644.0668',
      '21779.6600',
      '21915.2532',
      '22050.8464',
      '22186.4396',
      '22322.0328',
      '22457.6260',
      '22593.2192',
      '22728.8124',
      '22864.4056',
      23000,
    ],
  };
  const options = {
    min: createInfo.min,
    max: createInfo.max,
    gridNum: createInfo.grid,
    precision: symbolInfo,
    targetMin: symbolInfo,
    basePrecision: symbolInfo.basePrecision,
    baseMinSize: symbolInfo.baseMinSize,
    lastTradedPrice: metaData.lastTradedPrice,
    minimumOrderValue: symbolInfo.minimumOrderValue,
    minimumInvestment: symbolInfo.minimumInvestment,
    isNotice: false,
    float: 1.2,
    inverst: createInfo.inverst,
    isUseBase: false,
    baseAccount: 20000,
    symbolAccount: 10000,
  };
  it('计算格子的价格差，价格挡', () => {
    expect(priceLevel).toEqual(priceLevelHere);
  });
  it('计算每个格子可以购买的base数量', () => {
    const canBuyBaseNum = calcBuyNumPerGrid(
      options.inverst,
      priceLevel.gridLevels,
      0.95,
      metaData.lastTradedPrice,
      symbolInfo.basePrecision,
    );
    expect(canBuyBaseNum).toEqual('0.0008');
    expect(calcBuyNumPerGrid()).toEqual(0);
  });

  it('计算最大格子数量', () => {
    const gridProfitRatio = 0.004;
    const canBuyMaxNum = calcMaxGridNum(
      createInfo.max,
      createInfo.min,
      symbolInfo.pricePrecision,
      gridProfitRatio,
    );
    expect(canBuyMaxNum).toEqual(86);
    expect(calcMaxGridNum()).toEqual(0);
  });
  it('计算最小的区间上限max', () => {
    const gridProfitRatio = 0.004;
    const canMaxPrice = calcMinMax(createInfo.min, symbolInfo.basePrecision, gridProfitRatio);
    expect(canMaxPrice).toEqual('15120.9678');
    expect(calcMinMax()).toEqual(0);
  });
  it('计算区间价格范围', () => {
    expect(minMaxRange(undefined)).toEqual({
      min: 0,
      max: 0,
    });
    const range = minMaxRange(metaData.lastTradedPrice, symbolInfo.pricePrecision);
    expect(range).toEqual({
      min: 4000,
      max: 100000,
    });
  });
  it('计算网格利润范围', () => {
    expect(calcGridProfitRange()).toEqual('--');
    const feeRate = 0.0008;
    const range = calcGridProfitRange(
      createInfo.min,
      createInfo.max,
      priceLevelHere.levelPrice,
      feeRate,
    );
    expect(range).toEqual(`0.43% ～ 0.74%`);
  });
  it('计算最小投资额度', () => {
    expect(calcMinInvertByGridNum({})).toEqual({
      minInverst: 0,
      isShowHot: false,
    });

    expect(
      calcMinInvertByGridNum({
        minimumInvestment: 9,
        isNotice: false,
      }),
    ).toEqual({
      minInverst: '9',
      isShowHot: false,
    });

    const results = calcMinInvertByGridNum(options);
    expect(results).toEqual({
      minInverst: 136.32,
      isShowHot: false,
    });
  });
  it('计算最小下单数量', () => {
    expect(calculateMinGridSize({})).toEqual(0);

    const minOrder = calculateMinGridSize(options);
    expect(minOrder).toEqual(0.0001);
  });
  it('根据当前价格分离买卖单', () => {
    expect(calcBuySellNum({})).toEqual({
      needInverstBase: 0,
      needInverstQuota: 0,
      deelBaseNum: 0,
    });
    expect(calcBuySellNum(options)).toEqual({
      needInverstBase: 0,
      needInverstQuota: 1000,
      deelBaseNum: 0.0184,
    });
  });
});
