/**
 * Owner: clyne@kupotech.com
 * 全仓公式单测
 */
import React from 'react';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

import {
  calcCrossSLAndPLPrice,
  calcCrossStopPNL,
  calcCloseCrossPosPnl,
  calcCrossPosMargin,
  calcUnPNL,
  calcCrossLiquidPrice,
  calcPosOrderQty,
  calcCrossPosOrderMM,
  calcCrossOpenFee,
  calcIsolatedRiskRate,
  calcCrossRiskRate,
  calcPosIsolatedTotalMargin,
  calcPosROE,
  calcPosIsolatedRealLeverage,
  calcCrossCloseFee,
} from '@/pages/Futures/calc';
import Decimal from 'decimal.js';
import { getCurrenciesPrecision } from '@/hooks/futures/useGetCurrenciesPrecision';
import { getLeverage } from '@/hooks/futures/useLeverage';
import { toDP } from 'src/utils/operation';
import { cloneDeep, forIn } from 'lodash';
import {
  XBTUSDTM_NORMAL_SELL,
  XBTUSDTM_NORMAL_BUY,
  XBTUSDM_NORMAL_BUY,
  XBTUSDM_NORMAL_SELL,
  PEPEUSDTM_BUY,
  PEPEUSDTM_SELL,
} from './data/position';
import { allForward } from './data/order';
import { contracts } from './data/contracts';

const formatOrderMap = ({ symbols }) => {
  const orderSizeMap = {};
  const orderMarginMap = {};
  forIn(symbols, ({ askOrderCost, bidOrderSize, bidOrderCost, askOrderSize }, itemSymbol) => {
    // 数量
    orderSizeMap[`${itemSymbol}-sell`] = askOrderSize;
    orderSizeMap[`${itemSymbol}-buy`] = bidOrderSize;

    // 占用保证金
    orderMarginMap[`${itemSymbol}-sell`] = askOrderCost;
    orderMarginMap[`${itemSymbol}-buy`] = bidOrderCost;
  });
  return { orderSizeMap, orderMarginMap };
};

const DOWN = Decimal.ROUND_DOWN;

jest.mock('@/hooks/futures/useLeverage', () => ({
  getLeverage: jest.fn(),
}));

jest.mock('@/hooks/futures/useGetCurrenciesPrecision', () => ({
  getCurrenciesPrecision: jest.fn(),
}));

describe('test 全仓百分比反推止盈止损价格 calcCrossSLAndPLPrice ', () => {
  const XBTUSDTMSymbolInfo = { ...contracts.dict.XBTUSDTM, leverage: 3 };
  const XBTUSDMSymbolInfo = { ...contracts.dict.XBTUSDM, leverage: 3 };
  const PEPESymbolInfo = { ...contracts.dict.PEPEUSDTM, leverage: 5 };
  const tests = [
    // ================= 正向 =================
    {
      desc: '正常计算 ->【正向合约BTC，空单, TP, 止盈】',
      expected: '65655',
      args: {
        position: XBTUSDTM_NORMAL_SELL,
        symbolInfo: XBTUSDTMSymbolInfo,
        // 止盈
        stopType: 'profit',
        // 默认值测试
        // stopPriceType: 'TP',
        percent: 0.1,
      },
    },

    {
      desc: '正常计算 ->【正向合约BTC，多单, MP, 止损】',
      expected: '64761.84',
      leverage: 3,
      args: {
        position: XBTUSDTM_NORMAL_BUY,
        symbolInfo: XBTUSDTMSymbolInfo,
        // 止盈
        stopType: 'stopLoss',
        stopPriceType: 'MP',
        percent: 0.1,
      },
    },
    // ================= 正向高精度合约 =================
    {
      desc: '正常计算 ->【正向合约PEPE，空单, TP, 止盈】',
      expected: '0.0000093892',
      args: {
        position: PEPEUSDTM_SELL,
        symbolInfo: PEPESymbolInfo,
        // 止盈
        stopType: 'profit',
        stopPriceType: 'TP',
        percent: 0.1,
      },
    },

    {
      desc: '正常计算 ->【正向合约PEPE，多单, MP, 止损】',
      expected: '0.0000090763',
      leverage: 3,
      args: {
        position: PEPEUSDTM_BUY,
        symbolInfo: PEPESymbolInfo,
        // 止盈
        stopType: 'stopLoss',
        stopPriceType: 'MP',
        percent: 0.1,
      },
    },
    // ================= 反向 =================
    {
      desc: '正常计算 ->【反向合约BTC，多单, MP, 止损】',
      expected: '64483.07',
      leverage: 3,
      args: {
        position: XBTUSDM_NORMAL_BUY,
        symbolInfo: XBTUSDMSymbolInfo,
        // 止盈
        stopType: 'stopLoss',
        stopPriceType: 'MP',
        percent: 0.1,
      },
    },

    {
      desc: '正常计算 ->【反向合约BTC，空单, TP, 止盈】',
      expected: '64483',
      leverage: 3,
      args: {
        position: XBTUSDM_NORMAL_SELL,
        symbolInfo: XBTUSDMSymbolInfo,
        // 止盈
        stopType: 'profit',
        stopPriceType: 'TP',
        percent: 0.1,
      },
    },
  ];
  test.each(tests)('calcCrossSLAndPLPrice $desc', ({ args, expected, leverage }) => {
    getLeverage.mockReturnValue(leverage);
    expect(calcCrossSLAndPLPrice(args).toString()).toBe(expected);
  });
});

