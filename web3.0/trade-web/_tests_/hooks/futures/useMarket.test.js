/**
 * Owner: garuda@kupotech.com
 */
import { useSelector, useDispatch } from 'react-redux';

import * as hooks from '@/hooks/futures/useMarket';

import { getStore } from 'utils/createApp';

import { renderHook, act } from '@testing-library/react-hooks';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),

  useDispatch: jest.fn(),
}));

jest.mock('utils/createApp', () => {
  return {
    getStore: jest.fn(),
  };
});

jest.mock('@/pages/Orderbook/hooks/useModelData', () => {
  return {
    useGetBuySell1: jest.fn(),
  };
});

const initialState = {
  futuresMarket: {
    MPDict: {
      BTCUSD: 50000,
    },
    IPDict: {
      BTCUSD: 49500,
    },
    sortedMarkets: [
      { symbol: 'BTCUSD', lastPrice: '50000' },
      { symbol: 'ETHUSD', lastPrice: '4000' },
    ],
    bestInfo: {},
  },

  order_book: {
    fullData: {
      BTCUSD: {
        ask1: 50010,

        bid1: 49990,
      },
    },
  },
};

describe('hooks', () => {
  beforeEach(() => {
    useSelector.mockImplementation((callback) => callback(initialState));
    getStore.mockImplementation(() => {
      return {
        getState: () => initialState,
      };
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('useMarkPrice should return the correct mark price', () => {
    const { result } = renderHook(() => hooks.useMarkPrice('BTCUSD'));

    expect(result.current).toBe(50000);
  });

  it('useMarkPrice should return the correct mark price', () => {
    const { result } = renderHook(() => hooks.useMarkPrice('BTCUSDTM'));

    expect(result.current).toBe(0);
  });

  it('getMarkPrice should return the correct mark price', () => {
    expect(hooks.getMarkPrice('BTCUSD')).toBe(50000);
  });

  it('getMarkPrice should return the correct mark price', () => {
    expect(hooks.getMarkPrice('BTCUSDTM')).toBe(0);
  });

  it('useIndexPrice should return the correct index price', () => {
    const { result } = renderHook(() => hooks.useIndexPrice('BTCUSD'));

    expect(result.current).toBe(49500);
  });

  it('useIndexPrice should return the correct index price', () => {
    const { result } = renderHook(() => hooks.useIndexPrice('BTCUSDTM'));

    expect(result.current).toBe(0);
  });

  it('getIndexPrice should return the correct index price', () => {
    expect(hooks.getIndexPrice('BTCUSD')).toBe(49500);
  });

  it('getIndexPrice should return the correct index price', () => {
    expect(hooks.getIndexPrice('BTCUSDTM')).toBe("0");
  });

  it('useMarketInfoForSymbol should return the correct market info', () => {
    const { result } = renderHook(() => hooks.useMarketInfoForSymbol());

    expect(result.current).toBe(undefined);
  });

  it('useMarketInfoForSymbol should return the correct market info', () => {
    const { result, rerender } = renderHook(() => hooks.useMarketInfoForSymbol('BTCUSD'));

    expect(result.current).toEqual({ symbol: 'BTCUSD', lastPrice: '50000' });

    rerender({ symbol: 'BTCUSD', lastPrice: '50000' });

    expect(result.current).toEqual({ symbol: 'BTCUSD', lastPrice: '50000' });
  });

  it('getMarketInfoForSymbol should return the correct market info', () => {
    expect(hooks.getMarketInfoForSymbol('BTCUSD')).toEqual({
      symbol: 'BTCUSD',
      lastPrice: '50000',
    });
  });

  it('getMarketInfoForSymbol should return the correct market info', () => {
    expect(hooks.getMarketInfoForSymbol()).toEqual({});
  });

  it('useLastPrice should return the correct last price', () => {
    const { result } = renderHook(() => hooks.useLastPrice('BTCUSD'));

    expect(result.current).toBe('50000');
  });

  it('getLastPrice should return the correct last price', () => {
    expect(hooks.getLastPrice('BTCUSD')).toBe('50000');
  });

  it('useGetBestTicker should return the correct best ticker info', () => {
    const { result } = renderHook(() => hooks.useGetBestTicker());

    expect(result.current).toEqual({ ask1: 0, bid1: 0 });
  });

  it('usePullBestTicker should dispatch the correct action', () => {
    const dispatch = jest.fn();

    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => hooks.usePullBestTicker());

    act(() => {
      result.current('BTCUSD');
    });

    expect(dispatch).toHaveBeenCalledWith({
      payload: { symbol: 'BTCUSD' },
      type: 'futuresMarket/getBestTicker',
    });
  });

  it('getBestTicker should return the correct best ticker info', () => {
    expect(hooks.getBestTicker()).toEqual({ ask1: 0, bid1: 0 });
  });
});
