/**
 * Owner: garuda@kupotech.com
 * 全仓公式单测，此文件单测写到 calcCrossSandMaxOrder
 */
import { getCrossTotalMargin } from '@/hooks/futures/useCrossTotalMargin';
import {
  getPositionCalcData,
  getCrossPosOrderMargin,
  getCrossOrderSizeMap,
  getMMR,
} from '@/hooks/futures/useCalcData';

import { getMarkPrice } from '@/hooks/futures/useMarket';;
import { getFuturesCrossConfigForSymbol, getFuturesCrossBuffer } from '@/hooks/common/useSymbol';

import { SELL, BUY, CURRENCY_UNIT, QUANTITY_UNIT } from '@/meta/futures';

import {
  formatSizeSide,
  calcValue,
  newValue,
  calcMMR,
  calcIMR,
  calcAMR,
  calcCrossOrderMargin,
  calcCrossPositionOrderMargin,
  calcCrossMaxOrder,
  calcExpectAMR,
  calcCrossExpectLiquidation,
  calcCrossSandMaxOrder,
} from '@/pages/Futures/calc';
import { contracts } from './data/contracts';

jest.mock('@/hooks/futures/useMarket', () => ({
  getMarkPrice: jest.fn(),
}));

jest.mock('@/hooks/common/useSymbol', () => ({
  getFuturesCrossConfigForSymbol: jest.fn(),
  getSymbolInfo: jest.fn(),
  getFuturesCrossBuffer: jest.fn(),
}));

jest.mock('@/hooks/futures/useCalcData', () => ({
  getPositionCalcData: jest.fn(),
  getCrossPosOrderMargin: jest.fn(),
  getCrossOrderSizeMap: jest.fn(),
  getMMR: jest.fn(),
}));

jest.mock('@/hooks/futures/useCrossTotalMargin', () => ({
  getCrossTotalMargin: jest.fn(),
}));

describe('formatSizeSide', () => {
  it.each([
    {
      desc: '测试异常场景',
      expected: '0',
      args: '',
    },
    {
      desc: '测试异常场景【symbolInfo 不存在】',
      expected: '0',
      args: { side: BUY, size: 2 },
    },
    {
      desc: '测试【买单】',
      expected: '4',
      args: { side: BUY, size: 2, symbolInfo: { multiplier: 2 } },
    },
    {
      desc: '测试【卖单】',
      expected: '-0.000004',
      args: { side: SELL, size: 2, symbolInfo: { multiplier: 0.000002 } },
    },
    {
      desc: '测试反向【买单 && multiplier为负】',
      expected: '-4',
      args: { side: BUY, size: 2, symbolInfo: { multiplier: -2 } },
    },
  ])('test formatSizeSide $desc, 参数为 $args, 返回值为 $expected', ({ expected, args }) => {
    const result = formatSizeSide(args);
    expect(result).toBe(expected);
  });
});

describe('calcValue', () => {
  it.each([
    {
      desc: '测试异常场景',
      expected: '0',
      args: '',
    },
    {
      desc: '测试异常场景',
      expected: '0',
      args: { price: 2, qty: 2 },
    },
    {
      desc: '测试正向合约',
      expected: '0.004',
      args: { price: 2, qty: 2, symbolInfo: { multiplier: 0.001 } },
    },
    {
      desc: '测试高精度反向合约',
      expected: '-0.00016666666666666666667',
      args: { price: 60000, qty: 10, symbolInfo: { multiplier: -1, isInverse: true } },
    },
    {
      desc: '测试反向合约',
      expected: '0',
      args: { price: 0, qty: 10, symbolInfo: { multiplier: -1, isInverse: true } },
    },
  ])('test calcValue $desc, 参数为 $args, 返回值为 $expected', ({ expected, args }) => {
    const result = calcValue(args);
    expect(result).toBe(expected);
  });
});

