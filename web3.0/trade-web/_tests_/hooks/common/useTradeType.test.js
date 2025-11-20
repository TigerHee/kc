/**
 * Owner: garuda@kupotech.com
 */
import { useSelector } from 'dva';
import {
  setTradeType,
  getTradeType,
  useTradeType,
  useSymbolIsSupportTradeType,
  getSymbolIsSupportTradeType,
} from '@/hooks/common/useTradeType';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { getStateFromStore } from '@/utils/stateGetter';

jest.mock('dva', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@/utils/stateGetter', () => ({
  getStateFromStore: jest.fn(),
}));

describe('Trade functions', () => {
  it('should set and get trade type correctly', async () => {
    const dispatch = jest.fn();
    const tradeType = 'testTradeType';

    await setTradeType(dispatch, tradeType);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'trade/update_trade_type',
      payload: {
        tradeType: tradeType,
      },
    });

    // Mock useSelector and getStateFromStore to return the tradeType
    useSelector.mockImplementationOnce((selector) => selector({ trade: { tradeType: tradeType } }));
    getStateFromStore.mockImplementationOnce((selector) =>
      selector({ trade: { tradeType: tradeType } }),
    );

    expect(useTradeType()).toEqual(tradeType);
    expect(getTradeType()).toEqual(tradeType);
  });

  it('should return false if symbol is not provided in useSymbolIsSupportTradeType', () => {
    expect(useSymbolIsSupportTradeType({ tradeType: 'testTradeType' })).toBe(false);
  });

  it('should return false if symbol or tradeType is not provided in getSymbolIsSupportTradeType', () => {
    expect(getSymbolIsSupportTradeType({})).toBe(false);
    expect(getSymbolIsSupportTradeType({ symbol: 'testSymbol' })).toBe(false);
  });

  it('should return true if checkIsSupportBySymbol is not a function in useSymbolIsSupportTradeType and getSymbolIsSupportTradeType', () => {
    const symbol = 'testSymbol';
    const tradeType = 'testTradeType';
    TRADE_TYPES_CONFIG[tradeType] = {};

    useSelector.mockImplementation((selector) => {
      return selector({
        symbols: { symbolsMap: { 'BTC-USD': {} }, marginSymbolsMap: { 'BTC-USD': {} } },
        trade: { tradeType: 'MARGIN_TRADE' },
      });
    });

    expect(useSymbolIsSupportTradeType({ symbol, tradeType })).toBe(true);
    expect(getSymbolIsSupportTradeType({ symbol, tradeType, marginSymbolsMap: {} })).toBe(true);
  });

  it('should return the result of checkIsSupportBySymbol if it is a function in useSymbolIsSupportTradeType', () => {
    const symbol = 'testSymbol';
    const tradeType = 'testTradeType';
    TRADE_TYPES_CONFIG[tradeType] = {};

    useSelector.mockImplementation((selector) => {
      return selector({
        symbols: { symbolsMap: { 'BTC-USD': {} }, marginSymbolsMap: { 'BTC-USD': {} } },
        trade: { tradeType: 'MARGIN_TRADE' },
      });
    });

    expect(useSymbolIsSupportTradeType({ symbol })).toBe(false);
    expect(getSymbolIsSupportTradeType({ symbol, tradeType: 'MARGIN_TRADE', marginSymbolsMap: { 'BTC-USD': {} } })).toBe(false);
  });
});
