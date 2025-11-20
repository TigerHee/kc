/**
 * Owner: mike@kupotech.com
 */
import {
  calcGridNumRange,
  calcMinMax,
  minMaxRange,
  calcGridPriceLeval,
  getBlowUpPrice,
  getMinAmount,
} from 'Bot/Strategies/FutureGrid/util';

jest.mock('utils/lang', () => ({
  getLang: function () {
    return 'en-US';
  },
  _t: function (key) {
    if (key === 'perpetual_contract') return 'PERP';
    return '';
  },
  isRTLLanguage: () => false,
  formatLangInPureJs: (key) => 'PERP',
}));
describe('合约网格单测', () => {
  const metaData = {
    symbol: 'XBTUSDTM',
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
    base: 'BTC',
    quote: 'USDT',
  };
  const createInfo = {
    min: 15000,
    max: 23000,
    grid: 60,
    inverst: 1000,
  };

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

  it('计算可以购买的最大格子数量', () => {
    expect(calcGridNumRange(0, 0, 9)).toMatchObject({
      maxGridNum: 100,
      minGridNum: 2,
      rangeText: '(2-100)',
    });

    const rangeGridNum = calcGridNumRange(
      createInfo.max,
      createInfo.min,
      symbolInfo.pricePrecision,
    );
    expect(rangeGridNum).toEqual({
      maxGridNum: 86,
      minGridNum: 2,
      rangeText: '(2-86)',
    });
  });

  it('计算最小的max', () => {
    expect(calcMinMax(0)).toEqual(0);
    const minMax = calcMinMax(createInfo.min, symbolInfo.pricePrecision);
    expect(minMax).toEqual('15120.9678');
  });

  it('计算区间上下范围', () => {
    expect(minMaxRange(0, 8)).toMatchObject({ max: 0, min: 0 });

    const range = minMaxRange(metaData.lastTradedPrice, symbolInfo.pricePrecision);
    expect(range).toEqual({ max: 400000, min: 1000 });
  });
  it('计算格子的价格差，价格挡', () => {
    const levels = calcGridPriceLeval(
      createInfo.max,
      createInfo.min,
      createInfo.grid,
      symbolInfo.pricePrecision,
    );
    expect(levels).toEqual(priceLevelHere);
  });
});

jest.mock('Bot/helper', () => ({
  formatNumber: jest.fn((number, precision) => number.toFixed(precision)),
}));
describe('getBlowUpPrice', () => {
  it('should return 0 when blowUpPrice is "0"', () => {
    expect(getBlowUpPrice('0', 2)).toBe(0);
  });

  it('should return 0 when blowUpPrice is 0', () => {
    expect(getBlowUpPrice(0, 2)).toBe(0);
  });

  it('should return "--" when blowUpPrice is undefined', () => {
    expect(getBlowUpPrice(undefined, 2)).toBe('--');
  });

  it('should return the formatted number when blowUpPrice is a non-zero number', () => {
    expect(getBlowUpPrice(123.456, 2)).toBe('123.46');
  });
});

describe('getMinAmount', () => {
  it('should return the correct minimum amount', () => {
    const params = {
      createInfoMinAmount: 10,

      relatedParamsMinAmount: 5,

      leverage: 2,

      precision: 2,
    };

    expect(getMinAmount(params)).toBe('5.00');

    params.createInfoMinAmount = 20;

    expect(getMinAmount(params)).toBe('10.00');

    params.createInfoMinAmount = undefined;

    expect(getMinAmount(params)).toBe('5.00');

    params.relatedParamsMinAmount = undefined;

    expect(getMinAmount(params)).toBe('0.00');
  });
});