describe('newValue', () => {
  it.each([
    {
      desc: '测试异常场景',
      expected: '0',
      args: '',
    },
    {
      desc: '测试异常场景',
      expected: '2',
      args: { price: 1, size: 2 },
    },
    {
      desc: '测试正向合约',
      expected: '0.004',
      args: { price: 2, size: 0.002, symbolInfo: {} },
    },
    {
      desc: '测试反向合约',
      expected: '0.001',
      args: { price: 2, size: 0.002, symbolInfo: { isInverse: true } },
    },
  ])('test newValue $desc, 参数为 $args, 返回值为 $expected', ({ expected, args }) => {
    const result = newValue(args);
    expect(result).toBe(expected);
  });
});

describe('calcMMR', () => {
  it.each([
    {
      desc: '测试异常场景',
      expected: '0',
      args: '',
    },
    {
      desc: '测试正常值',
      expected: '0.005',
      args: { maxLev: 100, m: 300, posOrderQty: 0 },
    },
    {
      desc: '测试默认值',
      expected: '0.005',
      args: { maxLev: 100, m: 0, posOrderQty: 0 },
    },
    {
      desc: '测试最大值',
      expected: '0.005',
      args: { maxLev: 100, m: 300, posOrderQty: 150, mmrLimit: 0.005 },
    },
  ])('test calcMMR $desc, 参数为 $args, 返回值为 $expected', ({ expected, args }) => {
    const result = calcMMR(args);
    expect(result).toBe(expected);
  });
});

describe('calcAMR', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it.each([
    {
      desc: '测试异常场景',
      expected: '0',
      args: '',
    },
    {
      desc: '测试异常场景【totalMargin 不存在】',
      expected: '0',
      args: {
        totalMargin: 0,
        allPosValueMap: {
          BTC: 200,
        },
        currency: 'BTC',
      },
    },
    {
      desc: '测试反向结算币种正常值',
      expected: '0.5',
      args: {
        totalMargin: 100,
        allPosValueMap: {
          BTC: 200,
        },
        currency: 'BTC',
      },
    },
    {
      desc: '测试反向结算币种仓位不存在',
      expected: '0',
      args: {
        totalMargin: 100,
        allPosValueMap: {
          BTC: 0,
        },
        currency: 'BTC',
      },
    },
    {
      desc: '测试正向结算币种正常值',
      expected: '2.8334',
      args: {
        totalMargin: 182.9455545,
        allPosValueMap: {
          USDT: 64.5675,
        },
        currency: 'USDT',
      },
    },
  ])('test calcAMR $desc, 参数为 $args, 返回值为 $expected', ({ expected, args }) => {
    const result = calcAMR(args);
    expect(result).toBe(expected);
  });
});

describe('calcIMR', () => {
  it.each([
    {
      desc: '测试异常场景',
      expected: '0',
      args: '',
    },
    {
      desc: '测试f默认值场景',
      expected: '1.3',
      args: { leverage: 10, MMR: 1 },
    },
    {
      desc: '测试最大值场景',
      expected: '0.1',
      args: { leverage: 10, MMR: 1, f: 0.05 },
    },
  ])('test calcIMR $desc, 参数为 $args, 返回值为 $expected', ({ expected, args }) => {
    const result = calcIMR(args);
    expect(result).toBe(expected);
  });
});

describe('calcCrossOrderMargin', () => {
  it.each([
    {
      desc: '测试异常场景',
      expected: '0',
      args: '',
    },
    {
      desc: '测试正向合约【买单】',
      expected: '0.01',
      args: {
        symbolInfo: { multiplier: 0.001, isInverse: false },
        price: 10,
        size: 10,
        side: BUY,
        IMR: 0.09,
        takerFeeRate: 0.01,
      },
    },
    {
      desc: '测正向合约【卖单】',
      expected: '0.01',
      args: {
        symbolInfo: { multiplier: 0.001, isInverse: false },
        price: 10,
        size: 10,
        side: SELL,
        IMR: 0.09,
        takerFeeRate: 0.01,
      },
    },
    {
      desc: '测反向合约【买单】',
      expected: '0.0001',
      args: {
        symbolInfo: { multiplier: 0.001, isInverse: true },
        price: 10,
        size: 10,
        side: BUY,
        IMR: 0.09,
        takerFeeRate: 0.01,
      },
    },
    {
      desc: '测试反向合约【卖单】',
      expected: '0.0001',
      args: {
        symbolInfo: { multiplier: 0.001, isInverse: true },
        price: 10,
        size: 10,
        side: SELL,
        IMR: 0.09,
        takerFeeRate: 0.01,
      },
    },
  ])('test calcCrossOrderMargin $desc, 参数为 $args, 返回值为 $expected', ({ expected, args }) => {
    const result = calcCrossOrderMargin(args);
    expect(result).toBe(expected);
  });
});

