/**
 * Owner: garuda@kupotech.com
 */

import { renderHook } from '@testing-library/react-hooks';
import {
  getCurrentSymbol,
  useGetCurrentSymbol,
  useIsHasCurrentSymbolInfo,
  transformSymbolInfo,
  useGetCurrentSymbolInfo,
  useGetSymbolInfo,
  useGetMarginSymbolInfo,
  getSymbolInfo,
  getCurrentSymbolInfo,
  getFuturesSymbols,
  getFuturesSymbolList,
  useFuturesSymbols,
} from '@/hooks/common/useSymbol';
import { useSelector } from 'dva';
import { useTradeType } from '@/hooks/common/useTradeType';
import { getStore } from 'src/utils/createApp';

jest.mock('src/utils/createApp', () => ({
  getStore: jest.fn(),
}));

jest.mock('dva', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@/hooks/common/useTradeType', () => ({
  useTradeType: jest.fn(),
}));

describe('useGetCurrentSymbol', () => {
  it('should return current symbol', () => {
    useSelector.mockImplementation((selector) => selector({ trade: { currentSymbol: 'BTC-USD' } }));
    const { result } = renderHook(() => useGetCurrentSymbol());
    expect(result.current).toBe('BTC-USD');
  });

  it('should return getStore symbol', () => {
    getStore.mockReturnValueOnce({
      getState: () => ({
        trade: {
          currentSymbol: 'BTC-USD',
        },
      }),
    });
    const result = getCurrentSymbol();
    expect(result).toBe('BTC-USD');
  });
});

describe('useIsHasCurrentSymbolInfo', () => {
  it('should return true when current symbol exists in symbolsMap', () => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectTradeType') {
        return 'SPOT';
      }
      return selector({
        symbols: { symbolsMap: { 'BTC-USD': {} } },
        trade: { currentSymbol: 'BTC-USD' },
      });
    });
    useTradeType.mockReturnValueOnce('SPOT');
    const { result } = renderHook(() => useIsHasCurrentSymbolInfo());
    expect(result.current).toBe(true);
  });

  it('should return false when current futures symbol does not exist in futuresSymbolsMap', () => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectTradeType') {
        return 'FUTURES';
      }
      return selector({
        symbols: { symbolsMap: { 'BTC-USD': {} }, futuresSymbolsMap: {} },
        trade: { currentSymbol: 'BTC-USD' },
      });
    });
    useTradeType.mockReturnValueOnce('FUTURES');
    const { result } = renderHook(() => useIsHasCurrentSymbolInfo());
    expect(result.current).toBe(false);
  });

  it('should return false when current symbol does not exist in symbolsMap', () => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectTradeType') {
        return 'SPOT';
      }
      return selector({ symbols: { symbolsMap: {} }, trade: { currentSymbol: 'BTC-USD' } });
    });
    useTradeType.mockReturnValue('SPOT');
    const { result } = renderHook(() => useIsHasCurrentSymbolInfo());
    expect(result.current).toBe(false);
  });
});

describe('transformSymbolInfo', () => {
  it('should return transformed symbol info', () => {
    const info = {
      indexPriceTickSize: 1,
      tickSize: 0.01,
      priceIncrement: 0.01,
      multiplier: 1,
      baseIncrement: 0.01,
      lotSize: 1,
      isInverse: false,
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      settleCurrency: 'USD',
      pricePrecision: 2,
    };
    const result = transformSymbolInfo(info);
    expect(result).toEqual({
      ...info,
      tickSize: 0.01,
      indexPriceTickSize: 1,
      priceIncrement: 0.01,
      baseIncrement: 1,
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      settleCurrency: 'USD',
      pricePrecision: 2,
      indexPricePrecision: 0,
      basePrecision: 0,
    });
  });
});

describe('useGetCurrentSymbolInfo', () => {
  it('should return current symbol info', () => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectTradeType') {
        return 'SPOT';
      }
      return selector({
        symbols: { symbolsMap: { 'BTC-USD': {} }, futuresSymbolsMap: {} },
        trade: { currentSymbol: 'BTC-USD' },
      });
    });
    useTradeType.mockReturnValue('SPOT');
    const { result } = renderHook(() => useGetCurrentSymbolInfo());
    expect(result.current).toEqual({});
  });

  it('should return current futures symbol info', () => {
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectTradeType') {
        return 'FUTURES';
      }
      return selector({
        symbols: { symbolsMap: { 'BTC-USD': {} }, futuresSymbolsMap: {} },
        trade: { currentSymbol: 'BTC-USD' },
      });
    });
    useTradeType.mockReturnValue('FUTURES');
    const { result } = renderHook(() => useGetCurrentSymbolInfo());
    expect(result.current).toEqual({});
  });
});

describe('useGetSymbolInfo', () => {
  it('should return symbol info', () => {
    useSelector.mockImplementation((selector) =>
      selector({ symbols: { symbolsMap: { 'BTC-USD': {} } } }),
    );
    const { result } = renderHook(() => useGetSymbolInfo({ symbol: 'BTC-USD', tradeType: 'SPOT' }));
    expect(result.current).toEqual({});
  });

  it('should return futures symbol info', () => {
    useSelector.mockImplementation((selector) =>
      selector({ symbols: { symbolsMap: {}, futuresSymbolsMap: {} } }),
    );
    const { result } = renderHook(() =>
      useGetSymbolInfo({ symbol: 'BTC-USD', tradeType: 'FUTURES' }),
    );
    expect(result.current).toEqual({});
  });
});

describe('useGetMarginSymbolInfo', () => {
  it('should return margin symbol info', () => {
    useSelector.mockImplementation((selector) =>
      selector({ symbols: { marginSymbolsMap: { 'BTC-USD': {} } } }),
    );
    const { result } = renderHook(() => useGetMarginSymbolInfo({ symbol: 'BTC-USD' }));
    expect(result.current).toEqual({});
  });
});

describe('getSymbolInfo', () => {
  it('should return symbol info', () => {
    getStore.mockReturnValue({ getState: () => ({ symbols: { symbolsMap: { 'BTC-USD': {} } } }) });
    const result = getSymbolInfo({ symbol: 'BTC-USD', tradeType: 'SPOT' });
    expect(result).toEqual({});
  });
});

describe('getFuturesSymbols', () => {
  it('should return futures symbols', () => {
    getStore.mockReturnValue({
      getState: () => ({ symbols: { futuresSymbolsMap: { 'BTC-USD': {} } } }),
    });
    const result = getFuturesSymbols();
    expect(result).toEqual({ 'BTC-USD': {} });
  });
});

describe('getFuturesSymbolList', () => {
  it('should return futures symbol list', () => {
    getStore.mockReturnValue({ getState: () => ({ symbols: { futuresSymbols: ['BTC-USD'] } }) });
    const result = getFuturesSymbolList();
    expect(result).toEqual(['BTC-USD']);
  });
});

describe('useFuturesSymbols', () => {
  it('should return futures symbols', () => {
    useSelector.mockImplementation((selector) =>
      selector({ symbols: { futuresSymbolsMap: { 'BTC-USD': {} } } }),
    );
    const { result } = renderHook(() => useFuturesSymbols());
    expect(result.current).toEqual({ 'BTC-USD': {} });
  });
});
