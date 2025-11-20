import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { renderWithHook } from '_tests_/test-setup';
import { getStore } from 'src/utils/createApp';
import { getCoinInfo } from 'src/trade4.0/hooks/common/useCoin.js';

afterEach(cleanup);

jest.mock('src/utils/createApp', () => ({
  getStore: jest.fn().mockReturnValue({
    getState: jest.fn(),
  }),
}));

describe('useCoin hooks', () => {
  it('should return emptyObj when both symbol and coin are null', () => {
    const { result } = renderWithHook(() => getCoinInfo({}));
    expect(result.current).toEqual({});
  });

  it('should return value when coin is matched', () => {
    const state = {
      categories: {
        BTC: 1,
      },
    };

    getStore().getState.mockReturnValue(state);
    const { result } = renderWithHook(() => getCoinInfo({ coin: 'BTC' }));
    expect(result.current).toEqual(1);
  });

  it('should return emptyObj when coin is not matched', () => {
    const state = {
      categories: {
        BTC: 1,
      },
    };

    getStore().getState.mockReturnValue(state);
    const { result } = renderWithHook(() => getCoinInfo({ coin: 'ETH' }));
    expect(result.current).toEqual({});
  });

  it('should return emptyObj when symbol is matched', () => {
    const state = {
      categories: {
        BTC: 1,
      },
      symbols: {
        futuresSymbolsMap: {},
      },
    };

    getStore().getState.mockReturnValue(state);
    const { result } = renderWithHook(() => getCoinInfo({ symbol: 'BTC-USDT' }));
    expect(result.current).toEqual(1);
  });

  it('should return emptyObj when symbol is not matched', () => {
    const state = {
      categories: {
        BTC: 1,
      },
      symbols: {
        futuresSymbolsMap: {},
      },
    };

    getStore().getState.mockReturnValue(state);
    const { result } = renderWithHook(() => getCoinInfo({ symbol: 'ETH-USDT' }));
    expect(result.current).toEqual({});
  });

  it('should return emptyObj when futures symbol is not matched', () => {
    const state = {
      categories: {
        BTC: 1,
      },
      symbols: {
        futuresSymbolsMap: {
          XBTUSDTM: {
            baseCurrency: 'XBT', 
            imgUrl: 'a'
          }
        },
      },
    };

    getStore().getState.mockReturnValue(state);
    const { result } = renderWithHook(() => getCoinInfo({ symbol: 'XBTUSDTM' }));
    expect(result.current).toEqual({ iconUrl: 'a' });
  });
});