describe('calcCrossPositionOrderMargin', () => {
  it.each([
    {
      desc: '测试异常场景',
      expected: '0',
      args: '',
    },
    {
      desc: '测试 正向合约XBTUSDTM【仓位】',
      expected: '10',
      args: {
        symbolInfo: { symbol: 'XBTUSDTM' },
        currentQty: 1,
        positionMargin: 10,
        orderMarginMap: null,
      },
    },
    {
      desc: '测试 正向合约XBTUSDTM【订单】',
      expected: '20',
      args: {
        symbolInfo: { symbol: 'XBTUSDTM' },
        orderMarginMap: { 'XBTUSDTM-sell': 20, 'XBTUSDTM-buy': 15 },
      },
    },
    {
      desc: '测试 正向合约XBTUSDTM 【仓位 && 订单】',
      expected: '25',
      args: {
        symbolInfo: { symbol: 'XBTUSDTM' },
        currentQty: 1,
        positionMargin: 10,
        orderMarginMap: { 'XBTUSDTM-sell': 20, 'XBTUSDTM-buy': 15 },
      },
    },
    {
      desc: '测试 反向合约XBTUSDM 【仓位】',
      expected: '10',
      args: {
        symbolInfo: { symbol: 'XBTUSDM', isInverse: true },
        currentQty: 1,
        positionMargin: 10,
        orderMarginMap: null,
      },
    },
    {
      desc: '测试 反向合约XBTUSDM 【订单】',
      expected: '20',
      args: {
        symbolInfo: { symbol: 'XBTUSDM', isInverse: true },
        orderMarginMap: { 'XBTUSDM-sell': 20, 'XBTUSDM-buy': 15 },
      },
    },
    {
      desc: '测试 反向合约XBTUSDM【仓位 && 订单】',
      expected: '20',
      args: {
        symbolInfo: { symbol: 'XBTUSDM' },
        currentQty: -1,
        positionMargin: -10,
        orderMarginMap: { 'XBTUSDM-sell': -10, 'XBTUSDM-buy': 15 },
      },
    },
  ])(
    'test calcCrossPositionOrderMargin $desc, 参数为 $args, 返回值为 $expected',
    ({ expected, args }) => {
      const result = calcCrossPositionOrderMargin(args);
      expect(result).toBe(expected);
    },
  );
});

