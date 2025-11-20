import { getStore } from 'src/utils/createApp';
import { dividedBy } from 'src/utils/operation';
import { formatNumber } from 'src/trade4.0/utils/format';
import {
  getStateFromStore,
  getMarginMarkPrice,
  currencyAmount2BtcAmount,
  getIsolatedPositionSide,
  getCoinInfoFromStore,
  getMarginCurrencyConfig,
  getMarginPositionConfig,
  computeMaxBorrowAmount,
  computeIsolatedTotalLiability,
  computeIsolatedNetAsset,
  computeIsolatedRealLeaverage,
  computeCrossRealLeaverage,
  computeIsolatedBorrowAmount,
  computeIsolatedNetAssetWithCoefficient,
} from 'src/trade4.0/utils/stateGetter';
import { add, multiply } from 'src/helper';
import {
  getNetAsset,
  getMaxBorrowSize,
  getRealLeaverage,
} from 'src/components/Isolated/utils';

jest.mock('src/utils/createApp', () => ({
  getStore: jest.fn().mockReturnValue({
    getState: jest.fn(),
  }),
}));
jest.mock('@/utils/format', () => ({
  formatNumber: jest.fn(),
}));
jest.mock('src/utils/operation', () => ({
  dividedBy: jest.fn(() => jest.fn()),
}));
jest.mock('src/helper', () => ({
  add: jest.fn(),
  multiply: jest.fn().mockReturnValue({
    toFixed: jest.fn(),
  }),
}));
jest.mock('src/components/Isolated/utils', () => ({
  getNetAsset: jest.fn(),
  getRealLeaverage: jest.fn(),
  getMaxBorrowSize: jest.fn(),
}));