describe('test 全仓止盈止损盈亏 calcCrossStopPNL', () => {
  // 合约配置
  const XBTUSDTMSymbolInfo = { ...contracts.dict.XBTUSDTM, leverage: 3 };
  const XBTUSDMSymbolInfo = { ...contracts.dict.XBTUSDM, leverage: 3 };
  const PEPESymbolInfo = { ...contracts.dict.PEPEUSDTM, leverage: 5 };
  // 仓位数据
  const XBTUSDTM_SELL = { ...XBTUSDTM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDTM_BUY = { ...XBTUSDTM_NORMAL_BUY, currentQty: 5 };
  const PEPESELL = { ...PEPEUSDTM_SELL, currentQty: -10 };
  const PEPEBUY = { ...PEPEUSDTM_BUY, currentQty: 10 };
  const XBTUSDM_SELL = { ...XBTUSDM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDM_BUY = { ...XBTUSDM_NORMAL_BUY, currentQty: 5 };

  const tests = [
    // ================= 正向 =================

    {
      desc: '正常计算 ->【正向合约BTC，空单, 全仓平仓】',
      expected: '34.97',
      args: {
        position: XBTUSDTM_SELL,
        symbolInfo: XBTUSDTMSymbolInfo,
        stopQty: 5,
        stopPrice: '60000',
      },
    },

    {
      desc: '正常计算 ->【正向合约BTC，空单, 全仓平仓】',
      expected: '-34.97',
      args: {
        position: XBTUSDTM_BUY,
        symbolInfo: XBTUSDTMSymbolInfo,
        stopQty: 5,
        stopPrice: '60000',
      },
    },
    // ================= 正向高精度合约 =================

    {
      desc: '正常计算 ->【正向合约PEPE，空单, 全仓平仓】',
      expected: '1.65',
      args: {
        position: PEPESELL,
        symbolInfo: PEPESymbolInfo,
        stopQty: 10,
        stopPrice: '0.000005',
      },
    },

    {
      desc: '正常计算 ->【正向合约PEPE，多单, 全仓平仓】',
      expected: '-1.65',
      args: {
        position: PEPEBUY,
        symbolInfo: PEPESymbolInfo,
        stopQty: 10,
        stopPrice: '0.000005',
      },
    },
    // ================= 反向合约 =================

    {
      desc: '正常计算 ->【反向合约BTC，空单, 全仓平仓】',
      expected: '0.00000829',
      precision: 8,
      args: {
        position: XBTUSDM_SELL,
        symbolInfo: XBTUSDMSymbolInfo,
        stopQty: 5,
        stopPrice: '60000',
      },
    },

    {
      desc: '正常计算 ->【反向合约BTC，空单, 全仓平仓】',
      expected: '-0.00000829',
      precision: 8,
      args: {
        position: XBTUSDM_BUY,
        symbolInfo: XBTUSDMSymbolInfo,
        stopQty: 5,
        stopPrice: '60000',
      },
    },
  ];
  test.each(tests)('calcCrossStopPNL $desc', ({ args, precision, expected }) => {
    getCurrenciesPrecision.mockReturnValue({ shortPrecision: precision || 2 });
    expect(calcCrossStopPNL(args).toString()).toBe(expected);
  });
});

describe('test 全仓平仓预计盈亏 calcCloseCrossPosPnl', () => {
  // 合约配置
  const XBTUSDTMSymbolInfo = { ...contracts.dict.XBTUSDTM, leverage: 3 };
  const XBTUSDMSymbolInfo = { ...contracts.dict.XBTUSDM, leverage: 3 };
  const PEPESymbolInfo = { ...contracts.dict.PEPEUSDTM, leverage: 5 };
  // 仓位数据
  const XBTUSDTM_SELL = { ...XBTUSDTM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDTM_BUY = { ...XBTUSDTM_NORMAL_BUY, currentQty: 5 };
  const PEPESELL = { ...PEPEUSDTM_SELL, currentQty: -10 };
  const PEPEBUY = { ...PEPEUSDTM_BUY, currentQty: 10 };
  const XBTUSDM_SELL = { ...XBTUSDM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDM_BUY = { ...XBTUSDM_NORMAL_BUY, currentQty: 5 };

  const tests = [
    // ================= 正向 =================
    {
      desc: '正常计算 ->【正向合约BTC，空单, 部分平仓】',
      expected: '6.99',
      args: {
        position: XBTUSDTM_SELL,
        symbolInfo: XBTUSDTMSymbolInfo,
        closeQty: 1,
        closePrice: '60000',
      },
    },
    {
      desc: '正常计算 ->【正向合约BTC，空单, 全仓平仓】',
      expected: '34.97',
      args: {
        position: XBTUSDTM_SELL,
        symbolInfo: XBTUSDTMSymbolInfo,
        closeQty: 5,
        closePrice: '60000',
      },
    },
    {
      desc: '正常计算 ->【正向合约BTC，多单, 部分平仓】',
      expected: '-6.99',
      args: {
        position: XBTUSDTM_BUY,
        symbolInfo: XBTUSDTMSymbolInfo,
        closeQty: 1,
        closePrice: '60000',
      },
    },
    {
      desc: '正常计算 ->【正向合约BTC，空单, 全仓平仓】',
      expected: '-34.97',
      args: {
        position: XBTUSDTM_BUY,
        symbolInfo: XBTUSDTMSymbolInfo,
        closeQty: 5,
        closePrice: '60000',
      },
    },
    // ================= 正向高精度合约 =================
    {
      desc: '正常计算 ->【正向合约PEPE，空单, 部分平仓】',
      expected: '0.33',
      args: {
        position: PEPESELL,
        symbolInfo: PEPESymbolInfo,
        closeQty: 2,
        closePrice: '0.000005',
      },
    },
    {
      desc: '正常计算 ->【正向合约PEPE，空单, 全仓平仓】',
      expected: '1.65',
      args: {
        position: PEPESELL,
        symbolInfo: PEPESymbolInfo,
        closeQty: 10,
        closePrice: '0.000005',
      },
    },
    {
      desc: '正常计算 ->【正向合约PEPE，多单, 部分平仓】',
      expected: '-0.33',
      args: {
        position: PEPEBUY,
        symbolInfo: PEPESymbolInfo,
        closeQty: 2,
        closePrice: '0.000005',
      },
    },
    {
      desc: '正常计算 ->【正向合约PEPE，多单, 全仓平仓】',
      expected: '-1.65',
      args: {
        position: PEPEBUY,
        symbolInfo: PEPESymbolInfo,
        closeQty: 10,
        closePrice: '0.000005',
      },
    },
    // ================= 反向合约 =================
    {
      desc: '正常计算 ->【反向合约BTC，空单, 部分平仓】',
      expected: '0.00000165',
      precision: 8,
      args: {
        position: XBTUSDM_SELL,
        symbolInfo: XBTUSDMSymbolInfo,
        closeQty: 1,
        closePrice: '60000',
      },
    },
    {
      desc: '正常计算 ->【反向合约BTC，空单, 全仓平仓】',
      expected: '0.00000829',
      precision: 8,
      args: {
        position: XBTUSDM_SELL,
        symbolInfo: XBTUSDMSymbolInfo,
        closeQty: 5,
        closePrice: '60000',
      },
    },
    {
      desc: '正常计算 ->【反向合约BTC，多单, 部分平仓】',
      expected: '-0.00000165',
      precision: 8,
      args: {
        position: XBTUSDM_BUY,
        symbolInfo: XBTUSDMSymbolInfo,
        closeQty: 1,
        closePrice: '60000',
      },
    },
    {
      desc: '正常计算 ->【反向合约BTC，空单, 全仓平仓】',
      expected: '-0.00000829',
      precision: 8,
      args: {
        position: XBTUSDM_BUY,
        symbolInfo: XBTUSDMSymbolInfo,
        closeQty: 5,
        closePrice: '60000',
      },
    },
  ];
  test.each(tests)('calcCloseCrossPosPnl $desc', ({ args, precision, expected }) => {
    getCurrenciesPrecision.mockReturnValue({ shortPrecision: precision || 2 });
    expect(calcCloseCrossPosPnl(args).toString()).toBe(expected);
  });
});

describe('test 全仓占用占用保证金 calcCrossPosMargin', () => {
  // 合约配置
  const XBTUSDTMSymbolInfo = { ...contracts.dict.XBTUSDTM, leverage: 3 };
  const XBTUSDMSymbolInfo = { ...contracts.dict.XBTUSDM, leverage: 3 };
  const PEPESymbolInfo = { ...contracts.dict.PEPEUSDTM, leverage: 5 };
  // 仓位数据
  const XBTUSDTM_SELL = { ...XBTUSDTM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDTM_BUY = { ...XBTUSDTM_NORMAL_BUY, currentQty: 5 };
  const PEPESELL = { ...PEPEUSDTM_SELL, currentQty: -10 };
  const PEPEBUY = { ...PEPEUSDTM_BUY, currentQty: 10 };
  const XBTUSDM_SELL = { ...XBTUSDM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDM_BUY = { ...XBTUSDM_NORMAL_BUY, currentQty: 5 };

  const tests = [
    // ================= 正向 =================
    {
      desc: '正常计算 ->【正向合约BTC，空单 IMR】',
      expected: '300',
      args: {
        position: XBTUSDTM_SELL,
        symbolInfo: XBTUSDTMSymbolInfo,
        IMR: 1,
        markPrice: '60000',
      },
    },
    {
      desc: '正常计算 ->【正向合约BTC，多单 IMR】',
      expected: '305',
      args: {
        position: XBTUSDTM_BUY,
        symbolInfo: XBTUSDTMSymbolInfo,
        IMR: 1,
        markPrice: '61000',
      },
    },
    // ================= 正向无标记价格 =================
    {
      desc: '正常计算 ->【正向合约BTC，空单 IMR】',
      expected: '0',
      args: {
        position: XBTUSDTM_SELL,
        symbolInfo: XBTUSDTMSymbolInfo,
        IMR: 1,
      },
      noMarkPrice: true,
    },
    // ================= 正向高精度合约 =================
    {
      desc: '正常计算 ->【正向合约PEPE，多单 IMR】',
      expected: '3.513357363',
      args: {
        position: PEPEBUY,
        symbolInfo: PEPESymbolInfo,
        IMR: 1,
        markPrice: '0.0000093111',
      },
    },
    {
      desc: '正常计算 ->【正向合约PEPE，空单 IMR】',
      expected: '3.400158363',
      args: {
        position: PEPESELL,
        symbolInfo: PEPESymbolInfo,
        IMR: 1,
        markPrice: '0.0000090111',
      },
    },

    // ================= 反向合约 =================
    {
      desc: '正常计算 ->【反向合约BTC，空单 IMR】',
      expected: '0.0000833333',
      args: {
        position: XBTUSDM_SELL,
        symbolInfo: XBTUSDMSymbolInfo,
        IMR: 1,
        markPrice: '60000',
      },
    },
    {
      desc: '正常计算 ->【反向合约BTC，多单 IMR】',
      expected: '0.0000806451',
      args: {
        position: XBTUSDM_BUY,
        symbolInfo: XBTUSDMSymbolInfo,
        IMR: 1,
        markPrice: '62000',
      },
    },
  ];
  test.each(tests)('calcCrossPosMargin $desc', ({ args, expected, noMarkPrice }) => {
    if (noMarkPrice) {
      args.position.markPrice = undefined;
    }
    expect(toDP(calcCrossPosMargin(args))(10, DOWN).toString()).toBe(expected);
  });
});

describe('test 全仓UnPNL calcUnPNL', () => {
  // 合约配置
  const XBTUSDTMSymbolInfo = { ...contracts.dict.XBTUSDTM, leverage: 3 };
  const XBTUSDMSymbolInfo = { ...contracts.dict.XBTUSDM, leverage: 3 };
  const PEPESymbolInfo = { ...contracts.dict.PEPEUSDTM, leverage: 5 };
  // 仓位数据
  const XBTUSDTM_SELL = { ...XBTUSDTM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDTM_BUY = { ...XBTUSDTM_NORMAL_BUY, currentQty: 5 };
  const PEPESELL = { ...PEPEUSDTM_SELL, currentQty: -10 };
  const PEPEBUY = { ...PEPEUSDTM_BUY, currentQty: 10 };
  const XBTUSDM_SELL = { ...XBTUSDM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDM_BUY = { ...XBTUSDM_NORMAL_BUY, currentQty: 5 };

  const tests = [
    // ================= 正向 =================
    {
      desc: '正常计算 ->【正向合约BTC，空单】',
      expected: '34.975',
      args: {
        position: XBTUSDTM_SELL,
        symbolInfo: XBTUSDTMSymbolInfo,
        markPrice: '60000',
      },
    },
    {
      desc: '正常计算 ->【正向合约BTC，多单',
      expected: '-29.975',
      args: {
        position: XBTUSDTM_BUY,
        symbolInfo: XBTUSDTMSymbolInfo,
        markPrice: '61000',
      },
    },
    // ================= 正向高精度合约 =================
    {
      desc: '正常计算 ->【正向合约PEPE，多单',
      expected: '-0.029469473',
      args: {
        position: PEPEBUY,
        symbolInfo: PEPESymbolInfo,
        markPrice: '0.0000093111',
      },
    },
    {
      desc: '正常计算 ->【正向合约PEPE，空单',
      expected: '0.142668473',
      args: {
        position: PEPESELL,
        symbolInfo: PEPESymbolInfo,
        markPrice: '0.0000090111',
      },
    },

    // ================= 反向合约 =================
    {
      desc: '正常计算 ->【反向合约BTC，空单',
      expected: '0.0000082948',
      args: {
        position: XBTUSDM_SELL,
        symbolInfo: XBTUSDMSymbolInfo,
        markPrice: '60000',
      },
    },
    {
      desc: '正常计算 ->【反向合约BTC，多单',
      expected: '-0.0000056067',
      args: {
        position: XBTUSDM_BUY,
        symbolInfo: XBTUSDMSymbolInfo,
        markPrice: '62000',
      },
    },
  ];
  test.each(tests)('calcCrossPosMargin $desc', ({ args, expected }) => {
    expect(toDP(calcUnPNL(args))(10, DOWN).toString()).toBe(expected);
  });
});

describe('test 全仓仓位强平价格, 全仓强平价值 calcCrossLiquidPrice, calcCrossLiquidValue', () => {
  // 合约配置
  const XBTUSDTMSymbolInfo = { ...contracts.dict.XBTUSDTM, leverage: 3 };
  const XBTUSDMSymbolInfo = { ...contracts.dict.XBTUSDM, leverage: 3 };
  const PEPESymbolInfo = { ...contracts.dict.PEPEUSDTM, leverage: 5 };
  // 仓位数据
  const XBTUSDTM_SELL = { ...XBTUSDTM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDTM_BUY = { ...XBTUSDTM_NORMAL_BUY, currentQty: 5 };
  const PEPESELL = { ...PEPEUSDTM_SELL, currentQty: -10 };
  const PEPEBUY = { ...PEPEUSDTM_BUY, currentQty: 10 };
  const XBTUSDM_SELL = { ...XBTUSDM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDM_BUY = { ...XBTUSDM_NORMAL_BUY, currentQty: 5 };

  const tests = [
    // ================= 正向 =================
    {
      desc: '正常计算 ->【正向合约BTC，空单】',
      expected: '66487.13',
      args: {
        position: XBTUSDTM_SELL,
        symbolInfo: XBTUSDTMSymbolInfo,
        MMR: 0.002,
        AMR: 0.111,
        takerFeeRate: 0.0006,
        markPrice: '60000',
      },
    },
    {
      desc: '正常计算 ->【正向合约BTC，多单',
      expected: '54370.37',
      args: {
        position: XBTUSDTM_BUY,
        symbolInfo: XBTUSDTMSymbolInfo,
        MMR: 0.002,
        AMR: 0.111,
        takerFeeRate: 0.0006,
        markPrice: '61000',
      },
    },
    // ================= 正向强平价格超大为maxPrice =================
    {
      desc: '正向强平价格过大 ->【正向合约BTC，空单】',
      expected: '1000000',
      args: {
        position: XBTUSDTM_SELL,
        symbolInfo: XBTUSDTMSymbolInfo,
        MMR: 0.1,
        AMR: 100,
        takerFeeRate: 0.0006,
        markPrice: '60000',
      },
    },
    // ================= 正向强平价格为负数=================
    {
      desc: '正向强平价格为负数 ->【正向合约BTC，多单】',
      expected: '0.01',
      args: {
        position: XBTUSDTM_BUY,
        symbolInfo: XBTUSDTMSymbolInfo,
        MMR: 0.2,
        AMR: 101,
        takerFeeRate: 0.0006,
        markPrice: '61000',
      },
    },
    {
      desc: '正向强平价格为负数 ->【反向合约BTC，空单】',
      expected: '1000000',
      args: {
        position: XBTUSDM_SELL,
        symbolInfo: XBTUSDMSymbolInfo,
        MMR: 0.2,
        AMR: 101,
        takerFeeRate: 0.0006,
        markPrice: '61000',
      },
    },
    // ================= 正向高精度合约 =================
    {
      desc: '正常计算 ->【正向合约PEPE，多单',
      expected: '0.0000082992',
      args: {
        position: PEPEBUY,
        symbolInfo: PEPESymbolInfo,
        MMR: 0.002,
        AMR: 0.111,
        takerFeeRate: 0.0006,
        markPrice: '0.0000093111',
      },
    },
    {
      desc: '正常计算 ->【正向合约PEPE，空单',
      expected: '0.0000099853',
      args: {
        position: PEPESELL,
        symbolInfo: PEPESymbolInfo,
        MMR: 0.002,
        AMR: 0.111,
        takerFeeRate: 0.0006,
        markPrice: '0.0000090111',
      },
    },

    // ================= 反向合约 =================
    {
      desc: '正常计算 ->【反向合约BTC，空单',
      expected: '67316.08',
      args: {
        position: XBTUSDM_SELL,
        symbolInfo: XBTUSDMSymbolInfo,
        MMR: 0.002,
        AMR: 0.111,
        takerFeeRate: 0.0006,
        markPrice: '60000',
      },
    },
    {
      desc: '正常计算 ->【反向合约BTC，多单',
      expected: '55950.68',
      args: {
        position: XBTUSDM_BUY,
        symbolInfo: XBTUSDMSymbolInfo,
        MMR: 0.002,
        AMR: 0.111,
        takerFeeRate: 0.0006,
        markPrice: '62000',
      },
    },
  ];
  test.each(tests)('calcCrossLiquidPrice $desc', ({ args, expected }) => {
    expect(toDP(calcCrossLiquidPrice(args))(10, DOWN).toString()).toBe(expected);
  });
});

describe('test 持仓挂单对冲数量  calcPosOrderQty', () => {
  const copyData = cloneDeep(allForward);
  // 合约配置
  const XBTUSDTMSymbolInfo = { ...contracts.dict.XBTUSDTM, leverage: 3 };
  const XBTUSDMSymbolInfo = { ...contracts.dict.XBTUSDM, leverage: 3 };
  const PEPESymbolInfo = { ...contracts.dict.PEPEUSDTM, leverage: 5 };
  // 仓位数据
  const XBTUSDTM_SELL = { ...XBTUSDTM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDTM_BUY = { ...XBTUSDTM_NORMAL_BUY, currentQty: 5 };
  const PEPESELL = { ...PEPEUSDTM_SELL, currentQty: -10 };
  const PEPEBUY = { ...PEPEUSDTM_BUY, currentQty: 10 };
  const XBTUSDM_SELL = { ...XBTUSDM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDM_BUY = { ...XBTUSDM_NORMAL_BUY, currentQty: 5 };

  const tests = [
    // ================= 正向 =================
    {
      desc: '正常计算 ->【正向合约BTC，空单】',
      expected: '0.005',
      args: {
        position: XBTUSDTM_SELL,
        symbolInfo: XBTUSDTMSymbolInfo,
        symbolOrderMap: {
          askOrderCost: '10',
          bidOrderSize: '5',
          bidOrderCost: '0',
          askOrderSize: '0',
        },
      },
    },
    {
      desc: '正常计算 ->【正向合约BTC，多单',
      expected: '0.015',
      args: {
        position: XBTUSDTM_BUY,
        symbolInfo: XBTUSDTMSymbolInfo,
        symbolOrderMap: {
          askOrderCost: '5',
          bidOrderSize: '10',
          bidOrderCost: '0',
          askOrderSize: '0',
        },
      },
    },
    // ================= 正向高精度合约 =================
    {
      desc: '正常计算 ->【正向合约PEPE，多单',
      expected: '754660',
      args: {
        position: PEPEBUY,
        symbolInfo: PEPESymbolInfo,
        symbolOrderMap: {
          askOrderCost: '5',
          bidOrderSize: '10',
          bidOrderCost: '0',
          askOrderSize: '0',
        },
      },
    },
    {
      desc: '正常计算 ->【正向合约PEPE，空单',
      expected: '377330',
      args: {
        position: PEPESELL,
        symbolInfo: PEPESymbolInfo,
        symbolOrderMap: {
          askOrderCost: '10',
          bidOrderSize: '5',
          bidOrderCost: '0',
          askOrderSize: '0',
        },
      },
    },

    // ================= 反向合约 =================
    {
      desc: '正常计算 ->【反向合约BTC，空单',
      expected: '5',
      args: {
        position: XBTUSDM_SELL,
        symbolInfo: XBTUSDMSymbolInfo,
        symbolOrderMap: {
          askOrderCost: '5',
          bidOrderSize: '10',
          bidOrderCost: '0',
          askOrderSize: '0',
        },
      },
    },
    {
      desc: '正常计算 ->【反向合约BTC，多单',
      expected: '10',
      args: {
        position: XBTUSDM_BUY,
        symbolInfo: XBTUSDMSymbolInfo,
        symbolOrderMap: {
          askOrderCost: '10',
          bidOrderSize: '5',
          bidOrderCost: '0',
          askOrderSize: '0',
        },
      },
    },

    // ================= 正向无仓位 =================
    {
      desc: '正常计算 ->【正向无仓位 BTC，空单】',
      expected: '0.005',
      args: {
        position: {},
        symbolInfo: XBTUSDTMSymbolInfo,
        symbolOrderMap: {
          askOrderCost: '10',
          bidOrderSize: '5',
          bidOrderCost: '0',
          askOrderSize: '0',
        },
      },
    },
    // ================= 正向无仓位无订单 =================
    {
      desc: '正常计算 ->【正向无仓位无订单 BTC，空单】',
      expected: '0',
      args: {
        position: {},
        symbolInfo: XBTUSDTMSymbolInfo,
        symbolOrderMap: {},
      },
      noOrder: true,
    },
  ];
  test.each(tests)('calcPosOrderQty $desc', ({ args, expected, noOrder }) => {
    copyData.symbols[args.symbolInfo.symbol] = args.symbolOrderMap;
    const { orderSizeMap: orderMap } = formatOrderMap(copyData);
    expect(calcPosOrderQty({ ...args, orderMap: noOrder ? undefined : orderMap })).toBe(expected);
  });
});

describe('test 持仓订单对冲维持保证金  calcCrossPosOrderMM', () => {
  // 合约配置
  const XBTUSDTMSymbolInfo = { ...contracts.dict.XBTUSDTM, leverage: 3 };
  const XBTUSDMSymbolInfo = { ...contracts.dict.XBTUSDM, leverage: 3 };
  const PEPESymbolInfo = { ...contracts.dict.PEPEUSDTM, leverage: 5 };
  // 仓位数据
  const XBTUSDTM_SELL = { ...XBTUSDTM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDTM_BUY = { ...XBTUSDTM_NORMAL_BUY, currentQty: 5 };
  const PEPESELL = { ...PEPEUSDTM_SELL, currentQty: -10 };
  const PEPEBUY = { ...PEPEUSDTM_BUY, currentQty: 10 };
  const XBTUSDM_SELL = { ...XBTUSDM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDM_BUY = { ...XBTUSDM_NORMAL_BUY, currentQty: 5 };

  const tests = [
    // ================= 正向 =================
    {
      desc: '正常计算 ->【正向合约BTC，空单】',
      expected: '37.1938467',
      args: {
        position: XBTUSDTM_SELL,
        symbolInfo: XBTUSDTMSymbolInfo,
        posOrderQty: 0.005,
        MMR: 0.111,
      },
    },
    {
      desc: '正常计算 ->【正向合约BTC，多单',
      expected: '14.87753868',
      args: {
        position: XBTUSDTM_BUY,
        symbolInfo: XBTUSDTMSymbolInfo,
        posOrderQty: 0.002,
        MMR: 0.111,
      },
    },
    // ================= 正向 noMarkPrice =================
    {
      desc: '正常计算noMarkPrice ->【正向合约BTC，空单】',
      expected: '0',
      args: {
        position: XBTUSDTM_SELL,
        symbolInfo: XBTUSDTMSymbolInfo,
        posOrderQty: 0.005,
        MMR: 0.111,
      },
      noMarkPrice: true,
    },
    // ================= 正向高精度合约 =================
    {
      desc: '正常计算 ->【正向合约PEPE，多单',
      expected: '0.7868928869',
      args: {
        position: PEPEBUY,
        symbolInfo: PEPESymbolInfo,
        posOrderQty: 37733 * 20, // 20张
        MMR: 0.111,
      },
    },
    {
      desc: '正常计算 ->【正向合约PEPE，空单',
      expected: '0.7868928869',
      args: {
        position: PEPESELL,
        symbolInfo: PEPESymbolInfo,
        posOrderQty: 37733 * 20,
        MMR: 0.111,
      },
    },

    // ================= 反向合约 =================
    {
      desc: '正常计算 ->【反向合约BTC，空单',
      expected: '0.0000033316',
      args: {
        position: XBTUSDM_SELL,
        symbolInfo: XBTUSDMSymbolInfo,
        posOrderQty: 2,
        MMR: 0.111,
      },
    },
    {
      desc: '正常计算 ->【反向合约BTC，多单',
      expected: '0.0000066632',
      args: {
        position: XBTUSDM_BUY,
        symbolInfo: XBTUSDMSymbolInfo,
        posOrderQty: 4,
        MMR: 0.111,
      },
    },
  ];
  test.each(tests)('calcCrossPosOrderMM $desc', ({ args, expected, noMarkPrice }) => {
    if (noMarkPrice) {
      args.position.markPrice = undefined;
    }
    expect(toDP(calcCrossPosOrderMM(args))(10, DOWN).toString()).toBe(expected);
  });
});

describe('test 预计平仓手续费  calcCrossCloseFee', () => {
  // 合约配置
  const XBTUSDTMSymbolInfo = { ...contracts.dict.XBTUSDTM, leverage: 3 };
  const XBTUSDMSymbolInfo = { ...contracts.dict.XBTUSDM, leverage: 3 };
  const PEPESymbolInfo = { ...contracts.dict.PEPEUSDTM, leverage: 5 };
  // 仓位数据
  const XBTUSDTM_SELL = { ...XBTUSDTM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDTM_BUY = { ...XBTUSDTM_NORMAL_BUY, currentQty: 5 };
  const PEPESELL = { ...PEPEUSDTM_SELL, currentQty: -100 };
  const PEPEBUY = { ...PEPEUSDTM_BUY, currentQty: 100 };
  const XBTUSDM_SELL = { ...XBTUSDM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDM_BUY = { ...XBTUSDM_NORMAL_BUY, currentQty: 5 };

  const tests = [
    // ================= 正向 =================
    {
      desc: '正常计算 ->【正向合约BTC，空单】',
      expected: '1.8',
      args: {
        position: XBTUSDTM_SELL,
        symbolInfo: XBTUSDTMSymbolInfo,
        takerFeeRate: 0.006,
        markPrice: 60000,
        posOrderQty: 0.005,
      },
    },
    {
      desc: '正常计算 ->【正向合约BTC，多单',
      expected: '1.83',
      args: {
        position: XBTUSDTM_BUY,
        symbolInfo: XBTUSDTMSymbolInfo,
        takerFeeRate: 0.006,
        markPrice: 61000,
        posOrderQty: 0.005,
      },
    },
    // ================= 正向高精度合约 =================
    {
      desc: '正常计算 ->【正向合约PEPE，多单',
      expected: '0.0215327137',
      args: {
        position: PEPEBUY,
        symbolInfo: PEPESymbolInfo,
        takerFeeRate: 0.006,
        markPrice: 0.000009511,
        posOrderQty: 377330,
      },
    },
    {
      desc: '正常计算 ->【正向合约PEPE，空单',
      expected: '0.0215327137',
      args: {
        position: PEPESELL,
        symbolInfo: PEPESymbolInfo,
        takerFeeRate: 0.006,
        markPrice: 0.000009511,
        posOrderQty: 377330,
      },
    },

    // ================= 反向合约 =================
    {
      desc: '正常计算 ->【反向合约BTC，空单',
      expected: '5.9e-9',
      args: {
        position: XBTUSDM_SELL,
        symbolInfo: XBTUSDMSymbolInfo,
        takerFeeRate: 0.006,
        markPrice: 61000,
        posOrderQty: 0.06,
      },
    },
    {
      desc: '正常计算 ->【反向合约BTC，多单',
      expected: '5.2e-9',
      args: {
        position: XBTUSDM_BUY,
        symbolInfo: XBTUSDMSymbolInfo,
        takerFeeRate: 0.006,
        markPrice: 69000,
        posOrderQty: 0.06,
      },
    },
  ];
  test.each(tests)('calcCrossCloseFee $desc', ({ args, expected }) => {
    expect(toDP(calcCrossCloseFee(args))(10, DOWN).toString()).toBe(expected);
  });
});

describe('test 预计开仓手续费  calcCrossOpenFee', () => {
  const copyData = cloneDeep(allForward);

  copyData.symbols.XBTUSDTM = {
    askOrderCost: '10',
    bidOrderSize: '5',
    bidOrderCost: '0',
    askOrderSize: '0',
  };

  copyData.symbols.PEPEUSDTM = {
    askOrderCost: '10',
    bidOrderSize: '5',
    bidOrderCost: '0',
    askOrderSize: '0',
  };

  copyData.symbols.XBTUSDM = {
    askOrderCost: '5',
    bidOrderSize: '10',
    bidOrderCost: '0',
    askOrderSize: '0',
  };

  const { orderSizeMap: orderMap } = formatOrderMap(copyData);
  // 合约配置
  const XBTUSDTMSymbolInfo = { ...contracts.dict.XBTUSDTM, leverage: 3 };
  const XBTUSDMSymbolInfo = { ...contracts.dict.XBTUSDM, leverage: 3 };
  const PEPESymbolInfo = { ...contracts.dict.PEPEUSDTM, leverage: 5 };
  // 仓位数据
  const XBTUSDTM_SELL = { ...XBTUSDTM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDTM_BUY = { ...XBTUSDTM_NORMAL_BUY, currentQty: 5 };
  const PEPESELL = { ...PEPEUSDTM_SELL, currentQty: -10 };
  const PEPEBUY = { ...PEPEUSDTM_BUY, currentQty: 10 };
  const XBTUSDM_SELL = { ...XBTUSDM_NORMAL_SELL, currentQty: -5 };
  const XBTUSDM_BUY = { ...XBTUSDM_NORMAL_BUY, currentQty: 5 };

  const tests = [
    // ================= 正向 =================
    {
      desc: '正常计算 ->【正向合约BTC，空单】',
      expected: '1.8',
      args: {
        position: XBTUSDTM_SELL,
        symbolInfo: XBTUSDTMSymbolInfo,
        takerFeeRate: 0.006,
        markPrice: 60000,
      },
    },
    {
      desc: '正常计算 ->【正向合约BTC，多单',
      expected: '1.83',
      args: {
        position: XBTUSDTM_BUY,
        symbolInfo: XBTUSDTMSymbolInfo,
        takerFeeRate: 0.006,
        markPrice: 61000,
      },
    },
    // ================= 正向高精度合约 =================
    {
      desc: '正常计算 ->【正向合约PEPE，多单',
      expected: '0.0104267598',
      args: {
        position: PEPEBUY,
        symbolInfo: PEPESymbolInfo,
        takerFeeRate: 0.006,
        markPrice: 0.000009211,
      },
    },
    {
      desc: '正常计算 ->【正向合约PEPE，空单',
      expected: '0.0104267598',
      args: {
        position: PEPESELL,
        symbolInfo: PEPESymbolInfo,
        takerFeeRate: 0.006,
        markPrice: 0.000009211,
      },
    },

    // ================= 反向合约 =================
    {
      desc: '正常计算 ->【反向合约BTC，空单',
      expected: '9.836e-7',
      args: {
        position: XBTUSDM_SELL,
        symbolInfo: XBTUSDMSymbolInfo,
        takerFeeRate: 0.006,
        markPrice: 61000,
      },
    },
    {
      desc: '正常计算 ->【反向合约BTC，多单',
      expected: '0.000001',
      args: {
        position: XBTUSDM_BUY,
        symbolInfo: XBTUSDMSymbolInfo,
        takerFeeRate: 0.006,
        markPrice: 60000,
      },
    },
  ];
  test.each(tests)('calcCrossOpenFee $desc', ({ args, expected }) => {
    args.orderMap = orderMap;
    expect(toDP(calcCrossOpenFee(args))(10, DOWN).toString()).toBe(expected);
  });
});

describe('test 逐仓风险率 calcIsolatedRiskRate', () => {
  const tests = [
    {
      desc: '正常计算',
      expected: '0.6666666666',
      args: {
        isolatedMM: 20,
        isolatedTotalMargin: 30,
      },
    },
  ];
  test.each(tests)('calcIsolatedRiskRate $desc', ({ args, expected }) => {
    expect(toDP(calcIsolatedRiskRate(args))(10, DOWN).toString()).toBe(expected);
  });
});

describe('test 全仓风险率 calcCrossRiskRate', () => {
  const tests = [
    {
      desc: '正常计算',
      expected: '0.1122448979',
      args: {
        posOrderMM: 10,
        closeFee: 1,
        totalMargin: 100,
        openFee: 2,
      },
    },
  ];
  test.each(tests)('calcCrossRiskRate $desc', ({ args, expected }) => {
    expect(toDP(calcCrossRiskRate(args))(10, DOWN).toString()).toBe(expected);
  });
});

describe('test 总保证金：仓位保证金 + 前端计算未实现盈亏 calcPosIsolatedTotalMargin', () => {
  const tests = [
    {
      desc: '正常计算',
      expected: '30',
      args: {
        positionMargin: 10,
        unPnl: 20,
      },
    },
  ];
  test.each(tests)('calcPosIsolatedTotalMargin $desc', ({ args, expected }) => {
    expect(toDP(calcPosIsolatedTotalMargin(args))(10, DOWN).toString()).toBe(expected);
  });
});

describe('test 总保证金：仓位保证金 + 前端计算未实现盈亏 calcPosROE', () => {
  const tests = [
    {
      desc: '正常计算',
      expected: '2',
      args: {
        margin: 10,
        unPnl: 20,
      },
    },
  ];
  test.each(tests)('calcPosROE $desc', ({ args, expected }) => {
    expect(toDP(calcPosROE(args))(10, DOWN).toString()).toBe(expected);
  });
});

describe('test 逐仓真实杠杆 calcPosIsolatedRealLeverage', () => {
  const tests = [
    {
      desc: '正常计算',
      expected: '4.9792944339',
      args: {
        markValue: 60,
        positionTotalMargin: 12.05,
        bankruptFee: 0.0001,
      },
    },
  ];
  test.each(tests)('calcPosIsolatedRealLeverage $desc', ({ args, expected }) => {
    expect(toDP(calcPosIsolatedRealLeverage(args))(10, DOWN).toString()).toBe(expected);
  });
});