describe('calcCrossMaxOrder', () => {
  it.each([
    {
      desc: '测试异常场景',
      expected: 0,
      args: '',
    },
    {
      desc: '测试异常场景【totalMargin为0】',
      expected: 0,
      args: {
        totalMargin: 0,
      },
    },
    {
      desc: '测试异常场景【leverage不存在】',
      expected: 0,
      args: {
        totalMargin: 0,
        symbolInfo: {},
        tradingUnit: QUANTITY_UNIT,
      },
    },
    {
      desc: '测试异常场景【合约配置不存在】',
      expected: '0',
      args: {
        totalMargin: 100,
        symbolInfo: {},
        tradingUnit: QUANTITY_UNIT,
        leverage: 10,
        price: 100,
        takerFeeRate: 0.0006,
        isLong: true,
      },
    },
    {
      desc: '测试 正向合约XBTUSDTM【做多 && 无仓位 && baseCurrency】',
      expected: '9.7',
      args: {
        symbolInfo: { symbol: 'XBTUSDTM', multiplier: 0.1, maxOrderQty: 100, tickSize: 0.01 },
        totalMargin: 100,
        leverage: 10,
        price: 100,
        takerFeeRate: 0.0006,
        isLong: true,
        tradingUnit: CURRENCY_UNIT,
      },
      config: {
        k: 450,
      },
    },
    {
      desc: '测试 正向合约XBTUSDTM【做空 && 无仓位 && quantity】',
      expected: '97.82',
      args: {
        symbolInfo: { symbol: 'XBTUSDTM', multiplier: 0.1, maxOrderQty: 100, tickSize: 0.01 },
        totalMargin: 100,
        leverage: 10,
        price: 100,
        takerFeeRate: 0.0006,
        isLong: false,
        tradingUnit: QUANTITY_UNIT,
      },
      config: {
        k: 450,
      },
      positions: {},
      orderSizeMap: {},
    },
    {
      desc: '测试 正向合约XBTUSDTM【做多 && 无仓位 && 同向挂单 && baseCurrency】',
      expected: '9.5',
      args: {
        symbolInfo: { symbol: 'XBTUSDTM', multiplier: 0.1, maxOrderQty: 100, tickSize: 0.01 },
        totalMargin: 100,
        leverage: 10,
        price: 100,
        takerFeeRate: 0.0006,
        isLong: true,
        tradingUnit: CURRENCY_UNIT,
      },
      config: {
        k: 450,
      },
      positions: {},
      orderSizeMap: { 'XBTUSDTM-buy': 2 },
    },
    {
      desc: '测试 正向合约XBTUSDTM【做多 && 反向仓位 && quantity】',
      expected: '99.81',
      args: {
        symbolInfo: { symbol: 'XBTUSDTM', multiplier: 0.1, maxOrderQty: 1000000, tickSize: 0.01 },
        totalMargin: 100,
        leverage: 10,
        price: 100,
        takerFeeRate: 0.0006,
        isLong: true,
      },
      config: {
        k: 450,
      },
      positions: { isCross: true, currentQty: -2 },
      orderSizeMap: {},
    },
    {
      desc: '测试 正向合约XBTUSDTM【做空 && 同向仓位 && baseCurrency】',
      expected: '9.5',
      args: {
        symbolInfo: { symbol: 'XBTUSDTM', multiplier: 0.1, maxOrderQty: 1000000, tickSize: 0.01 },
        totalMargin: 100,
        leverage: 10,
        price: 100,
        takerFeeRate: 0.0006,
        isLong: false,
        tradingUnit: CURRENCY_UNIT,
      },
      config: {
        k: 450,
      },
      positions: { isCross: true, currentQty: -2 },
      orderSizeMap: {},
    },
    {
      desc: '测试 正向合约XBTUSDTM【做空 && 同向仓位 && 同向持仓 && baseCurrency】',
      expected: '9.2',
      args: {
        symbolInfo: { symbol: 'XBTUSDTM', multiplier: 0.1, maxOrderQty: 1000000, tickSize: 0.01 },
        totalMargin: 100,
        leverage: 10,
        price: 100,
        takerFeeRate: 0.0006,
        isLong: false,
        tradingUnit: CURRENCY_UNIT,
      },
      config: {
        k: 450,
      },
      positions: { isCross: true, currentQty: -2 },
      orderSizeMap: { 'XBTUSDTM-sell': 3 },
    },
    {
      desc: '测试 正向合约XBTUSDTM【最大值】',
      expected: '6',
      args: {
        symbolInfo: { symbol: 'XBTUSDTM', multiplier: 0.1, maxOrderQty: 6, tickSize: 0.01 },
        totalMargin: 100,
        leverage: 10,
        price: 100,
        takerFeeRate: 0.0006,
        isLong: true,
      },
      config: {
        k: 450,
      },
      positions: {},
      orderSizeMap: { 'XBTUSDTM-sell': 5 },
    },
    {
      // TIPS: 后端返回的 maxOrderQty 肯定是张数，所以这里的最大值限制在 baseCurrency 单位时，为 maxOrderQty * multiplier
      // 反向合约就是张数，所以不需要乘 multiplier
      desc: '测试反向合约XBTUSDM【做多 && 无仓位 && 无挂单 && baseCurrency】',
      expected: '6724.13',
      args: {
        symbolInfo: {
          symbol: 'XBTUSDM',
          isInverse: true,
          multiplier: -1,
          maxOrderQty: 1000000,
          tickSize: 0.01,
        },
        totalMargin: 0.01,
        leverage: 10,
        price: 68000,
        takerFeeRate: 0.0006,
        isLong: true,
        tradingUnit: CURRENCY_UNIT,
      },
      config: {
        k: 15000000,
      },
    },
    {
      desc: '测试反向合约XBTUSDM【做空 && 无仓位 && 无挂单】',
      expected: '6724.13',
      args: {
        symbolInfo: {
          symbol: 'XBTUSDM',
          isInverse: true,
          multiplier: -1,
          maxOrderQty: 1000000,
          tickSize: 0.01,
        },
        totalMargin: 0.01,
        leverage: 10,
        price: 68000,
        takerFeeRate: 0.0006,
        isLong: false,
        tradingUnit: CURRENCY_UNIT,
      },
      config: {
        k: 15000000,
      },
    },
    {
      desc: '测试反向合约XBTUSDM【做多 && 无仓位 && 同向挂单】',
      expected: '754.13',
      args: {
        symbolInfo: {
          symbol: 'XBTUSDM',
          isInverse: true,
          multiplier: -1,
          maxOrderQty: 1000000,
          tickSize: 0.01,
        },
        totalMargin: 0.01,
        leverage: 10,
        price: 68000,
        takerFeeRate: 0.0006,
        isLong: true,
        tradingUnit: CURRENCY_UNIT,
      },
      config: {
        k: 15000000,
      },
      positions: {},
      orderSizeMap: { 'XBTUSDM-buy': 6000 },
    },
    {
      desc: '测试反向合约XBTUSDM【做空 && 反向仓位 && 反向挂单】',
      expected: '6926.82',
      args: {
        symbolInfo: {
          symbol: 'XBTUSDM',
          isInverse: true,
          multiplier: -1,
          maxOrderQty: 1000000,
          tickSize: 0.01,
        },
        totalMargin: 0.01,
        leverage: 10,
        price: 70000,
        takerFeeRate: 0.0006,
        isLong: false,
        tradingUnit: CURRENCY_UNIT,
      },
      config: {
        k: 15000000,
      },
      positions: { isCross: true, currentQty: 5 },
      orderSizeMap: { 'XBTUSDM-buy': 4 },
    },
    {
      desc: '测试反向合约XBTUSDM【做空 && 同向仓位 && 反向挂单】',
      expected: '6916.87',
      args: {
        symbolInfo: {
          symbol: 'XBTUSDM',
          isInverse: true,
          multiplier: -1,
          maxOrderQty: 1000000,
          tickSize: 0.01,
        },
        totalMargin: 0.01,
        leverage: 10,
        price: 70000,
        takerFeeRate: 0.0006,
        isLong: false,
        tradingUnit: CURRENCY_UNIT,
      },
      config: {
        k: 15000000,
      },
      positions: { isCross: true, currentQty: -5 },
      orderSizeMap: { 'XBTUSDM-buy': 4 },
    },
    {
      desc: '测试反向合约XBTUSDM【做多 && 同向仓位 && 同向挂单】',
      expected: '69065.54',
      args: {
        symbolInfo: {
          symbol: 'XBTUSDM',
          isInverse: true,
          multiplier: -1,
          maxOrderQty: 1000000,
          tickSize: 0.01,
        },
        totalMargin: 0.1,
        leverage: 10,
        price: 70000,
        takerFeeRate: 0.0006,
        isLong: true,
        tradingUnit: CURRENCY_UNIT,
      },
      config: {
        k: 15000000,
      },
      positions: { isCross: true, currentQty: 5 },
      orderSizeMap: { 'XBTUSDM-buy': 4 },
    },
    {
      desc: '测试反向合约XBTUSDM【最大值】',
      expected: '1000',
      args: {
        symbolInfo: {
          symbol: 'XBTUSDM',
          isInverse: true,
          multiplier: -1,
          maxOrderQty: 1000,
          tickSize: 0.01,
        },
        totalMargin: 0.01,
        leverage: 10,
        price: 70000,
        takerFeeRate: 0.0006,
        isLong: false,
        tradingUnit: CURRENCY_UNIT,
      },
      config: {
        k: 15000000,
      },
      positions: { isCross: true, currentQty: -5 },
      orderSizeMap: { 'XBTUSDM-buy': 4 },
    },
  ])(
    'test calcCrossMaxOrder $desc $args',
    ({ expected, args, config, positions, orderMarginMap, orderSizeMap }) => {
      getCrossPosOrderMargin.mockReturnValue(orderMarginMap);
      getFuturesCrossConfigForSymbol.mockReturnValue(config);
      getPositionCalcData.mockReturnValue(positions);
      getCrossOrderSizeMap.mockReturnValue(orderSizeMap);
      getFuturesCrossBuffer.mockReturnValue(0.995);
      const result = calcCrossMaxOrder(args);
      expect(result).toBe(expected);
    },
  );
});

