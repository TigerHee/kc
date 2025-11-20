/**
 * Owner: garuda@kupotech.com
 */

import { useSelector, useDispatch } from 'react-redux';

import { getState, evtEmitter } from 'helper';

import {
  useLeverageDialog,
  useGetMaxLeverage,
  useGetLeverage,
  getLeverage,
  getMaxLeverage,
} from '@/hooks/futures/useLeverage';
import { useGetSymbolInfo, getSymbolInfo } from '@/hooks/common/useSymbol';

import { DEFAULT_LEVERAGE, MARGIN_MODE_CROSS } from '@/meta/futures';

import { renderHook, act } from '@testing-library/react-hooks';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),

  useDispatch: jest.fn(),
}));

jest.mock('helper', () => {
  const event = jest.fn();
  return {
    getState: jest.fn(),
    evtEmitter: {
      getEvt: jest.fn(() => {
        return {
          emit: event,
        };
      }),
    },
  };
});

jest.mock('@/hooks/common/useSymbol', () => ({
  useGetSymbolInfo: jest.fn(),

  getSymbolInfo: jest.fn(),
}));

jest.mock('@/meta/const', () => ({
  FUTURES: 'FUTURES',
}));

describe('useLeverageDialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should open leverage dialog', () => {
    const { result } = renderHook(() => useLeverageDialog());

    const event = evtEmitter.getEvt();

    act(() => {
      result.current.openLeverageDialog({ symbol: 'BTC', marginMode: 'isolated' });
    });

    expect(event.emit).toHaveBeenCalledWith('event/futures@leverage_dialog_open', {
      symbol: 'BTC',
      marginMode: 'isolated',
    });
  });

  it('should close leverage dialog', () => {
    const { result } = renderHook(() => useLeverageDialog());

    const event = evtEmitter.getEvt();

    act(() => {
      result.current.closeLeverageDialog();
    });

    expect(event.emit).toHaveBeenCalledWith('event/futures@leverage_dialog_close');
  });

  it('should dispatch cross leverage change', () => {
    const dispatch = jest.fn();

    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => useLeverageDialog());

    act(() => {
      result.current.onCrossLeverageSubmit({ leverage: 10, symbol: 'BTC' });
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'futuresCommon/crossLeverageChange',

      payload: { leverage: 10, symbol: 'BTC' },
    });
  });

  it('should dispatch isolated leverage change', () => {
    const dispatch = jest.fn();

    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => useLeverageDialog());

    act(() => {
      result.current.onIsolatedLeverageSubmit({ leverage: 10, symbol: 'BTC' });
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'futuresCommon/isolatedLeverageChange',

      payload: { leverage: 10, symbol: 'BTC' },
    });
  });

  it('should dispatch get user max leverage', () => {
    const dispatch = jest.fn();

    useDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => useLeverageDialog());

    act(() => {
      result.current.getV2UserMaxLeverage('BTC');
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: 'futuresCommon/getV2UserMaxLeverage',

      payload: { symbol: 'BTC' },
    });
  });
});

describe('useGetMaxLeverage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return max leverage for non-logged in user', () => {
    const mockSymbolInfo = { maxLeverage: 20 };

    useGetSymbolInfo.mockReturnValue(mockSymbolInfo);

    useSelector.mockImplementation((callback) =>
      callback({ user: { isLogin: null }, futuresCommon: {} }),
    );

    const { result } = renderHook(() => useGetMaxLeverage({ symbol: 'BTC' }));

    expect(result.current).toBe(20);
  });

  it('should return trial fund user max leverage', () => {
    useGetSymbolInfo.mockReturnValue({});

    useSelector.mockImplementation((callback) =>
      callback({
        user: { isLogin: true },

        futuresCommon: { trialFundUserMaxLeverage: 15 },
      }),
    );

    const { result } = renderHook(() =>
      useGetMaxLeverage({ symbol: 'BTC', switchTrialFund: true, isUser: true }),
    );

    expect(result.current).toBe(15);
  });

  it('should return max isolated leverage from map', () => {
    useGetSymbolInfo.mockReturnValue({});

    useSelector.mockImplementation((callback) =>
      callback({
        user: { isLogin: true },
        futuresCommon: { maxIsolatedLeverageMap: { BTC: 25 } },
      }),
    );

    const { result } = renderHook(() => useGetMaxLeverage({ symbol: 'BTC', isUser: true }));

    expect(result.current).toBe(25);
  });

  it('should return max cross leverage from map', () => {
    useGetSymbolInfo.mockReturnValue({});

    useSelector.mockImplementation((callback) =>
      callback({
        user: { isLogin: true },
        futuresCommon: { maxCrossLeverageMap: { BTC: 25 } },
      }),
    );

    const { result } = renderHook(() =>
      useGetMaxLeverage({ symbol: 'BTC', marginMode: MARGIN_MODE_CROSS, isUser: true }),
    );

    expect(result.current).toBe(25);
  });

  it('should return default leverage if no max leverage found', () => {
    useGetSymbolInfo.mockReturnValue({});

    useSelector.mockImplementation((callback) =>
      callback({
        user: { isLogin: true },

        futuresCommon: {},
      }),
    );

    const { result } = renderHook(() =>
      useGetMaxLeverage({ symbol: 'BTC', isUser: true, needDefault: true }),
    );

    expect(result.current).toBe(DEFAULT_LEVERAGE);
  });
});