describe('stateGetter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get state from store', () => {
    const fn = jest.fn();
    const state = {};

    getStore().getState.mockReturnValue(state);

    const result = getStateFromStore(fn);
    expect(result).toBe(fn(state));
  });

  it('should get margin mark price', () => {
    const state = {
      symbols: {
        symbolsMap: {
          'BTC-USDT': {
            pricePrecision: 2,
          },
        },
      },
      trade: {
        currentSymbol: 'BTC-USDT',
      },
      isolated: {
        targetPriceMap: {
          'BTC-BTC': '1',
          'USDT-BTC': '10000',
        },
      },
    };

    getStore().getState.mockReturnValue(state);
    dividedBy.mockReturnValue((num) => num);
    formatNumber.mockReturnValue('10000.00');

    const result = getMarginMarkPrice();

    expect(getStore().getState).toHaveBeenCalled();
    expect(dividedBy).toHaveBeenCalledWith('1');
    expect(formatNumber).toHaveBeenCalledWith('10000', {
      dropZ: false,
      pointed: false,
      fixed: 2,
    });
    expect(result).toBe('10000.00');
  });

  it('currencyAmount2BtcAmount', () => {
    const state = {
      isolated: {
        targetPriceMap: {
          'BTC-BTC': 1,
          'ETH-BTC': 0.03,
        },
      },
    };
    getStore().getState.mockReturnValue(state);
    multiply().toFixed.mockImplementationOnce(() => '0.03');

    const result = currencyAmount2BtcAmount({ currency: 'ETH', amount: 1 });

    expect(result).toEqual('0.03');
    expect(multiply).toHaveBeenCalledWith(1, 0.03);
  });

  it('getIsolatedPositionSide return long', () => {
    jest.mock('src/trade4.0/utils/stateGetter', () => ({
      ...jest.requireActual('src/trade4.0/utils/stateGetter'),
      currencyAmount2BtcAmount: jest.fn(),
    }));
    const state = {
      isolated: {
        targetPriceMap: {
          'BASE-BTC': 1,
          'QUOTE-BTC': 0.03,
        },
      },
    };
    getStore().getState.mockReturnValue(state);

    multiply().toFixed.mockImplementationOnce(() => 0.5)
                      .mockImplementationOnce(() => 1);

    const result = getIsolatedPositionSide({
      baseAsset: { currency: 'BASE', liability: '100' },
      quoteAsset: { currency: 'QUOTE', liability: '200' },
    });
    expect(result).toBe('long');
  });

  it('getIsolatedPositionSide return short', () => {
    jest.mock('src/trade4.0/utils/stateGetter', () => ({
      ...jest.requireActual('src/trade4.0/utils/stateGetter'),
      currencyAmount2BtcAmount: jest.fn(),
    }));
    const state = {
      isolated: {
        targetPriceMap: {
          'BASE-BTC': 1,
          'QUOTE-BTC': 0.03,
        },
      },
    };
    getStore().getState.mockReturnValue(state);

    multiply().toFixed.mockImplementationOnce(() => 1)
                      .mockImplementationOnce(() => 0.5);

    const result = getIsolatedPositionSide({
      baseAsset: { currency: 'BASE', liability: '200' },
      quoteAsset: { currency: 'QUOTE', liability: '100' },
    });
    expect(result).toBe('short');
  });

  it('getIsolatedPositionSide return undefined', () => {
    jest.mock('src/trade4.0/utils/stateGetter', () => ({
      ...jest.requireActual('src/trade4.0/utils/stateGetter'),
      currencyAmount2BtcAmount: jest.fn(),
    }));
    const state = {
      isolated: {
        targetPriceMap: {
          'BASE-BTC': 1,
          'QUOTE-BTC': 0.03,
        },
      },
    };
    getStore().getState.mockReturnValue(state);

    multiply().toFixed.mockImplementationOnce(() => 1)
                      .mockImplementationOnce(() => 1);

    const result = getIsolatedPositionSide({
      baseAsset: { currency: 'BASE', liability: '200' },
      quoteAsset: { currency: 'QUOTE', liability: '100' },
    });
    expect(result).toBeUndefined();
  });

  it('getCoinInfoFromStore', () => {
    const state = {
      categories: {
        BTC: { name: 'Bitcoin', symbol: 'BTC' },
      }
    };
    getStore().getState.mockReturnValue(state);
    const coinInfo = getCoinInfoFromStore('BTC');
    expect(coinInfo).toEqual({ name: 'Bitcoin', symbol: 'BTC' });
    expect(getStore).toHaveBeenCalled();
    expect(getStore().getState).toHaveBeenCalled();
  });

  it('getMarginCurrencyConfig', () => {
    const state = {
      symbols: {
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
      marginMeta: {
        crossCurrenciesMap: {
          BTC: {
            buyMaxAmount: 500,
            borrowMaxAmount: 600,
            borrowCoefficient: 1,
          },
        },
        loanCurrenciesMap: {
          BTC: {
            borrowMinAmount: 0,
            currencyLoanMinUnit: 0,
            marginBorrowEnabled: true,
          },
        },
      },
    };

    getStore().getState.mockReturnValue(state);

    const config = getMarginCurrencyConfig({ tag: 'BTC-USDT', currency: 'BTC' });

    expect(config).toEqual({
      buyMaxAmount: 100,
      isDebitEnabled: true,
      borrowMaxAmount: 300,
      borrowCoefficient: 1,
      borrowMinAmount: 0,
      currencyLoanMinUnit: 0,
    });
  });

  it('getMarginPositionConfig for isolatedMargin', () => {
    const state = {
      symbols: {
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
      marginMeta: {
        configs: {
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
    };

    getStore().getState.mockReturnValue(state);

    const config = getMarginPositionConfig('BTC-USDT');

    expect(config).toEqual({
      baseBorrowEnable: true,
      baseMaxBuyAmount: 100,
      quoteBorrowEnable: false,
      quoteMaxBuyAmount: 200,
      baseMaxBorrowAmount: 300,
      quoteMaxBorrowAmount: 400,
      baseBorrowCoefficient: 1,
      quoteBorrowCoefficient: 1,
    });
  });

  it('getMarginPositionConfig for crossMargin', () => {
    const state = {
      symbols: {
        isolatedSymbolsMap: {},
      },
      marginMeta: {
        configs: {
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
    };

    getStore().getState.mockReturnValue(state);

    const config = getMarginPositionConfig();

    expect(config).toEqual({
      baseBorrowEnable: true,
      baseMaxBuyAmount: 100,
      quoteBorrowEnable: false,
      quoteMaxBuyAmount: 200,
      baseMaxBorrowAmount: 300,
      quoteMaxBorrowAmount: 400,
      baseBorrowCoefficient: 1,
      quoteBorrowCoefficient: 1,
    });
  });

  it('computeMaxBorrowAmount', () => {
    const mockConfig = {
      borrowMinAmount: 0,
      borrowMaxAmount: 10,
      borrowCoefficient: 1,
      currencyLoanMinUnit: 0.01,
    };
    // Arrange
    const mockState = {
      symbols: {
        isolatedSymbolsMap: {
          'BTC-USDT': {
            baseMaxBorrowAmount: mockConfig.borrowMaxAmount,
          },
        },
      },
      marginMeta: {
        crossCurrenciesMap: {},
        loanCurrenciesMap: {
          BTC: {
            currencyLoanMinUnit: mockConfig.currencyLoanMinUnit,
          },
        },
      },
      isolated: {
        targetPriceMap: {
          'BTC-BTC': 1,
        },
      },
    };
    const params = {
      tag: 'BTC-USDT',
      currency: 'BTC',
      netAsset: 1,
      liability: 0.1,
      userLeverage: 2,
      totalLiability: 0.5,
    };
    const expectedMaxBorrowSize = 5;

    getStore().getState.mockReturnValue(mockState);
    getMaxBorrowSize.mockReturnValue(expectedMaxBorrowSize);

    // Act
    const result = computeMaxBorrowAmount(params);

    // Assert
    expect(getStore).toHaveBeenCalledTimes(3);
    expect(getMaxBorrowSize).toHaveBeenCalledWith({
      coin: {
        liability: params.liability,
        targetPrice: mockState.isolated.targetPriceMap['BTC-BTC'],
        borrowMaxAmount: mockConfig.borrowMaxAmount,
        borrowMinAmount: mockConfig.borrowMinAmount,
        borrowCoefficient: mockConfig.borrowCoefficient,
        currencyLoanMinUnit: mockConfig.currencyLoanMinUnit,
      },
      netAsset: params.netAsset,
      userLeverage: params.userLeverage,
      totalLiability: params.totalLiability,
    });
    expect(result).toBe(expectedMaxBorrowSize);
  });

  it('computeIsolatedTotalLiability', () => {
    const mockPositionData = {
      baseAsset: {
        liabilityInterest: '10',
        liabilityPrincipal: '20',
        currency: 'BTC',
      },
      quoteAsset: {
        liabilityInterest: '30',
        liabilityPrincipal: '40',
        currency: 'BTC',
      },
    };

    jest.mock('src/trade4.0/utils/stateGetter', () => ({
      ...jest.requireActual('src/trade4.0/utils/stateGetter'),
      currencyAmount2BtcAmount: jest.fn(({ amount }) => amount),
    }));

    const result = computeIsolatedTotalLiability(mockPositionData);
    expect(result).toBe(0);
  });

  it('computeIsolatedNetAsset', () => {
    const mockPositionData = {
      totalConversionBalance: '100',
      baseAsset: {
        currency: 'BTC',
        liabilityInterest: '1',
        liabilityPrincipal: '2',
      },
      quoteAsset: {
        currency: 'USD',
        liabilityInterest: '0.5',
        liabilityPrincipal: '1.5',
      },
    };
    jest.mock('src/trade4.0/utils/stateGetter', () => ({
      ...jest.requireActual('src/trade4.0/utils/stateGetter'),
      computeIsolatedTotalLiability: jest.fn(() => '5'),
    }));

    // Mock the return value of getNetAsset
    const expectedNetAsset = '95';
    getNetAsset.mockReturnValue(expectedNetAsset);

    // Call the function to test
    const netAsset = computeIsolatedNetAsset(mockPositionData);

    // Check if getNetAsset was called with the correct parameters
    expect(getNetAsset).toHaveBeenCalledWith(mockPositionData.totalConversionBalance, 0);

    // Check if the result is as expected
    expect(netAsset).toBe(expectedNetAsset);
  });

  it('computeIsolatedRealLeaverage', () => {
    const mockPositionData = {
      totalConversionBalance: '100',
      baseAsset: {
        currency: 'BTC',
        liabilityInterest: '1',
        liabilityPrincipal: '2',
        marginCoefficient: '1.5',
      },
      quoteAsset: {
        currency: 'USD',
        liabilityInterest: '0.5',
        liabilityPrincipal: '1.5',
        marginCoefficient: '1.2',
      },
    };
    const mockNetAsset = '95';
    jest.mock('src/trade4.0/utils/stateGetter', () => ({
      ...jest.requireActual('src/trade4.0/utils/stateGetter'),
      computeIsolatedNetAsset: jest.fn(() => mockNetAsset),
    }));

    // Mock the return value of getRealLeaverage
    const expectedRealLeverage = '2';
    getRealLeaverage.mockReturnValue(expectedRealLeverage);

    // Call the function to test
    const realLeverage = computeIsolatedRealLeaverage(mockPositionData);

    // Check if the result is as expected
    expect(realLeverage).toBe(expectedRealLeverage);
  });

  it('computeCrossRealLeaverage', () => {
    const mockPositionData = {
      totalBalance: '100',
      totalLiability: '10',
    };
    const mockNetAsset = '90';
    getNetAsset.mockReturnValue(mockNetAsset);

    // Mock the return value of getRealLeaverage
    const expectedRealLeverage = '1.1';
    getRealLeaverage.mockReturnValue(expectedRealLeverage);

    // Call the function to test
    const realLeverage = computeCrossRealLeaverage(mockPositionData);

    // Check if getNetAsset was called with the correct parameters
    expect(getNetAsset).toHaveBeenCalledWith(mockPositionData.totalBalance, mockPositionData.totalLiability);

    expect(getRealLeaverage).toHaveBeenCalledWith(mockPositionData.totalBalance, mockNetAsset);

    // Check if the result is as expected
    expect(realLeverage).toBe(expectedRealLeverage);
  });

  it('computeIsolatedBorrowAmount', () => {
    jest.mock('src/trade4.0/utils/stateGetter', () => ({
      ...jest.requireActual('src/trade4.0/utils/stateGetter'),
      getMarginCurrencyConfig: jest.fn(() => ({ isDebitEnabled: false })),
      computeMaxBorrowAmount: jest.fn(),
      computeIsolatedTotalLiability: jest.fn(),
      computeIsolatedNetAssetWithCoefficient: jest.fn(),
    }));

    const result = computeIsolatedBorrowAmount({
      positionData: { tag: 'BTC-USDT' },
      currency: 'BTC',
      userLeverage: 10,
    });

    expect(result).toBe(0);
  });
});