describe('calcExpectAMR', () => {
  it.each([
    {
      desc: '测试异常场景',
      expected: '--',
      args: '',
    },
    {
      desc: '测试异常场景【预计金额计算为0】',
      expected: '--',
      args: {
        symbolInfo: { symbol: 'XBTUSDTM' },
        totalMargin: 1.21,
        posUnPnl: -1.21,
      },
    },
    {
      desc: '测试 正向XBTUSDTM 【无仓位】',
      expected: '5',
      args: {
        symbolInfo: { symbol: 'XBTUSDTM' },
        totalMargin: 10,
        posUnPnl: 0,
        newMarkValue: 2,
      },
    },
    {
      desc: '测试 反向XBTUSDM 【当前仓位 && 其它仓位】',
      expected: '26.25',
      args: {
        symbolInfo: { symbol: 'XBTUSDM', settleCurrency: 'XBT' },
        totalMargin: 0.1,
        posUnPnl: 0.005,
        newMarkValue: 0.0028,
      },
      positions: {
        XBTMM24: {
          symbol: 'XBTMM24',
          settleCurrency: 'BTC',
          isCross: true,
          markValue: '0.0012',
        },
        XBTUSDTM: {
          symbol: 'XBTUSDTM',
          isCross: true,
          settleCurrency: 'USDT',
        },
      },
    },
  ])('test calcExpectAMR $desc $args', ({ expected, args, positions }) => {
    getPositionCalcData.mockReturnValue(positions);
    const result = calcExpectAMR(args);
    expect(result).toBe(expected);
  });
});

