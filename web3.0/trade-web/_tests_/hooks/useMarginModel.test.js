import { renderWithHook } from '_tests_/test-setup';
import useMarginModel, { getMarginModel } from 'src/trade4.0/hooks/useMarginModel.js';
import { MARGIN_TRADE_TYPE } from '@/meta/tradeTypes';
import { getStateFromStore } from '@/utils/stateGetter';

jest.mock('@/utils/stateGetter', () => ({
  getStateFromStore: jest.fn(),
}));

describe('useMarginModel', () => {
  it('returns expected result when no keys and params are provided', () => {
    // Act
    const { result } = renderWithHook(() => useMarginModel());

    // Assert
    expect(result.current).toEqual({
      accountConfigs: {},
      borrowSizeMap: {},
      borrowType: '',
      coinList: [],
      coinsConfig: {},
      isAutoRepay: false,
      isEnabled: true,
      liabilityRate: 0,
      position: {},
      statusInfo: {},
      totalBalance: 0,
      totalLiability: 0,
      userLeverage: 0,
    });
  });

  it('returns expected result when no keys and params are provided has keys', () => {
    // Act
    const { result } = renderWithHook(() => useMarginModel(['accountConfigs']));

    // Assert
    expect(result.current).toEqual({
      accountConfigs: {},
    });
  });
});

describe('getMarginModel', () => {
  let state;

  beforeEach(() => {
    state = {
      trade: {
        currentSymbol: 'BTC-USD',
        tradeType: MARGIN_TRADE_TYPE.MARGIN_TRADE.key,
      },
      isolated: {
        tagMap: {},
        positionMap: {},
        borrowSizeMap: {},
      },
      marginMeta: {
        configs: {},
        userPosition: {},
        positionDetail: {},
        loanCurrenciesMap: {},
        crossCurrenciesMap: {},
        liabilityRate: {},
        borrowSizeMap: {},
      },
      tradeForm: {
        marginOrderModeBuy: 'buy',

        marginOrderModeSell: 'sell',

        isolatedOrderModeBuy: 'buy',

        isolatedOrderModeSell: 'sell',
      },
      user_assets: {
        main: [],
        trade: [],
        margin: [],
        coinIn: [],
        withdraw: [],
        mainMap: {},
        tradeMap: {},
        marginMap: {},
        marginTotalAsset: 0,
        currencies: [],
      },
      symbols: {
        symbolsMap: { 'BTC-USD': {} },
        marginSymbolsMap: { 'BTC-USD': {} },
        isolatedSymbolsMap: {
          'BTC-USDT': {
            baseBorrowEnable: true,
            baseMaxBuyAmount: 100,
            quoteBorrowEnable: false,
            quoteMaxBuyAmount: 200,
            baseMaxBorrowAmount: 300,
            quoteMaxBorrowAmount: 400,
            baseBorrowCoefficient: 1,
            quoteBorrowCoefficient: 1,
          },
        },
      },

      // ... 其他需要的状态属性
    };

    getStateFromStore.mockImplementation((fn) => fn(state));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('coinList should return correct result', () => {
    const result = getMarginModel(['coinList'], { symbol: 'BTC-USD' });

    expect(result).toEqual({
      coinList: [],
    });
  });

  it('isAutoRepay should return correct result', () => {
    const result = getMarginModel(['isAutoRepay'], { symbol: 'BTC-USD' });

    expect(result).toEqual({
      isAutoRepay: undefined,
    });
  });

  it('userLeverage should return correct result', () => {
    const result = getMarginModel(['userLeverage'], { symbol: 'BTC-USD' });

    expect(result).toEqual({
      userLeverage: 10,
    });
  });

  it('accountConfigs should return correct result', () => {
    const result = getMarginModel(['accountConfigs'], { symbol: 'BTC-USD' });

    expect(result).toEqual({
      accountConfigs: {},
    });
  });

  it('totalBalance should return correct result', () => {
    const result = getMarginModel(['totalBalance'], { symbol: 'BTC-USD' });

    expect(result).toEqual({
      totalBalance: undefined,
    });
  });

  it('totalLiability should return correct result', () => {
    const result = getMarginModel(['totalLiability'], { symbol: 'BTC-USD' });

    expect(result).toEqual({
      totalLiability: undefined,
    });
  });

  it('liabilityRate should return correct result', () => {
    const result = getMarginModel(['liabilityRate'], { symbol: 'BTC-USD' });

    expect(result).toEqual({
      liabilityRate: {},
    });
  });

  it('position should return correct result', () => {
    const result = getMarginModel(['position'], { symbol: 'BTC-USD' });

    expect(result).toEqual({
      position: {},
    });
  });

  it('borrowSizeMap should return correct result', () => {
    const result = getMarginModel(['borrowSizeMap'], { symbol: 'BTC-USD' });

    expect(result).toEqual({
      borrowSizeMap: {},
    });
  });

  it('isEnabled should return correct result', () => {
    const result = getMarginModel(['isEnabled'], { symbol: 'BTC-USD' });

    expect(result).toEqual({
      isEnabled: false,
    });
  });

  it('statusInfo should return correct result', () => {
    const result = getMarginModel(['statusInfo'], { symbol: 'BTC-USD' });

    expect(result).toEqual({
      statusInfo: {},
    });
  });

  it('borrowType should return correct result', () => {
    const result = getMarginModel(['borrowType'], { symbol: 'BTC-USD' });

    expect(result).toEqual({
      borrowType: undefined,
    });
  });
});