describe('useGetLeverage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return isolated leverage from map', () => {
    useSelector.mockImplementation((callback) =>
      callback({
        futuresCommon: { isolatedLeverageMap: { BTC: 10 } },
      }),
    );

    const { result } = renderHook(() => useGetLeverage({ symbol: 'BTC' }));

    expect(result.current).toBe(10);
  });

  it('should return cross leverage from map', () => {
    useSelector.mockImplementation((callback) =>
      callback({
        futuresCommon: { crossLeverageMap: { BTC: 15 } },
      }),
    );

    const { result } = renderHook(() =>
      useGetLeverage({ symbol: 'BTC', marginMode: MARGIN_MODE_CROSS }),
    );

    expect(result.current).toBe(15);
  });

  it('should return default leverage if no leverage found', () => {
    useSelector.mockImplementation((callback) =>
      callback({
        futuresCommon: {},
      }),
    );

    const { result } = renderHook(() => useGetLeverage({ symbol: 'BTC', needDefault: true }));

    expect(result.current).toBe(DEFAULT_LEVERAGE);
  });
});

describe('getLeverage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return isolated leverage from map', () => {
    const mockState = { futuresCommon: { isolatedLeverageMap: { BTC: 10 } } };

    getState.mockImplementation((callback) => callback(mockState));

    const result = getLeverage({ symbol: 'BTC' });

    expect(result).toBe(10);
  });

  it('should return cross leverage from map', () => {
    const mockState = { futuresCommon: { crossLeverageMap: { BTC: 15 } } };

    getState.mockImplementation((callback) => callback(mockState));

    const result = getLeverage({ symbol: 'BTC', marginMode: MARGIN_MODE_CROSS });

    expect(result).toBe(15);
  });

  it('should return default leverage if no leverage found', () => {
    const mockState = { futuresCommon: {} };

    getState.mockImplementation((callback) => callback(mockState));

    const result = getLeverage({ symbol: 'BTC', needDefault: true });

    expect(result).toBe(DEFAULT_LEVERAGE);
  });
});

describe('getMaxLeverage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return max leverage for non-logged in user', () => {
    const mockSymbolInfo = { maxLeverage: 20 };

    getSymbolInfo.mockReturnValue(mockSymbolInfo);

    getState.mockImplementation((callback) =>
      callback({ user: { isLogin: null }, futuresCommon: {} }),
    );

    const result = getMaxLeverage({ symbol: 'BTC' });

    expect(result).toBe(20);
  });

  it('should return trial fund user max leverage', () => {
    getSymbolInfo.mockReturnValue({});

    getState.mockImplementation((callback) =>
      callback({
        user: { isLogin: true },
        futuresCommon: { trialFundUserMaxLeverage: 15 },
      }),
    );

    const result = getMaxLeverage({ symbol: 'BTC', switchTrialFund: true, isUser: true });

    expect(result).toBe(15);
  });

  it('should return max isolated leverage from map', () => {
    getSymbolInfo.mockReturnValue({});

    getState.mockImplementation((callback) =>
      callback({
        user: { isLogin: true },

        futuresCommon: { maxIsolatedLeverageMap: { BTC: 25 } },
      }),
    );

    const result = getMaxLeverage({ symbol: 'BTC', isUser: true });

    expect(result).toBe(25);
  });

  it('should return max cross leverage from map', () => {
    getSymbolInfo.mockReturnValue({});

    getState.mockImplementation((callback) =>
      callback({
        user: { isLogin: true },

        futuresCommon: { maxCrossLeverageMap: { BTC: 25 } },
      }),
    );

    const result = getMaxLeverage({ symbol: 'BTC', marginMode: MARGIN_MODE_CROSS, isUser: true });

    expect(result).toBe(25);
  });

  it('should return default leverage if no max leverage found', () => {
    getSymbolInfo.mockReturnValue({});

    getState.mockImplementation((callback) =>
      callback({
        user: { isLogin: true },

        futuresCommon: {},
      }),
    );

    const result = getMaxLeverage({ symbol: 'BTC', isUser: true, needDefault: true });

    expect(result).toBe(DEFAULT_LEVERAGE);
  });
});