describe('calcCrossExpectLiquidation', () => {
  it.each([
    {
      desc: '测试异常场景',
      expected: '--',
      args: '',
    },
    {
      desc: '测试异常场景 【输入size大于最大可开】',
      expected: '--',
      args: {
        size: 100,
        maxOrderQty: 80,
      },
    },
    {
      desc: '测试异常场景 【新数量为0】',
      expected: '--',
      args: {
        size: 10,
        maxOrderQty: 80,
        positions: { currentQty: -10 },
      },
    },
    {
      desc: '测试异常场景 正向TESTUSDTM 【预计保证金为0, AMR无法计算】',
      expected: '--',
      args: {
        size: 12,
        symbolInfo: {
          symbol: 'TESTUSDTM',
          multiplier: 1,
        },
        price: 2,
        maxOrderQty: 80,
        totalMargin: 10,
        markPrice: 1,
        positions: {
          symbol: 'TESTUSDTM',
          currentQty: -10,
        },
      },
    },
    {
      desc: '测试 正向SLPUSDTM【做空 && 无仓位】',
      expected: '13.6',
      args: {
        size: 10,
        maxOrderQty: 80,
        symbolInfo: {
          symbol: 'SLPUSDTM',
          multiplier: 10,
          maxPrice: 10000,
          indexPriceTickSize: 0.01,
        },
        price: 20,
        isBuy: false,
        takerFeeRate: 0,
      },
      markPrice: 20.5,
      totalMargin: 40,
      MMR: 0.5,
    },
    {
      desc: '测试 反向XBTUSDM 【做多 && 无仓位】',
      expected: '13003.466666666666666',
      args: {
        size: 100,
        maxOrderQty: 1000,
        symbolInfo: {
          symbol: 'XBTUSDM',
          multiplier: -1,
          maxPrice: 10000000,
          indexPriceTickSize: 0.01,
          isInverse: true,
        },
        price: 65000,
        isBuy: true,
        takerFeeRate: 0.0004,
        tradingUnit: CURRENCY_UNIT,
      },
      markPrice: 70000,
      totalMargin: 0.01,
      MMR: 0.5,
    },
    {
      desc: '测试 正向SLPUSDTM 最大值 【做空 && 有仓位 && 钱很多】',
      expected: 10000,
      args: {
        size: 10,
        maxOrderQty: 80,
        symbolInfo: {
          symbol: 'SLPUSDTM',
          multiplier: 10,
          maxPrice: 10000,
          indexPriceTickSize: 0.01,
        },
        price: 20,
        isBuy: false,
        takerFeeRate: 0,
      },
      positions: {
        symbol: 'SLPUSDTM',
        currentQty: -1000,
      },
      markPrice: 20.5,
      totalMargin: 40000000000,
      MMR: 0.5,
    },
    {
      desc: '测试 反向XBTUSDM 最小值 【做空 && 有仓位 && 钱很多】',
      expected: 10000000,
      args: {
        size: 100,
        maxOrderQty: 1000,
        symbolInfo: {
          symbol: 'XBTUSDM',
          multiplier: -1,
          maxPrice: 10000000,
          indexPriceTickSize: 0.01,
          isInverse: true,
        },
        price: 65000,
        isBuy: true,
        takerFeeRate: 0.0004,
      },
      positions: {
        symbol: 'XBTUSDM',
        currentQty: -1000,
      },
      markPrice: 70000,
      totalMargin: 10,
      MMR: 0.5,
    },
  ])(
    'test calcCrossExpectLiquidation $desc, 参数为 $args, 返回值为 $expected',
    ({ expected, args, markPrice, totalMargin, positions, MMR }) => {
      getMarkPrice.mockReturnValue(markPrice);
      getCrossTotalMargin.mockReturnValue(totalMargin);
      getPositionCalcData.mockReturnValue(positions);
      getMMR.mockReturnValue(MMR);
      const result = calcCrossExpectLiquidation(args);
      expect(result).toBe(expected);
    },
  );
});

describe('calcCrossSandMaxOrder', () => {
  it.each([
    {
      desc: '测试异常场景',
      expected: '0',
      args: '',
    },
    {
      desc: '测试 正向PEPEUSDTM【高精度】',
      expected: '1066734628.7453929326',
      symbol: 'PEPEUSDTM',
      args: {
        symbolInfo: {
          symbol: 'PEPEUSDTM',
        },
        totalMargin: 2200,
        leverage: 5.32,
        price: 0.0000109653,
      },
    },
    {
      desc: '测试 正向XBTUSDTM',
      expected: '0.15711542588706043995',
      symbol: 'XBTUSDTM',
      args: {
        symbolInfo: {
          symbol: 'XBTUSDTM',
        },
        totalMargin: 2200,
        leverage: 5,
        price: 70000,
      },
    },
    {
      desc: '测试 反向XBTUSDM',
      expected: '6998.3671746370298349',
      symbol: 'XBTUSDM',
      args: {
        symbolInfo: {
          symbol: 'XBTUSDM',
          isInverse: true,
        },
        totalMargin: 0.01,
        leverage: 10,
        price: 70000,
      },
    },
  ])(
    'test calcCrossSandMaxOrder $desc, 参数为 $args, 返回值为 $expected',
    ({ expected, args, symbol }) => {
      getFuturesCrossConfigForSymbol.mockReturnValue(contracts.dict[symbol]);
      const result = calcCrossSandMaxOrder(args);
      expect(result).toBe(expected);
    },
  );
});
